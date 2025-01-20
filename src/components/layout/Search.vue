<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import dropdownDown from "@/assets/icons/problem-set-board/dropdown-down.svg";
import search from "@/assets/icons/problem-set-board/search.svg";
import { DatePicker } from "primevue";

const STATUS = ["안 푼 문제", "푼 문제", "틀린 문제"];
const { showStatus } = defineProps({
  showStatus: {
    type: Boolean,
    required: true,
  },
});

const keyword = ref("");
const isOpen = ref(false);
const status = ref([]);
const dropdown = ref(null);

const startTime = ref();
const endTime = ref();

const handleSearch = () => {
  console.log(keyword.value);
};

const isChecked = (state) => status.value.includes(state);
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const selectItem = (state) => {
  if (status.value.includes(state)) {
    status.value = status.value.filter((value) => value !== state);
  } else {
    status.value.push(state);
  }
};
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex justify-between items-center bg-beige-2 rounded-2xl h-12 p-4 border border-black-4"
    >
      <input
        v-model="keyword"
        type="text"
        class="w-full bg-transparent"
        placeholder="제목, 설명으로 검색"
      />
      <button @click="handleSearch" class="bg-transparent">
        <img :src="search" alt="검색 아이콘" />
      </button>
    </div>
    <div class="flex h-10 gap-6">
      <div v-if="showStatus" class="relative" ref="dropdown">
        <button
          @click="toggleDropdown"
          :class="[
            'flex justify-between items-center w-[210px] px-4 py-2 bg-beige-2 border border-black-4 rounded-lg',
            isOpen ? 'border-orange-1' : '',
          ]"
        >
          상태
          <img :src="dropdownDown" alt="드롭다운 아이콘" />
        </button>

        <div
          v-if="isOpen"
          class="absolute left-0 w-full mt-2 bg-beige-2 border rounded-md shadow-lg"
        >
          <ul>
            <li
              v-for="state in STATUS"
              :key="state"
              class="px-4 py-2 hover:bg-beige-1 cursor-pointer transition-colors"
              @click="selectItem(state)"
            >
              <input
                type="checkbox"
                class="mr-2 accent-black-2"
                name="status"
                :checked="isChecked(state)"
              />
              {{ state }}
            </li>
          </ul>
        </div>
      </div>
      <div class="w-full px-4 bg-beige-2 border border-black-4 rounded-lg">
        <div class="flex card items-center h-10 gap-4">
          <span>기간 선택</span>
          <span>|</span>
          <span>시작일</span>
          <DatePicker
            v-model="startTime"
            class="w-[116px] h-6"
            id="startTime"
            dateFormat="yy-mm-dd"
          />
          <span>종료일</span>
          <DatePicker
            v-model="endTime"
            class="w-[116px] h-6"
            id="endTime"
            dateFormat="yy-mm-dd"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
