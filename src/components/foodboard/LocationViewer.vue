<script setup>
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import LocationIcon from "@/assets/icons/location_icon.svg";

const props = defineProps({
  postLocation: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <section class="w-full h-[374px] bg-white02 border border-white02">
    <KakaoMap
      width="100%"
      height="300"
      :lat="props.postLocation.latitude"
      :lng="props.postLocation.longitude"
      :draggable="false"
      :scrollwheel="false"
      @onLoadKakaoMap="onLoadKakaoMap"
    >
      <KakaoMapMarker
        :lat="props.postLocation.latitude"
        :lng="props.postLocation.longitude"
      />
    </KakaoMap>
    <div class="w-full h-[72px] flex items-center bg-white01 px-5">
      <div class="flex flex-1 items-center">
        <img
          :src="LocationIcon"
          alt="위치 아이콘 상세 정보로 이동"
          class="h-30"
        />
        <div class="flex-col ml-[15px]">
          <p class="text-black01 font-semibold text-[18px]">
            {{ props.postLocation.name }}
          </p>
          <p class="text-gray02 text-[14px]">
            {{ props.postLocation.address }}
          </p>
        </div>
      </div>

      <a :href="props.postLocation.url" class="text-gray02 hover:text-black02"
        >상세 정보 바로가기</a
      >
    </div>
  </section>
</template>

<style scoped></style>
