<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";

import { RouterView } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="flex h-screen">
    <Sidebar v-if="route.path !== '/'" />
    <div class="flex-1 bg-beige-2 p-6">
      <RouterView />
    </div>
  </div>
</template>