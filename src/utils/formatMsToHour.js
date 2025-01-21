export const formatMsToHourMinute = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60)); // 1시간 = 1000ms * 60초 * 60분
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)); // 나머지 ms에서 분 계산

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else {
    return `${minutes}분`;
  }
};
