<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";

import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import Header from "./Header.vue";

const route = useRoute();
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar v-if="route.path !== '/'" class="relative z-40" />
    <div class="flex-1 flex flex-col bg-beige-2 py-6 pr-6">
      <Header v-if="route.path !== '/'" class="rounded-t-3xl bg-white" />
      <main class="flex-1 rounded-b-3xl bg-white overflow-y-auto">
        <section class="max-w-[1000px] mx-auto py-8">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>
