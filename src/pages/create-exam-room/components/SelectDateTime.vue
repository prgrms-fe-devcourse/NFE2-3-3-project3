<script setup>
import { ref, watch, computed } from "vue";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import SelectionChip from "./SelectionChip.vue";

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
const selectedTime = ref(null);
const hours = ref(0);
const minutes = ref(0);

// 시험 시작 시간 (Date 객체)를 계산하는 computed
const startDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return null;
  try {
    const date = new Date(selectedDate.value);

    // selectedTime이 문자열인 경우 ("HH:mm" 형식)
    if (typeof selectedTime.value === "string") {
      const [h, m] = selectedTime.value.split(":");
      date.setHours(parseInt(h) || 0, parseInt(m) || 0, 0);
    }
    // selectedTime이 Date 객체인 경우
    else if (selectedTime.value instanceof Date) {
      date.setHours(
        selectedTime.value.getHours(),
        selectedTime.value.getMinutes(),
        0,
      );
    }
    return date;
  } catch (error) {
    console.error("Date parsing error:", error);
    return null;
  }
});

// 시험 종료 시간을 계산하는 computed
const endDateTime = computed(() => {
  if (!startDateTime.value || (!hours.value && !minutes.value)) return null;

  const durationInMs = (hours.value * 60 + minutes.value) * 60 * 1000;
  return new Date(startDateTime.value.getTime() + durationInMs);
});

// Chip에 표시할 텍스트
const dateTimeChip = computed(() => {
  // 1. 날짜만 선택된 경우
  if (
    selectedDate.value &&
    !selectedTime.value &&
    !hours.value &&
    !minutes.value
  ) {
    return new Date(selectedDate.value).toLocaleDateString();
  }

  // 2. 날짜와 시간까지 선택된 경우
  if (
    selectedDate.value &&
    selectedTime.value &&
    !hours.value &&
    !minutes.value
  ) {
    const dateTime = new Date(startDateTime.value);
    return dateTime.toLocaleString();
  }

  // 3. 날짜, 시간, 시험 시간까지 모두 선택된 경우
  if (startDateTime.value && endDateTime.value) {
    return `${startDateTime.value.toLocaleString()} ~ ${endDateTime.value.toLocaleString()}`;
  }

  return "";
});

// 시작 시간이 변경될 때마다 부모 컴포넌트에 알림
watch(startDateTime, (newDateTime) => {
  if (newDateTime) {
    emit("update:examDateTime", newDateTime);
  }
});

// 시험 시간(duration)이 변경될 때마다 부모 컴포넌트에 알림
watch([hours, minutes], ([newHours, newMinutes]) => {
  const totalMinutes = newHours * 60 + newMinutes;
  if (totalMinutes <= 1440) {
    // 24시간(1440분) 이하인 경우만
    emit("update:duration", totalMinutes);
  }
});

const resetDateTime = () => {
  selectedDate.value = null;
  selectedTime.value = null;
  hours.value = 0;
  minutes.value = 0;
  emit("update:examDateTime", null);
  emit("update:duration", null);
};
</script>

<template>
  <!-- 시간 선택 완료 -> 시작 일시 ~ 종료 일시 -->
  <SelectionChip
    v-if="selectedDate"
    :label="dateTimeChip"
    icon="pi pi-clock"
    @remove="resetDateTime"
    removable
  />

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
            <InputNumber
              v-model="hours"
              :min="0"
              :max="23"
              class="w-full"
              :showButtons="false"
              buttonLayout="horizontal"
              spinnerMode="horizontal"
            />
          </div>
          <div class="w-full">
            <label class="text-sm text-gray-600 mb-1 block">분</label>
            <InputNumber
              v-model="minutes"
              :min="0"
              :max="59"
              :step="5"
              class="w-full"
              :showButtons="false"
              buttonLayout="horizontal"
              spinnerMode="horizontal"
            />
          </div>
        </div>

        <!-- 시험 시간 선택 -->
        <div class="flex gap-4 w-full flex-col">
          <h3 class="text-lg font-medium w-full">시험 시간</h3>
          <div class="flex gap-4 w-full">
            <div class="w-full">
              <label class="text-sm text-gray-600 mb-1 block">시간</label>
              <InputNumber
                v-model="hours"
                :min="0"
                :max="23"
                class="w-full"
                :showButtons="false"
                buttonLayout="horizontal"
                spinnerMode="horizontal"
              />
            </div>
            <div class="w-full">
              <label class="text-sm text-gray-600 mb-1 block">분</label>
              <InputNumber
                v-model="minutes"
                :min="0"
                :max="59"
                :step="5"
                class="w-full"
                :showButtons="false"
                buttonLayout="horizontal"
                spinnerMode="horizontal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
