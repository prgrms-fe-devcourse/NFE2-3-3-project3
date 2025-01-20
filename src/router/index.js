import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 가져오기
import MyProblemSets from "@/pages/MyProblemSets.vue";
import MyProblems from "@/pages/MyProblems.vue";
import MyCustomProblems from "@/pages/MyCustomProblems.vue";
import ProblemBoard from "@/pages/ProblemBoard.vue";
import ProblemSetBoard from "@/pages/ProblemSetBoard.vue";
import ReviewBoard from "@/pages/ReviewBoard.vue";
import ExamRoom from "@/pages/exam-room/ExamRoom.vue";
import RootPage from "@/pages/RootPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: RootPage,
  },
  {
    path: "/my-problems",
    name: "MyProblems",
    component: MyProblems,
  },
  {
    path: "/my-problem-sets",
    name: "MyProblemSets",
    component: MyProblemSets,
  },
  {
    path: "/my-custom-problems",
    name: "MyCustomProblems",
    component: MyCustomProblems,
  },
  {
    path: "/problem-board",
    name: "ProblemBoard",
    component: ProblemBoard,
  },
  {
    path: "/problem-set-board",
    name: "ProblemSetBoard",
    component: ProblemSetBoard,
  },
  {
    path: "/review-board",
    name: "ReviewBoard",
    component: ReviewBoard,
  },
  {
    path: "/exam-room",
    name: "ExamRoom",
    component: ExamRoom,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
