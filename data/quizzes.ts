import { Quiz } from "@/types/quiz";

export const quizzes: Quiz[] = [
  {
    id: "1",
    question: "다음 중 JavaScript의 기본 데이터 타입이 아닌 것은?",
    options: ["String", "Boolean", "Integer", "Object"],
    correct_answer: 2,
    explanation: "JavaScript의 기본 데이터 타입은 String, Number, Boolean, Null, Undefined, Symbol, BigInt입니다. Integer는 JavaScript에 존재하지 않는 타입입니다.",
    available_date: new Date().toISOString().split('T')[0],
    is_active: true
  },
  {
    id: "2",
    question: "React에서 컴포넌트의 상태를 관리하기 위해 사용하는 Hook은?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct_answer: 0,
    explanation: "useState는 React에서 컴포넌트의 상태를 관리하기 위한 가장 기본적인 Hook입니다.",
    available_date: new Date().toISOString().split('T')[0],
    is_active: true
  },
  {
    id: "3",
    question: "다음 중 TypeScript의 타입이 아닌 것은?",
    options: ["number", "string", "boolean", "integer"],
    correct_answer: 3,
    explanation: "TypeScript의 기본 타입은 number, string, boolean, null, undefined, void, never 등이 있습니다. integer는 TypeScript의 타입이 아닙니다.",
    available_date: new Date().toISOString().split('T')[0],
    is_active: true
  },
  {
    id: "4",
    question: "Next.js에서 페이지를 생성하는 방법이 아닌 것은?",
    options: ["pages 디렉토리", "app 디렉토리", "components 디렉토리", "src/pages 디렉토리"],
    correct_answer: 2,
    explanation: "Next.js에서 페이지를 생성하는 방법은 pages 디렉토리, app 디렉토리, src/pages 디렉토리를 사용합니다. components 디렉토리는 재사용 가능한 컴포넌트를 저장하는 곳입니다.",
    available_date: new Date().toISOString().split('T')[0],
    is_active: true
  },
  {
    id: "5",
    question: "다음 중 CSS-in-JS 라이브러리가 아닌 것은?",
    options: ["styled-components", "emotion", "tailwindcss", "jss"],
    correct_answer: 2,
    explanation: "tailwindcss는 CSS-in-JS 라이브러리가 아닌 유틸리티 기반의 CSS 프레임워크입니다.",
    available_date: new Date().toISOString().split('T')[0],
    is_active: true
  }
]; 