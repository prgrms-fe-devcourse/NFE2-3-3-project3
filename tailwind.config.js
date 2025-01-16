module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Tailwind CSS의 기본 리셋(preflight)을 비활성화
  },
};
