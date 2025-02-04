// 랜덤 문제 추출 함수
export function getRandomQuestions(questions, count) {
  // 모든 id 추출
  const ids = questions.map((q) => q.id);

  // id를 랜덤하게 섞어서 필요한 개수만큼 선택
  const randomIds = ids.sort(() => Math.random() - 0.5).slice(0, count);

  // 선택된 id에 해당하는 문제 필터링
  return questions.filter((q) => randomIds.includes(q.id));
}
