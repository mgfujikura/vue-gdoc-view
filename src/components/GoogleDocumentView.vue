<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import toPx from './toPxcel';

const props = defineProps<{
  src: string;
  width: number | string;
  height: number | string;
  documentWidth?: number;
}>();

const width = computed(() => (typeof props.width === 'string' ? props.width : props.width + 'px'));
const height = computed(() => (typeof props.height === 'string' ? props.height : props.height + 'px'));

const documentPx = computed(() => props.documentWidth || 601.867);

const frameWrapper = useTemplateRef('frameWrapper');

const scale = computed(() => {
  if (!frameWrapper.value) {
    return undefined;
  }
  const wrapperWidth = toPx(props.width, frameWrapper.value.parentElement?.clientWidth);
  const scale = wrapperWidth / documentPx.value;
  return `scale(${scale})`;
});

const frameLoaded = ref(false);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

const frameLoaded2 = () => {
  frameLoaded.value = mounted.value;
};
</script>
<template>
  <div
    ref="frameWrapper"
    class="FrameWrapper"
    :style="{
      width: width,
      height: height,
    }"
  >
    <slot v-if="!frameLoaded"></slot>
    <iframe
      v-show="frameLoaded"
      frameborder="0"
      :width="documentPx"
      height="100%"
      :src="src"
      :style="{
        transform: scale,
      }"
      @load="frameLoaded2()"
    ></iframe>
  </div>
</template>
<style scoped>
iframe {
  height: 100%;
  border: none;
  overflow-x: clip;
  transform-origin: 0 0;
}
.FrameWrapper {
  height: 100%;
  overflow: hidden;
}
</style>
