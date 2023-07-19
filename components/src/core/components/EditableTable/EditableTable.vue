<script>
import isEqual from 'lodash/isEqual';
import {computed, h, reactive, watchEffect} from 'vue';
import Table from '@orangehrm/oxd/core/components/EditableTable/core/Table.vue';
import TableHead from '@orangehrm/oxd/core/components/EditableTable/core/TableHead.vue';
import TableBody from '@orangehrm/oxd/core/components/EditableTable/core/TableBody.vue';
import TableRow from '@orangehrm/oxd/core/components/EditableTable/core/TableRow.vue';
import TableData from '@orangehrm/oxd/core/components/EditableTable/core/TableData.vue';
import TableHeader from '@orangehrm/oxd/core/components/EditableTable/core/TableHeader.vue';

export default {
  name: 'oxd-edit-table',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableData,
    TableHeader,
  },
  setup(props) {
    const state = reactive({
      data: [],
      pagination: [],
      deltas: [],
      editing: null,
    });

    const rowComputedStyles = computed(() => {
      const columnStyles = props.headers.map(() => 'minmax(10px, 1fr)');
      return {
        'grid-template-columns': columnStyles.join(' '),
      };
    });

    function mapFromArray(array, prop) {
      const map = {};
      for (var i = 0; i < array.length; i++) {
        map[array[i][prop]] = array[i];
      }
      return map;
    }

    function getDelta(o, n, comparator) {
      const delta = {
        added: [],
        deleted: [],
        changed: [],
      };
      const mapO = mapFromArray(o, 'id');
      const mapN = mapFromArray(n, 'id');
      for (const id in mapO) {
        if (!mapN.hasOwnProperty(id)) {
          delta.deleted.push(mapO[id]);
        } else if (!comparator(mapN[id], mapO[id])) {
          delta.changed.push(mapN[id]);
        }
      }

      for (var id in mapN) {
        if (!mapO.hasOwnProperty(id)) {
          delta.added.push(mapN[id]);
        }
      }
      return delta;
    }

    watchEffect(() => {
      state.data = JSON.parse(JSON.stringify(props.items));
    });

    watchEffect(() => {
      state.deltas.push(getDelta(state.data, props.items, isEqual));
      console.log(state.deltas);
    });

    return () =>
      h(
        Table,
        {},
        {
          default: () => [
            h(
              TableHead,
              {
                style: rowComputedStyles.value,
              },
              {
                default: () =>
                  props.headers.map(header =>
                    h(TableHeader, header?.header?.props ?? {}, {
                      default: () => header.title,
                    }),
                  ),
              },
            ),
            h(
              TableBody,
              {},
              {
                default: () =>
                  state.data.map((row, index) =>
                    h(
                      TableRow,
                      {
                        style: rowComputedStyles.value,
                      },
                      {
                        default: () =>
                          props.headers.map(header => {
                            const key =
                              JSON.stringify(row) + JSON.stringify(header);
                            if (key === state.editing) {
                              return h('input', {
                                value: row[header.key],
                                onBlur: () => {
                                  state.editing = null;
                                },
                                onChange: $event => {
                                  state.data[index][header.key] =
                                    $event.target.value;
                                },
                              });
                            } else {
                              return h(
                                TableData,
                                {
                                  onClick: () => {
                                    state.editing = key;
                                  },
                                },
                                {
                                  default: () => row[header.key],
                                },
                              );
                            }
                          }),
                      },
                    ),
                  ),
              },
            ),
            h('br'),
            h(
              'button',
              {
                onClick: () => {
                  state.data.push(
                    props.headers.reduce(
                      (acc, obj) => ({...acc, [obj.key]: undefined}),
                      {},
                    ),
                  );
                },
              },
              'Add',
            ),
          ],
        },
      );
  },
};
</script>

<style lang="scss" src="./editable-table.scss"></style>
