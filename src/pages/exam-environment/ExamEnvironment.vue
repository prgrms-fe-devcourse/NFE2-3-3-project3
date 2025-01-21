<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import TestProblem from "./components/TestProblem.vue";
import TestSidebar from "./components/TestSidebar.vue";

const router = useRouter();
const problems = ref([
  {
    id: 1,
    status: "corrected",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
  {
    id: 2,
    status: "",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
  {
    id: 3,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
  {
    id: 4,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
  {
    id: 5,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
  {
    id: 6,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    option1: "보기 1",
    option2: "보기 2",
    option3: "보기 3",
    option4: "보기 4",
  },
]);

const currentProblem = computed(
  () => problems.value[currentProblemIndex.value],
);

const currentProblemIndex = ref(0);
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

const userAnswers = ref(Array(problems.value.length).fill(""));
const selectAnswer = (num) => {
  if (showWarning.value) {
    showWarning.value = false;
  }
  userAnswers.value[currentProblemIndex.value] = num;
};

const showWarning = ref(false);
const submitAnswers = () => {
  router.push(`/exam-result/${1}`); // 시험결과 id
};
const submitAnswersSafely = () => {
  if (userAnswers.value.some((answer) => !answer)) {
    showWarning.value = true;
    return;
  }
  submitAnswers();
};
</script>
<template>
  <main class="flex h-screen">
    <section class="flex flex-col justify-between w-full">
      <div class="flex flex-col">
        <div
          class="flex justify-center items-center w-full h-16 bg-black-6 mb-14"
        >
          <h1 class="font-semibold text-xl">소방공무원 제 2차 시험장</h1>
        </div>
        <TestProblem
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
      :userAnswers="userAnswers"
      :showWarning="showWarning"
      @submitAnswers="submitAnswers"
      @submitAnswersSafely="submitAnswersSafely"
      @setCurrentProblemIndex="setCurrentProblemIndex"
    />
  </main>
</template>
<style scoped></style>
