import { ref } from "vue";

export function useGameStart() {
  const isGameStarting = ref(true);

  setTimeout(() => {
    isGameStarting.value = false;
  }, 3000);

  return { isGameStarting };
}
