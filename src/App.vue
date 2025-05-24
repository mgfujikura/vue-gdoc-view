<script setup lang="ts">
import GoogleDocumentView from './components/GoogleDocumentView.vue';
</script>

<template>
  <div class="App">
    <GoogleDocumentView
      src="https://docs.google.com/document/d/e/2PACX-1vRdGpAes41j2Akcmuir1aCQv0yERaqucBSSSyj-TlljLfurQY7tBun56YtaADbRW54M72O_UfxqVhQj/pub?embedded=true"
      width="400px"
      height="600px"
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
