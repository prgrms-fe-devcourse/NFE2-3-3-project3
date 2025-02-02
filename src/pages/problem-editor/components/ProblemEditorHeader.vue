<script setup>
import { ref, reactive, watchEffect } from "vue";
import arrowLeftPath from "@/assets/icons/problem-editor/arrow-left.svg";
import folderPath from "@/assets/icons/problem-editor/folder.svg";
import arrowTopPath from "@/assets/icons/problem-editor/arrow-top.svg";
import { Button } from "primevue";
import { workbookAPI } from "@/api/workbook";
import { useAuthStore } from "@/store/authStore";
import ProblemSetPopUp from "@/components/layout/ProblemSetPopUp.vue";
const props = defineProps({
  storedFolder: {
    type: Object,
  },
});
const emits = defineEmits([
  "submitProblems",
  "onGoingBack",
  "setProblemFolder",
]);

const { user } = useAuthStore();

const popup = ref(null);

// 팝업 열림 상태
const isFolderOpen = ref(false);
const isCreateNewFolder = ref(false);
// 선택된 폴더
const selectedFolder = ref("");

// 폴더 토글 버튼 조작
const onClickFolder = () => {
  isFolderOpen.value = !isFolderOpen.value;
  isCreateNewFolder.value = false;
};

// 초기값은 API에서 불러오기
// my problemsets
const problemSets = reactive([]);

//폴더 지정 함수
const setFolder = (folder) => {
  selectedFolder.value = folder.title;
  emits("setProblemFolder", folder);
};

const setFolderFromList = (selectedProblemSet) => {
  if (!selectedProblemSet) {
    setFolder({ id: "", title: "문제집을 선택하세요" });
  } else setFolder(selectedProblemSet);
};

watchEffect(() => {
  // `props.storedFolder`가 존재하는 경우 설정
  const folder = props.storedFolder || { id: "", title: "문제집을 선택하세요" };
  setFolder(folder);
});

const fetchProblemSets = async () => {
  if (!user || !user.id) {
    console.error("사용자 인증에 실패했습니다. 다시 로그인해주세요.");
    return;
  }

  try {
    const userId = user.id;
    const userFolderData = await workbookAPI.getUid(userId);
    problemSets.push(...userFolderData);

    const sharedFolderData = await workbookAPI.getShared(userId);
    problemSets.push(...sharedFolderData);
  } catch (error) {
    console.error("폴더 데이터를 가져오는 중 오류 발생:", error);
  }
};

fetchProblemSets();
</script>
<template>
  <header
    class="top-0 left-0 p-2.5 border-b border-black-5 flex items-center justify-between"
  >
    <Button @click="emits('onGoingBack')" style="padding: 8px 8px">
      <img
        :src="arrowLeftPath"
        alt="뒤로가기"
        class="align-middle items-center"
      />
    </Button>
    <div
      ref="popup"
      class="overlay flex items-center cursor-pointer relative rounded"
      @click="onClickFolder"
    >
      <p class="p-1.5 bg-orange-1 rounded mr-4">
        <img :src="folderPath" alt="폴더" class="align-middle" />
      </p>
      <span
        class="text-xl font-medium mr-4"
        :class="{
          'text-red-1':
            selectedFolder === '문제집을 선택하세요' && !!selectedFolder,
        }"
        >{{ selectedFolder }}</span
      >
      <img
        :src="arrowTopPath"
        :alt="isFolderOpen ? '폴더 토글 닫힘' : '폴더 토글 열림'"
        :class="[
          isFolderOpen ? 'rotate-180' : 'rotate-0',
          'transform transition-transform duration-300',
        ]"
      />
      <!-- 팝업 -->
      <ProblemSetPopUp
        :parent-ref="popup"
        v-model:show-problem-set="isFolderOpen"
        v-model:show-add-popup="isCreateNewFolder"
        @clickProblemSet="setFolderFromList"
        class="w-64 absolute top-full left-1/2 -translate-x-1/2 mt-3 ml-5"
      />
    </div>
    <Button label="저장하기" @click="emits('submitProblems')"></Button>
    <!-- 팝업 -->
  </header>
</template>
<style scoped>
::v-deep(.overlay) {
  z-index: 9999 !important;
}
</style>
