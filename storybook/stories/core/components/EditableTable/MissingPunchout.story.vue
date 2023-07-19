<template>
  <div class="bg-wrapper">
    <div class="oxd-list-title">
      <div class="oxd-list-title-content">
        <oxd-text type="card-title"> Missing Punch Outs </oxd-text>
        <oxd-pop-over-button
          size="medium"
          displayType="label"
          :options="buttonOptions"
          :customPopOverButtonLabel="saveButtonLabel"
          @update:modelValue="onSelectOption"
        />
      </div>
      <oxd-divider class="oxd-list-title-divider" />
    </div>
    <oxd-list :flatTop="true">
      <template #contentHeaderLeft>
        <oxd-text tag="p" class="table-count">
          {{ tableHeaderText }}
        </oxd-text>
      </template>
      <template #contentHeaderRight>
        <oxd-quick-search :clear="false" placeholder="Search">
          <template v-slot:iconSlot>
            <oxd-icon-button class="search" name="oxd-search"></oxd-icon-button>
          </template>
        </oxd-quick-search>
        <oxd-icon-button
          name="funnel"
          tooltip="Filter"
          displayType="label-info"
        ></oxd-icon-button>
      </template>
      <template #contentBody>
        <oxd-list-table
          :items="items"
          :flashing="true"
          :selectable="true"
          :headers="headers"
          :loading="isLoading"
          v-model:order="sortDefinition"
          v-model:selected="checkedItems"
        ></oxd-list-table>
      </template>
      <template #contentFooter>
        <oxd-pagination
          v-model:current="currentPage"
          :length="pages"
          :perPage="pageSize"
          :totalRecordsCount="total"
          @onPerPageSelect="onPageSizeChange"
        ></oxd-pagination>
      </template>
    </oxd-list>

    <oxd-dialog
      v-if="showDialog"
      @update:show="onCancel"
      :style="{maxWidth: '450px'}"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="modal-title">Are you sure?</oxd-text>
      </div>
      <div class="orangehrm-text-center-align">
        <oxd-text type="subtitle-2">
          The changes you have made will be discarded.
        </oxd-text>
      </div>
      <div class="orangehrm-modal-footer">
        <oxd-button
          label="No, Cancel"
          displayType="text"
          class="orangehrm-button-margin"
          @click="onCancel"
        />
        <oxd-button
          label="Yes, Continue"
          displayType="label-danger"
          class="orangehrm-button-margin"
          @click="onContinue"
        />
      </div>
    </oxd-dialog>
  </div>
</template>

<script>
import faker from './faker.js';
import {reactive, toRefs, watch, computed, nextTick} from 'vue';
import Text from '@orangehrm/oxd/core/components/Text/Text.vue';
import List from '@orangehrm/oxd/core/components/List2/List2.vue';
import Dialog from '@orangehrm/oxd/core/components/Dialog/Dialog';
import Button from '@orangehrm/oxd/core/components/Button/Button.vue';
import Divider from '@orangehrm/oxd/core/components/Divider/Divider.vue';
import IconButton from '@orangehrm/oxd/core/components/Button/Icon.vue';
import ListTable from '@orangehrm/oxd/core/components/ListTable/ListTable.vue';
import TimeInput from '@orangehrm/oxd/core/components/Input/Time/TimeInput.vue';
import Pagination from '@orangehrm/oxd/core/components/Pagination/Pagination.vue';
import PopOverButton from '@orangehrm/oxd/core/components/PopOverButton/PopOverButton.vue';
import QuickSearchInput from '@orangehrm/oxd/core/components/Input/Autocomplete/QuickSearchInput.vue';

const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Array(10)
          .fill(null)
          .map(() => {
            return {
              duration: '00:00',
              empId: faker.employee.id(),
              inDate: faker.date.past(),
              inTime: faker.time.past(),
              outDate: faker.date.past(),
              outTime: faker.time.past(),
              empName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            };
          }),
      );
    }, Math.floor(Math.random() * 1000));
  });
};

