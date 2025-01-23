<script setup>
import { ref, watchEffect } from "vue";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/store/authStore";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import UserListItem from "./UserListItem.vue";
import searchIcon from "@/assets/icons/search-icon.svg";
import { followAPI } from "@/api/follow";

// 팔로잉 목록 불러오기
const authStore = useAuthStore();

const fetchFollowing = async () => {
  try {
    if (authStore.user?.id) {
      const followData = await followAPI.getFollowing(authStore.user.id);
      followingUsers.value = followData.map((item) => ({
        email: item.followings.email,
        nickname: item.followings.name || item.followings.email.split("@")[0],
        profileImage: item.followings.avatar_url,
      }));
    }
  } catch (error) {
    console.error("팔로잉 목록 불러오기 실패:", error);
    toast.add({
      severity: "error",
      summary: "불러오기 실패",
      detail: "팔로잉 목록을 불러오는데 실패했습니다.",
      life: 3000,
    });
  }
};

watchEffect(() => {
  if (authStore.isAuthenticated) {
    fetchFollowing();
  }
});

const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
  shareOption: {
    type: String,
    default: "share",
  },
});

const emit = defineEmits(["update:participants", "update:shareOption"]);

const toast = useToast();
const shareOption = ref(props.shareOption);
const newParticipant = ref("");
const selectedUsers = ref([]);
const followingUsers = ref([]);

watchEffect(() => {
  selectedUsers.value = props.participants;
  shareOption.value = props.shareOption;
});

const handleShareOptionChange = (value) => {
  shareOption.value = value;
  emit("update:shareOption", value);
};

const addParticipantByEmail = () => {
  if (!newParticipant.value) return;

  const session = JSON.parse(
    localStorage.getItem(
      "sb-" + import.meta.env.VITE_SUPABASE_PROJECT_REF + "-auth-token",
    ),
  );
  if (session?.user?.email === newParticipant.value) {
    toast.add({
      severity: "warn",
      summary: "추가 불가",
      detail: "자기 자신은 추가할 수 없습니다.",
      life: 3000,
    });
    return;
  }

  handleUserAdd({
    email: newParticipant.value,
    nickname: newParticipant.value.split("@")[0],
    profileImage: "/placeholder.jpg",
  });
  newParticipant.value = "";
};

const handleUserAdd = (user) => {
  if (!selectedUsers.value.some((selected) => selected.email === user.email)) {
    selectedUsers.value.push(user);
    emit("update:participants", selectedUsers.value);
  }
};

const handleUserRemove = (user) => {
  if (user.isOwner) {
    toast.add({
      severity: "warn",
      summary: "삭제 불가",
      detail: "시험 주최자는 삭제할 수 없습니다.",
      life: 3000,
    });
    return;
  }
  selectedUsers.value = selectedUsers.value.filter(
    (selected) => selected.email !== user.email,
  );
  emit("update:participants", selectedUsers.value);
};

// 사용자 정보 설정
watchEffect(() => {
  try {
    const storageKeys = Object.keys(localStorage);
    const supabaseAuthKey = storageKeys.find(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
    );

    if (supabaseAuthKey) {
      const sessionStr = localStorage.getItem(supabaseAuthKey);
      if (!sessionStr) return;

      const session = JSON.parse(sessionStr);
      if (session?.user) {
        const user = session.user;
        const hasOwner = selectedUsers.value.some((u) => u.isOwner);

        if (!hasOwner) {
          selectedUsers.value = [
            {
              email: user.email,
              nickname:
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "시험 주최자",
              profileImage: user.user_metadata?.avatar_url || "",
              isOwner: true,
            },
          ];
          emit("update:participants", selectedUsers.value);
        }
      }
    }
  } catch (error) {
    console.error("세션 정보 파싱 중 에러 발생:", error);
  }
});
</script>

<template>
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
          @click="addParticipantByEmail"
          class="absolute right-2 top-1/2 -translate-y-1/2 !rounded-l-none !bg-orange-1"
        >
          <img :src="searchIcon" alt="검색" class="w-4 h-4" />
        </Button>
      </div>

      <!-- 팔로잉 목록 -->
      <section class="rounded-xl bg-beige-1 w-full px-5 py-3 h-full flex-1">
        <h4 class="font-semibold mb-4">팔로잉</h4>
        <div class="overflow-auto h-full">
          <div
            v-if="followingUsers.length === 0"
            class="text-center text-gray-500 py-4 h-[80%] w-full item-middle"
          >
            팔로잉 목록이 비었습니다.
          </div>
          <ul v-else class="divide-y divide-gray-100">
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
      </section>
    </div>

    <!-- 초대된 참가자 목록 -->
    <section class="rounded-xl bg-beige-1 w-full px-5 py-3 h-full">
      <h4 class="font-medium mb-4">초대된 참가자</h4>
      <ul class="overflow-auto divide-y divide-gray-100">
        <UserListItem
          v-for="user in selectedUsers"
          :key="user.email"
          :user="user"
          :show-remove-button="!user.isOwner"
          :is-owner="user.isOwner"
          @remove="handleUserRemove"
        />
      </ul>
    </section>
  </div>

  <!-- 결과 공유 설정 -->
  <div class="mb-8">
    <h3 class="text-lg font-medium mb-4">결과 공유 설정</h3>
    <div class="flex gap-3 flex-col">
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="shareOption"
          @change="handleShareOptionChange"
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
          @change="handleShareOptionChange"
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
</template>
