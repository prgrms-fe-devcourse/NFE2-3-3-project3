<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu } from "primevue";

import CommentList from "@/pages/problem-set-detail/components/CommentList.vue";
import addOption from "@/assets/icons/problem-set-board-detail/add-option.svg";
import thumbsUp from "@/assets/icons/problem-set-board-detail/thumbs-up.svg";
import testCenterEnter from "@/assets/icons/problem-set-board-detail/test-center-enter.svg";
import like from "@/assets/icons/problem-set-board-detail/like.svg";
import ProblemTable from "@/components/layout/ProblemTable.vue";
import { workbookAPI } from "@/api/workbook";
import { userAPI } from "@/api/user";
import { workbookLikeAPI } from "@/api/workbookLike";
import { authAPI } from "@/api/auth";

const route = useRoute();
const router = useRouter();

const uid = ref(null);
const love = ref(null);
const name = ref(null);
const title = ref(null);
const comments = ref([]);
const problems = ref([]);
const created_at = ref(null);
const updated_at = ref(null);
const description = ref(null);
const workbookUserId = ref(null);

const goToEditPage = () => {
  router.push(`/my-problem-sets-update/${route.params.problemSetId}`);
};
//메뉴 항목 정의
const myMenuItems = [
  {
    label: "PDF로 변환하기",
    icon: "pi pi-download",
  },
  {
    label: "수정하기",
    icon: "pi pi-pencil",
    command: goToEditPage,
  },
  {
    label: "삭제하기",
    icon: "pi pi-trash",
  },
];
const otherMenuItems = [
  {
    label: "PDF로 변환하기",
    icon: "pi pi-download",
  },
  {
    label: "공유받기",
    icon: "pi pi-bookmark",
  },
];

// Menu 참조
const myMenu = ref(null);
const otherMenu = ref(null);
// Menu 열기 함수
const openMenu = (event) => {
  if (uid.value === workbookUserId.value) myMenu.value.toggle(event);
  else otherMenu.value.toggle(event);
};

const currentPage = ref(1);
const totalPages = ref(0);
// 페이지 변경 핸들러
const handlePageChange = (page) => {
  loadComments(page + 1); // PrimeVue의 Paginator는 0-based index 사용
};

// 댓글 불러오기
const loadComments = async (page = 1) => {};

onMounted(async () => {
  const workbookData = await workbookAPI.getOne(route.params.problemSetId);
  title.value = workbookData["title"];
  description.value = workbookData["description"];
  created_at.value = workbookData["created_at"].split("T")[0];
  updated_at.value = workbookData["updated_at"].split("T")[0];

  const workbookProblemData = await workbookAPI.getWorkbookProblems(
    workbookData["id"],
  );
  problems.value = workbookProblemData;
  const workbookDataUid = workbookData["uid"];
  const userInfo = await userAPI.getOne(workbookDataUid);
  name.value = userInfo["name"];
  workbookUserId.value = workbookDataUid;

  love.value = await workbookLikeAPI.getWorkbookLikeCount(workbookData["id"]);

  const comment = await workbookAPI.workbookCommentInfo(workbookData["id"]);
  comments.value = comment;

  const userId = await authAPI.getCurrentUser();
  uid.value = userId["id"];
});
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <div class="h-[124px] flex items-center mb-[63px]">
      <div class="w-[124px] h-[124px] mr-[21px]">
        <RouterLink :to="`/exam-make/${route.params.problemSetId}`">
          <img :src="testCenterEnter" alt="시험장 입실"
        /></RouterLink>
      </div>
      <div class="h-[124px] mr-[196px] flex flex-col justify-between">
        <div class="flex flex-col justify-between h-[77px]">
          <div class="font-laundry text-[36px] -tracking[1.1%]">
            {{ title }}
          </div>
          <div class="h-[23px]">{{ description }}</div>
        </div>
        <div class="flex w-[473px] h-[23px] ml-[7px] justify-between">
          <div>작성자 | {{ name }}</div>
          <div>생성일 | {{ created_at }}</div>
          <div>수정일 | {{ updated_at }}</div>
          <div class="flex justify-between w-8">
            <div>
              <img :src="thumbsUp" alt="좋아요" />
            </div>
            <div>{{ love }}</div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-8 h-8">
          <img :src="like" alt="좋아요" />
        </div>
        <div class="w-10 h-10 ml-[26px]">
          <button @click="openMenu">
            <img :src="addOption" alt="문제집 추가 설정" />
          </button>
        </div>
      </div>
    </div>
    <ProblemTable
      :problems="problems"
      :showCheckbox="false"
      :show-problem="false"
    />
    <hr class="w-[870px] mb-10 border border-[#d4d4d4]" />
    <CommentList
      :comments="comments"
      :workbookId="route.params.problemSetId"
      :totalPages="totalPages"
      :currentPage="currentPage"
      @page-change="handlePageChange"
    />
  </div>
  <Menu
    :model="myMenuItems"
    ref="myMenu"
    popup
    appendTo="body"
    class="p-menu w-[200px] font-pretend"
  />
  <Menu
    :model="otherMenuItems"
    ref="otherMenu"
    popup
    appendTo="body"
    class="p-menu w-[200px] font-pretend"
  />
</template>
<style scoped></style>
