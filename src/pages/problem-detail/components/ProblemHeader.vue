<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Avatar } from "primevue";
import { pointAPI } from "@/api/point";
import { getCurrentGradeInfo } from "@/utils/getCurrentGradeInfo";
import shareIcon from "@/assets/icons/problem-board/fi-rr-share.svg";
import thumbsUpIcon from "@/assets/icons/problem-board/fi-rr-thumbs-up.svg";
import defaultProfileIMG from "@/assets/default-profile-image.svg";

const props = defineProps({
  problem: {
    type: Object,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  hasLiked: {
    type: Boolean,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["toggle-like", "menu-action"]);
const userGrade = ref(null);
const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 메뉴 외부 클릭시 닫기
const closeMenu = (event) => {
  const menu = document.querySelector('.menu-container');
  const button = document.querySelector('.menu-trigger');
  if (!menu?.contains(event.target) && !button?.contains(event.target)) {
    showMenu.value = false;
  }
};

// 프로필 이미지 없을 때 기본 이미지 불러오기
const handleAvatarError = (e) => {
  e.target.src = defaultProfileIMG;
};

// 사용자 등급 정보 가져오기
const fetchUserGrade = async () => {
  try {
    if (props.author?.id) {
      const pointData = await pointAPI.getAll(props.author.id);
      if (pointData && pointData.length > 0) {
        // 전체 포인트 합계 계산
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

onMounted(() => {
  fetchUserGrade();
  document.addEventListener('click', closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div class="flex justify-between flex-col gap-10">
    <div class="flex gap-2 items-center">
      <Avatar
        :image="author?.avatar_url"
        @error="handleAvatarError"
        shape="circle"
        size="large"
      />
      <div>
        <!-- 닉네임, 등급 -->
        <p>
          <strong aria-label="닉네임">{{ author?.name || "닉네임" }}</strong>
          <span class="ml-2 text-black-3">
            {{ userGrade?.name || "등급 없음" }}
          </span>
        </p>
        <!-- 최종 수정일 -->
        <span class="text-black-3 text-sm" aria-label="최종 수정일">
          {{ new Date(problem?.updated_at).toLocaleDateString() }}
        </span>
      </div>
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
          <button
            @click="$emit('toggle-like')"
            class="flex items-center gap-1 px-2 py-1 rounded-full transition"
            :class="hasLiked ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'"
          >
            <img
              :src="thumbsUpIcon"
              alt="좋아요 아이콘"
              class="w-4 h-4"
              :class="{ 'opacity-50': !hasLiked }"
            />
            <span>{{ likeCount }}</span>
          </button>
        </div>
      </div>

      <div class="relative flex items-center justify-center">
        <button
          class="menu-trigger w-12 h-12 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          @click="toggleMenu"
          aria-label="더보기"
        >
          <i class="pi pi-ellipsis-h"></i>
        </button>
        
        <!-- 커스텀 메뉴 -->
        <div
          v-if="showMenu"
          class="menu-container absolute right-0 top-12 mt-2 flex bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex-col"
          style="z-index: 1000;"
        >
          <button
            @click="emit('menu-action', 'edit')"
            class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <i class="pi pi-pencil"></i>
            <span>수정하기</span>
          </button>
          <div class="border-b border-gray-200"></div>
          <button
            @click="emit('menu-action', 'delete')"
            class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-red-600"
          >
            <i class="pi pi-trash"></i>
            <span>삭제하기</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  min-width: 220px;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.pi) {
  font-size: 1rem;
}
</style>