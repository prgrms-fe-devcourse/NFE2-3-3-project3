<script setup>
import { setDefaultAvatar } from "@/utils/imageUtils";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  showRemoveButton: {
    type: Boolean,
    default: false,
  },
  isOwner: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['add', 'remove']);
</script>

<template>
  <li class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
    <div class="flex gap-2 items-center">
      <img 
        :src="user.profileImage" 
        :alt="user.nickname"
        @error="setDefaultAvatar"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div class="flex flex-col">
        <strong class="font-medium">{{ user.email }}</strong>
        <div class="flex items-center gap-2">
          <span class="text-gray-1">{{ user.nickname }}</span>
          <span v-if="isOwner" class="text-orange-500 text-sm">(주최자)</span>
        </div>
      </div>
    </div>
    
    <button 
      v-if="showRemoveButton"
      @click="emit('remove', user)"
      class="text-red-500 hover:text-red-600 px-2 py-1 rounded"
    >
      제거
    </button>
    <button 
      v-else-if="!isOwner"
      @click="emit('add', user)"
      class="text-orange-500 hover:text-orange-600 px-2 py-1 rounded"
    >
      추가
    </button>
  </li>
</template>

<style scoped>
.text-gray-1 {
  color: var(--gray-1, #666666);
}
</style>