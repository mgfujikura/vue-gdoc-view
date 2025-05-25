<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import toPx from './toPxcel';

const props = defineProps<{
  src: string;
  width: number | string;
  height: number | string;
  documentWidth?: number;
  margin?: number | string;
  padding?: number | string;
}>();

const width = computed(() => (typeof props.width === 'string' ? props.width : props.width + 'px'));
const height = computed(() => (typeof props.height === 'string' ? props.height : props.height + 'px'));

const documentPx = computed(() => props.documentWidth || 601.867);

const frameWrapper = useTemplateRef('frameWrapper');
const iframe = useTemplateRef('iframe');

const scale = computed(() => {
  if (!frameWrapper.value) {
    return undefined;
  }
  const wrapperWidth = toPx(props.width, frameWrapper.value.parentElement?.clientWidth);
  const scale = wrapperWidth / documentPx.value;
  return scale;
});
const frameHeight = computed(() => {
  if (!frameWrapper.value || !scale.value) {
    return undefined;
  }
  return frameWrapper.value.clientHeight / scale.value;
});

const frameLoaded = ref(false);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

const onFrameLoad = () => {
  frameLoaded.value = mounted.value;
  if (!iframe.value) {
    return;
  }
  const doc = iframe.value.contentDocument;
  if (!doc) {
    return;
  }
  const body = doc.querySelector('body');
  if (body) {
    if (props.margin) {
      body.style.margin = props.margin.toString();
    }
    if (props.padding) {
      body.style.padding = props.padding.toString();
    }
  }
  // リンクの処理変更
  const anchors = doc.querySelectorAll('a[href]');
  for (const elm of anchors) {
    const a = elm as HTMLAnchorElement;
    a.target = '_parent';
    const url = new URL(a.href);
    a.href = url.searchParams.get('q') || '';
  }
  // 画像リンクは削除されているため、代替テキストをリンクにする
  const images = doc.querySelectorAll('img[alt]');
  for (const elm of images) {
    const img = elm as HTMLImageElement;
    const a = document.createElement('a');
    a.href = img.alt;
    img.alt = '';
    a.target = '_parent';
    a.appendChild(img.cloneNode(true));
    img.parentElement?.replaceChild(a, img);
  }
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
      ref="iframe"
      v-show="frameLoaded"
      frameborder="0"
      :width="documentPx"
      :height="frameHeight"
      :src="src"
      :style="{
        transform: `scale(${scale})`,
      }"
      @load="onFrameLoad()"
    ></iframe>
  </div>
</template>
<style scoped>
iframe {
  /* height: 100%; */
  border: none;
  overflow-x: clip;
  transform-origin: 0 0;
}
.FrameWrapper {
  height: 100%;
  overflow: hidden;
}
</style>
