<!-- <script setup>
import { Button, useToast } from "primevue";
import { storeToRefs } from "pinia";
import { watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useExamResultStore } from "@/store/ExamResultStore";
import { useAuthStore } from "@/store/authStore";

const route = useRoute();
const toast = useToast();
const examResultStore = useExamResultStore();
const authStore = useAuthStore();

const testResultId = computed(() => route.params.examResultId);
const userId = computed(() => authStore.user?.id);

const {
  fetchProblems,
  toggleAgainViewProblem,
  checkAgainViewStatus,
  fetchMyOption,
} = examResultStore;
const {
  currentProblem,
  isFetchingProblems,
  problems,
  myOption,
  status,
  againViewProblems,
} = storeToRefs(examResultStore);

const selectedMyOption = computed(() => {
  const problem = myOption.value.find(
    (item) => item.problem_id === currentProblem.value?.id,
  );
  return problem ? problem.my_option : "선택하지 않음";
});

const selectedStatus = computed(() => {
  const problem = status.find(
    (item) => item.problem_id === currentProblem.value?.id,
  );
  return problem ? problem.status : "미표기";
});

const fetchData = async (id) => {
  //중복호출되는 부분 발견..
  if (isFetchingProblems.value) {
    isFetchingProblems.value = false;
  }
  try {
    if (!id) {
      console.warn("fetchData: 유효하지 않은 ID");
      return;
    }
    isFetchingProblems.value = true;
    examResultStore.error = null;

    await fetchProblems(id);

    if (problems.value.length > 0 && !currentProblem.value) {
      examResultStore.selectProblem(problems.value[0]);
    }
  } catch (error) {
    console.error("문제 불러오기 실패:", error);
    examResultStore.error = error.message || "문제를 불러오는 데 실패했습니다.";
  } finally {
    isFetchingProblems.value = false;
  }
};

const toggleProblemStatus = async () => {
  console.log("버튼 클릭:", {
    userId: userId.value,
    currentProblemId: currentProblem.value?.id,
    isAgainViewProblem: againViewProblems.value.includes(
      currentProblem.value?.id,
    ),
  });

  if (!currentProblem.value?.id) {
    toast.add({
      severity: "error",
      summary: "오류 발생",
      detail: "현재 문제가 유효하지 않습니다.",
      life: 3000,
    });
    return;
  }

  try {
    await toggleAgainViewProblem(userId.value, currentProblem.value.id, toast);
  } catch (error) {
    console.error("toggleProblemStatus 오류:", error);
  }
};

watch(
  testResultId,
  async (newId) => {
    if (!newId) {
      console.warn("watch: 유효하지 않은 testResultId");
      return;
    }

    try {
      // 데이터를 가져오고 상태 업데이트
      await fetchData(newId);

      // 선택지 데이터 가져오기
      if (userId.value) {
        console.log("fetchMyOption 호출:", userId.value, newId);
        await fetchMyOption(userId.value, newId);
      } else {
        console.warn("유효하지 않은 사용자 ID");
      }

      if (currentProblem.value) {
        await checkAgainViewStatus(userId.value, currentProblem.value.id);
      } else {
        console.warn("현재 문제가 선택되지 않았습니다.");
      }
    } catch (error) {
      console.error("watch(testResultId) 실행 중 오류 발생:", error);
    }
  },
  { immediate: true },
);

watch(
  currentProblem,
  async (newProblem) => {
    if (!newProblem) {
      console.warn("currentProblem이 설정되지 않았습니다.");
      examResultStore.currentProblem = null;
      return;
    }

    try {
      console.log("currentProblem 변경 감지:", newProblem);
      // 문제 선택 및 "다시 볼 문제" 상태 확인
      await checkAgainViewStatus(userId.value, newProblem.id);
    } catch (error) {
      console.error("currentProblem 상태 업데이트 중 오류:", error);
    }
  },
  { immediate: true },
);

watch(
  againViewProblems,
  (newVal) => {
    console.log("againViewProblems 변경 감지:", newVal);
  },
  { deep: true },
);

