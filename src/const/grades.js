import Grade1 from "@/assets/grade-images/grade-1.png";
import Grade2 from "@/assets/grade-images/grade-2.png";
import Grade3 from "@/assets/grade-images/grade-3.png";

export const GRADES = {
  one: {
    name: "초보",
    point: 0,
    examLimit: 2,
    problemSetLimit: 10,
    imgSrc: Grade1,
  },
  two: {
    name: "중수",
    point: 500,
    examLimit: 6,
    problemSetLimit: 25,
    imgSrc: Grade2,
  },
  three: {
    name: "고수",
    point: 5000,
    examLimit: 10,
    problemSetLimit: 30,
    imgSrc: Grade3,
  },
};
