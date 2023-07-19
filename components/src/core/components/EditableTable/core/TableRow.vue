<template>
  <div class="oxd-edit-table-row" role="row">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'oxd-edit-table-row',
});
</script>
