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
const emits = defineEmits<{
  loaded: [doc: Document];
}>();

const width = computed(() => (typeof props.width === 'string' ? props.width : props.width + 'px'));
const height = computed(() => (typeof props.height === 'string' ? props.height : props.height + 'px'));

const documentPx = computed(() => props.documentWidth || 601.867);

const frameWrapperRef = useTemplateRef('frameWrapper');
const iframeRef = useTemplateRef('iframe');

const scale = computed(() => {
  if (!frameWrapperRef.value) {
    return undefined;
  }
  const wrapperWidth = toPx(props.width, frameWrapperRef.value.parentElement?.clientWidth);
  const scale = wrapperWidth / documentPx.value;
  return scale;
});
const frameHeight = computed(() => {
  if (!frameWrapperRef.value || !scale.value) {
    return undefined;
  }
  return frameWrapperRef.value.clientHeight / scale.value;
});

const frameLoaded = ref(false);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

const onFrameLoad = () => {
  frameLoaded.value = mounted.value;
  if (!iframeRef.value) {
    return;
  }
  const doc = iframeRef.value.contentDocument;
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
  // 画像の alt が link: で始まっている場合は link: 以降スペースまたは最後までの文字列を
  // 画像リンクURLとして設定する。
  // ※ Googleドキュメントで画像リンクをつけてもHTML化時にリンクが削除されてしまうため
  const images = doc.querySelectorAll('img[alt]');
  for (const elm of images) {
    const img = elm as HTMLImageElement;
    if (!img.alt.startsWith('link:')) {
      continue;
    }
    const [url, alt] = img.alt.substring(5).split(' ', 2);
    const a = document.createElement('a');
    a.href = url;
    if (alt) {
      img.alt = alt;
    } else {
      img.removeAttribute('alt');
    }
    a.target = '_parent';
    a.appendChild(img.cloneNode(true));
    img.parentElement?.replaceChild(a, img);
  }
  // onLoadイベント
  emits('loaded', doc);
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
