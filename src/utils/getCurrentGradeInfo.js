import { GRADES } from "@/const/grades";

export const getCurrentGradeInfo = (currentPoint) => {
  if (currentPoint < GRADES.two.point) {
    return {
      current: GRADES.one,
      next: GRADES.two,
    };
  } else if (currentPoint < GRADES.three.point) {
    return {
      current: GRADES.two,
      next: GRADES.three,
    };
  } else {
    return {
      current: GRADES.three,
      next: null,
    };
  }
};
