<script setup lang="ts">
import GoogleDocumentView from './components/GoogleDocumentView.vue';
</script>

<template>
  <div class="App">
    <GoogleDocumentView src="/docs/sample1/index.html" width="600px" height="600px" margin="0" padding="1em"
      >ロード中</GoogleDocumentView
    >
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  height: 100%;
}
</style>
