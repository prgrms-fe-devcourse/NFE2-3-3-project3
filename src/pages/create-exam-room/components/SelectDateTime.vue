<script setup>
import { ref, watch, computed } from "vue";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";

const props = defineProps({
  examDateTime: {
    default: null,
  },
  duration: {
    default: null,
  },
});

const emit = defineEmits(["update:examDateTime", "update:duration"]);

const selectedDate = ref(new Date());
const startHours = ref(0);
const startMinutes = ref(0);
const durationHours = ref(0);
const durationMinutes = ref(0);

const startDateTime = computed(() => {
  if (!selectedDate.value) return null;
  try {
    const date = new Date(selectedDate.value);
    date.setHours(startHours.value || 0, startMinutes.value || 0, 0);
    return date;
  } catch (error) {
    console.error("Date parsing error:", error);
    return null;
  }
});

watch([selectedDate, startHours, startMinutes], () => {
  if (startDateTime.value) {
    emit("update:examDateTime", startDateTime.value);
  }
});

watch([durationHours, durationMinutes], () => {
  const totalMinutes = durationHours.value * 60 + durationMinutes.value;
  if (totalMinutes <= 1440) {
    emit("update:duration", totalMinutes);
  }
});
</script>

<template>
  <h2 class="text-2xl text-black-1 font-medium mb-6">시간 선택하기</h2>

  <div class="flex gap-20 w-full">
    <div class="flex flex-col gap-2 align-top">
      <h3 class="text-lg font-medium">시작 날짜</h3>
      <Calendar
        v-model="selectedDate"
        :showIcon="true"
        :minDate="new Date()"
        dateFormat="yy-mm-dd"
        class="w-full"
        :inline="true"
        showButtonBar
      />
    </div>

    <div class="flex gap-4 w-fit flex-col">
      <h3 class="text-lg font-medium shrink-0">시작 시간</h3>
      <div class="flex items-center gap-2">
        <InputNumber
          v-model="startHours"
          placeholder="0"
          :min="0"
          :max="23"
          :showButtons="true"
          class="w-1/2 border border-gray-300 rounded-md p-2 shadow-sm"
          :inputClass="'w-full p-0 border-none'"
        />
        <label class="text-gray-600 block shrink-0 text-lg">시간</label>
        <InputNumber
          v-model="startMinutes"
          placeholder="0"
          :min="0"
          :max="59"
          :step="5"
          :showButtons="true"
          class="w-1/2 border border-gray-300 rounded-md p-2 shadow-sm"
          :inputClass="'w-full p-0 border-none'"
        />
        <label class="text-gray-600 block shrink-0 text-lg">분</label>
        <span class="text-gray-600 shrink-0 text-lg">부터</span>
      </div>

      <div class="flex gap-4 w-full flex-col">
        <h3 class="text-lg font-medium w-full">지속 시간 설정</h3>
        <div class="flex items-center gap-2 w-full">
          <InputNumber
            v-model="durationHours"
            placeholder="0"
            :min="0"
            :max="23"
            :showButtons="true"
            class="w-1/2 border border-gray-300 rounded-md p-2 shadow-sm"
          />
          <label class="text-gray-600 block shrink-0 text-lg">시간</label>
          <InputNumber
            v-model="durationMinutes"
            placeholder="0"
            :min="0"
            :max="59"
            :step="5"
            :showButtons="true"
            class="w-1/2 border border-gray-300 rounded-md p-2 shadow-sm"
          />
          <label class="text-gray-600 block shrink-0 text-lg">분</label>
          <span class="text-gray-600 text-lg shrink-0">동안</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputnumber-input) {
  width: 100%;
  padding: 0.5rem !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
