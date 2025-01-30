<script setup>
import { RouterLink } from "vue-router";
import { Paginator, Select } from "primevue";
import { ref, computed, watch } from "vue";
import ProblemSet from "@/components/layout/ProblemSet.vue";
import { useRoute } from "vue-router";
import ProblemTable from "@/components/layout/ProblemTable.vue";
import { problemAPI } from "@/api/problem";
import { followAPI } from "@/api/follow";
import { workbookAPI } from "@/api/workbook";
import { SORT, SORTS } from "@/const/sorts";
import EmptyText from "@/components/layout/EmptyText.vue";

const route = useRoute();
const { userId } = defineProps({
  userId: String,
});

const followings = ref([]);
const problems = ref([]);
const problemSets = ref([]);
const first = ref(0);
const rows = ref(8);

const sorts = ref(SORTS);
const sort = ref(SORTS[0]);

const TABS = ["팔로잉 목록", "공유한 문제", "공유한 문제집"];

const currentTab = ref(route.query.tab || TABS[0]);
const changeTab = (event) => {
  currentTab.value = event.target.innerText;
};

const sortedProblemSets = computed(() => {
  const newProblemSets = [...problemSets.value];
  switch (sort.value?.value) {
    case SORT.latest:
      return newProblemSets
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(first.value, first.value + rows.value);
    case SORT.likes:
      return newProblemSets
        .sort((a, b) => (b.likes.length || 0) - (a.likes.length || 0))
        .slice(first.value, first.value + rows.value);
    default:
      return newProblemSets.slice(first.value, first.value + rows.value);
  }
});

watch(
  () => userId,
  async () => {
    const followingPromise = followAPI.getFollowing(userId);
    const problemsPromise = problemAPI.getAllSharedByUserId(userId);
    const problemSetsPromise = workbookAPI.getAllSharedByUserId(userId);

    const [followingData, problemsData, problemSetsData] = await Promise.all([
      followingPromise,
      problemsPromise,
      problemSetsPromise,
    ]);

    followings.value = followingData;
    problems.value = problemsData;
    problemSets.value = problemSetsData;
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <section class="flex flex-col gap-6">
    <div class="flex gap-8 text-black-2 font-semibold text-xl">
      <RouterLink
        v-for="tab in TABS"
        :to="`${route.path}?tab=${tab}`"
        :key="tab"
        :class="
          currentTab === tab
            ? 'text-orange-1'
            : 'hover:text-gray-1 transition-colors'
        "
        @click="changeTab"
        replace
      >
        {{ tab }}
      </RouterLink>
    </div>

    <!-- 팔로잉 목록 탭 -->
    <div v-if="currentTab === TABS[0]">
      <div
        v-if="!followings.length"
        class="flex items-center justify-center h-40"
      >
        <EmptyText>팔로잉한 유저가 없습니다...</EmptyText>
      </div>
      <template v-else class="grid grid-cols-6 gap-4">
        <RouterLink
          v-for="{ following } in followings"
          :to="`/users/${following.id}`"
          class="flex flex-col justify-center items-center gap-4 w-36 h-40 px-2 py-5 bg-black-6/20 rounded-lg"
        >
          <img
            class="w-16 h-16 rounded-full border border-black-4"
            :src="following.avatar_url"
            alt="프로필 이미지"
          />
          <div class="flex flex-col items-center gap-1">
            <p class="text-sm font-semibold">{{ following.name }}</p>
            <p class="text-xs font-medium text-black-3">
              {{ following.email }}
            </p>
          </div>
        </RouterLink>
      </template>
    </div>

    <!-- 공유한 문제 탭 -->
    <div v-else-if="currentTab === TABS[1]">
      <ProblemTable
        :problems="problems"
        :show-my-problem="false"
        :show-problem="false"
        :show-shared-problem="false"
      />
    </div>

    <!-- 공유한 문제집 탭  -->
    <section
      v-else-if="currentTab === TABS[2]"
      class="flex flex-col gap-[18px]"
    >
      <div class="flex justify-between items-center">
        <p class="font-semibold text-xl">{{ problemSets.length }} 문제집</p>
        <Select
          v-model="sort"
          :options="sorts"
          optionLabel="name"
          class="w-40"
        />
      </div>

      <div
        v-if="!problemSets.length"
        class="flex items-center justify-center h-40"
      >
        <EmptyText>검색된 문제집이 없습니다...</EmptyText>
      </div>
      <div v-else class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="problemSet in sortedProblemSets"
          :key="problemSet.id"
          :to="`/problem-set-board/${problemSet.id}`"
          :problemSet="problemSet"
        />
      </div>
      <Paginator
        v-model:first="first"
        :rows="rows"
        :totalRecords="problemSets.length"
      ></Paginator>
    </section>
  </section>
</template>
<style scoped></style>
