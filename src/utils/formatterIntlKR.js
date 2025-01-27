export const formatterIntlKR = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

// 사용 예시
// formatterIntlKR.format(new Date(props.start_date))