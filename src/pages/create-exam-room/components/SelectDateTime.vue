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

// 날짜와 시간 선택을 위한 ref
const selectedDate = ref(null);
// 시작 시간을 위한 ref
const startHours = ref(0);
const startMinutes = ref(0);
// 시험 시간을 위한 ref
const durationHours = ref(0);
const durationMinutes = ref(0);

// 시험 시작 시간 (Date 객체)를 계산하는 computed
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

// 시작 시간이 변경될 때마다 부모 컴포넌트에 알림
watch([selectedDate, startHours, startMinutes], () => {
  if (startDateTime.value) {
    emit("update:examDateTime", startDateTime.value);
  }
});

// 시험 시간(duration)이 변경될 때마다 부모 컴포넌트에 알림
watch([durationHours, durationMinutes], () => {
  const totalMinutes = durationHours.value * 60 + durationMinutes.value;
  if (totalMinutes <= 1440) {
    // 24시간(1440분) 이하인 경우만
    emit("update:duration", totalMinutes);
  }
});
</script>

<template>
  <h2 class="text-2xl text-black-1 font-medium mb-6">시간 선택하기</h2>

  <!-- 시작 시간 선택 -->
  <div class="space-y-4 mb-4">
    <h3 class="text-lg font-medium">시작 날짜</h3>
    <div class="flex gap-6 align-top">
      <Calendar
        v-model="selectedDate"
        :showIcon="true"
        :minDate="new Date()"
        dateFormat="yy-mm-dd"
        class="w-1/2"
        :inline="true"
        showButtonBar
      />
      <div class="flex gap-4 w-full flex-col">
        <h3 class="text-lg font-medium shrink-0">시작 시간</h3>
        <div class="flex gap-4 w-full mb-20">
          <div class="w-full">
            <label class="text-sm text-gray-600 mb-1 block">시간</label>
            <input
              type="number"
              v-model="startHours"
              :min="0"
              :max="23"
              class="w-full border border-gray-300 rounded-md p-2 shadow-sm [appearance:textfield]"
            />
          </div>
          <div class="w-full">
            <label class="text-sm text-gray-600 mb-1 block">분</label>
            <input
              type="number"
              v-model="startMinutes"
              :min="0"
              :max="59"
              :step="5"
              class="w-full border border-gray-300 rounded-md p-2 shadow-sm [appearance:textfield]"
            />
          </div>
        </div>

        <!-- 시험 시간 선택 -->
        <div class="flex gap-4 w-full flex-col">
          <h3 class="text-lg font-medium w-full">시험 시간</h3>
          <div class="flex gap-4 w-full">
            <div class="w-full">
              <label class="text-sm text-gray-600 mb-1 block">시간</label>
              <input
                type="number"
                v-model="durationHours"
                :min="0"
                :max="23"
                class="w-full border border-gray-300 rounded-md p-2 shadow-sm [appearance:textfield]"
              />
            </div>
            <div class="w-full">
              <label class="text-sm text-gray-600 mb-1 block">분</label>
              <input
                type="number"
                v-model="durationMinutes"
                :min="0"
                :max="59"
                :step="5"
                class="w-full border border-gray-300 rounded-md p-2 shadow-sm [appearance:textfield]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스피너 버튼 보이게 하기 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  height: auto;
}
</style>
