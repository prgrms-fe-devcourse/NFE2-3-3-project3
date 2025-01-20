import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        //팀컬러
        orange: {
          1: "#F1A140", // Orange-1
          2: "#F6C085", // Orange-2
          3: "#FBE1C0", // Orange-3
        },
        //배경색
        beige: {
          1: "#F7F3E9", // Beige-1,
          2: "#FAF8F1", // Beige-2
        },
      },
      //폰트 추가
      fontFamily: {
        //기본
        pretend: ["Pretendard", ...defaultTheme.fontFamily.sans],
        //제목
        laundry: ["LaundryGothic", "sans-serif"],
      },
    },
  },
  corePlugins: {
    preflight: false, // Tailwind CSS의 기본 리셋(preflight)을 비활성화
  },
};
