<script setup>
import { ref, reactive, computed, onMounted, watchEffect } from "vue";
import { Avatar, ToggleSwitch, MultiSelect, Button } from "primevue";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "primevue/usetoast";
import { pointAPI } from "@/api/point";
import { getCurrentGradeInfo } from "@/utils/getCurrentGradeInfo";
import { supabase } from "@/api/index.js";
import { RouterLink } from "vue-router";
import defaultProfileIMG from "@/assets/default-profile-image.svg";
import { categoryAPI } from "@/api/category";

const props = defineProps({
  problem: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  author: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  hasLiked: {
    type: Boolean,
    required: true,
    default: false,
  },
  likeCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["toggle-like", "menu-action"]);
const toast = useToast();
const userGrade = ref(null);
const authStore = useAuthStore();

const category = reactive([]);
const filteredCategory = ref("");
const doesCategoryExist = computed(() => {
  return JSON.stringify(category).indexOf(`${filteredCategory.value}`) === -1
    ? false
    : true;
});

const onFilterCategory = (event) => {
  filteredCategory.value = event.value;
};

const createCategory = async () => {
  if (!filteredCategory.value.trim()) {
    console.error("카테고리 이름은 비워둘 수 없습니다.");
    return;
  }

  const newCategoryData = await categoryAPI.createCategory({
    name: filteredCategory.value.trim(),
  });

  category.push(...newCategoryData);
  props.problem.category = [...newCategoryData];

  filteredCategory.value = "";
};

const getCurrentUserId = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user?.id;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
};

const isAuthor = computed(() => {
  return props.author?.id === authStore.user?.id;
});

const handleAvatarError = (e) => {
  e.target.src = defaultProfileIMG;
};

const fetchUserGrade = async () => {
  try {
    if (props.author?.id) {
      const pointData = await pointAPI.getAll(props.author.id);
      if (pointData && pointData.length > 0) {
        const totalPoints = pointData.reduce(
          (sum, point) => sum + point.point,
          0,
        );
        const gradeInfo = getCurrentGradeInfo(totalPoints);
        userGrade.value = gradeInfo.current;
      }
    }
  } catch (error) {
    console.error("등급 정보 조회 실패:", error);
  }
};

watchEffect(() => {
  fetchUserGrade();
});

const routeConfig = computed(() => {
  if (!props.author?.id) return null;
  return {
    name: "UserProfile",
    params: { userId: props.author.id },
  };
});

onMounted(async () => {
  const categoryData = await categoryAPI.getAll();
  category.push(...categoryData);
  if (categoryData.length > 0) {
    props.problem.category = categoryData[0].name; // 기본 카테고리 이름 설정
  }
});
</script>

<template>
  <div class="w-full item-between mb-8">
    <!-- 프로필 정보 + 최종 수정일 + 라우터 링크 -->
    <RouterLink
      v-if="routeConfig"
      :to="routeConfig"
      class="flex gap-2 items-center"
    >
      <Avatar
        :image="author?.avatar_url"
        @error="handleAvatarError"
        shape="circle"
        size="large"
      />
      <div>
        <p>
          <strong aria-label="닉네임">{{ author?.name || "닉네임" }}</strong>
          <span class="ml-2 text-black-3">
            {{ userGrade?.name || "등급 없음" }}
          </span>
        </p>
        <span class="text-black-3 text-sm" aria-label="최종 수정일">
          {{ new Date(problem?.updated_at).toLocaleString() }}
        </span>
      </div>
    </RouterLink>

    <!-- 수정 완료, 취소 버튼 -->
    <nav class="item-middle gap-2">
      <button class="bg-black-5 px-4 py-1 rounded-full">수정</button>
      <button class="bg-orange-1 text-white px-4 py-1 rounded-full">
        삭제
      </button>
    </nav>
  </div>

  <div class="flex items-center gap-4 mb-10">
    <div class="flex-1">
      <input
        type="text"
        class="text-4xl font-bold mb-4 border border-gray-300 rounded p-2 w-full"
        v-model="problem.title"
      />
      <div class="flex items-center gap-2 text-sm">
        <fieldset class="flex items-center gap-2 w-full mb-4">
          <label for="category" class="mr-1">카테고리</label>
          <MultiSelect
            v-model="problem.category"
            display="chip"
            :options="category"
            optionLabel="name"
            filter
            :selection-limit="1"
            class="md:h-9 items-center md:w-60 font-regular text-sm py-2 mr-2"
            @filter="onFilterCategory"
          >
            <template #footer>
              <div class="p-3 flex justify-between">
                <Button
                  label="카테고리 추가"
                  severity="secondary"
                  text
                  size="small"
                  icon="pi pi-plus"
                  :disabled="doesCategoryExist"
                  @click="createCategory"
                />
              </div>
            </template>
          </MultiSelect>

          <label for="shared"> 공개 여부 </label>
          <ToggleSwitch v-model="problem.shared" name="shared" />
        </fieldset>
      </div>
    </div>
  </div>
</template>

<style scoped>
.addDivider::after {
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  margin-top: 12px;
  content: "";
  display: block;
}
</style>