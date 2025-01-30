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
import { useToast } from "primevue/usetoast";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const problems = ref([]);
const initialProblems = ref([]);
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const filterType = ref('all'); // 'all', 'againView', 'myProblems', 'sharedProblems'

const handleFilterChange = (type) => {
  filterType.value = type;
};

const filterProblems = () => {
  if (filterType.value === 'all') {
    problems.value = initialProblems.value;
  } else if (filterType.value === 'againView') {
    problems.value = initialProblems.value.filter(problem => problem.againView);
  } else if (filterType.value === 'myProblems') {
    problems.value = initialProblems.value.filter(problem => problem.isOwner);
  } else if (filterType.value === 'sharedProblems') {
    problems.value = initialProblems.value.filter(problem => problem.isShared);
  }
};

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

    const mergedProblems = [
      ...(againViewProblems?.length ? againViewProblems.map(p => ({ ...p, againView: true })) : []),
      ...(userProblems?.length ? userProblems.map(p => ({ ...p, isOwner: true })) : []),
      ...(sharedProblems?.length ? sharedProblems.map(p => ({ ...p, isShared: true })) : []),
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
    toast.add({
      severity: "error",
      summary: "오류",
      detail: "문제 로드 중 오류가 발생했습니다",
      life: 3000,
    });
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
    // 검색 조건이 없을 때는 초기 목록 반환
    if (!keyword && !startDate && !endDate && !status) {
      problems.value = initialProblems.value;
    } else {
      let filteredProblems = [...initialProblems.value];

      // 키워드 검색
      if (keyword) {
        const searchTerm = keyword.toLowerCase();
        filteredProblems = filteredProblems.filter(
          (problem) =>
            problem.title?.toLowerCase().includes(searchTerm) ||
            problem.content?.toLowerCase().includes(searchTerm),
        );
      }

      // 날짜 필터링
      if (startDate || endDate) {
        filteredProblems = filteredProblems.filter((problem) => {
          const problemDate = new Date(problem.created_at);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          return (
            (!start || problemDate >= start) && (!end || problemDate <= end)
          );
        });
      }

      // 상태 필터링
      if (status) {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.status === status,
        );
      }

      problems.value = filteredProblems;
    }

    // URL 쿼리 파라미터 업데이트
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

// 필터 변경 감시
watch(filterType, filterProblems);
</script>

<template>
  <section class="flex flex-col gap-16 w-[1000px] mx-auto mt-[72px] relative">
    <Toast />
    <h1 class="text-[42px] font-laundry">보관한 문제</h1>
    <Search :show-status="true" @search="search" />
    <div v-if="loading" class="text-center">로딩 중...</div>
    <ProblemTable
      v-else
      :problems="problems"
      :show-my-problem="true"
      :show-shared-problem="true"
      :show-problem="true"
      @filter-change="handleFilterChange"
    />
  </section>
</template>
