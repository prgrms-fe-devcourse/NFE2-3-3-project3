<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex h-screen">
    <Sidebar class="lg:w-64 w-16 bg-gray-200 h-full" />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="flex-1 px-6 py-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
