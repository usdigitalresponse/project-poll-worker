import { FieldType } from '@airtable/blocks/models';
import { Box, Button, Heading, Icon, initializeBlock, useBase } from '@airtable/blocks/ui';
import React, { useEffect, useState } from 'react';

// features
import setupFeature from './features/setup';
import trainingFeature from './features/training';
import helpdeskFeature from './features/helpdesk';

const features = [];
features.push(setupFeature);
features.push(trainingFeature);
features.push(helpdeskFeature);

const unsupportedTypes = [
  FieldType.BUTTON,
  FieldType.COUNT,
  FieldType.CREATED_TIME,
  FieldType.FORMULA,
  FieldType.LAST_MODIFIED_BY,
  FieldType.LAST_MODIFIED_TIME,
  FieldType.MULTIPLE_LOOKUP_VALUES
];

const typeNames = {};
typeNames[FieldType.BUTTON] = 'Button';
typeNames[FieldType.COUNT] = 'Count';
typeNames[FieldType.CREATED_TIME] = 'Created time';
typeNames[FieldType.FORMULA] = 'Formula';
typeNames[FieldType.LAST_MODIFIED_BY] = 'Last modified by';
typeNames[FieldType.LAST_MODIFIED_TIME] = 'Last modified time';
typeNames[FieldType.MULTIPLE_LOOKUP_VALUES] = 'Lookup';
typeNames[FieldType.SINGLE_LINE_TEXT] = 'Single line text';

function getStatus(field, res, table) {
  if (res === null) {
    return 'missing';
  } else if (res.type !== field.type) {
    return 'type_mismatch';
  } else if (res.type === FieldType.FORMULA) {
    if (!res.options.isValid) {
      return 'formula_invalid';
    }
  } else if (res.type === FieldType.MULTIPLE_RECORD_LINKS) {
    if (res.options.prefersSingleRecordLink !== field.options.prefersSingleRecordLink) {
      return 'linking_mismatch';
    }
  } else if (res.type === FieldType.MULTIPLE_LOOKUP_VALUES) {
    // TODO check fieldNameInLinkedTable
    if (table.getFieldById(res.options.recordLinkFieldId).name !== field.options.recordLinkFieldName) {
      // show same message as type mismatch for now
      return 'type_mismatch';
    }
  } else if (res.type === FieldType.BUTTON) {
    // TODO API not returning label as documented
  }
  return 'success';
}

function updateFieldStatus(table) {
  for (const field of table.fields) {
    const res = table.t.getFieldByNameIfExists(field.name);
    field.status = getStatus(field, res, table.t);
  }
}

function writableFields(base, table) {
  return table.fields.map((f) => {
    const field = {
      name: f.name,
      type: f.type,
      options: f.options,
      description: f.description
    };

    // be sure not to update options object in-place
    if (unsupportedTypes.includes(field.type)) {
      field.type = FieldType.SINGLE_LINE_TEXT;
      delete field.options;
    } else if (field.type === FieldType.MULTIPLE_RECORD_LINKS) {
      // prefersSingleRecordLink not supported
      field.options = {
        linkedTableId: base.getTableByName(f.options.linkedTableName).id
      };
    }

    return field;
  });
}

async function createTable(base, table) {
  await base.createTableAsync(table.name, writableFields(base, table));
}

async function updateTable(base, table) {
  const t = base.getTableByName(table.name);
  for (const field of writableFields(base, table)) {
    if (t.getFieldByNameIfExists(field.name) === null) {
      await t.createFieldAsync(field.name, field.type, field.options, field.description);
    }
  }
}

function tableStatus(table) {
  if (table.create) {
    if (table.exists) {
      return 'exists'
    } else {
      return 'to be created';
    }
  } else {
    if (table.exists) {
      return 'to be updated';
    } else {
      return 'missing';
    }
  }
}

function Formula(props) {
  return <pre style={{fontSize: "1rem", backgroundColor: "#eee", padding: "0.25rem", margin: 0, whiteSpace: "pre-wrap"}}>{props.value}</pre>;
}

