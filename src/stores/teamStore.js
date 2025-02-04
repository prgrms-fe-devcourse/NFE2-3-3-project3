// 위 코드를 Setup Store 방식으로 변경하였습니다.

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTeamStore = defineStore("teamStore", () => {
  // ✅ 상태 (state)
  const selectedTeam = ref(localStorage.getItem("selectedTeam") || "기본");
  const selectedCommunity = ref("");
  const isEmblemEffectOn = ref(false);
  const isEnterAnimationOn = ref(false);

  // ✅ Actions (methods 대신 함수로 정의)
  const selectTeam = (team) => {
    selectedTeam.value = team;
    localStorage.setItem("selectedTeam", team);
    // 기본테마가 아닐때만 엠블럼 함수 실행
    if (team !== "기본") triggerEmblemEffect();
  };

  const endEmblemAnimation = () => {
    isEmblemEffectOn.value = false;
  };

  const endEnterAnimation = () => {
    isEnterAnimationOn.value = false;
  };

  const triggerEmblemEffect = () => {
    isEmblemEffectOn.value = true;
    setTimeout(() => {
      endEmblemAnimation();
    }, 2500);
  };

  const triggerEnteringAnimation = (team) => {
    selectedCommunity.value = team.name;
    isEnterAnimationOn.value = true;
    setTimeout(() => {
      endEnterAnimation();
    }, 1500);
  };

  // ✅ Getter (Computed 사용 가능)
  const isTeamSelected = computed(() => selectedTeam.value !== "기본");

  // 💡 Setup Store 방식은 객체가 아니라 함수에서 값을 반환해야 함
  return {
    selectedTeam,
    selectedCommunity,
    isEmblemEffectOn,
    isEnterAnimationOn,
    selectTeam,
    endEmblemAnimation,
    endEnterAnimation,
    triggerEmblemEffect,
    triggerEnteringAnimation,
    isTeamSelected,
  };
});
