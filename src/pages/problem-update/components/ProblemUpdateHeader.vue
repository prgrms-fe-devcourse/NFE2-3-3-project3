<script setup>
import { ref, computed, watchEffect, onBeforeUnmount } from "vue";
import { Avatar } from "primevue";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "primevue/usetoast";
import { pointAPI } from "@/api/point";
import { getCurrentGradeInfo } from "@/utils/getCurrentGradeInfo";
import { problemAPI } from "@/api/problem";
import { problemLikeAPI } from "@/api/problemLike";
import { supabase } from "@/api/index.js";
import { RouterLink } from "vue-router";
import shareIcon from "@/assets/icons/problem-board/fi-rr-share.svg";
import thumbsUpIcon from "@/assets/icons/problem-board/fi-rr-thumbs-up.svg";
import defaultProfileIMG from "@/assets/default-profile-image.svg";

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
const showMenu = ref(false);
const authStore = useAuthStore();

const hasLiked = ref(false);
const likeCount = ref(0);
const isBookmarked = ref(false);

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
      <button class="bg-orange-1 text-white px-4 py-1 rounded-full">삭제</button>
     </nav>
  </div>

  <div class="flex items-center gap-4 mb-10">
    <div class="flex-1">
      <h1 class="text-4xl font-bold mb-4">{{ problem?.title }}</h1>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="bg-gray-100 px-2 py-1 rounded">{{
          problem?.category?.name
        }}</span>
        <div class="flex items-center gap-1">
          <img :src="shareIcon" alt="공유 아이콘" class="w-4 h-4" />
          <span>{{ problem?.shared ? "공개됨" : "미공개" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
