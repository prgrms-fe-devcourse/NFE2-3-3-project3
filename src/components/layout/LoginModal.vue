<script setup>
import { authAPI } from "@/api/auth";

const emit = defineEmits(["login-success", "update:modalValue"]);
const props = defineProps({
  modalValue: {
    type: Boolean,
    required: true,
  },
});

const handleGoogleLogin = async () => {
  await authAPI.logInWithGoogle();
  emit("login-success");
  emit("update:modalValue", false);
};

const handleGithubLogin = async () => {
  await authAPI.logInWithGithub();
  emit("login-success");
  emit("update:modalValue", false);
};

const handleKakaoLogin = async () => {
  await authAPI.logInWithKakao();
  emit("login-success");
  emit("update:modalValue", false);
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="modalValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      @click="$emit('update:modelValue', false)"
    >
      <!-- 모달 배경 -->
      <div
        class="fixed inset-0 transition-opacity bg-black bg-opacity-50"
        @click="$emit('update:modalValue', false)"
      ></div>

      <!-- 모달 -->
      <div class="flex items-center justify-center min-h-full p-4">
        <div
          class="relative w-full max-w-md p-6 text-left transition-all transform bg-white rounded-lg shadow-xl"
        >
          <!-- 모달 header -->
          <div class="mb-5 text-center">
            <h3 class="text-xl font-medium text-gray-900">로그인</h3>
            <p class="mt-2 text-sm text-gray-500">
              간편 로그인으로 3초만에 로그인을 시작해보세요.
            </p>
          </div>

          <!-- 로그인 버튼 -->
          <div class="flex flex-col gap-2 box-border">
            <button
              @click="handleGoogleLogin"
              class="flex items-center justify-center w-full px-4 py-3 space-x-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                class="w-5 h-5"
                alt="Google logo"
              />
              <span>Google로 로그인</span>
            </button>

            <button
              @click="handleGithubLogin"
              class="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white bg-gray-800 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                class="w-5 h-5"
                alt="GitHub logo"
              />
              <span>GitHub로 로그인</span>
            </button>

            <button
              @click="handleKakaoLogin"
              class="flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-black hover:bg-[#FEE500]/90 focus:outline-none focus:ring-[#FEE500]"
            >
              <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                class="w-6 h-6"
                alt="Kakao logo"
              />
              <span>카카오로 로그인</span>
            </button>
          </div>

          <!-- 이용약관 -->
          <p class="mt-4 text-xs text-center text-gray-500">
            로그인 시 이용약관과 개인정보 처리방침에 동의하게 됩니다
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
