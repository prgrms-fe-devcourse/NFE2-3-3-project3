<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import TestProblem from "./components/TestProblem.vue";
import TestSidebar from "./components/TestSidebar.vue";
import { useRoute } from "vue-router";
import { testCenterAPI } from "@/api/testCenter";
import { testResultAPI } from "@/api/testResult";
import { authAPI } from "@/api/auth";
import { useToast } from "primevue";

let intervalId;
const toast = useToast();
const router = useRouter();
const route = useRoute();

const problems = ref([]);
const testCenter = ref();
const elapsedTime = ref(0);
const currentProblemIndex = ref(0);
const userAnswers = ref();

const remainedTime = computed(() => {
  if (!testCenter.value) return { hours: "00", minutes: "00", seconds: "00" };
  const startTime = new Date(testCenter.value.start_date).getTime();
  const endTime = new Date(testCenter.value.end_date).getTime();

  const remainedMilliseconds = endTime - (startTime + elapsedTime.value);
  const remainedSeconds = Math.floor(remainedMilliseconds / 1000);
  const hours = String(Math.floor(remainedSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainedSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(remainedSeconds % 60).padStart(2, "0");
  return { hours, minutes, seconds };
});

const currentProblem = computed(
  () => problems.value[currentProblemIndex.value].problem,
);

const setCurrentProblemIndex = (index) => {
  currentProblemIndex.value = index;
};

const setNextProblemIndex = () => {
  if (currentProblemIndex.value === problems.value.length - 1) return;
  currentProblemIndex.value += 1;
};

const setPrevProblemIndex = () => {
  if (currentProblemIndex.value === 0) return;
  currentProblemIndex.value -= 1;
};

const selectAnswer = (num) => {
  userAnswers.value[currentProblemIndex.value] = num;
};

const submitAnswers = async () => {
  const correctCount = problems.value.reduce((acc, { problem }, index) => {
    return problem.answer === userAnswers.value[index] ? acc + 1 : acc;
  }, 0);

  const testResult = await testResultAPI.add({
    test_center_id: testCenter.value.id,
    correct_count: correctCount,
    total_count: problems.value.length,
    time: elapsedTime.value,
  });
  router.push(`/exam-result/${testResult.id}`);
};

const updateElapsedTime = () => {
  if (!testCenter.value) return;
  if (
    remainedTime.value.hours === "00" &&
    remainedTime.value.minutes === "00" &&
    remainedTime.value.seconds === "00"
  ) {
    submitAnswers();
    return;
  }
  const startDate = new Date(testCenter.value.start_date);
  elapsedTime.value = new Date().getTime() - startDate.getTime();
};

onMounted(() => {
  intervalId = setInterval(updateElapsedTime, 1000); // 1초마다 경과시간 업데이트
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

watch(
  route,
  async () => {
    const testCenterId = route.params.examId;
    const user = await authAPI.getCurrentUser();
    const isSubmitted = await testResultAPI.checkIsSubmitted(
      user.id,
      testCenterId,
    );
    if (isSubmitted) {
      toast.add({
        severity: "error",
        summary: "시험 입장 오류",
        detail: "이미 제출한 시험입니다.",
        life: 3000,
      });
      return router.replace("/exam-room");
    }

    const testCenterData = await testCenterAPI.getAllByTestCenterId(
      testCenterId,
    );
    if (
      new Date(testCenterData.start_date) > new Date() ||
      new Date(testCenterData.end_date) < new Date()
    ) {
      toast.add({
        severity: "error",
        summary: "시험 입장 오류",
        detail: "시험 시간이 아닙니다.",
        life: 3000,
      });
      return router.replace("/exam-room");
    }
    problems.value = testCenterData.problems;
    userAnswers.value = Array(problems.value.length).fill("");
    testCenter.value = testCenterData;
  },
  { immediate: true },
);
</script>
<template>
  <main class="flex h-auto relative">
    <section class="flex flex-col justify-between w-full">
      <div class="flex flex-col">
        <div
          class="flex justify-center items-center w-full h-16 bg-black-6 mb-14"
        >
          <h1 class="font-semibold text-xl">
            {{ testCenter.workbook.title }} 시험장
          </h1>
        </div>
        <TestProblem
          v-if="problems.length"
          :problem="currentProblem"
          :userAnswers="userAnswers"
          :currentProblemIndex="currentProblemIndex"
          @selectAnswer="selectAnswer"
        />
      </div>
      <div class="flex items-center w-full h-16 bg-black-6">
        <div class="flex w-[1000px] mx-auto gap-2">
          <button
            @click="setPrevProblemIndex"
            type="button"
            class="w-20 h-8 bg-navy-3 text-center rounded-l-2xl rounded-r-sm text-white"
          >
            이전
          </button>
          <button
            @click="setNextProblemIndex"
            type="button"
            class="w-20 h-8 bg-navy-3 text-center rounded-r-2xl rounded-l-sm text-white"
          >
            다음
          </button>
        </div>
      </div>
    </section>
    <TestSidebar
      :remainedTime="remainedTime"
      :userAnswers="userAnswers"
      @submitAnswers="submitAnswers"
      @setCurrentProblemIndex="setCurrentProblemIndex"
    />
  </main>
</template>
<style scoped></style>
