<script setup>
import Profile from "@/components/layout/Profile.vue";
import MypageTabs from "./components/MypageTabs.vue";
import Grade from "@/components/layout/Grade.vue";
</script>
<template>
  <div class="flex flex-col gap-16">
    <h1 class="text-[42px] leading-none font-laundry">내 정보</h1>
    <section class="flex h-56 gap-5">
      <Profile
        img-src="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
        name="김세빈"
        email="rlatpqls13@gmail.com"
      />
      <Grade />
    </section>
    <MypageTabs />
  </div>
</template>
<style scoped></style>
