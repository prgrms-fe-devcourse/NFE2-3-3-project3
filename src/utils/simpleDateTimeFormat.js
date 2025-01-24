export const simpleDateTimeFormat = (date, pattern) => {
  const dateString = pattern.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, function (match) {
    let matchString = 0;

    switch (match) {
      case "yyyy":
        matchString = date.getFullYear();
        break;
      case "MM":
        matchString = date.getMonth() + 1;
        break;
      case "dd":
        matchString = date.getDate();
        break;
      case "HH":
        matchString = date.getHours();
        break;
      case "mm":
        matchString = date.getMinutes();
        break;
      case "ss":
        matchString = date.getSeconds();
        break;
      case "SSS":
        matchString = date.getMilliseconds();
        break;
      default:
        return match;
    }

    if (match === "SSS") {
      return matchString < 10 ? `00${matchString}` : matchString < 100 ? `0${matchString}` : matchString.toString();
    }

    return matchString < 10 ? `0${matchString}` : matchString.toString(); // 두 자리 수로 반환
  });

  return dateString;
};