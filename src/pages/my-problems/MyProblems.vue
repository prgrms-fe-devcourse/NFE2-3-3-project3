<script setup>
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref, watch } from "vue";
import { SORT } from "@/const/sorts";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { againViewProblemAPI } from "@/api/againViewProblem";
import { problemAPI } from "@/api/problem";
import { categoryAPI } from "@/api/category";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const problems = ref([]);
const initialProblems = ref([]); // 초기 문제 목록 저장
const loading = ref(false);
const error = ref(null);

const loadProblems = async (userId) => {
  if (!userId) return;

  loading.value = true;
  error.value = null;

  try {
    const [againViewProblems, userProblems, sharedProblems] = await Promise.all(
      [
        againViewProblemAPI.getAllByUserId(userId),
        problemAPI.getAllByUserId(userId),
        problemAPI.getUserSharedProblems(userId),
      ],
    );

    // 빈 배열이 아닌 결과만 병합
    const mergedProblems = [
      ...(againViewProblems?.length ? againViewProblems : []),
      ...(userProblems?.length ? userProblems : []),
      ...(sharedProblems?.length ? sharedProblems : []),
    ];

    const uniqueProblems = Array.from(
      new Map(mergedProblems.map((item) => [item.id, item])).values(),
    );

    // 각 문제의 카테고리 조회 시 예외 처리
    const problemsWithCategory = await Promise.all(
      uniqueProblems.map(async (problem) => {
        try {
          const categoryData = await categoryAPI.getCategoryNameById(
            problem.category_id,
          );
          return {
            ...problem,
            category_name: categoryData?.name || "미분류",
          };
        } catch (err) {
          console.warn(`카테고리 조회 실패 (문제 ID: ${problem.id}):`, err);
          return {
            ...problem,
            category_name: "카테고리 없음",
          };
        }
      }),
    );

    problems.value = problemsWithCategory;
    initialProblems.value = problemsWithCategory;
  } catch (err) {
    error.value = err;
    console.error("문제 로드 실패:", err);
  } finally {
    loading.value = false;
  }
};

const search = async (
  keyword,
  startDate,
  endDate,
  sort = SORT.latest,
  status,
) => {
  if (!user.value?.id) return;

  loading.value = true;
  try {
    // 검색 조건이 없을 때
    if (!keyword && !startDate && !endDate && !status) {
      problems.value = initialProblems.value;
    } else {
      // API를 통한 검색 수행
      const searchResults = await problemAPI.search(
        user.value.id,
        keyword,
        startDate,
        endDate,
        status,
      );
      problems.value = searchResults;
    }

    router.push({
      query: {
        ...(keyword && { keyword }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(status && { status }),
        sort,
      },
    });
  } catch (err) {
    console.error("검색 실패:", err);
    error.value = "검색 중 오류가 발생했습니다";
  } finally {
    loading.value = false;
  }
};

watch(
  () => user.value?.id,
  (newUserId) => {
    if (newUserId) {
      loadProblems(newUserId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="flex flex-col gap-16 w-[1000px] mx-auto mt-[72px] relative">
    <h1 class="text-[42px] font-laundry">보관한 문제</h1>
    <Search :show-status="true" @search="search" />
    <div v-if="loading" class="text-center">로딩 중...</div>
    <div v-else-if="error" class="text-red-500 text-center">
      문제 로드 중 오류가 발생했습니다
    </div>
    <ProblemTable
      v-else
      :problems="problems"
      :show-my-problem="true"
      :show-shared-problem="true"
      :show-problem="true"
    />
  </section>
</template>
