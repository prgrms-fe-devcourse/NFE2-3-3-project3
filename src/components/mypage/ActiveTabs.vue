<script setup>
const props = defineProps({ 
  createdPostsCount: {
    type: Number,
  },
  commentedPostsCount: {
    type: Number,
  },
  likedPostsCount: {
    type: Number,
  },
  activeTab: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(["update:activeTab"]);

const updateTab = (tab) => {
  emit("update:activeTab", tab);
};
</script>

<template>
  <div class="flex ml-[148px] gap-[50px] mr-[100px] mt-[124px]">
    <button @click="updateTab('posts')" class="flex flex-col items-center gap-[24px]">
      <span class="text-black01 text-[26px] font-bold">{{ props.createdPostsCount }}</span>
      <span class="text-black02 text-[18px] whitespace-nowrap">게시물</span>
    </button>
    <button @click="updateTab('comments')" class="flex flex-col items-center gap-[24px]">
      <span class="text-black01 text-[26px] font-bold">{{ props.commentedPostsCount }}</span>
      <span class="text-black02 text-[18px] whitespace-nowrap">댓글</span>
    </button>
    <button @click="updateTab('likes')" class="flex flex-col items-center gap-[24px]">
      <span class="text-black01 text-[26px] font-bold">{{ props.likedPostsCount }}</span>
      <span class="text-black02 text-[18px] whitespace-nowrap">좋아요</span>
    </button>
  </div>
</template>
