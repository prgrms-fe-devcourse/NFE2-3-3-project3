<script setup>
const { imgSrc, name, email } = defineProps({
  imgSrc: String,
  name: String,
  email: String,
});
</script>
<template>
  <article
    class="flex flex-col justify-center items-center w-52 h-56 bg-beige-2 px-11 rounded-2xl gap-4"
  >
    <img
      class="w-32 h-32 rounded-full border border-black-4 object-cover"
      :src="imgSrc"
      alt="내 프로필 이미지"
    />
    <div class="flex flex-col items-center">
      <p class="font-semibold text-xl">
        {{ name }}
      </p>
      <p class="font-medium text-gray-3 text-sm">
        {{ email }}
      </p>
    </div>
  </article>
</template>
<style scoped></style>
