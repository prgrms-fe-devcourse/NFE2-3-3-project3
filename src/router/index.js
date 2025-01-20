import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 가져오기
import MyProblemSets from "@/pages/MyProblemSets.vue";
import MyProblems from "@/pages/MyProblems.vue";
import MyCustomProblems from "@/pages/MyCustomProblems.vue";
import ProblemBoard from "@/pages/ProblemBoard.vue";
import ProblemSetBoard from "@/pages/problem-set-board/ProblemSetBoard.vue";
import ReviewBoard from "@/pages/ReviewBoard.vue";
import ExamRoom from "@/pages/exam-room/ExamRoom.vue";
import MainContent from "@/components/layout/MainContent.vue";
import LandingPage from "@/pages/LandingPage.vue";
import ExamHistory from "@/pages/ExamHistory.vue";
import ProblemSetBoardDetail from "@/pages/ProblemSetBoardDetail.vue";

const routes = [
  {
    path: "/", // 랜딩 페이지
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/home", // 기존 홈 페이지
    name: "Home",
    component: MainContent,
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
  {
    path: "/exam-history",
    name: ExamHistory,
    component: ExamHistory,
  },
  {
    path: "/problem-set-board/:problemSetId",
    name: "ProblemSetBoardDetail",
    component: ProblemSetBoardDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
