<script setup>
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";
import createWorkbook from "@/assets/icons/my-problem-sets/createWorkbook.svg";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { Avatar } from "primevue";
import ProblemSet from "@/components/layout/ProblemSet.vue";
import { ToggleSwitch } from "primevue";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useWorkbookStore } from "@/store/workbookStore";
import { storeToRefs } from "pinia";
import { workbookAPI } from "@/api/workbook";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const workbookStore = useWorkbookStore();

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  shared: {
    type: Boolean,
    required: false,
    default: false,
  },
  tags: {
    type: Array, // 태그 필드 추가
    required: false,
    default: () => [],
  },
});
const router = useRouter();

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

const showDialog = ref(false);
const title = ref("");
const description = ref("");
const shared = ref(false);

// Store의 상태를 반응형으로 가져오기
const { workbooks, problemCounts } = storeToRefs(workbookStore);

//전체보기
const isMyBooksViewAll = ref(false);

const toggleMyBooksViewAll = () => {
  isMyBooksViewAll.value = !isMyBooksViewAll.value;
};

// 🔥 공유받은 문제집 목록 가져오기
const sharedWorkbooks = computed(() => workbookStore.sharedWorkbooks);

const isSharedBooksViewAll = ref(false);

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
    console.log("데이터 확인", book.id);
    await workbookStore.fetchProblemCount(book.id);
    console.log("데이터 확인222", book.id, "=>", problemCounts.value[book.id]);
  }
};

const visibleSharedBooks = computed(() => {
  return isSharedBooksViewAll.value
    ? sharedBooks.value
    : sharedBooks.value.slice(0, 4);
});

const toggleSharedBooksViewAll = () => {
  isSharedBooksViewAll.value = !isSharedBooksViewAll.value;
};

// 문제집 상세 페이지로 이동하는 함수
const goToProblemSet = (bookId) => {
  router.push(`/problem-set-board/${bookId}`);
};

//문제집 추가

const onCreateNewFolder = async ({ title, description, shared }) => {
  try {
    const data = await workbookAPI.add(title, description, shared);
    console.log("생성된 문제집 데이터:", data); // 성공적으로 추가된 데이터 출력
    alert("문제집이 성공적으로 추가되었습니다!");
    showDialog.value = false; // 모달 닫기
  } catch (error) {
    console.error("문제집 생성에 실패했습니다:", error);
  }
};

// 버튼 클릭 시 호출될 함수
const addWorkbook = async () => {
  if (!title.value.trim() || !description.value.trim()) {
    alert("제목과 설명을 입력해주세요.");
    return;
  }
  await onCreateNewFolder({
    title: title.value,
    description: description.value,
    shared: shared.value, // 공개 여부 포함
  });
};

watch(
  () => authStore.user.id,
  async (newUserId) => {
    if (newUserId) {
      try {
        await workbookStore.loadWorkbooks(newUserId); // 문제집 로드
        await fetchCountsForAllWorkbooks(); // 문제 수 로드
        await workbookStore.loadSharedWorkbooks(newUserId); //공유받은 문제집
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
    <h1 class="text-[42px] font-laundry">보관한 문제집 테스트중gg</h1>

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

      <!-- <div class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="book in visibleMyBooks"
          :key="book.id"
          :problemSet="book"
          :to="`/problem-set-board/${book.id}`"
          @click="console.log(book)"
        />
      </div> -->

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
          <!-- 문제집 제목 -->
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

          <!-- 문제집 설명 -->
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

          <!-- 공개 여부 -->
          <div class="flex items-center gap-2">
            <label for="shared" class="text-sm font-medium">공개 여부</label>
            <ToggleSwitch v-model="shared" name="shared" />
          </div>
        </div>

        <!-- 버튼 -->
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
