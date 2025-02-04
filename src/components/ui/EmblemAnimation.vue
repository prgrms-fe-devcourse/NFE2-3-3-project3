<script setup>
import doosanEmblem from "@/assets/images/doosan_emblem.svg";
import hanhwaEmblem from "@/assets/images/logo_hanhwa.svg";
import kiaEmblem from "@/assets/images/logo_kia.svg";
import kiwoomEmblem from "@/assets/images/logo_kiwoom.svg";
import ktEmblem from "@/assets/images/logo_kt.svg";
import lgEmblem from "@/assets/images/logo_lg.svg";
import lotteEmblem from "@/assets/images/logo_lotte.svg";
import ncEmblem from "@/assets/images/logo_nc.svg";
import samsungEmblem from "@/assets/images/logo_samsung.svg";
import ssgEmblem from "@/assets/images/logo_ssg.svg";
import { useTeamStore } from "@/stores/teamStore";
import gsap from "gsap";
import { computed, onMounted } from "vue";

const teamStore = useTeamStore();

const emblem = {
  히어로즈: kiwoomEmblem,
  타이거즈: kiaEmblem,
  위즈: ktEmblem,
  트윈스: lgEmblem,
  자이언츠: lotteEmblem,
  다이노스: ncEmblem,
  라이온즈: samsungEmblem,
  랜더스: ssgEmblem,
  이글스: hanhwaEmblem,
  베어스: doosanEmblem,
};

const selectedEmblem = computed(() => emblem[teamStore.selectedTeam]);

onMounted(() => {
  const timeline = gsap.timeline();
  const totalDuration = 2.5;

  timeline
    .fromTo(
      ".overlay-background",
      {
        opacity: 0.75,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
      },
      {
        opacity: 1,
        backgroundColor:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.2))",
        duration: totalDuration * 0.3,
        ease: "power3.out",
      }
    )
    .fromTo(
      ".emblem-container",
      { scale: 0.5, opacity: 0 },
      {
        scale: 1.2,
        opacity: 1,
        duration: totalDuration * 0.15,
        ease: "power3.out",
      }
    )
    .fromTo(
      ".emblem-ring",
      {
        opacity: 0,
        scale: 0.8,
        boxShadow: "0 0 0px 0px rgba(255, 255, 255, 0.5)",
      },
      {
        opacity: 1,
        scale: 3,
        boxShadow: "0 0 100px 40px rgba(255, 255, 255, 0.9)",
        duration: totalDuration * 0.5,
        yoyo: true,
        ease: "sine.inOut",
      }
    )
    .to(".emblem-container", {
      opacity: 0,
      duration: totalDuration * 0.2,
      ease: "power3.in",
    })
    .to(".overlay-background", {
      opacity: 0,
      duration: totalDuration * 0.2,
      ease: "power3.in",
    });
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 overlay-background"
  >
    <div class="emblem-container relative flex items-center justify-center">
      <img
        :src="selectedEmblem"
        class="relative w-[350px] h-[200px] emblem-img rotate-animation"
        alt="엠블럼"
      />
    </div>
  </div>
</template>

<style scoped>
.emblem-container {
  transform-origin: center;
  position: relative;
  width: 350px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.emblem-container::before {
  content: "";
  position: absolute;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8),
    0 0 30px 20px rgba(0, 190, 255, 0.6); /* 더 밝은 빛 */
  filter: blur(10px);
  animation: pulse-ring 1.5s ease-in-out infinite; /* 링 애니메이션 */
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

@keyframes glass-shine {
  0% {
    filter: brightness(0.6);
  }
  50% {
    filter: brightness(1.8);
  }
  100% {
    filter: brightness(0.6);
  }
}

.emblem-img {
  animation: glass-shine 0.8s ease-in-out infinite;
  filter: brightness(1);
}

@keyframes glow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.overlay-background {
  background-color: rgba(0, 0, 0, 0.75);
  background-image: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0.5)
  );
}
</style>
