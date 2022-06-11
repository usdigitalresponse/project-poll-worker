import { FieldType } from '@airtable/blocks/models';
import { colors } from '@airtable/blocks/ui';

// TODO make configurable in UI
const roles = [
  {title: 'Precinct Lead', fullTitle: 'Precinct Lead'},
  {title: 'Clerk', fullTitle: 'Clerk'},
  {title: 'Maj Ins', fullTitle: 'Majority Inspector'},
  {title: 'Min Ins', fullTitle: 'Minority Inspector'},
  {title: 'Mach Op', fullTitle: 'Machine Operator'},
  {title: 'Mach Ins', fullTitle: 'Machine Inspector'},
  {title: 'Other Precinct Volunteers', fullTitle: 'Pink Slip Worker'}
];

const name = 'Poll Workers & Precincts';
const tables = [
  {
    name: 'Title + Role',
    create: true,
    fields: [
      {
        name: 'Title',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Full Title',
        type: FieldType.SINGLE_LINE_TEXT
      }
    ],
    records: roles.map((role) => {
      return {
        'Title': role.title,
        'Full Title': role.fullTitle
      };
    })
  },
  {
    name: 'Precincts',
    create: true,
    fields: [
      {
        name: 'Precinct',
        type: FieldType.FORMULA,
        options: {
          formula: '{Precinct Number} & " - " & {Description}'
        }
      },
      {
        name: 'Precinct Number',
        type: FieldType.NUMBER,
        options: {
          precision: 0
        }
      },
      {
        name: 'Description',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Address',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Special Instructions',
        type: FieldType.MULTILINE_TEXT
      }
    ]
  },
  {
    name: 'Poll Workers',
    create: true,
    fields: [
      {
        name: 'Poll Worker ID',
        type: FieldType.FORMULA,
        options: {
          formula: '{Full Name} & " - " & {Home Precinct (GIS Lookup)} & " - " & {Title} & " " & SWITCH({Election Availability}, "November, 2022", "🟢", "Not available November, 2022", "⬜️", "No longer interested in being a Poll Worker", "🔶")'
        }
      },
      {
        name: 'Home Precinct (GIS Lookup)',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'Precinct found by the GIS Precinct Lookup App.',
        options: {
          linkedTableName: 'Precincts',
          prefersSingleRecordLink: false,
          inverseLinkFieldName: 'Home Precinct (GIS Lookup)'
        }
      },
      {
        name: 'Role - Current Election',
        type: FieldType.FORMULA,
        description: 'If the Poll Worker is staffed in a role in the Precincts table for the current election, name the role here.',
        options: {
          formula: 'IF({Precinct Lead}, "Precinct Lead", IF({Maj Ins}, "Majority Inspector", IF({Min Ins}, "Minority Inspector", IF({Mach Op}, "Machine Operator", IF({Clerk}, "Clerk")))))'
        }
      },
      {
        name: 'Assigned Precinct',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'This is Precinct Assigned to the Poll Worker. When running the GIS Precinct Lookup Script, you can choose to Assign Precincts if unassigned. So, this field uses the Home Precinct (GIS Lookup) field to assign a precinct.',
        options: {
          linkedTableName: 'Precincts',
          prefersSingleRecordLink: true,
          inverseLinkFieldName: 'Assigned Precinct'
        }
      },
      {
        name: 'Election Availability',
        type: FieldType.SINGLE_SELECT,
        description: 'Is this Poll Worker available to work for the election listed?',
        options: {
          choices: [
            {name: 'November, 2022', color: colors.GREEN_LIGHT_1},
            {name: 'Not available November, 2022', color: colors.GRAY_LIGHT_1},
            {name: 'No longer interested in being a Poll Worker', color: colors.ORANGE_BRIGHT},
            {name: 'Temporarily not available November, 2022', color: colors.TEAL_LIGHT_2},
            {name: 'November, 2022 Sub', color: colors.YELLOW_LIGHT_1},
            {name: 'November, 2021', color: colors.BLUE_LIGHT_2}
          ]
        }
      },
      {
        name: 'Phone',
        type: FieldType.PHONE_NUMBER
      },
      {
        name: 'Home or Mobile?',
        type: FieldType.SINGLE_SELECT,
        options: {
          choices: [
            {name: 'Mobile phone', color: colors.YELLOW_LIGHT_2},
            {name: 'Home phone', color: colors.BLUE_LIGHT_2}
          ]
        }
      },
      {
        name: 'Alternate Phone',
        type: FieldType.PHONE_NUMBER
      },
      {
        name: 'Email',
        type: FieldType.EMAIL
      },
      {
        name: 'Preferred Comunication Method',
        type: FieldType.MULTIPLE_SELECTS,
        options: {
          choices: [
            {name: 'Email', color: colors.BLUE_LIGHT_2},
            {name: 'Text', color: colors.CYAN_LIGHT_2},
            {name: 'Phone', color: colors.TEAL_LIGHT_2}
          ]
        }
      },
      {
        name: 'Lookup Precinct',
        type: FieldType.BUTTON,
        description: 'Uses the GIS Precinct Lookup script to find a poll worker\'s precinct.',
        options: {
          label: 'Lookup Precinct',
          action: 'Run script'
        }
      },
      {
        name: 'Street Address',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'City',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'State',
        type: FieldType.SINGLE_SELECT,
        options: {
          choices: [
            {name: 'AL'},
            {name: 'AK'},
            {name: 'AS'},
            {name: 'AZ'},
            {name: 'AR'},
            {name: 'CA'},
            {name: 'CO'},
            {name: 'CT'},
            {name: 'DE'},
            {name: 'DC'},
            {name: 'FM'},
            {name: 'FL'},
            {name: 'GA'},
            {name: 'GU'},
            {name: 'HI'},
            {name: 'ID'},
            {name: 'IL'},
            {name: 'IN'},
            {name: 'IA'},
            {name: 'KS'},
            {name: 'KY'},
            {name: 'LA'},
            {name: 'ME'},
            {name: 'MH'},
            {name: 'MD'},
            {name: 'MA'},
            {name: 'MI'},
            {name: 'MN'},
            {name: 'MS'},
            {name: 'MO'},
            {name: 'MT'},
            {name: 'NE'},
            {name: 'NV'},
            {name: 'NH'},
            {name: 'NJ'},
            {name: 'NM'},
            {name: 'NY'},
            {name: 'NC'},
            {name: 'ND'},
            {name: 'MP'},
            {name: 'OH'},
            {name: 'OK'},
            {name: 'OR'},
            {name: 'PA'},
            {name: 'PW'},
            {name: 'PR'},
            {name: 'RI'},
            {name: 'SC'},
            {name: 'SD'},
            {name: 'TN'},
            {name: 'TX'},
            {name: 'UT'},
            {name: 'VT'},
            {name: 'VI'},
            {name: 'VA'},
            {name: 'WA'},
            {name: 'WV'},
            {name: 'WI'},
            {name: 'WY'}
          ]
        }
      },
      {
        name: 'Zip Code',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Full Mail Address',
        type: FieldType.FORMULA,
        options: {
          formula: `{Street Address} & '\n' & {City} & ', ' & State & ' ' & {Zip Code}`
        }
      },
      {
        name: 'Willing to Travel',
        type: FieldType.SINGLE_SELECT,
        options: {
          choices: [
            {name: 'Willing to Travel', color: colors.ORANGE_LIGHT_2},
            {name: 'Can Not Travel', color: colors.GRAY_LIGHT_2}
          ]
        }
      },
      {
        name: 'Party Affiliation',
        type: FieldType.SINGLE_SELECT,
        description: 'Select party affiliation. To be filled in by Election Staff only, not included on signup form.',
        options: {
          choices: [
            {name: 'Democrat', color: colors.BLUE_BRIGHT},
            {name: 'Republican', color: colors.RED_BRIGHT},
            {name: 'Green', color: colors.GREEN_BRIGHT},
            {name: 'Libertarian', color: colors.YELLOW_BRIGHT},
            {name: 'None (No Affiliation)', color: colors.PURPLE_BRIGHT},
            {name: 'Other', color: colors.RED_LIGHT_2}
          ]
        }
      },
      {
        name: 'Other Party Affiliation',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'Fill-in if voter has checked "Other" as party affiliation on voter registration form and entered text for Other.'
      },
      {
        name: 'Precinct Name (From Precincts)',
        type: FieldType.MULTIPLE_LOOKUP_VALUES,
        description: 'The Precinct Name as shown in the Precincts table.',
        options: {
          recordLinkFieldName: 'Home Precinct (GIS Lookup)',
          fieldNameInLinkedTable: 'Description'
        }
      },
      {
        name: 'Title',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'Title is the role that this Poll Worker would fill if staffed for an election. Be sure to add the worker\'s title here in addition to adding them to the role, so we have the title in their name and can easily find them per precinct and role when adding to roles in the Precincts table',
        options: {
          linkedTableName: 'Title + Role',
          prefersSingleRecordLink: false
        }
      },
      {
        name: 'Previous Election Poll Experience?',
        type: FieldType.SINGLE_SELECT,
        options: {
          choices: [
            {name: 'Yes', color: colors.BLUE_LIGHT_2},
            {name: 'No', color: colors.CYAN_LIGHT_2}
          ]
        }
      },
      {
        name: 'Last Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'First Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Do Not Call',
        type: FieldType.MULTIPLE_SELECTS,
        options: {
          choices: [
            {name: 'Do Not Call', color: colors.RED_BRIGHT}
          ]
        }
      },
      {
        name: 'Phone Contact Form',
        type: FieldType.BUTTON,
        options: {
          label: 'Phone Contact Form',
          formula: '"https://airtable.com/your-form?prefill_First%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({First Name})) & "&prefill_Last%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Last Name})) & "&prefill_Email=" & {Email} & "&prefill_Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Phone})) & "&prefill_Alternate%20Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Alternate Phone})) & "&prefill_Poll%20Workers%20UID=" & RECORD_ID() & "&prefill_Election%20Availability=" & ENCODE_URL_COMPONENT(CONCATENATE({Election Availability})) & "&prefill_Willing%20to%20Travel=" & ENCODE_URL_COMPONENT(CONCATENATE({Willing to Travel})) & "&prefill_Address=" & ENCODE_URL_COMPONENT(CONCATENATE({Street Address})) & "&prefill_Do%20Not%20Call=" & ENCODE_URL_COMPONENT(CONCATENATE({Do Not Call})) & "&prefill_Home%20or%20Mobile?=" & ENCODE_URL_COMPONENT(CONCATENATE({Home or Mobile?})) & "&prefill_Previous%20Election%20Poll%20Experience?=" & ENCODE_URL_COMPONENT(CONCATENATE({Previous Election Poll Experience?})) & "&prefill_Comments=" & ENCODE_URL_COMPONENT(CONCATENATE({Comments}))'
        }
      },
      {
        name: 'Called On',
        type: FieldType.DATE,
        options: {
          dateFormat: {name: 'local', format: 'l'}
        }
      },
      {
        name: 'Comments',
        type: FieldType.MULTILINE_TEXT
      },
      {
        name: 'Appointed / Elected',
        type: FieldType.MULTIPLE_SELECTS,
        options: {
          choices: [
            {name: 'Appointed', color: colors.BLUE_LIGHT_2},
            {name: 'Elected', color: colors.CYAN_LIGHT_2}
          ]
        }
      },
      ...roles.map((role) => {
        return {
          name: role.title,
          type: FieldType.MULTIPLE_RECORD_LINKS,
          description: `To assign this Poll Worker as a ${role.fullTitle} working in the current election, select the precinct.`,
          options: {
            linkedTableName: 'Precincts',
            prefersSingleRecordLink: true,
            inverseLinkFieldName: role.title
          }
        };
      }),
      {
        name: 'Created On',
        type: FieldType.CREATED_TIME,
        description: 'Date the record was created (the person signed up to be a Poll Worker, or the date of initial import)'
      },
      {
        name: 'Last Modified',
        type: FieldType.LAST_MODIFIED_TIME,
        description: 'This date is changed by: initial signup form, current election interest form, phone contact form'
      },
      {
        name: 'Full Name',
        type: FieldType.FORMULA,
        description: 'Full Name of the Poll Worker',
        options: {
          formula: '({First Name} & " " & {Last Name})'
        }
      },
      {
        name: 'Link for Update Info',
        type: FieldType.FORMULA,
        options: {
          formula: '"https://airtable.com/your-form?prefill_First%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({First Name})) & "&prefill_Last%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Last Name})) & "&prefill_Email=" & {Email} & "&prefill_Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Phone})) & "&prefill_Alternate%20Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Alternate Phone})) & "&prefill_Poll%20Workers%20UID=" & RECORD_ID() & "&prefill_Election%20Availability=" & ENCODE_URL_COMPONENT(CONCATENATE({Election Availability})) & "&prefill_Willing%20to%20Travel=" & ENCODE_URL_COMPONENT(CONCATENATE({Willing to Travel})) & "&prefill_Address=" & ENCODE_URL_COMPONENT(CONCATENATE({Street Address})) & "&prefill_Home%20or%20Mobile?=" & ENCODE_URL_COMPONENT(CONCATENATE({Home or Mobile?})) & "&prefill_Previous%20Election%20Poll%20Experience?=" & ENCODE_URL_COMPONENT(CONCATENATE({Previous Election Poll Experience?}))'
        }
      },
      {
        name: 'Enter Party Affiliation',
        type: FieldType.BUTTON,
        options: {
          label: 'Enter Party Affiliation',
          formula: '"https://airtable.com/your-form?prefill_First%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({First Name})) & "&prefill_Last%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Last Name})) & "&prefill_Email=" & {Email} & "&prefill_Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Phone})) & "&prefill_Alternate%20Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Alternate Phone})) & "&prefill_Poll%20Workers%20UID=" & RECORD_ID() & "&prefill_Address=" & ENCODE_URL_COMPONENT(CONCATENATE({Street Address})) & "&prefill_Party%20Affiliation=" & ENCODE_URL_COMPONENT(CONCATENATE({Party Affiliation})) & "&prefill_Other%20Party%20Affiliation=" & ENCODE_URL_COMPONENT(CONCATENATE({Other Party Affiliation}))'
        }
      },
      {
        name: 'Record ID - Poll Workers',
        type: FieldType.FORMULA,
        options: {
          formula: 'RECORD_ID()'
        }
      }
    ]
  }
];

