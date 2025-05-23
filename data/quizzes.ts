import { Quiz } from "@/types/quiz";

export const quizzes: Quiz[] = [
  {
    id: "1",
    question: "다음 중 JavaScript의 기본 데이터 타입이 아닌 것은?",
    options: ["String", "Boolean", "Integer", "Object"],
    correct_answer: 2,
    explanation: "JavaScript의 기본 데이터 타입은 String, Number, Boolean, Undefined, Null, Symbol, BigInt입니다. Integer는 별도의 타입이 아닙니다."
  },
  {
    id: "2",
    question: "React에서 컴포넌트의 상태를 관리하기 위해 사용하는 Hook은?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct_answer: 0,
    explanation: "useState는 React에서 컴포넌트의 상태를 관리하기 위한 가장 기본적인 Hook입니다."
  },
  {
    id: "3",
    question: "다음 중 CSS-in-JS 라이브러리가 아닌 것은?",
    options: ["Styled-components", "Emotion", "Sass", "CSS Modules"],
    correct_answer: 2,
    explanation: "Sass는 CSS 전처리기(preprocessor)이며, CSS-in-JS 라이브러리가 아닙니다."
  }
]; 