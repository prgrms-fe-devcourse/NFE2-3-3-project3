module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          1: "#F1A140", // Orange-1
          2: "#F6C085", // Orange-2
          3: "#FBE1C0", // Orange-3
        },
        beige: {
          1: "#F7F3E9", // Beige-1
          2: "#FAF8F1", // Beige-2
        },
      },
      fontFamily: {
        pretend: ["Pretendard", ...defaultTheme.fontFamily.sans], // Pretendard 추가
        laundry: ["LaundryGothic", "sans-serif"], // LaundryGothic 추가
      },
    },
  },
  corePlugins: {
    preflight: false, // Tailwind CSS의 기본 리셋(preflight)을 비활성화
  },
};
