<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore";
import LoginModal from "./LoginModal.vue";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";

const router = useRouter();

const alertPath = new URL("@/assets/icons/alert.svg", import.meta.url).href;
const pointPath = new URL("@/assets/icons/point.svg", import.meta.url).href;



// Menu 참조
const menu = ref(null);

// Menu 열기 함수
const openMenu = (event) => {
  menu.value.toggle(event); // 클릭 위치에서 메뉴 표시
};
//포인트 추적
const points = ref(40);

const authStore = useAuthStore();
const showLoginModal = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// 메뉴 항목 정의
const menuItems = [
  {
    label: "프로필",
    icon: "pi pi-user",
    command: () => {
      router.push("/mypage");
    },
  },
  {
    label: "로그아웃",
    icon: "pi pi-sign-out",
    command: handleLogout
  },
];

const handleLoginSuccess = () => {
  showLoginModal.value = false;
};

onMounted(async () => {
  await authStore.initializeAuth();
});
</script>

<template>
  <header class="w-full">
    <nav
      class="flex items-center space-x-3 text-gray-600 justify-end py-6 px-16"
    >
      <a href="#" class="hover:text-gray-800 no-underline">다크 모드</a>
      <!-- 알림 및 포인트 -->
      <img :src="alertPath" alt="alert" />

      <div
        class="flex items-center px-2 py-1 h-[24px] bg-black-5 rounded-full font-pretend"
      >
        <!-- 별 아이콘 -->
        <img :src="pointPath" alt="point" class="mr-1" />
        <!-- 포인트 숫자 -->
        <span class="text-sm font-bold text-gray-800">{{ points }}</span>
      </div>
      <!-- 메뉴 트리거 -->
      <div
        @click="openMenu"
        class="flex items-center gap-2 cursor-pointer font-pretend"
      >
        <span class="font-medium">안효태님</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <!-- Menu -->
      <Menu
        :model="menuItems"
        ref="menu"
        popup
        appendTo="body"
        class="p-menu w-[200px]"
      />
    </nav>

    <!-- 로그인 모달 -->
    <LoginModal v-model="showLoginModal" @login-success="handleLoginSuccess" />
  </header>
</template>
