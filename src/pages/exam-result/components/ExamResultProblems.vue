<script setup>
import { Button } from "primevue";
import { storeToRefs } from "pinia";
import { watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useExamResultStore } from "@/store/ExamResultStore";

const route = useRoute();
const examResultStore = useExamResultStore();
const testResultId = computed(() => route.params.examResultId);

const selectedMyOption = computed(() =>
  myOption.value.find((item) => item.problem_id === currentProblem.value?.id),
);
const selectedStatus = computed(() =>
  status.value.find((item) => item.problem_id === currentProblem.value?.id),
);

const { fetchProblems } = examResultStore;
const { currentProblem, isFetchingProblems, problems, myOption, status } =
  storeToRefs(examResultStore);

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

watch(
  testResultId,
  async (newId) => {
    if (!newId) {
      console.warn("watch: 유효하지 않은 testResultId");
      return;
    }
    await fetchData(newId); // 이전 작업 중단 후 새로운 작업 시작
  },
  { immediate: true },
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
              label="다시 볼 문제"
              icon="pi pi-flag"
              size="small"
              severity="secondary"
              class="!bg-navy-4 !text-white"
              aria-label="again-view-problem"
              title="나중에 복습할 문제 표시"
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
                  {{ selectedMyOption.my_option }}
                </div>

                <span
                  v-if="selectedStatus?.status === 'corrected'"
                  class="text-green-500"
                >
                  정답
                </span>
                <span
                  v-else-if="selectedStatus?.status === 'wrong'"
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
