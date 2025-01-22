<script setup>
import Profile from "@/components/layout/Profile.vue";
import { getCurrentGradeInfo } from "@/utils/getCurrentGradeInfo";
import { ref, onMounted } from "vue";
import MypageTabs from "./components/MypageTabs.vue";
import Grade from "@/components/layout/Grade.vue";

const points = ref(0);
const gradeInfo = ref();

onMounted(() => {
  points.value = 0;
  setTimeout(() => {
    points.value = 40;
    gradeInfo.value = getCurrentGradeInfo(40);
  }, 100);
});
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
      <Grade :points="points" :gradeInfo="gradeInfo" />
    </section>
    <MypageTabs />
  </div>
</template>
<style scoped></style>
