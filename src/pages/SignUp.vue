<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import Logo from "@/assets/images/logo.svg";
import { ref, watch } from "vue";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");
const duplicateEmailError = ref("");

const errors = ref({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // 최소 8자, 대문자 1개 이상, 소문자 1개 이상
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

// 비밀번호 유효성 검사 함수
const validatePassword = (value) => {
  if (!value) {
    return "비밀번호를 입력해주세요.";
  } else if (value.length < 8) {
    return "비밀번호는 8글자 이상이어야 합니다.";
  } else if (!isValidPassword(value)) {
    // isValidPassword 함수 사용
    return "비밀번호는 대문자와 소문자를 모두 포함해야 합니다.";
  }
  return "";
};

// 비밀번호 일치 여부 검사 함수
const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "비밀번호 확인을 입력해주세요.";
  } else if (password !== confirmPassword) {
    return "비밀번호가 일치하지 않습니다.";
  }
  return "";
};

// 실시간 유효성 검사
watch(email, (newValue) => {
  if (!newValue) {
    errors.value.email = "이메일을 입력해주세요.";
  } else if (!isValidEmail(newValue)) {
    errors.value.email = "올바른 이메일 형식이 아닙니다.";
  } else {
    errors.value.email = "";
  }
});

watch(name, (newValue) => {
  if (!newValue) {
    errors.value.name = "이름을 입력해주세요.";
  } else {
    errors.value.name = "";
  }
});

watch(password, (newValue) => {
  errors.value.password = validatePassword(newValue);

  if (confirmPassword.value) {
    errors.value.confirmPassword = validatePasswordMatch(
      newValue,
      confirmPassword.value
    );
  }
});

watch(confirmPassword, (newValue) => {
  errors.value.confirmPassword = validatePasswordMatch(
    password.value,
    newValue
  );
});

const signUp = async () => {
  // 모든 필드 확인
  if (
    !email.value ||
    !name.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    if (!email.value) errors.value.email = "이메일을 입력해주세요.";
    if (!name.value) errors.value.name = "이름을 입력해주세요.";
    if (!password.value) errors.value.password = "비밀번호를 입력해주세요.";
    if (!confirmPassword.value)
      errors.value.confirmPassword = "비밀번호 확인을 입력해주세요.";
    return;
  }

  // 모든 유효성 검사 통과 확인
  if (Object.values(errors.value).some((error) => error !== "")) {
    return;
  }

  // 회원가입
  try {
    duplicateEmailError.value = "";

    // 이메일 중복 체크
    const { data: existingUsers, error: checkError } = await supabase
      .from("user_info")
      .select("email")
      .eq("email", email.value);

    if (checkError) {
      console.error("이메일 중복 체크 중 오류:", checkError);
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {
      duplicateEmailError.value = "이미 존재하는 이메일입니다.";
      return;
    }

    // 회원가입
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (signUpError) {
      console.error("회원가입 실패:", signUpError);
      throw signUpError;
    }

    if (user) {
      console.log("Auth 회원가입 성공:", user);

      const { error: updateError } = await supabase
        .from("user_info")
        .update({ name: name.value })
        .eq("id", user.id); // auth의 id와 매칭되는 레코드 찾기

      if (updateError) {
        console.error("사용자 정보 업데이트 실패:", updateError);
        throw updateError;
      }

      console.log("user_info 테이블에 이름 업데이트 성공");

      await supabase.auth.signOut();
      router.push("/signin");
    }
  } catch (error) {
    console.error("알 수 없는 오류:", error.message);
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
    className="w-full min-h-screen flex pt-[20px] justify-center bg-white01 text-black ">
    <section
      className="w-[494px] h-auto flex flex-col items-center gap-[60px] ">
      <h1 className="font-bold text-[32px] text-[#1A1A1A]">회원가입</h1>
      <form
        class="w-full max-w-[494px] flex flex-col gap-[30px] mb-[52px] bg-white01"
        @submit.prevent="signUp">
        <div class="flex-1 relative">
          <Input v-model="email" placeholder="이메일을 입력해주세요" />
          <p v-if="errors.email" class="text-[#FF3333] text-xs mt-[10px]">
            {{ errors.email }}
          </p>
        </div>
        <div class="flex-1 relative">
          <Input v-model="name" placeholder="이름을 입력해주세요" />
          <p v-if="errors.name" class="text-[#FF3333] text-xs mt-[10px]">
            {{ errors.name }}
          </p>
        </div>
        <div class="flex-1 relative">
          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력해주세요" />
          <p v-if="errors.password" class="text-[#FF3333] text-xs mt-[10px]">
            {{ errors.password }}
          </p>
        </div>
        <div class="flex-1 relative">
          <Input
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호를 확인해주세요" />
          <p
            v-if="errors.confirmPassword"
            class="text-[#FF3333] text-xs mt-[10px]">
            {{ errors.confirmPassword }}
          </p>
        </div>
        <Button text="회원가입" type="submit" />
        <p
          v-if="duplicateEmailError"
          class="text-[#FF3333] text-xs text-center">
          {{ duplicateEmailError }}
        </p>
      </form>
    </section>
  </article>
</template>
<style scoped></style>
