<script setup>
const logoPath = new URL("@/assets/logos/logo.svg", import.meta.url).href;
</script>
<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- 랜딩 페이지 상단 -->
    <header class="bg-beige-2 h-[64px]">
      <div
        class="w-full max-w-[1440px] mx-auto flex justify-between items-center px-4"
      >
        <RouterLink to="/home">
          <img :src="logoPath" alt="Pullgo" class="w-auto h-auto" />
        </RouterLink>
        <nav class="flex gap-4">
          <button
            class="text-white bg-orange-1 border-none text-sm rounded-[4px] px-4 py-2.5 font-sans hover:bg-orange-2"
          >
            로그인
          </button>
          <button
            class="bg-orange-1 border-none text-white text-sm px-4 py-2.5 rounded-[4px] hover:bg-orange-2 font-pretend"
          >
            회원가입
          </button>
        </nav>
      </div>
    </header>

    <!-- 랜딩 페이지 메인 섹션 -->
    <main class="flex-1 bg-white py-16">
      <div class="w-full max-w-[1440px] mx-auto text-center px-4">
        <h2 class="text-[56px] font-laundry mb-4">풀고에서 풀고 또 풀자!</h2>
        <p
          class="text-black text-lg max-w-3xl mx-auto font-pretend text-[20px]"
        >
          혹시 아직까지 워드로 문제를 만들고 계신가요? "풀고"에서는 문제
          제작부터 공유까지, 여러 플랫폼을 돌아다닐 필요 없이 한 번에 해결할 수
          있습니다. 지금까지 푼 문제들을 모아서 편하게 확인하고, 친구들과 함께
          시험도 만들어 보세요!
        </p>
        <button
          class="mt-8 rounded-[10px] bg-orange-1 text-white px-8 py-4 text-lg hover:bg-orange-2 border-none w-[321px] h-[56px] text-[24px] font-pretend"
        >
          문제 풀러 가기
        </button>

        <!-- 메인 콘텐츠 미리보기 섹션 & 이미지로 대체 예정 -->
        <section class="bg-white mt-16">
          <div
            class="bg-white rounded-3xl p-12 w-full max-w-[1440px] mx-auto flex flex-col px-[100px]"
          >
            <!-- 상단 헤더 -->
            <h1
              class="text-[2.5rem] lg:text-[2.5rem] font-laundry mb-8 text-left"
            >
              안효태님, 다시 만나 반가워요!
            </h1>

            <!-- 프로필 및 등급 카드 -->
            <div
              class="grid grid-cols-[300px_1fr] gap-8 mb-12 w-full items-stretch"
            >
              <!-- 프로필 카드 -->
              <div
                class="bg-beige-2 shadow rounded-lg p-6 flex flex-col items-center justify-center space-y-4"
              >
                <img
                  src="@/assets/harp seal.jpg"
                  alt="Avatar"
                  class="w-[120px] h-[120px] rounded-full object-cover mb-4"
                />
                <div class="text-center font-pretend">
                  <p class="text-[1.5rem] lg:text-lg font-bold">안효태님</p>
                  <p class="text-gray-600 text-[1rem] lg:text-sm">
                    example@gmail.com
                  </p>
                </div>
              </div>

              <!-- 등급 카드 -->
              <div
                class="bg-beige-2 shadow rounded-lg p-6 flex flex-col justify-center space-y-4 font-pretend"
              >
                <p class="text-gray-700 text-[1.2rem] lg:text-base">
                  현재 등급은 <span class="font-bold">"초급"</span>
                </p>
                <p class="text-gray-700 mt-2 text-[1rem] lg:text-sm">
                  시험장 2개 참여<br />문제집 10개 생성
                </p>
                <p class="text-gray-700 mt-2 text-[1rem] lg:text-sm">
                  중급까지 500포인트 남았습니다.
                </p>
              </div>
            </div>

            <!-- 하단 카드 섹션 -->
            <section>
              <h2
                class="text-[1.5rem] lg:text-lg font-bold mb-6 text-left font-pretend"
              >
                공부하러 가기
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
                <!-- 카드 1 -->
                <div
                  class="bg-beige-2 shadow rounded-lg p-6 flex flex-col justify-between aspect-[270/261] font-pretend"
                >
                  <h3 class="font-bold mb-4 text-[1.2rem] lg:text-base">
                    문제 생성하기
                  </h3>
                  <p class="text-gray-600 text-[1rem] lg:text-sm">
                    새로운 문제를 만들고, 문제집에 추가하세요.
                  </p>
                </div>

                <!-- 카드 2 -->
                <div
                  class="bg-beige-2 shadow rounded-lg p-6 flex flex-col justify-between aspect-[270/261] font-pretend"
                >
                  <h3 class="font-bold mb-4 text-[1.2rem] lg:text-base">
                    시험장 입실
                  </h3>
                  <p class="text-gray-600 text-[1rem] lg:text-sm">
                    친구들과 함께 시험을 보고 결과를 공유하세요.
                  </p>
                </div>

                <!-- 카드 3 -->
                <div
                  class="bg-beige-2 shadow rounded-lg p-6 flex flex-col justify-between aspect-[270/261] font-pretend"
                >
                  <h3 class="font-bold mb-4 text-[1.2rem] lg:text-base">
                    다시 볼 문제
                  </h3>
                  <p class="text-gray-600 text-[1rem] lg:text-sm">
                    틀렸거나, 다시 보고 싶은 문제를 다시 한번 공부해보세요.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
