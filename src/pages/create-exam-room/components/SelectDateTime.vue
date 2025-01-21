<script setup>
import { ref } from "vue";
import { DatePicker, DatePickerStyle } from "primevue";

const emit = defineEmits(["update:examDateTime", "update:duration"]);

const startDate = ref(null);
const startTime = ref(null);
const duration = ref(null);

const handleStartDateChange = (newDate) => {
  emit("update:examDateTime", { ...startDate.value, date: newDate });
};

const handleDurationChange = (newDuration) => {
  emit("update:duration", newDuration);
};
</script>

<template>
  <div class="px-16 py-6">
    <h2 class="text-2xl text-black-1 font-medium mb-6">시간 선택하기</h2>

    <div class="grid grid-cols-2 gap-8">
      <!-- 시험 시작 시간 -->
      <div>
        <h3 class="text-lg mb-4">시작 시간</h3>

        <div class="card flex justify-center">
          <DatePicke
            v-model="date"
            inline
            showWeek
            class="w-full sm:w-[30rem]"
          />
        </div>

        <DatePicker v-model="date" inline showWeek class="w-full sm:w-[30rem]" />

      </div>

      <!-- 시험 시간 -->
      <div>
        <h3 class="text-lg mb-4">시험 시간 (24시간)</h3>
        <DatePicker
          v-model="templatedisplay"
          showIcon
          fluid
          iconDisplay="input"
          timeOnly
        >
          <template #inputicon="slotProps">
            <i class="pi pi-clock" @click="slotProps.clickCallback" />
          </template>
        </DatePicker>
      </div>
    </div>
  </div>
</template>