tables.push(
  {
    name: 'Poll Workers Info Updates',
    create: true,
    fields: [
      {
        name: 'Name + Update Type',
        type: FieldType.FORMULA,
        options: {
          formula: '{Full Name} & " - " & {Update Type}'
        }
      },
      // use same field settings as Poll Workers
      ...[
        'Election Availability',
        'Previous Election Poll Experience?',
        'First Name',
        'Last Name',
        'Do Not Call',
        'Phone',
        'Home or Mobile?',
        'Alternate Phone',
        'Called On',
        'Email',
        'Willing to Travel',
        'Comments',
        'Last Modified',
        'Full Name',
        'Party Affiliation',
        'Other Party Affiliation'
      ].map((name) => {
        let field = tables.find(t => t.name === 'Poll Workers').fields.find(f => f.name === name);
        if (!field) {
          throw new Error(`Could not find field: ${name}`);
        }
        // deep copy
        return JSON.parse(JSON.stringify(field));
      }),
      {
        name: 'Address',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Poll Workers UID',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'Airtable record ID for the main user record in the Poll Workers table. Used to reference which record should be updated in the Poll Workers table with new info entered from Info Updates.'
      },
      {
        name: 'Update Type',
        type: FieldType.SINGLE_SELECT,
        options: {
          choices: [
            {name: 'Poll Worker Info Update', color: colors.ORANGE_LIGHT_2},
            {name: 'Party Affiliation Update', color: colors.PURPLE_LIGHT_1},
            {name: 'Phone Contact', color: colors.ORANGE_LIGHT_1}
          ]
        }
      }
    ]
  }
);

export default {name: name, tables: tables};
