<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import Logo from "@/assets/images/logo.svg";
import KakaoLogo from "@/assets/images/kakao_logo.svg";
import GoogleLogo from "@/assets/images/google_logo.svg";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  signInWithGoogle,
  signInWithKakao,
  signInWithEmail,
} from "../api/supabase-api/signIn";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const loginError = ref(false);
const router = useRouter();
const auth = useAuthStore();

// 구글 로그인
const handleGoogleLogin = async () => {
  try {
    await auth.loginWithGoogle();
    router.push("/");
  } catch (error) {
    console.error(`구글 로그인 실패:`, error);
  }
};

// 카카오 로그인
const handleKakaoLogin = async () => {
  try {
    await auth.loginWithKakao();
    router.push("/");
  } catch (error) {
    console.error("카카오 로그인 에러:", error);
  }
};

// 일반 로그인
const handleEmailLogin = async () => {
  if (!email.value || !password.value) return;

  try {
    await auth.loginWithEmail(email.value, password.value);
    loginError.value = false;
    router.push("/");
  } catch (error) {
    loginError.value = true;
    console.error("로그인 실패:", error);
  }
};
</script>
<template>
  <header
    className="w-full h-[100px] border-b border-white02  bg-white01 flex items-center justify-center">
    <RouterLink to="/">
      <img :src="Logo" alt="main logo" />
    </RouterLink>
  </header>
  <article
    className="w-full min-h-screen pt-[20px] gap-[57px] flex flex-col items-center justify-center bg-white01 text-black ">
    <section className="w-[494px] h-auto flex flex-col items-center gap-[60px]">
      <h1 className="font-bold text-[32px] text-[#1A1A1A]">로그인</h1>
      <form
        class="w-full max-w-[494px] flex flex-col gap-[30px] bg-white01"
        @submit.prevent="handleEmailLogin">
        <div class="flex-1 relative">
          <Input v-model="email" placeholder="이메일을 입력해주세요" />
        </div>
        <div class="flex-1 relative">
          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력해주세요" />
          <p v-if="loginError" class="text-[#FF3333] text-xs mt-[10px]">
            이메일 또는 비밀번호를 다시 확인해주세요.
            <br />
            등록되지 않은 이메일이거나, 이메일 혹은 비밀번호를 잘못
            입력하셨습니다.
          </p>
        </div>
        <Button text="로그인" type="submit" />
        <RouterLink to="signup">
          <Button text="회원가입" type="button" custom-class="bg-white01" />
        </RouterLink>
      </form>
    </section>
    <section
      className="w-[494px] h-auto flex flex-col items-center gap-[60px] ">
      <h1 className="font-bold text-[32px] text-[#1A1A1A]">간편 로그인</h1>
      <form
        class="w-full max-w-[494px] flex flex-col gap-[30px] mb-[65px] bg-white01">
        <Button
          :logo="KakaoLogo"
          text="카카오 로그인"
          type="submit"
          @click.prevent="handleKakaoLogin"
          custom-class="bg-[#FEE500] text-[#000000]" />
        <Button
          :logo="GoogleLogo"
          text="Google 로그인"
          type="submit"
          @click.prevent="handleGoogleLogin"
          custom-class="bg-[#fff] text-[#1D1C2B]" />
      </form>
    </section>
  </article>
</template>
<style scoped></style>
