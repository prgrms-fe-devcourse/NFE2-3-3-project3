<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex flex-col lg:flex-row h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="p-6 flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>
