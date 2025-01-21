<script setup>
import { ref } from "vue";
import SearchBar from "@/components/layout/SearchBar.vue";
import RadioButton from "primevue/radiobutton";
import tempIMG from "@/assets/harp seal.jpg";

const emit = defineEmits(["update:participants"]);

const participants = ref([]);
const permissions = ref("view");

const handleParticipantSearch = (email) => {
  // 참가자 검색 로직
};

const handlePermissionChange = (value) => {
  permissions.value = value;
};
</script>

<template>
  <div class="px-16 py-6">
    <h2 class="text-2xl text-black-1 font-medium mb-6">시험장 초대하기</h2>

    <!-- 참가자 검색 -->
    <section class="mb-8 grid grid-cols-2 gap-6">
      <!-- 검색 바 + 팔로잉 목록 -->
      <div>
        <SearchBar
          placeholder="이메일로 검색"
          @search="handleParticipantSearch"
          class="bg-gray-50 mb-4"
        />
        <!-- 팔로잉 목록 -->
        <div class="rounded-lg bg-beige-2 px-6 py-4">
          <h4 class="font-normal">팔로잉</h4>
          <img :src="tempIMG" alt="임시 프로필" class="w-8 h-8 rounded-full" />
          <strong>user@gamil.com</strong>
          <span>사용자</span>
        </div>
      </div>

      <!-- 초대된 참가자 목록 -->
      <div class="rounded-lg bg-beige-2 px-6 py-4">
        <h4 class="font-normal">초대된 참가자</h4>
        <div class="space-y-2">
          <div v-for="participant in participants" :key="participant.email">
            {{ participant.email }}
          </div>
        </div>
      </div>
    </section>

    <!-- 권한 설정 -->
    <div>
      <h3 class="text-lg mb-4">결과 공유 여부를 선택해주세요.</h3>
      <div class="flex gap-4 flex-col">
        <div class="flex gap-2">
          <RadioButton
            v-model="permissions"
            value="view"
            @change="handlePermissionChange"
          />
          <label>공유함</label>
          <span>(참가자들의 이름, 성적이 모든 참가자에게 전달됩니다.)</span>
        </div>
        <div class="flex gap-2">
          <RadioButton
            v-model="permissions"
            value="edit"
            @change="handlePermissionChange"
          />
          <label>공유 안 함</label>
          <span>(참가자들은 본인의 성적만 열람이 가능합니다.)</span>
        </div>
      </div>
    </div>
  </div>
</template>
