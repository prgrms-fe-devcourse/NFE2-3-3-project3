<script setup>
defineProps({
  problem: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="mb-8">
    <p class="text-gray-700 mb-10">{{ problem?.question }}</p>

    <!-- 이미지 섹션 -->
    <div v-if="problem?.image_src" class="mb-10 item-middle">
      <img
        :src="problem.image_src"
        alt="문제 이미지"
        class="rounded-lg max-h-[400px]"
      />
    </div>

    <!-- 객관식 보기 -->
    <div v-if="problem?.problem_type === 'multiple_choice'" class="space-y-4">
      <ol class="list-decimal space-y-2 text-gray-700">
        <li v-if="problem.option_one" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle">1</strong>
          <span>{{ problem.option_one }}</span>
        </li>
        <li v-if="problem.option_two" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle">2</strong>
          <span>{{ problem.option_two }}</span>
        </li>
        <li v-if="problem.option_three" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle">3</strong>
          <span>{{ problem.option_three }}</span>
        </li>
        <li v-if="problem.option_four" class="flex items-center gap-2">
          <strong class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle">4</strong>
          <span>{{ problem.option_four }}</span>
        </li>
      </ol>
    </div>

    <!-- OX 보기 -->
    <div v-if="problem?.problem_type === 'OX'" class="space-y-4">
      <ul>
        <li v-if="problem?.option_one" class="flex items-center gap-2 rounded border border-gray-200">
          <strong class="text-lg font-normal item-middle inline-block border-gray-200 h-full border-r px-4 py-2 bg-black-6">O</strong>
          <span class="inline-block px-4 py-2">{{ problem.option_one }}</span>
        </li>
        <li v-if="problem?.option_two" class="flex items-center gap-2 rounded border border-gray-200">
          <strong class="text-lg font-normal item-middle inline-block border-gray-200 h-full border-r px-4 py-2 bg-black-6">X</strong>
          <span class="inline-block px-4 py-2">{{ problem.option_two }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>