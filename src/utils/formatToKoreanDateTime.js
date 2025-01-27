export const formatToKoreanDateTime = (dateString) => {
  if (!dateString) return "";
  
  try {
    // ISO 문자열에서 시간 부분을 직접 추출
    const matches = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!matches) return "";
    
    const [_, year, month, day, hours, minutes] = matches;
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return "";
  }
};