watch(
  () => examResultStore.myOption,
  (newVal, oldVal) => {
    console.log("myOption 변경 감지");
    console.log("이전 값:", oldVal);
    console.log("새 값:", newVal);
  },
  { deep: true },
);
</script> -->

<script setup>
import { Button, useToast } from "primevue";
import { storeToRefs } from "pinia";
import { watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useExamResultStore } from "@/store/ExamResultStore";
import { useAuthStore } from "@/store/authStore";

const route = useRoute();
const toast = useToast();

// Pinia Store 설정
const examResultStore = useExamResultStore();
const authStore = useAuthStore();
const {
  fetchMyOption,
  fetchProblems,
  toggleAgainViewProblem,
  checkAgainViewStatus,
} = examResultStore;
const {
  currentProblem,
  problems,
  myOption,
  status,
  againViewProblems,
  isFetchingProblems,
} = storeToRefs(examResultStore);

const testResultId = computed(() => route.params.examResultId);
const userId = computed(() => authStore.user?.id);

// 계산된 값
const selectedMyOption = computed(() => {
  const problem = myOption.value.find(
    (item) => item.problem_id === currentProblem.value?.id,
  );
  return problem ? problem.my_option : "선택하지 않음";
});

// const selectedStatus = computed(() => {
//   const problem = status.value.find(
//     (item) => item.problem_id === currentProblem.value?.id,
//   );
//   return problem ? problem.status : "미표기";
// });

const selectedStatus = computed(() => {
  if (!currentProblem.value) return null;
  const statusForCurrentProblem = status.value.find(
    (item) => item.problem_id === currentProblem.value.id,
  );
  console.log("📢 selectedStatus 계산 결과:", statusForCurrentProblem);
  return statusForCurrentProblem || null;
});

// 초기 데이터 로드
const loadInitialData = async () => {
  if (isFetchingProblems) return;
  try {
    if (!userId.value || !testResultId.value) {
      console.warn("유효하지 않은 userId 또는 testResultId");
      return;
    }
    isFetchingProblems = true;
    await fetchProblems(userId, testResultId);
    // 첫 번째 문제를 기본 선택
    if (problems.value.length > 0 && !currentProblem.value) {
      examResultStore.selectProblem(problems.value[0]);
    }
  } catch (error) {
    console.error("초기 데이터 로드 실패:", error);
    toast.add({
      severity: "error",
      summary: "데이터 로드 실패",
      detail: "문제 및 선택 데이터를 불러오는 데 실패했습니다.",
      life: 3000,
    });
  } finally {
    isFetchingProblems = false;
  }
};

// 문제 상태 토글
const toggleProblemStatus = async () => {
  if (!currentProblem.value?.id || !userId.value) {
    toast.add({
      severity: "error",
      summary: "오류 발생",
      detail: "유효하지 않은 문제 또는 사용자 ID입니다.",
      life: 3000,
    });
    return;
  }

  try {
    await toggleAgainViewProblem(userId.value, currentProblem.value.id, toast);
  } catch (error) {
    console.error("문제 상태 토글 실패:", error);
  }
};

// 현재 문제 변경 시 상태 확인
watch(
  currentProblem,
  async (newProblem) => {
    if (!newProblem || !userId.value) {
      console.warn("currentProblem이 없거나 userId가 유효하지 않습니다.");
      return;
    }

    try {
      console.log("currentProblem 변경 감지:", newProblem);
      await checkAgainViewStatus(userId.value, newProblem.id);
    } catch (error) {
      console.error("checkAgainViewStatus 실행 중 오류 발생:", error);
    }
  },
  { immediate: true }, // 즉시 실행
);

watch(
  () => route.params.examResultId,
  (newExamResultId) => {
    console.log("📢 route.params.examResultId 변경 감지:", newExamResultId);
    if (newExamResultId) {
      loadInitialData();
      fetchMyOption(newExamResultId);
    }
  },
  { immediate: true }, // 즉시 실행
);
</script>

