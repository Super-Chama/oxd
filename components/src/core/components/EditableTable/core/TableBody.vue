<template>
  <div class="oxd-edit-table-body" role="rowgroup">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'oxd-edit-table-body',
});
</script>
