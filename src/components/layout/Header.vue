<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore";
import LoginModal from "./LoginModal.vue";

const authStore = useAuthStore();
const showLoginModal = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const handleLoginSuccess = () => {
  showLoginModal.value = false;
};

onMounted(async () => {
  await authStore.initializeAuth();
});
</script>

<template>
  <header class="bg-gray-100 shadow-md w-full fixed top-0 left-1">
    <div class="container mx-auto flex items-center pr-6 flex-wrap">
      <nav
        class="flex items-center space-x-3 text-gray-600 mt-2 lg:mt-0 lg:ml-auto p-4"
      >
        <a href="#" class="hover:text-gray-800 no-underline">다크 모드</a>
        <a href="#" class="hover:text-gray-800 no-underline">알림</a>
        <a href="#" class="hover:text-gray-800 no-underline">포인트</a>

        <!-- 로그인 상태에 따른 버튼 표시 -->
        <template v-if="authStore.isAuthenticated">
          <span class="text-sm text-gray-700">{{ authStore.user?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </template>
        <template v-else>
          <button
            @click="showLoginModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            로그인
          </button>
        </template>
      </nav>
    </div>

    <!-- 로그인 모달 -->
    <LoginModal v-model="showLoginModal" @login-success="handleLoginSuccess" />
  </header>
</template>
