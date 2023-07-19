import EditableTable from '@orangehrm/oxd/core/components/EditableTable/EditableTable.vue';
import MissingPunchout from './MissingPunchout.story.vue';

export default {
  title: 'Data Tables/EditableTable',
  component: EditableTable,
  argTypes: {},
};

const Template = (args) => ({
  setup() {
    return {args};
  },
  components: {'oxd-edit-table': EditableTable},
  template: '<oxd-edit-table v-bind="args"></oxd-edit-table>',
});

export const Default = Template.bind({});
Default.args = {
  headers: [
    {key: 'firstName', title: 'First Name'},
    {key: 'middleName', title: 'Middle Name'},
    {key: 'lastName', title: 'Last Name'},
    {key: 'jobTitle', title: 'Job Title'},
  ],
  items: [
    {
      firstName: 'James',
      middleName: null,
      lastName: 'Andrews',
      jobTitle: 'Engineering Manager',
    },
    {
      firstName: 'Rike',
      middleName: null,
      lastName: 'Matt',
      jobTitle: 'Engineer',
    },
    {
      firstName: 'Klein',
      middleName: 'Dane',
      lastName: 'Lazar',
      jobTitle: 'Engineer',
    },
    {
      firstName: 'Philip',
      middleName: 'de',
      lastName: 'Silva',
      jobTitle: 'Temp',
    },
  ],
};

export const SampleScreen = () => MissingPunchout;
