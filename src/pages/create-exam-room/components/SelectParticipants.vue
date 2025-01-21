// SelectParticipants.vue
<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import UserListItem from "./UserListItem.vue";
import searchIcon from "@/assets/icons/search-icon.svg";
import SelectionChip from "./SelectionChip.vue";

const toast = useToast();
const shareOption = ref("share");
const newParticipant = ref("");
const selectedUsers = ref([]);
const followingUsers = ref([]);

// 팔로잉 목록 불러오기 (더미 데이터)
const fetchFollowingUsers = () => {
  followingUsers.value = [
    {
      email: "user1@example.com",
      nickname: "사용자1",
      profileImage: "/placeholder.jpg",
    },
  ];
};

const addParticipantByEmail = () => {
  if (!newParticipant.value) return;

  handleUserAdd({
    email: newParticipant.value,
    nickname: "새 사용자",
    profileImage: "/placeholder.jpg",
  });
  newParticipant.value = "";
};

const handleUserAdd = (user) => {
  if (!selectedUsers.value.some((selected) => selected.email === user.email)) {
    selectedUsers.value.push(user);
  }
};

const handleUserRemove = (user) => {
  selectedUsers.value = selectedUsers.value.filter(
    (selected) => selected.email !== user.email,
  );
};

onMounted(fetchFollowingUsers);
</script>

<template>
  <div class="px-16">
    <!-- 공개 여부 & 총 시험 인원 (본인 포함) -->
    <SelectionChip
      v-if="selectedUsers.length"
      :label="participantsChip"
      icon="pi pi-users"
      @remove="selectedUsers = []"
      removable
    />

    <h2 class="text-2xl text-black-1 font-medium mb-6">시험장 초대하기</h2>

    <div class="flex justify-center gap-6 h-[400px] mb-6">
      <!-- 검색 및 팔로잉 목록 -->
      <div class="w-full h-full flex-col flex gap-6">
        <div class="flex shrink-0 relative">
          <InputText
            v-model="newParticipant"
            placeholder="이메일 주소를 입력하세요"
            class="flex-1 w-full pr-[80px]"
            @keyup.enter="addParticipantByEmail"
          />
          <Button
            label="추가"
            @click="addParticipant"
            class="absolute right-2 top-1/2 -translate-y-1/2 !rounded-l-none !bg-orange-1"
          >
            <img :src="searchIcon" alt="검색" class="w-4 h-4" />
          </Button>
        </div>

        <!-- 팔로잉 목록 -->
        <div class="rounded-xl bg-beige-1 w-full px-5 py-3 h-full flex-1">
          <h4 class="font-semibold mb-4">팔로잉</h4>
          <ul class="overflow-auto divide-y divide-gray-100">
            <UserListItem
              v-for="user in followingUsers"
              :key="user.email"
              :user="user"
              :show-remove-button="
                selectedUsers.some((selected) => selected.email === user.email)
              "
              @add="handleUserAdd"
              @remove="handleUserRemove"
            />
          </ul>
        </div>
      </div>

      <!-- 초대된 참가자 목록 -->
      <div class="rounded-xl bg-beige-1 w-full px-5 py-3 h-full">
        <h4 class="font-medium mb-4">초대된 참가자</h4>
        <ul class="overflow-auto divide-y divide-gray-100">
          <UserListItem
            v-for="user in selectedUsers"
            :key="user.email"
            :user="user"
            :show-remove-button="true"
            @remove="handleUserRemove"
          />
        </ul>
      </div>
    </div>

    <!-- 결과 공유 설정 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">결과 공유 설정</h3>
      <div class="flex gap-3 flex-col">
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="shareOption"
            inputId="share"
            name="share"
            value="share"
          />
          <label for="share">공유함</label>
          <span class="text-sm text-gray-1">
            (참가자들의 이름, 성적이 모든 참가자에게 전달됩니다.)
          </span>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="shareOption"
            inputId="private"
            name="share"
            value="private"
          />
          <label for="private">공유하지 않음</label>
          <span class="text-sm text-gray-1">
            (참가자들은 본인의 성적만 열람이 가능합니다.)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
