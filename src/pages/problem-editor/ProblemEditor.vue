<script setup>
import ProblemEditorHeader from "./components/ProblemEditorHeader.vue";
import ProblemEditorLists from "./components/ProblemEditorLists.vue";
import ProblemEditorMain from "./components/ProblemEditorMain.vue";
</script>
<template>
  <div class="flex flex-col h-screen w-screen">
    <ProblemEditorHeader />
    <div class="flex flex-row h-full w-full">
      <ProblemEditorLists />
      <ProblemEditorMain />
    </div>
  </div>
</template>
<style scoped></style>
