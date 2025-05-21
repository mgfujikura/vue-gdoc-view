<script setup lang="ts">
import GoogleDocumentView from './components/GoogleDocumentView.vue';
</script>

<template>
  <div class="App">
    <GoogleDocumentView
      src="https://docs.google.com/document/d/e/2PACX-1vRDSV3ebQfluGw6mxaokXZ1AIdSx0NLQh2oYtgbek2Wj9M6NIZoOO23IfUKgfQZ07vMDv6hkEvL1TQc/pub?embedded=true"
      width="50vmin"
      height="50vmin"
      >まってます</GoogleDocumentView
    >
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  height: 100%;
}
</style>
