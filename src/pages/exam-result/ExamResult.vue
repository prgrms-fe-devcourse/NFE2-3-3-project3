<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";

import { useRoute } from "vue-router";

import ExamResultHeader from "./components/ExamResultHeader.vue";
import ExamResultBody from "./components/ExamResultBody.vue";

const route = useRoute();
</script>

<template>
  <div class="flex h-screen overflow-auto w-full">
    <Sidebar v-if="route.path !== '/'" class="relative z-40" />
    <div class="flex-1 flex flex-col bg-beige-2 py-6 pr-6 overflow-x-hidden">
      <ExamResultHeader class="rounded-t-3xl bg-[#F0F0F0]" />
      <main class="flex-1 rounded-b-3xl bg-white">
        <section
          class="max-w-[1200px] min-h-[400rem] py-8 pl-80 -mr-8 relative"
        >
          <ExamResultBody class="absolute top-[-56px] max-w-[712px]" />
        </section>
      </main>
    </div>
  </div>
</template>
