<template>
  <div class="oxd-edit-table-th" role="columnheader">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'oxd-edit-table-th',
});
</script>
