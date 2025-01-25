<script setup>
import { ref, watch } from "vue";
import Chart from "primevue/chart";

const props = defineProps({
  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
  correctCount: {
    type: Number,
    required: true,
    default: 0,
  },
  averageCount: {
    type: Number,
    required: true,
    default: 1,
  },
});

const chartData = ref({
  labels: ["내 점수", "평균 점수"],
  datasets: [
    {
      backgroundColor: ["#F6C085", "#8992B5"],
      data: [props.correctCount, props.averageCount],
    },
  ],
});
// 차트 옵션
const chartOptions = ref({
  responsive: true, // 부모 래핑 박스 크기에 맞춤
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: props.total, // 최대 점수
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
});

watch(
  () => [props.correctCount, props.averageCount, props.totalCount],
  ([newCorrect, newAverage, newTotal]) => {
    chartData.value.datasets[0].data = [newCorrect, newAverage];
    chartOptions.value.scales.x.max = newTotal;
  },
);
</script>

<template>
  <div class="w-full h-full">
    <!-- Bar Chart -->
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>
