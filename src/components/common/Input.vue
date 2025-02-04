<script setup>
defineProps({
  modelValue: String, // v-model을 위한 값
  type: { type: String, default: "text" }, // 기본값: text
  placeholder: String,
});

defineEmits(["update:modelValue"]);
</script>
<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full h-[76px] bg-white01 border border-gray01 rounded-[10px] placeholder-[#4D4D4D] pl-[30px]"
    :placeholder="placeholder"
  />
</template>
<style scoped></style>
