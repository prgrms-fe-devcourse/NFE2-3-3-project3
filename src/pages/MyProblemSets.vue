<script setup>
import { ref, computed } from "vue";
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";

const myBooks = ref([
  { title: "기본 문제집", description: "문제집에 대한 설명입니다.", count: 40 },
  { title: "기본 문제집", description: "문제집에 대한 설명입니다.", count: 40 },
  { title: "기본 문제집", description: "문제집에 대한 설명입니다.", count: 40 },
  { title: "기본 문제집", description: "문제집에 대한 설명입니다.", count: 40 },
  { title: "추가 문제집", description: "추가 문제집 설명입니다.", count: 50 },
]);

const sharedBooks = ref([
  {
    title: "기본 문제집",
    description: "문제집에 대한 설명입니다.",
    count: 40,
    sharedBy: "닉네임",
  },
  {
    title: "기본 문제집",
    description: "문제집에 대한 설명입니다.",
    count: 40,
    sharedBy: "닉네임",
  },
  {
    title: "기본 문제집",
    description: "문제집에 대한 설명입니다.",
    count: 40,
    sharedBy: "닉네임",
  },
  {
    title: "기본 문제집",
    description: "문제집에 대한 설명입니다.",
    count: 40,
    sharedBy: "닉네임",
  },
  {
    title: "추가 공유 문제집",
    description: "추가 공유된 문제집 설명입니다.",
    count: 50,
    sharedBy: "다른 닉네임",
  },
]);

const isMyBooksViewAll = ref(false);
const isSharedBooksViewAll = ref(false);

const visibleMyBooks = computed(() => {
  return isMyBooksViewAll.value ? myBooks.value : myBooks.value.slice(0, 4);
});

const visibleSharedBooks = computed(() => {
  return isSharedBooksViewAll.value
    ? sharedBooks.value
    : sharedBooks.value.slice(0, 4);
});

const toggleMyBooksViewAll = () => {
  isMyBooksViewAll.value = !isMyBooksViewAll.value;
};

const toggleSharedBooksViewAll = () => {
  isSharedBooksViewAll.value = !isSharedBooksViewAll.value;
};
</script>

<template>
  <section class="flex flex-col gap-16 w-[1000px] mx-auto mt-[72px]">
    <h1 class="text-[42px] font-laundry">보관한 문제집</h1>

    <!-- 내가 만든 문제집 섹션 -->
    <section class="flex flex-col gap-[18px]">
      <div class="flex items-center gap-[16px]">
        <h2 class="font-semibold text-xl">내가 만든 문제집</h2>
        <button
          @click="toggleMyBooksViewAll"
          class="text-[#B1B1B1] hover:no-underline flex items-center gap-1"
        >
          {{ isMyBooksViewAll ? "접기" : "전체보기 +" }}
        </button>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(book, index) in visibleMyBooks"
          :key="index"
          class="w-[204px] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between"
        >
          <div>
            <h3 class="font-semibold">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 truncate">{{ book.description }}</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <img :src="shareIcon" alt="share" />
            <p class="text-sm font-medium">{{ book.count }}문제</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 공유 받은 문제집 섹션 -->
    <section class="flex flex-col gap-[18px]">
      <div class="flex items-center gap-[16px]">
        <h2 class="font-semibold text-xl">공유 받은 문제집</h2>
        <button
          @click="toggleSharedBooksViewAll"
          class="text-[#B1B1B1] hover:no-underline flex items-center gap-1"
        >
          {{ isSharedBooksViewAll ? "접기" : "전체보기 +" }}
        </button>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(book, index) in visibleSharedBooks"
          :key="index"
          class="w-[204px] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between"
        >
          <div>
            <h3 class="font-semibold">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 truncate">{{ book.description }}</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm text-gray-600">{{ book.sharedBy }}</p>
            <p class="text-sm font-medium">{{ book.count }}문제</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.material-icons {
  font-size: 16px;
  vertical-align: middle;
}
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
