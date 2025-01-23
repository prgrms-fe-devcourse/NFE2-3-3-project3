<script setup>
import { Avatar, AvatarGroup, Column, DataTable } from "primevue";
import { readonly } from "vue";
import { formatMsToHourMinute } from "@/utils/formatMsToHour";
import { formatDate } from "@/utils/formatDate";
import { RouterLink } from "vue-router";

const { exams: rawExams } = defineProps({
  exams: {
    type: Array,
    required: true,
  },
});
const exams = readonly(rawExams);
</script>
<template>
  <section class="flex flex-col gap-[18px]">
    <div class="flex justify-between items-center">
      <p class="font-semibold text-xl">{{ exams.length }} 시험장</p>
    </div>

    <!-- 테이블 -->
    <DataTable
      :value="exams"
      dataKey="id"
      tableStyle="min-width: 50rem;"
      showGridlines
      paginator
      :rows="10"
    >
      <template #empty>검색된 시험이 없습니다...</template>
      <Column field="title" sortable header="시험명"></Column>
      <Column field="workbook.title" sortable header="사용한 문제집">
        <template #body="slotProps">
          <RouterLink :to="`/my-problem-sets/${slotProps.data.workbook.id}`">
            {{ slotProps.data.workbook.title }}
          </RouterLink>
        </template>
      </Column>
      <Column field="time" sortable header="소요 시간">
        <template #body="slotProps">
          {{ formatMsToHourMinute(slotProps.data.time) }}
        </template>
      </Column>
      <Column field="solved_with" header="함께 푼 사람">
        <template #body="slotProps">
          <AvatarGroup>
            <Avatar
              v-for="avatar_url in slotProps.data.solved_with.slice(0, 3)"
              :image="avatar_url"
              shape="circle"
            />
            <Avatar
              v-if="slotProps.data.solved_with.length - 3"
              :label="`+${slotProps.data.solved_with.length - 3}`"
              shape="circle"
            />
          </AvatarGroup>
        </template>
      </Column>
      <Column field="start_date" sortable header="응시 일시">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.test_center.start_date) }}
        </template>
      </Column>
    </DataTable>
  </section>
</template>
<style></style>
