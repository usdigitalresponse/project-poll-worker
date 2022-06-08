import { FieldType } from '@airtable/blocks/models';
import { colors } from '@airtable/blocks/ui';

const name = 'Helpdesk';
const tables = [
  {
    name: 'Helpdesk Staff',
    create: true,
    fields: [
      {
        name: 'Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Email',
        type: FieldType.EMAIL
      },
      {
        name: 'Phone',
        type: FieldType.PHONE_NUMBER
      }
    ]
  },
  {
    name: 'Election Day Helpdesk',
    create: true,
    fields: [
      {
        name: 'Requester + Role + Precinct',
        type: FieldType.FORMULA,
        options: {
          formula: '{Requester Name} & " - " & {Role - Current Election (from Requester)} & " - " & {Precinct Name (From Precincts) (from Requester)}'
        }
      },
      {
        name: 'Issue Type',
        type: FieldType.MULTIPLE_SELECTS,
        description: 'List of problem types poll workers can choose in the help request form. Customize this field type in the field title pulldown to add or change problem types.',
        options: {
          choices: [
            {name: 'Voting Machines', color: colors.RED_BRIGHT},
            {name: 'Missing Staff', color: colors.RED_LIGHT_1},
            {name: 'Long Wait Times', color: colors.ORANGE_BRIGHT},
            {name: 'Interference with Voters', color: colors.ORANGE_LIGHT_1},
            {name: 'Need Supplies', color: colors.YELLOW_BRIGHT},
            {name: 'Other', color: colors.YELLOW_LIGHT_1}
          ]
        }
      },
      {
        name: 'Issue Description',
        type: FieldType.MULTILINE_TEXT,
        description: 'Issue description from the election worker with the issue. To expand the text box, click into the box and then click the blue box with the diagonal arrows that appears. You can also change the view settings to make the row height bigger by going to the row of icons below the Airtable tabs and clicking the icon with the box and arrows in between Color and Share View.'
      },
      {
        name: 'Status',
        type: FieldType.SINGLE_SELECT,
        description: 'The staff person assigned should change the status pulldown as they work on the project to reflect status of the issue.',
        options: {
          choices: [
            {name: 'New', color: colors.TEAL_LIGHT_1},
            {name: 'Investigating', color: colors.ORANGE_LIGHT_1},
            {name: 'Communicating with Requester', color: colors.YELLOW_LIGHT_1},
            {name: 'Resolved', color: colors.GREEN_LIGHT_1}
          ]
        }
      },
      {
        name: 'Staff Assigned',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'When a new helpdesk request comes in, click into an empty box in this row, then click the + button which appears to assign a Staff person to investigate. When the person starts work on the issue,  change status to Investigating. To add staff members to the list, add them to the Helpdesk Staff table.',
        options: {
          linkedTableName: 'Helpdesk Staff',
          prefersSingleRecordLink: true
        }
      },
      {
        name: 'Election Staff Notes',
        type: FieldType.MULTILINE_TEXT,
        description: 'Notes from election staff working on resolving the issue. Issue description from the election worker with the issue. To expand the text box, click into the box and then click the blue box with the diagonal arrows that appears. You can also change the view settings to make the row height bigger by going to the row of icons below the Airtable tabs and clicking the icon with the box and arrows in between Color and Share View.'
      },
      {
        name: 'Created',
        type: FieldType.CREATED_TIME
      },
      {
        name: 'Last Modified By',
        type: FieldType.LAST_MODIFIED_BY
      },
      {
        name: 'Last Modified',
        type: FieldType.LAST_MODIFIED_TIME
      },
      {
        name: 'Requester Election Day Phone',
        type: FieldType.PHONE_NUMBER,
        description: 'Phone number the poll worker entered where they can be reached on election day. May be different from the phone number in the poll worker\'s main record.'
      },
      {
        name: 'Requester Election Day Email',
        type: FieldType.EMAIL
      },
      {
        name: 'Requester',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        options: {
          linkedTableName: 'Poll Workers',
          prefersSingleRecordLink: true
        }
      },
      {
        name: 'Requester Precinct',
        type: FieldType.MULTIPLE_LOOKUP_VALUES,
        options: {
          recordLinkFieldName: 'Requester',
          fieldNameInLinkedTable: 'Home Precinct (GIS Lookup)'
        }
      },
      {
        name: 'Precinct Name (From Precincts) (from Requester)',
        type: FieldType.MULTIPLE_LOOKUP_VALUES,
        options: {
          recordLinkFieldName: 'Requester',
          fieldNameInLinkedTable: 'Precinct Name (From Precincts)'
        }
      },
      {
        name: 'Requester Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Poll Workers UID',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'Used to link the person with the issue back to the person in the Poll Workers table.'
      },
      {
        name: 'Role - Current Election (from Requester)',
        type: FieldType.MULTIPLE_LOOKUP_VALUES,
        options: {
          recordLinkFieldName: 'Requester',
          fieldNameInLinkedTable: 'Role - Current Election'
        }
      }
    ]
  },
  {
    name: 'Poll Workers',
    create: false,
    fields: [
      {
        name: 'Link for Helpdesk - Election Day',
        type: FieldType.FORMULA,
        options: {
          formula: '"https://airtable.com/your-form?prefill_Requester%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Full Name})) & "&prefill_Poll%20Workers%20UID=" & RECORD_ID()'
        }
      },
      {
        name: 'To Email - Link for Helpdesk',
        type: FieldType.FORMULA,
        options: {
          formula: 'SUBSTITUTE({Link for Helpdesk - Election Day},"_","%5F")'
        }
      },
      {
        name: 'Help Request - Election Day',
        type: FieldType.BUTTON,
        description: 'Use this button to start an Election Day Help Request form for this Poll Worker.',
        options: {
          label: 'Help Request - Election Day',
          formula: '"https://airtable.com/your-form?prefill_Requester%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Full Name})) & "&prefill_Poll%20Workers%20UID=" & RECORD_ID()'
        }
      }
    ]
  }
];

export default {name: name, tables: tables};
