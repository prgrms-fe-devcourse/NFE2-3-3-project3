<script setup>
import { onBeforeRouteLeave, useRouter } from "vue-router";
import ProblemEditorHeader from "./components/ProblemEditorHeader.vue";
import ProblemEditorLists from "./components/ProblemEditorLists.vue";
import ProblemEditorMain from "./components/ProblemEditorMain.vue";
import ProblemEditorGuide from "./components/ProblemEditorGuide.vue";
import { reactive, onBeforeMount, ref, toRaw } from "vue";
import { problemAPI } from "@/api/problem";

const router = useRouter();

const problemEditorMain = ref(null);
const isSubmitClicked = ref(false);
const createdProblems = reactive({
  folder: { id: "", title: "" },
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
const setProblemFolder = (folderObject) => {
  createdProblems.folder = folderObject;
};

// 문제 리스트 업데이트 함수
const addProblem = () => {
  const newItem = {
    title: "",
    type: "4지선다",
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

const submitProblems = async () => {
  // 문제 업로드
  isSubmitClicked.value = true;

  if (problemEditorMain.value) {
    problemEditorMain.value.submitProblem();
  }

  const workbookId = createdProblems.folder.id;

  const uploadPromises = createdProblems.problemLists.map(async (problem) => {
    try {
      const categoryRaw = toRaw(problem.category);
      console.log(categoryRaw);
      // time
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const koreaTimeDiff = 9 * 60 * 60 * 1000;
      const korNow = new Date(utc + koreaTimeDiff);

      const problemForSubmission = {
        title: problem?.title || "", // 제목
        question: problem?.question || "", // 질문
        answer: problem?.answer || "", // 정답
        explanation: problem?.explanation || "", // 풀이
        origin_source: problem?.origin_source || "", // 출처
        problem_type: problem?.type === "4지선다" ? "multiple_choice" : "ox", // 문제 유형 변환
        category_id: categoryRaw[0]?.id || 0, // 카테고리 ID 추출
        option_one: problem?.option_one || null, // 보기 1
        option_two: problem?.option_two || null, // 보기 2
        option_three: problem?.option_three || null, // 보기 3
        option_four: problem?.option_four || null, // 보기 4
        shared: problem?.shared || false, // 공개 여부
        created_at: korNow,
        updated_at: korNow,
      };
      console.log("problemForSubmission:", problemForSubmission);
      const data = await problemAPI.add(workbookId, problemForSubmission);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });

  try {
    // 모든 문제 업로드가 완료될 때까지 기다림
    await Promise.all(uploadPromises);

    // 업로드 완료 후 홈으로 리다이렉트
    router.push("/");
  } catch (error) {
    console.error("문제 업로드 중 오류 발생:", error);
  }
};

const onGoingBack = () => {
  window.history.length > 2 ? router.go(-1) : router.push("/");
};

onBeforeRouteLeave((to, from) => {
  // 제출 클릭한 경우 건너뛰기
  if (isSubmitClicked.value) return true;
  else {
    if (problemEditorMain.value) {
      problemEditorMain.value.submitProblem();
    }
    const answer = window.confirm(
      "아직 제출되지 않은 문제들이 있습니다. 만들어진 문제는 저장되지 않습니다.",
    );
    if (answer) {
      sessionStorage.setItem(
        "createdProblems",
        JSON.stringify(createdProblems),
      );
      return true;
    }
    return false;
  }
});

onBeforeMount(() => {
  const storedData = sessionStorage.getItem("createdProblems"); // 변수명 변경

  if (createdProblems && storedData) {
    try {
      const parsedData = JSON.parse(storedData); // JSON 데이터를 객체로 변환
      if (typeof parsedData === "object" && parsedData !== null) {
        Object.assign(createdProblems, parsedData); // createdProblems에 병합
      } else {
        console.warn("Parsed data is not a valid object:", parsedData);
      }
    } catch (error) {
      console.error("Failed to parse sessionStorage data:", error);
    }
  }
});
</script>
<template>
  <div class="flex flex-col h-screen w-full">
    <ProblemEditorHeader
      :stored-Folder="createdProblems.folder"
      @submit-problems="submitProblems"
      @on-going-back="onGoingBack"
      @set-problem-folder="setProblemFolder"
    />
    <div class="flex flex-row h-min-screen w-screen flex-grow">
      <ProblemEditorLists
        :problem-list="createdProblems.problemLists"
        @add-problem="addProblem"
        @on-click-problem-list="setTargetProblem"
        class="w-2/12"
      />
      <ProblemEditorMain
        v-if="
          targetProblem.idx !== -1 && createdProblems.problemLists.length > 0
        "
        ref="problemEditorMain"
        :key="targetProblem.idx"
        :problem-idx="targetProblem.idx"
        :problem-content="targetProblem.content"
        @update-list-Item="updateListItem"
        @delete-problem="deleteProblem"
        @submit-problem="submitProblem"
      />
      <ProblemEditorGuide v-else />
    </div>
  </div>
</template>
<style></style>
