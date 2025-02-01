<script setup>
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";
import createWorkbook from "@/assets/icons/my-problem-sets/createWorkbook.svg";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { Avatar, useToast, ToggleSwitch } from "primevue";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useWorkbookStore } from "@/store/workbookStore";
import { storeToRefs } from "pinia";
import { workbookAPI } from "@/api/workbook";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const workbookStore = useWorkbookStore();
const router = useRouter();
const {
  workbooks,
  sharedWorkbooks,
  problemCounts,
  title,
  description,
  shared,
} = storeToRefs(workbookStore);

//모달
const toast = useToast();
const showDialog = ref(false);

//전체보기
const isMyBooksViewAll = ref(false);
const isSharedBooksViewAll = ref(false);
const toggleMyBooksViewAll = () => {
  isMyBooksViewAll.value = !isMyBooksViewAll.value;
};

const visibleMyBooks = computed(() => {
  const newBooks = isMyBooksViewAll.value
    ? workbooks.value
    : workbooks.value.slice(0, 4);
  return newBooks.map((book) => ({
    ...book,
    problems: new Array(problemCounts.value[book.id] || 0).fill({}),
    shared: book.shared ?? false,
  }));
});

//문제 수를 개별적으로 가져오는 함수
const fetchCountsForAllWorkbooks = async () => {
  const allBooks = [...workbooks.value, ...sharedWorkbooks.value];

  for (const book of allBooks) {
    await workbookStore.fetchProblemCount(book.id);
  }
};

const toggleSharedBooksViewAll = () => {
  isSharedBooksViewAll.value = !isSharedBooksViewAll.value;
};

// 문제집 상세 페이지로 이동하는 함수
const goToProblemSet = (bookId) => {
  router.push(`/problem-set-board/${bookId}`);
};

//리셋
const resetFormFields = () => {
  title.value = "";
  description.value = "";
  shared.value = false;
};

//문제집 추가
const addWorkbook = async () => {
  if (!title.value.trim() || !description.value.trim()) {
    toast.add({
      severity: "warn",
      summary: "경고",
      detail: "제목과 설명을 입력해주세요.",
      life: 3000,
    });
    return;
  }

  try {
    await workbookAPI.add(title.value, description.value, shared.value);

    workbookStore.updateWorkbook({
      title: title.value,
      description: description.value,
      shared: shared.value,
    });

    toast.add({
      severity: "success",
      summary: "성공",
      detail: "문제집이 성공적으로 추가되었습니다!",
      life: 3000,
    });

    await workbookStore.loadWorkbooks(authStore.user.id);
    await fetchCountsForAllWorkbooks();

    showDialog.value = false;
    resetFormFields();
  } catch (error) {
    console.error("문제집 생성에 실패했습니다:", error);
    toast.add({
      severity: "error",
      summary: "오류",
      detail: "문제집 생성에 실패했습니다.",
      life: 3000,
    });
  }
};

watch(
  () => authStore.user.id,
  async (newUserId) => {
    if (newUserId) {
      try {
        await workbookStore.loadWorkbooks(newUserId); // 문제집 로드
        await workbookStore.loadSharedWorkbooks(newUserId); //공유받은 문제집
        await fetchCountsForAllWorkbooks(newUserId); // 문제 수 로드
      } catch (error) {
        console.error("데이터 로드 중 오류:", error);
      }
    }
  },
  { immediate: true },
);
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
          class="w-[204px] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between cursor-pointer"
          @click="goToProblemSet(book.id)"
        >
          <div>
            <h3 class="font-semibold">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 truncate">{{ book.description }}</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <img
              v-if="book.shared"
              :src="shareIcon"
              alt="공유됨"
              class="w-5 h-5"
              :class="{ 'opacity-0': !book.shared }"
            />
            <span v-else class="w-5 h-5"></span>
            <p class="text-sm font-medium">
              {{ problemCounts[book.id] || 0 }}문제
            </p>
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
          v-for="book in sharedWorkbooks"
          :key="book.id"
          class="w-[204px] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between cursor-pointer"
          @click="goToProblemSet(book.id)"
        >
          <div>
            <h3 class="font-semibold">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 truncate">{{ book.description }}</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <div class="flex items-center">
              <Avatar
                :image="book.user.avatar_url"
                class="mr-2 max-w-7 max-h-7"
                shape="circle"
              />
              <span>{{ book.user.name }}</span>
            </div>

            <p class="text-sm font-medium">
              {{ problemCounts[book.id] || 0 }}문제
            </p>
          </div>
        </div>
      </div>
      <!-- 아래의 img가 모달을 나오게 해주는 버튼 -->
      <img
        :src="createWorkbook"
        alt="createWorkbook"
        class="fixed flex items-center justify-center w-16 h-16 rounded-full cursor-pointer bg-orange-1 right-20 bottom-20"
        @click="showDialog = true"
      />

      <!-- 모달 -->
      <Dialog
        v-model:visible="showDialog"
        header="문제집 추가하기"
        modal
        class="w-[500px]"
      >
        <div class="flex flex-col gap-4">
          <div>
            <label for="title" class="block text-sm font-medium"
              >문제집 제목</label
            >
            <input
              id="title"
              type="text"
              class="w-full border rounded px-2 py-1"
              v-model="title"
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium"
              >문제집 설명</label
            >
            <textarea
              id="description"
              rows="4"
              class="w-full border rounded px-2 py-1"
              v-model="description"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <label for="shared" class="text-sm font-medium">공개 여부</label>
            <ToggleSwitch v-model="shared" name="shared" />
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <Button
              label="문제집 추가하기"
              class="p-button"
              @click="addWorkbook"
            />
            <Button
              label="취소"
              class="p-button-text"
              @click="showDialog = false"
            />
          </div>
        </template>
      </Dialog>
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
