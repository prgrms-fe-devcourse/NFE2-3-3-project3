<script setup>
import { onMounted, watch } from 'vue';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const props = defineProps({
  problem: {
    type: Object,
    required: true,
  },
});

let viewer;

onMounted(() => {
  viewer = new Viewer({
    el: document.querySelector('#viewer'),
    initialValue: props.problem?.question,
  });
});

watch(() => props.problem, (newProblem) => {
  if (viewer) {
    viewer.setMarkdown(newProblem.question || '');
  }
});
</script>

<template>
  <div class="mb-8">
    <div id="viewer" class="text-gray-700 min-h-4 mb-10 w-full"></div>

    <!-- 객관식 보기 -->
    <div
      v-if="props.problem?.problem_type === 'multiple_choice'"
      class="space-y-4"
    >
      <ol class="list-decimal space-y-2 text-gray-700">
        <li v-if="props.problem.option_one" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 item-middle">1</strong>
          <span>{{ props.problem.option_one }}</span>
        </li>
        <li v-if="props.problem.option_two" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 item-middle">2</strong>
          <span>{{ props.problem.option_two }}</span>
        </li>
        <li v-if="props.problem.option_three" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 item-middle">3</strong>
          <span>{{ props.problem.option_three }}</span>
        </li>
        <li v-if="props.problem.option_four" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 item-middle">4</strong>
          <span>{{ props.problem.option_four }}</span>
        </li>
      </ol>
    </div>

    <!-- OX 보기 -->
    <div v-if="props.problem?.problem_type === 'ox'" class="space-y-4">
      <ul class="flex gap-4">
        <li
          class="flex items-center gap-2 rounded-xl  w-1/2 h-24 text-4xl font-extrabold item-middle border-r px-4 py-2 bg-orange-1 hover:bg-orange-2 text-white shadow-sm transition"
        >
          O
        </li>
        <li
          class="flex items-center gap-2 rounded-xl w-1/2 h-24 text-4xl item-middle px-4 py-2 bg-black-6 hover:bg-orange-2 text-gray-1 shadow-sm transition"
        >
          X
        </li>
      </ul>
    </div>
  </div>
</template>