export default {
  components: {
    'oxd-text': Text,
    'oxd-list': List,
    'oxd-dialog': Dialog,
    'oxd-button': Button,
    'oxd-divider': Divider,
    'oxd-list-table': ListTable,
    'oxd-pagination': Pagination,
    'oxd-icon-button': IconButton,
    'oxd-quick-search': QuickSearchInput,
    'oxd-pop-over-button': PopOverButton,
  },

  setup() {
    const punchOutRenderer = (index, data, header, row) => {
      return {
        component: TimeInput,
        props: {
          format: '24',
          modelValue: data,
          'onUpdate:modelValue': (value) => {
            state.items[index].outTime = value;
          },
        },
      };
    };

    const state = reactive({
      items: [],
      headers: [
        {
          name: 'empId',
          title: 'E-ID',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
        },
        {
          name: 'empName',
          title: 'Employee Name',
          sortField: 'empName',
          style: {
            flex: '10%',
            'min-width': '180px',
            'margin-right': '0',
          },
        },
        {
          name: 'inDate',
          title: 'Punch-In Date',
          sortField: 'inDate',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
          cellType: 'oxd-table-cell-date',
        },
        {
          name: 'inTime',
          title: 'Punch-In Time',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
        },
        {
          name: 'outDate',
          title: 'Punch-Out Date',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
          cellType: 'oxd-table-cell-date',
        },
        {
          name: 'outTime',
          title: 'Punch-Out Time',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
          cellRenderer: punchOutRenderer,
        },
        {
          name: 'duration',
          title: 'Duration',
          style: {
            flex: '5%',
            'min-width': '90px',
            'margin-right': '0',
          },
        },
      ],
      checkedItems: [],
      isLoading: false,
      sortDefinition: {
        empName: 'DEFAULT',
        inDate: 'DESC',
      },
      pages: 10,
      total: 100,
      pageSize: 10,
      currentPage: 1,
      showDialog: null,
    });

    const buttonOptions = [
      {
        context: 'context_savepage',
        label: 'Save Current Page',
      },
      {
        context: 'context_saveall',
        label: 'Save All Records',
      },
    ];

    const tableHeaderText = computed(() => {
      if (state.items.length === 0) return 'No Records Found';
      if (state.checkedItems.length > 0) {
        return `${state.checkedItems.length} out of ${state.items.length} Selected`;
      }
      return `${state.items.length} Record(s) Found`;
    });

    const saveButtonLabel = computed(() => {
      if (state.checkedItems.length === 0) return 'Save Records';
      return `Save Selected ${state.checkedItems.length} Records`;
    });

    const onSelectOption = (option) => {
      console.log('selected');
    };

    const onPageSizeChange = (option) => {
      console.log('selected');
    };

    const loadData = async () => {
      state.isLoading = true;
      state.items = await fetchData();
      state.isLoading = false;
      await nextTick();
      state.checkedItems = state.items.map((_, i) => i);
    };

    const onCancel = () => {
      state.showDialog(false);
      state.showDialog = null;
    };
    const onContinue = () => {
      state.showDialog(true);
      state.showDialog = null;
    };

    const toggleDialog = () => {
      return new Promise((resolve) => {
        state.showDialog = resolve;
      });
    };

    watch(
      () => state.currentPage,
      (newVal, oldVal) => {
        toggleDialog().then((res) => {
          if (res) return loadData();
        });
      },
    );

    loadData();

    return {
      onCancel,
      onContinue,
      buttonOptions,
      onSelectOption,
      tableHeaderText,
      saveButtonLabel,
      onPageSizeChange,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
$oxd-list-padding: 24px;
$oxd-border-radius: 1.2rem;

.bg-wrapper {
  padding: 1rem;
  background-color: #f6f5fb;
}
.oxd-list-title {
  background-color: #fff;
  padding-left: $oxd-list-padding;
  padding-right: $oxd-list-padding;
  border-top-left-radius: $oxd-border-radius;
  border-top-right-radius: $oxd-border-radius;

  &-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(#{$oxd-list-padding}* 0.5) 0;
  }

  &-divider {
    padding-bottom: 10px;
  }
}

.table-count {
  font-size: 12px;
  font-weight: 600;
}

::v-deep(.oxd-icon-button.search) {
  width: 28px;
  height: 28px;
  padding: 0px;
  min-width: unset;
  min-height: unset;
  background: rgba(100, 114, 140, 0.1) !important;
}
::v-deep(.oxd-list-content-header) {
  align-items: center;
}
::v-deep(.oxd-time-wrapper) {
  max-width: 90px;
}
::v-deep(.oxd-time-input .oxd-input) {
  padding: 5px;
  min-height: 32px;
}
::v-deep(.oxd-time-input-icon-wrapper) {
  width: 24px;
  height: 24px;
}
::v-deep(.oxd-time-input-icon-wrapper .oxd-icon) {
  font-size: 12px;
}
.orangehrm-modal-header {
  margin-bottom: 1.2rem;
  display: flex;
  justify-content: center;
}
.orangehrm-modal-footer {
  margin-top: 1.2rem;
  display: flex;
  justify-content: center;
}
.orangehrm-button-margin {
  margin: 0.25rem;
}
.orangehrm-text-center-align {
  text-align: center;
}
</style>
