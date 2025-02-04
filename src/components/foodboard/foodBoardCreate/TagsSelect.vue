<script setup>
import DeleteBtn from "@/assets/icons/delete-btn.svg";
import { foodBoardTag } from "@/constants/index";
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps({
  initialTags: Array, // 기존 게시물의 태그
});

const selectedTag = ref([]);
const emit = defineEmits(["update:selectedTag"]);

// 기존 태그 데이터 반영
watchEffect(() => {
  if (props.initialTags) {
    selectedTag.value = [...props.initialTags];
  }
});

const selectTag = (tag) => {
  if (!selectedTag.value.includes(tag)) {
    selectedTag.value.push(tag);
    emit("update:selectedTag", selectedTag.value);
  }
};

const removeTag = (tag) => {
  selectedTag.value = selectedTag.value.filter((t) => t !== tag);
  emit("update:selectedTag", selectedTag.value);
};
</script>

<template>
  <div class="flex flex-col gap-[20px]">
    <div class="min-h-[39px] overflow-x-auto scrollbar-hide">
      <div class="flex items-center gap-x-[10px] w-max flex-nowrap">
        <button
          v-for="(tag, index) of foodBoardTag"
          :key="index"
          @click="selectTag(tag)"
          class="inline-flex items-center h-[39px] px-[15px] rounded-[10px] whitespace-nowrap"
          :class="{
            'bg-gray02 text-white01 gap-[10px]': selectedTag.includes(tag),
            'bg-white02 text-black01': !selectedTag.includes(tag),
          }"
        >
          <p>{{ tag }}</p>
          <img
            v-if="selectedTag.includes(tag)"
            @click.stop="removeTag(tag)"
            :src="DeleteBtn"
            class="cursor-pointer"
          />
        </button>
      </div>
    </div>
  </div>
</template>
