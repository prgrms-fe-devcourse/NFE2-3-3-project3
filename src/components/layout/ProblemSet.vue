<script setup>
import { Avatar } from "primevue";
import { RouterLink } from "vue-router";
</script>
<template>
  <RouterLink>
    <article
      class="flex flex-col justify-between w-full h-[146px] bg-orange-3 gap-[50px] px-4 py-3 rounded-lg"
    >
      <div>
        <p class="font-pretend text-lg">제목</p>
        <p class="text-sm text-gray-1">문제집에 대한 설명입니다. ...</p>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <Avatar
            image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
            class="mr-2 max-w-7 max-h-7"
            shape="circle"
          />
          <span>이름</span>
        </div>
        <p class="font-medium">100문제</p>
      </div>
    </article>
  </RouterLink>
</template>
<style scoped></style>
