<script setup>
import Profile from "@/components/layout/Profile.vue";
import Grade from "@/components/layout/Grade.vue";
import UserProfileTabs from "./components/UserProfileTabs.vue";
import { userAPI } from "@/api/user";
import { watchEffect, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const user = ref();

watchEffect(async () => {
  const data = await userAPI.getOne(route.params.userId);
  user.value = data;
});
</script>
<template>
  <div class="flex flex-col gap-16">
    <h1 class="text-[42px] leading-none font-laundry">회원 정보</h1>
    <section class="flex h-56 gap-5">
      <Profile
        :img-src="user?.avatar_url"
        :name="user?.name"
        :email="user?.email"
      />
      <Grade :user-id="route.params.userId" />
    </section>
    <UserProfileTabs />
  </div>
</template>
<style scoped></style>
