<script setup>
import { RouterLink } from "vue-router";
import { Paginator, Select } from "primevue";
import { ref, watchEffect } from "vue";
import ProblemSet from "@/components/layout/ProblemSet.vue";
import { useRoute } from "vue-router";
import ProblemTable from "@/components/layout/ProblemTable.vue";
import { problemAPI } from "@/api/problem";
import { followAPI } from "@/api/follow";
import { workbookAPI } from "@/api/workbook";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const followings = ref([]);
const problems = ref([]);
const problemSets = ref([]);

const SORTS = ref([
  { name: "최신순", value: "최신순" },
  { name: "좋아요 많은 순", value: "좋아요 많은 순" },
  { name: "정답률 높은 순", value: "정답률 높은 순" },
  { name: "정답률 낮은 순", value: "정답률 낮은 순" },
]);
const sort = ref({ name: "최신순", value: "최신순" });

const TABS = ["팔로잉 목록", "공유한 문제", "공유한 문제집"];

const currentTab = ref(route.query.tab || TABS[0]);
const changeTab = (event) => {
  currentTab.value = event.target.innerText;
};

watchEffect(async () => {
  const userId = route.params.userId;
  if (!userId || !user.value) return;
  if (userId === user.value.id) {
    router.replace("/mypage");
    return;
  }

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
});
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
    <div v-if="currentTab === TABS[0]" class="grid grid-cols-6 gap-4">
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
          :options="SORTS"
          optionLabel="name"
          class="w-40"
        />
      </div>

      <div class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="problemSet in problemSets"
          :key="problemSet.id"
          :to="`/problem-set-board/${problemSet.id}`"
          :problemSet="problemSet"
        />
      </div>
      <Paginator :rows="10" :totalRecords="120"></Paginator>
    </section>
  </section>
</template>
<style scoped>
/* 테이블 헤더 텍스트를 중앙 정렬 */
::v-deep(.p-datatable-column-header-content) {
  justify-content: center;
}
</style>
