<template>
  <div class="oxd-edit-table-thead" role="rowgroup">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'oxd-edit-table-thead',
});
</script>
