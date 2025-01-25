/**
 * 날짜를 한국 날짜 + 오전 / 오후로 표시
 * @param {string | Date} date - 포맷팅할 날짜
 * @returns {string} 형식: "YYYY. MM. DD HH:mm"
 */
export const formatToKoreanDateTime = (date) => {
  if (!date) return "";
  
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};