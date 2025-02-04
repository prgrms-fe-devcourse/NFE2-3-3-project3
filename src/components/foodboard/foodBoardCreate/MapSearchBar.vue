<script setup>
import SearchIcon from "@/assets/icons/search.svg";

const props = defineProps({
  modelValue: String, // 부모에서 전달하는 keyword 값
});

const emits = defineEmits(["update:modelValue", "search"]);

const onSearch = () => {
  emits("search");
};

const updateKeyword = (event) => {
  emits("update:modelValue", event.target.value);
};
</script>
<template>
  <div
    id="location-search-bar"
    class="relative w-full h-[40px] z-10 mt-1 pr-1 pl-1"
  >
    <input
      :v-model="keyword"
      type="text"
      placeholder="당신의 맛집을 검색하세요"
      class="w-full h-[40px] bg-white border border-white02 rounded-[10px] px-5 py-5 text-[18px] text-black01 placeholder-[18px] placeholder-gray02 focus:outline-none"
      @input="updateKeyword"
      @keyup.enter="onSearch"
    />

    <button
      @click="onSearch"
      class="absolute right-5 top-1/2 transform -translate-y-1/2"
    >
      <img :src="SearchIcon" class="w-6 h-6" alt="검색" />
    </button>
  </div>
</template>