function getFieldStatus(field) {
  if (field.status === 'type_mismatch' || field.status === 'missing') {
    const typeName = typeNames[field.type] || field.type;
    const changeText = field.status === 'missing' ? `Add as "${typeName}"` : `Change type to "${typeName}"`;
    if (field.type === FieldType.FORMULA) {
      return <Box>{changeText} with <Formula value={field.options.formula} /></Box>;
    } else if (field.type === FieldType.MULTIPLE_LOOKUP_VALUES) {
      return <Box>{changeText} on "{field.options.recordLinkFieldName}" and "{field.options.fieldNameInLinkedTable}"</Box>;
    } else if (field.type === FieldType.BUTTON) {
      if (field.options.formula) {
        return <Box>{changeText} with label "{field.options.label}" and URL formula <Formula value={field.options.formula} /></Box>;
      } else {
        return <Box>{changeText} with label "{field.options.label}" and Action "{field.options.action}"</Box>;
      }
    } else if (field.type === FieldType.COUNT) {
      return <Box>{changeText} on "{field.options.recordLinkFieldName}"</Box>;
    } else {
      return <Box>{changeText}</Box>;
    }
  } else if (field.status === 'linking_mismatch') {
    const action = field.options.prefersSingleRecordLink ? 'Disable' : 'Enable';
    return <Box>{action} "Allow linking to multiple records"</Box>;
  } else {
    return <Box>{field.status}</Box>;
  }
}

function Field(props) {
  const { field } = props;
  const status = getFieldStatus(field);

  return (
    <Box marginBottom={3}>
      <strong>{field.name}</strong>
      {status}
    </Box>
  );
}

function Table(props) {
  const { showDetails, table } = props;

  if (showDetails) {
    const fields = table.fields.filter((field) => field.status !== 'success').map((field) => {
      return <Field key={field.name} field={field} />;
    });

    return (
      <Box>
        <Heading size="small">
          {table.name}
          {fields.length == 0 && <Icon name="check" size={16} fillColor="#20c933" marginLeft={1} />}
        </Heading>
        {fields}
      </Box>
    );
  } else {
    return <Heading size="small">{table.name} - {tableStatus(table)}</Heading>;
  }
}

function App() {
  // useBase is a React hook, so must be placed inside component
  const base = useBase();
  const [getTables, setTables] = useState([]);
  const [currentFeature, setFeature] = useState(null);

  let tables = currentFeature && currentFeature.tables;

  async function install() {
    const tables = currentFeature.tables;

    // create / update tables
    for (const table of tables) {
      if (table.create) {
        await createTable(base, table);
      } else {
        await updateTable(base, table);
      }
    }

    // update linked names
    for (const table of tables) {
      for (const field of table.fields) {
        if (field.type === FieldType.MULTIPLE_RECORD_LINKS && field.options.inverseLinkFieldName) {
          const baseField = base.getTableByName(table.name).getFieldByName(field.name);
          const inverseField = base.getTableByName(field.options.linkedTableName).getFieldById(baseField.options.inverseLinkFieldId);
          await inverseField.updateNameAsync(field.options.inverseLinkFieldName);
        }
      }
    }

    refresh();
  }

  function refresh() {
    // refresh data
    for (const table of tables) {
      table.t = base.getTableByNameIfExists(table.name);
      table.exists = table.t !== null;
      if (table.exists) {
        updateFieldStatus(table);
      }
    }
    // always re-render
    // easier than dealing with nested state
    setTables([...tables]);
  }

  // TODO improve this pattern
  function selectFeature(feature) {
    tables = feature.tables;
    refresh();
    setFeature(feature);
  }

  if (currentFeature === null) {
    const featureItems = features.map((feature) => {
      return <Box key={feature.name} marginBottom={3}><Button onClick={() => selectFeature(feature)} variant="primary" size="large">{feature.name}</Button></Box>;
    });

    return (
      <Box padding={3}>
        <Heading size="small" marginBottom={3}>Select a feature</Heading>
        {featureItems}
      </Box>
    );
  } else {
    const showDetails = getTables.every((t) => t.exists);
    const allowInstall = getTables.every((t) => t.create ? !t.exists : t.exists);
    const tableItems = getTables.map((table) => {
      return <Table key={table.name} showDetails={showDetails} table={table} />;
    });

    return (
      <Box padding={3}>
        {!showDetails &&
          <Button onClick={install} disabled={!allowInstall} variant="primary" size="large" marginBottom={3}>Install {currentFeature.name}</Button>
        }
        {showDetails &&
          <Button onClick={refresh} position="absolute" top={3} right={3}>Refresh</Button>
        }
        {tableItems}
      </Box>
    );
  }
}

initializeBlock(() => <App />);
