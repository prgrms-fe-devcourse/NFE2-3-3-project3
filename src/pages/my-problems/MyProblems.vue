<script setup>
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref, watch } from "vue";
import { SORT } from "@/const/sorts";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { againViewProblemAPI } from "@/api/againViewProblem";
import { problemAPI } from "@/api/problem";
import { categoryAPI } from "@/api/category";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const problems = ref([]);
const initialProblems = ref([]);
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const filterType = ref("all"); // 'all', 'againView', 'myProblems'

const handleFilterChange = (type) => {
  filterType.value = type;
};

const filterProblems = () => {
  if (filterType.value === "all") {
    problems.value = initialProblems.value;
  } else if (filterType.value === "againView") {
    problems.value = initialProblems.value.filter(
      (problem) => problem.againView,
    );
  } else if (filterType.value === "myProblems") {
    problems.value = initialProblems.value.filter((problem) => problem.isOwner);
  }
};

const loadProblems = async (userId) => {
  if (!userId) return;

  loading.value = true;
  error.value = null;

  try {
    const [againViewProblems, userProblems, categories] = await Promise.all([
      againViewProblemAPI.getAllByUserId(userId),
      problemAPI.getAllByUserId(userId),
      categoryAPI.getAll(),
    ]);

    // againViewProblems의 problem_id 집합 생성
    const againViewProblemIds = new Set(againViewProblems.map((p) => p.id));

    // userProblems를 기준으로 병합
    const mergedProblems = userProblems.map((problem) => ({
      ...problem,
      isOwner: true,
      againView: againViewProblemIds.has(problem.id),
      latest_status: problem.latest_status,
      category_name: categories.find((c) => c.id === problem.category_id)?.name,
    }));

    problems.value = mergedProblems;
    initialProblems.value = mergedProblems;
  } catch (err) {
    error.value = err;
    console.error("문제 로드 실패:", err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "문제를 불러오는데 실패했습니다.",
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
    let filteredProblems = [...initialProblems.value];

    if (status) {
      filteredProblems = filteredProblems.filter((problem) => {
        switch (status) {
          case "푼 문제":
            return ["wrong", "corrected"].includes(problem.latest_status);
          case "틀린 문제":
            return problem.latest_status === "wrong";
          case "안 푼 문제":
            return problem.latest_status === "none" || !problem.latest_status;
          default:
            return true;
        }
      });
    }

    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.title?.toLowerCase().includes(searchTerm) ||
          problem.question?.toLowerCase().includes(searchTerm),
      );
    }

    if (startDate || endDate) {
      filteredProblems = filteredProblems.filter((problem) => {
        const problemDate = new Date(problem.created_at);
        const start = startDate ? new Date(startDate) : null;
        let end = endDate ? new Date(endDate) : null;

        if (end) {
          end.setDate(end.getDate() + 1);
        }

        return (!start || problemDate >= start) && (!end || problemDate <= end);
      });
    }

    problems.value = filteredProblems;

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
  <section class="flex flex-col w-[1000px] mx-auto relative">
    <Toast />
    <h1 class="text-[42px] font-laundry mb-16">보관한 문제</h1>
    <div class="flex flex-col gap-16">
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
    </div>
  </section>
</template>