<template>
  <div class="bg-white p-6 rounded-lg w-full mx-auto">
    <template v-if="examResultStore.isLoading">
      <div class="text-center py-10 text-gray-500">
        문제를 불러오는 중입니다...
      </div>
    </template>

    <template v-else-if="examResultStore.error">
      <div class="text-red-500 text-center py-10">
        {{ examResultStore.error }}
      </div>
    </template>

    <template v-else>
      <div v-if="examResultStore.currentProblem">
        <!-- 지역 변수 캐싱 -->
        <div v-if="(currentProblem = examResultStore.currentProblem)">
          <div
            class="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-300"
          >
            <h2 class="text-xl font-bold">문제 {{ currentProblem.number }}</h2>
            <Button
              :label="'다시 볼 문제'"
              icon="pi pi-flag"
              size="small"
              severity="secondary"
              :class="{
                'again-view-active': againViewProblems.includes(
                  currentProblem?.id,
                ),
                'again-view-inactive': !againViewProblems.includes(
                  currentProblem?.id,
                ),
              }"
              @click="toggleProblemStatus"
            />
          </div>

          <!-- question -->
          <div class="text-gray-800 mb-6">
            <p class="text-lg mb-4 font-medium">
              {{ currentProblem.question }}
            </p>
          </div>

          <!-- image -->
          <div v-if="currentProblem.image_src" class="flex justify-center mb-6">
            <img
              :src="currentProblem.image_src"
              :alt="`문제 ${currentProblem.number} 이미지`"
              loading="lazy"
              class="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <!-- 객관식 선택지 -->
          <div
            v-if="currentProblem.problem_type === 'multiple_choice'"
            class="mt-4"
          >
            <h3 class="font-bold text-lg mb-2">선택지</h3>
            <ul>
              <li
                v-for="(option, idx) in currentProblem.options"
                :key="'option-' + currentProblem.id + '-' + idx"
                class="text-gray-700 bg-gray-100 p-2 rounded-lg mb-2"
              >
                {{ idx + 1 }}. {{ option }}
              </li>
            </ul>
          </div>

          <!-- 내 선택 -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-2">내 선택</h3>
            <div class="flex items-center gap-4 border-b pb-4">
              <template v-if="currentProblem">
                <div
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-black font-bold"
                >
                  {{ selectedMyOption }}
                </div>

                <span
                  v-if="selectedStatus && selectedStatus.status === 'corrected'"
                  class="text-green-500"
                >
                  정답
                </span>
                <span
                  v-else-if="
                    selectedStatus && selectedStatus.status === 'wrong'
                  "
                  class="text-red-500"
                >
                  오답
                </span>
                <p v-else class="text-gray-800 flex-grow">
                  아직 답안을 선택하지 않았습니다.
                </p>
              </template>
            </div>
          </div>

          <!-- 정답 -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-3">정답</h3>
            <div class="flex items-start gap-3">
              <!-- 정답 번호 표시 -->
              <span
                class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-3 text-red-1 font-bold"
                :class="{
                  'w-10 h-10': currentProblem.answer >= 10,
                  'text-sm': currentProblem.answer >= 10,
                }"
              >
                {{ currentProblem.answer }}
              </span>

              <!-- 선택지 내용 -->
              <div class="flex-1">
                <p class="text-gray-800 font-medium leading-relaxed">
                  {{ currentProblem.options[currentProblem.answer - 1] }}
                </p>
              </div>
            </div>
          </div>

          <!-- 풀이 섹션 -->
          <div
            v-if="currentProblem.explanation"
            class="bg-gray-50 p-4 rounded-lg"
          >
            <h3 class="font-bold text-lg mb-2 text-gray-700">상세 풀이</h3>
            <p class="text-gray-600 leading-relaxed">
              {{ currentProblem.explanation }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        표시할 문제가 없습니다
      </div>
    </template>
  </div>
</template>
<style scoped>
/* 다시 볼 문제 활성 상태 */
.again-view-active {
  background-color: #f1a140 !important;
  color: #ffffff !important;
  border-color: transparent !important;
}

/* 다시 볼 문제 비활성 상태 */
.again-view-inactive {
  background-color: #8992b5 !important;
  color: #ffffff !important;
  border-color: transparent !important;
}
</style>
