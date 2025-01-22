import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";

// 페이지 컴포넌트 가져오기
import MyProblemSets from "@/pages/MyProblemSets.vue";
import MyProblems from "@/pages/my-problems/MyProblems.vue";
import ProblemBoard from "@/pages/problem-board/ProblemBoard.vue";
import ProblemSetBoard from "@/pages/problem-set-board/ProblemSetBoard.vue";
import ExamRoom from "@/pages/exam-room/ExamRoom.vue";
import LandingPage from "@/pages/LandingPage.vue";
import ExamHistory from "@/pages/exam-history/ExamHistory.vue";
import ProblemSetBoardDetail from "@/pages/ProblemSetBoardDetail.vue";
import CreateExamRoom from "@/pages/create-exam-room/CreateExamRoom.vue";
import ProblemBoardDetail from "@/pages/problem-detail/ProblemBoardDetail.vue";
import MyProblemsDetail from "@/pages/MyProblemsDetail.vue";
import ExamMake from "@/pages/ExamMake.vue";
import MyProblemSetsDetail from "@/pages/MyProblemSetsDetail.vue";
import ExamResult from "@/pages/ExamResult.vue";
import MyProblemSetsUpdate from "@/pages/MyProblemSetsUpdate.vue";
import Mypage from "@/pages/Mypage/Mypage.vue";
import ProblemBoardDetailUpdate from "@/pages/ProblemBoardDetailUpdate.vue";
import UserProfile from "@/pages/user-profile/UserProfile.vue";
import Home from "@/pages/Home.vue";

const routes = [
  // 레이아웃이 필요없는 페이지들
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/problem-editor",
    name: "ProblemEditor",
    component: () => import("@/pages/problem-editor/ProblemEditor.vue"),
  },
  {
    path: "/exam",
    name: "ExamEnvironment",
    component: () => import("@/pages/exam-environment/ExamEnvironment.vue"),
  },

  // DefaultLayout을 사용하는 페이지들
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
      },
      {
        path: "mypage",
        name: "mypage",
        component: Mypage,
      },
      {
        path: "my-problems",
        name: "MyProblems",
        component: MyProblems,
      },
      {
        path: "my-problems/:myProblemId",
        name: "MyProblemsDetail",
        component: MyProblemsDetail,
      },
      {
        path: "my-problem-sets",
        name: "MyProblemSets",
        component: MyProblemSets,
      },
      {
        path: "my-problem-sets-update/:problemSetId",
        name: "MyProblemSetsUpdate",
        component: MyProblemSetsUpdate,
      },
      {
        path: "my-problem-sets/:problemSetId",
        name: "MyProblemSetsDetail",
        component: MyProblemSetsDetail,
      },
      {
        path: "problem-board",
        name: "ProblemBoard",
        component: ProblemBoard,
      },
      {
        path: "problem-set-board",
        name: "ProblemSetBoard",
        component: ProblemSetBoard,
      },
      {
        path: "exam-room",
        name: "ExamRoom",
        component: ExamRoom,
      },
      {
        path: "create-exam-room",
        name: "CreateExamRoom",
        component: CreateExamRoom,
      },
      {
        path: "exam-result/:examResultId",
        name: "ExamResult",
        component: ExamResult,
      },
      {
        path: "exam-history",
        name: "ExamHistory",
        component: ExamHistory,
      },
      {
        path: "exam-make/:problemSetId",
        name: "ExamMake",
        component: ExamMake,
      },
      {
        path: "problem-set-board/:problemSetId",
        name: "ProblemSetBoardDetail",
        component: ProblemSetBoardDetail,
      },
      {
        path: "problem-board/:problemId",
        name: "ProblemBoardDetail",
        component: ProblemBoardDetail,
      },
      {
        path: "problem-board-update/:problemId",
        name: "ProblemBoardDetailUpdate",
        component: ProblemBoardDetailUpdate,
      },
      {
        path: "users/:userId",
        name: "UserProfile",
        component: UserProfile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
