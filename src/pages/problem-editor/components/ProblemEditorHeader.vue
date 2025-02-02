<script setup>
import { ref, reactive, onBeforeMount, watchEffect, onMounted } from "vue";
import arrowLeftPath from "@/assets/icons/problem-editor/arrow-left.svg";
import folderPath from "@/assets/icons/problem-editor/folder.svg";
import arrowTopPath from "@/assets/icons/problem-editor/arrow-top.svg";
import { Listbox, InputText, Textarea, Button, ToggleSwitch } from "primevue";
import { workbookAPI } from "@/api/workbook";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "primevue/usetoast";
import { useCreateProblemStore } from "@/store/createProblemStore";
import { storeToRefs } from "pinia";

const toast = useToast();
const { user } = useAuthStore();
const createProblemStore = useCreateProblemStore();
const { createdProblems } = storeToRefs(createProblemStore);
// 팝업 열림 상태
const isFolderOpen = ref(false);
const isCreateNewFolder = ref(false);

const emits = defineEmits(["submitProblems", "onGoingBack"]);

// 선택된 폴더
const selectedFolder = ref("");
const createdNewFolder = ref({
  title: "",
  description: "",
  shared: false,
});

//폴더 토글 버튼 조작
const onClickFolder = () => {
  isFolderOpen.value = !isFolderOpen.value;
};

const showNewFolderPopup = () => {
  isCreateNewFolder.value = true;
};

//초기값은 API에서 불러오기
//my problemsets
const problemSets = reactive([]);
const selectedProblemSet = reactive({});

const closeAllPopups = () => {
  isCreateNewFolder.value = false;
  isFolderOpen.value = false;
};

// const setFolder = (folder) => {
//   if (!folder || typeof folder !== "object") {
//     console.error("setFolder: 유효하지 않은 folder 값이 전달됨:", folder);
//     folder = { id: "", title: "문제집을 선택하세요" };
//   }

//   createProblemStore.setProblemFolder(folder);
//   // Object.assign(selectedProblemSet, folder);

//   Object.assign(selectedProblemSet.value, folder);
//   selectedFolder.value = folder.title;
//   closeAllPopups();
// };

//폴더 지정 함수
const setFolder = (folder) => {
  selectedFolder.value = folder.title;
  createProblemStore.setProblemFolder(folder);
  closeAllPopups();
};

const onCreateNewFolder = async ({ title, description, shared }) => {
  // 빈문자열
  if (title.trim() === "") {
    toast.add({
      severity: "warn",
      summary: "문제집 생성 불가",
      detail: "문제집 제목을 입력해 주세요",
      life: 3000,
    });
    return;
  }
  // 이미 있는 문제집
  const isThereSet = problemSets.findIndex((problemSet) => {
    return problemSet.title === title.trim();
  });

  if (isThereSet !== -1) {
    setFolder(problemSets[isThereSet]);
    selectedProblemSet.value = problemSets[isThereSet];
    toast.add({
      severity: "info",
      summary: "문제집 생성 불가",
      detail: "이미 있는 문제집 입니다",
      life: 3000,
    });
    return;
  }
  try {
    const data = await workbookAPI.add(
      title.trim(),
      description.trim(),
      shared,
    );
    setFolder(data);
    problemSets.push(data);
    selectedProblemSet.value = data;
  } catch (error) {
    console.error("문제집 생성에 실패했습니다.");
  }
};

const setFolderFromList = (value) => {
  console.log("value", value);
  if (!value) {
    setFolder({ id: "", title: "문제집을 선택하세요" });
  } else {
    setFolder(value);
  }
  isFolderOpen.value = false;
};

watchEffect(() => {
  const folder = createdProblems.value.folder || {
    id: "",
    title: "문제집을 선택하세요",
  };
  setFolder(folder);
  selectedProblemSet.value = folder;
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

onMounted(() => {
  fetchProblemSets();
});
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
      class="overlay flex items-center cursor-pointer relative rounded"
      @click="onClickFolder"
    >
      <p class="p-1.5 bg-orange-1 rounded mr-4">
        <img :src="folderPath" alt="폴더" class="align-middle" />
      </p>
      <span class="text-xl font-medium mr-4">{{
        createdProblems.folder.title
      }}</span>
      <img
        :src="arrowTopPath"
        :alt="isFolderOpen ? '폴더 토글 닫힘' : '폴더 토글 열림'"
        :class="[
          isFolderOpen ? 'rotate-180' : 'rotate-0',
          'transform transition-transform duration-300',
        ]"
      />
      <!-- 팝업 -->
      <div v-if="isFolderOpen" class="absolute top-full mt-3" @click.stop>
        <Listbox
          v-model="selectedProblemSet"
          :options="problemSets"
          filter
          optionLabel="title"
          listStyle="max-height: 14rem"
          @change="(event) => setFolderFromList(event.value)"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <i class="pi pi-folder"></i>
              <div>{{ slotProps.option.title }}</div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-center">
              <Button
                label="새로운 문제집 만들기"
                icon="pi pi-plus"
                @click="showNewFolderPopup"
                class="w-[12rem] mx-1 mb-2"
              />
            </div>
          </template>
        </Listbox>
      </div>

      <div
        v-if="isCreateNewFolder && isFolderOpen"
        class="w-64 absolute top-full mt-3 left-[240px] ml-5"
        @click.stop
      >
        <!-- TODO: 무조건 이름 입력해야 클릭 가능 -->
        <div class="flex flex-col gap-4 px-4 py-2 bg-white border rounded-lg">
          <div class="flex flex-col gap-2">
            <label for="title" class="text-sm">문제집 이름</label>
            <InputText
              id="title"
              v-model="createdNewFolder.title"
              placeholder="문제집 이름을 입력해주세요"
              maxlength="20"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description" class="text-sm">문제집 설명</label>
            <Textarea
              v-model="createdNewFolder.description"
              id="description"
              class="border rounded-md resize-none font-sans px-2 py-1.5"
              rows="5"
              cols="30"
              placeholder="문제집 설명을 입력해주세요"
            />
          </div>
          <div class="flex gap-2 place-items-center">
            <label for="description" class="text-sm">공개 여부</label>
            <ToggleSwitch
              v-model="createdNewFolder.shared"
              name="shared"
              class="align-middle"
            />
          </div>
          <Button
            label="문제집 추가하기"
            icon="pi pi-plus"
            @click="onCreateNewFolder(createdNewFolder)"
          />
        </div>
      </div>
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
