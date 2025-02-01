<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import ExamResultHeader from "./components/ExamResultHeader.vue";
import ExamResultBody from "./components/ExamResultBody.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="flex h-screen w-full">
    <Sidebar v-if="route.path !== '/'" class="relative z-40" />

    <div class="flex-1 flex flex-col bg-beige-2 py-6 pr-6 overflow-x-hidden">
      <div class="flex justify-center w-full">
        <div class="max-w-[1200px] w-full">
          <ExamResultHeader
            class="rounded-t-3xl bg-[#F0F0F0] overflow-auto max-h-screen"
          />

          <main class="rounded-b-3xl bg-white h-auto flex flex-col">
            <section class="max-w-[1200px] py-8 mx-auto flex justify-center">
              <ExamResultBody class="max-w-[712px] mt-[-104px] z-10 ml-40" />
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
