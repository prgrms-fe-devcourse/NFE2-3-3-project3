<script setup>
import { supabase } from "@/api";
import { notificationAPI } from "@/api/notification";
import { Button, Menu } from "primevue";
import { ref, onBeforeMount, nextTick } from "vue";
import { RouterLink } from "vue-router";
import EmptyText from "@/components/layout/EmptyText.vue";
import Badge from "primevue/badge";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const newNotificationCount = ref(0);
const notifications = ref([]);
const menu = ref(null);

supabase
  .channel("notification-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "notification" },
    ({ new: newNotification }) => {
      if (user.value?.id !== newNotification.target_uid) return;

      newNotificationCount.value += 1;
      fetchNotifications();
    },
  )
  .subscribe();

const clickNotification = async (notification) => {
  if (notification.read) return;
  newNotificationCount.value -= 1;
  await notificationAPI.read(notification.id);
};

const readAllNotifications = async () => {
  newNotificationCount.value = 0;
  notifications.value = notifications.value.map((notification) => ({
    ...notification,
    read: true,
  }));
  await notificationAPI.readAll(user.value?.id);
};

const deleteAllNotifications = async (notification) => {
  newNotificationCount.value = 0;
  notifications.value = [];
  await notificationAPI.deleteAll(notification.receiver.id);
};

const getNotificationIcon = (notification) => {
  const { notification_type, follow, invite, comment } = notification;
  if (!follow && !invite && !comment) return "pi pi-times";
  switch (notification_type) {
    case "follow":
      return "pi pi-user-plus";
    case "comment":
      return "pi pi-comment";
    case "invite":
      return "pi pi-pen-to-square";
    default:
      return "";
  }
};

const getNotificationURL = (notification) => {
  const { sender, comment, follow, invite, notification_type } = notification;
  if (!follow && !invite && !comment) return "#";
  switch (notification_type) {
    case "follow":
      return `/users/${sender.id}`;
    case "comment":
      if (comment?.problem_id) {
        return `/problem-board/${comment.problem_id}`;
      }
      if (comment?.workbook_id) {
        return `/problem-set-board/${comment.workbook_id}`;
      }
    case "invite":
      return `/exam-room`;
    default:
      return "/";
  }
};

const getNotificationMessage = (notification) => {
  const { sender, comment, follow, invite, notification_type } = notification;
  if (!follow && !invite && !comment) return "삭제된 알림입니다.";
  switch (notification_type) {
    case "follow":
      return `${sender.name}님이 회원님을 팔로우하기 시작했습니다.`;
    case "comment":
      if (comment?.problem_id) {
        return `${sender.name}님이 회원님이 올리신 문제에 댓글을 남겼습니다.`;
      }
      if (comment?.workbook_id) {
        return `${sender.name}님이 회원님이 올리신 문제집에 댓글을 남겼습니다.`;
      }
    case "invite":
      return `${sender.name}님이 회원님을 시험에 초대했습니다.`;
    default:
      return "";
  }
};

const toggle = async (event) => {
  menu.value.toggle(event);
  await nextTick();
  const menuElement = document.getElementById("notification_menu");
  if (menuElement) {
    menuElement.scrollTop = 0;
  }
};

const fetchNotifications = async () => {
  const notificationsData = await notificationAPI.getAll();
  const count = await notificationAPI.countNewNotification();

  notifications.value = notificationsData;
  newNotificationCount.value = count;
};

onBeforeMount(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="relative">
    <Button
      @click="toggle"
      icon="pi pi-bell"
      severity="secondary"
      variant="text"
      class="!py-0"
      aria-haspopup="true"
      aria-controls="notification_menu"
      rounded
    >
    </Button>
    <Badge
      v-if="newNotificationCount > 0"
      :value="newNotificationCount"
      size="small"
      class="absolute top-0 right-0"
    />
  </div>
  <Menu
    ref="menu"
    id="notification_menu"
    :model="notifications"
    class="w-80 max-h-80 overflow-y-auto"
    popup
  >
    <template #start>
      <div v-if="notifications.length > 0" class="flex justify-end pt-1 pr-1">
        <Button
          @click="readAllNotifications()"
          label="모두 읽기"
          severity="secondary"
          size="small"
          variant="text"
        />
        <Button
          @click="deleteAllNotifications(notifications[0])"
          label="전체 삭제"
          severity="danger"
          size="small"
          variant="text"
        />
      </div>
      <EmptyText v-else class="py-6">새로운 알림이 없습니다...</EmptyText>
    </template>
    <template #item="{ item: notification, props }">
      <RouterLink
        :to="getNotificationURL(notification)"
        v-slot="{ href, navigate }"
        custom
      >
        <a :href="href" v-bind="props.action" @click="navigate">
          <div
            @click="clickNotification(notification)"
            :class="`flex gap-4 place-items-stretch ${
              notification.read ? 'opacity-50' : ''
            }`"
          >
            <span :class="[getNotificationIcon(notification), 'mt-1']"></span>
            <p>
              {{ getNotificationMessage(notification) }}
            </p>
          </div>
        </a>
      </RouterLink>
    </template>
  </Menu>
</template>

<style scoped></style>
