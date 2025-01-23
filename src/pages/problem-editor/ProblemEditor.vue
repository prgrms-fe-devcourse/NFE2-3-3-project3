<script setup>
import ProblemEditorHeader from "./components/ProblemEditorHeader.vue";
import ProblemEditorLists from "./components/ProblemEditorLists.vue";
import ProblemEditorMain from "./components/ProblemEditorMain.vue";
import { reactive, toRaw } from "vue";

const createdProblems = reactive({
  folder: "기본 폴더 id",
  problemLists: [],
});

const targetProblem = reactive({
  idx: -1,
  content: {},
});

const setTargetProblem = (itemIdx) => {
  targetProblem.idx = itemIdx;
  if (itemIdx === -1) {
    targetProblem.content = {};
    return;
  }
  targetProblem.content = createdProblems.problemLists[itemIdx];
  console.log("target", targetProblem);
};

const setProblemFolder = (folderId) => {
  createdProblems.folder = folderId;
};

// 문제 리스트 업데이트 함수
const addProblem = () => {
  const newItem = {
    title: "새로운 문제",
    type: "",
  };
  createdProblems.problemLists.push(newItem);
};

const deleteProblem = () => {
  createdProblems.problemLists.splice(targetProblem.idx, 1);
  setTargetProblem(targetProblem.idx - 1);
};

const updateListItem = (type, updatedContent) => {
  if (type === "TYPE") {
    createdProblems.problemLists[targetProblem.idx].type = updatedContent;
  } else if (type === "TITLE") {
    createdProblems.problemLists[targetProblem.idx].title = updatedContent;
  }
};
//문제 하나 제출
const submitProblem = (idx, content) => {
  console.log("submitProblem called:");
  console.log("Index (idx):", idx); // Index 값 확인
  console.log("Content (content):", content); // Content 값 확인

  if (!content || typeof content !== "object") {
    console.error("Invalid content provided:", content);
    return;
  }

  if (idx >= 0 && idx < createdProblems.problemLists.length) {
    const updatedProblem = {
      ...createdProblems.problemLists[idx], // 기존 데이터
      ...content, // 업데이트된 데이터
    };

    console.log("Updated Problem Data:", updatedProblem);
    createdProblems.problemLists.splice(idx, 1, updatedProblem); // 배열 교체
    console.log("Updated Problem List:", createdProblems.problemLists);
  }
};

const submitProblems = () => {};

const onGoingBack = () => {
  //세션 스토리지에 저장
};
</script>
<template>
  <div class="flex flex-col h-screen w-screen">
    <ProblemEditorHeader
      @submit-problems="submitProblems"
      @on-going-back="onGoingBack"
      @set-problem-folder="setProblemFolder"
    />
    <div class="flex flex-row h-min-screen w-min-full flex-grow">
      <ProblemEditorLists
        :problem-list="createdProblems.problemLists"
        @add-problem="addProblem"
        @on-click-problem-list="setTargetProblem"
      />
      <ProblemEditorMain
        v-if="targetProblem.idx !== -1"
        :key="targetProblem.idx"
        :problem-idx="targetProblem.idx"
        :problem-content="targetProblem.content"
        @update-list-Item="updateListItem"
        @delete-problem="deleteProblem"
        @submit-problem="submitProblem"
      />
    </div>
  </div>
</template>
<style></style>
