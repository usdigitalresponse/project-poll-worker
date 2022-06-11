import { FieldType } from '@airtable/blocks/models';
import { colors } from '@airtable/blocks/ui';

const name = 'Training';
const tables = [
  {
    name: 'Training Sessions',
    create: true,
    fields: [
      {
        name: 'Session Date & Time',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Session Full?',
        type: FieldType.FORMULA,
        options: {
          formula: 'IF(({Available Spots} > 0), "Spots Available", "Full")'
        }
      },
      {
        name: 'Attendee Limit',
        type: FieldType.NUMBER,
        description: 'Edit this field to show the maximum number of people who can attend each session. These can be different for each session, or the same.',
        options: {
          precision: 0
        }
      },
      {
        name: 'Current Signups',
        type: FieldType.COUNT,
        description: 'Counts the number of attendees in Training Signups field to determine how many people have signed up for a session so far',
        options: {
          recordLinkFieldName: 'Training Signups'
        }
      },
      {
        name: 'Available Spots',
        type: FieldType.FORMULA,
        description: 'Calculation: attendee limit - current signups',
        options: {
          formula: '{Attendee Limit} - {Current Signups}'
        }
      },
      {
        name: 'Notes',
        type: FieldType.MULTILINE_TEXT
      }
    ]
  },
  {
    name: 'Training Signups',
    create: true,
    fields: [
      {
        name: 'Attendee',
        type: FieldType.FORMULA,
        options: {
          formula: '({Full Name} & " - " & {Email})'
        }
      },
      {
        name: 'First Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'Last Name',
        type: FieldType.SINGLE_LINE_TEXT
      },
      {
        name: 'New/Change/Cancel',
        type: FieldType.SINGLE_SELECT,
        description: 'If a record is the Master Entry, it is the original signup record and used to record current session. If there has been a change or cancel record submitted for this Poll Worker, the Training Sessions field in the Master Entry always reflects current registration status.',
        options: {
          choices: [
            {name: 'Master Entry', color: colors.GREEN_BRIGHT},
            {name: 'Change', color: colors.YELLOW_LIGHT_2},
            {name: 'Cancel', color: colors.RED_BRIGHT}
          ]
        }
      },
      {
        name: 'Last Action',
        type: FieldType.SINGLE_SELECT,
        description: 'Used to determine which type of email to send - new registration, change session, or cancel registration',
        options: {
          choices: [
            {name: 'New Signup', color: colors.GREEN_LIGHT_1},
            {name: 'Change Session', color: colors.YELLOW_LIGHT_2},
            {name: 'Cancel Registration', color: colors.RED_BRIGHT}
          ]
        }
      },
      {
        name: 'Title (from Poll Workers)',
        type: FieldType.MULTIPLE_LOOKUP_VALUES,
        options: {
          recordLinkFieldName: 'Link to Poll Workers Table',
          fieldNameInLinkedTable: 'Title'
        }
      },
      {
        name: 'Attended Training',
        type: FieldType.CHECKBOX,
        description: 'Check this box when a worker has attended training. Checking here will automatically update the worker\'s record in the Poll Workers table to show Training Completed',
        options: {
          icon: 'check',
          color: 'greenBright'
        }
      },
      {
        name: 'Email',
        type: FieldType.EMAIL
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
        name: 'Training Sessions',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'This list is linked to the Training Sessions table. Training Sessions field in the Master Entry always reflects current registration status. Training Session from change or cancel entries are removed so there is only one session registration per person. The Training Session Chosen field is plain text and always reflects the training session submitted with each entry.',
        options: {
          // TODO limit record selection to a view
          linkedTableName: 'Training Sessions',
          prefersSingleRecordLink: true
        }
      },
      {
        name: 'Poll Workers UID',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'Airtable record ID for the main user record in the Poll Workers table. Used to reference which record should be updated in the Poll Workers table with new info entered from Training Signups and to record attendance when training is complete.'
      },
      {
        name: 'Training Signup UID',
        type: FieldType.FORMULA,
        description: 'UID for this record in the Training Signups table',
        options: {
          formula: 'RECORD_ID()'
        }
      },
      {
        name: 'Original Training Signup UID',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'UID of the Master Entry training signup entry. Used to correctly change the master entry if a change / cancel is received. NOTE the master entry is the entry used to track all changes.'
      },
      {
        name: 'Full Name',
        type: FieldType.FORMULA,
        options: {
          formula: '({First Name} & " " & {Last Name})'
        }
      },
      {
        name: 'Link to Poll Workers Table',
        type: FieldType.MULTIPLE_RECORD_LINKS,
        description: 'For Master Record only, links to the record in Poll Workers',
        options: {
          linkedTableName: 'Poll Workers',
          prefersSingleRecordLink: false
        }
      },
      {
        name: 'Link for Change / Cancel',
        type: FieldType.FORMULA,
        description: 'Link from the Master Entry for each person signed up for training is sent in email confirmation to allow for changes and cancellations. Note the link in the Master Entry is always sent to be sure the records are updated correctly.',
        options: {
          formula: '"https://airtable.com/your-form?prefill_First%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({First Name})) & "&prefill_Last%20Name=" & ENCODE_URL_COMPONENT(CONCATENATE({Last Name})) & "&prefill_Email=" & {Email} & "&prefill_Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Phone})) & "&prefill_Alternate%20Phone=" & ENCODE_URL_COMPONENT(CONCATENATE({Alternate Phone})) & "&prefill_Training%20Signup%20UID=" & {Training Signup UID} & "&prefill_Home%20or%20Mobile?=" & ENCODE_URL_COMPONENT(CONCATENATE({Home or Mobile?}))'
        }
      },
      {
        name: 'Training Session Chosen',
        type: FieldType.SINGLE_LINE_TEXT,
        description: 'Shows the original training session chosen for this entry. Because a change or cancel request will change the linked training session in the Master Entry for the person, this creates a trail for all of the sessions this user may have requested over time. If there are questions, filter by the user\'s name and use this column to track all changes. This field in the Master Entry will show the original session chosen.'
      },
      {
        name: 'Created Time',
        type: FieldType.CREATED_TIME,
        description: 'Date + Time of record creation'
      },
      {
        name: 'Last Modified',
        type: FieldType.LAST_MODIFIED_TIME,
        description: 'Date + Time of Record Last Modified'
      },
      {
        name: 'Signature (for use in class attendance)',
        type: FieldType.SINGLE_LINE_TEXT
      }
    ]
  }
];

export default {name: name, tables: tables};
