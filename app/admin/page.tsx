"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz } from "@/lib/quiz";
import { toast } from "sonner";

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('퀴즈를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, formData);
        toast.success('퀴즈가 수정되었습니다.');
      } else {
        await addQuiz(formData);
        toast.success('퀴즈가 추가되었습니다.');
      }
      setFormData({
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
      });
      setEditingQuiz(null);
      loadQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('퀴즈 저장에 실패했습니다.');
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      question: quiz.question,
      options: quiz.options,
      correct_answer: quiz.correct_answer,
      explanation: quiz.explanation,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) return;
    
    try {
      await deleteQuiz(id);
      toast.success('퀴즈가 삭제되었습니다.');
      loadQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('퀴즈 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">로딩 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">퀴즈 관리</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingQuiz ? '퀴즈 수정' : '새 퀴즈 추가'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">문제</label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">보기</label>
              {formData.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                  placeholder={`보기 ${index + 1}`}
                  required
                />
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">정답</label>
              <select
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              >
                {formData.options.map((_, index) => (
                  <option key={index} value={index}>
                    보기 {index + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                {editingQuiz ? '수정하기' : '추가하기'}
              </Button>
              {editingQuiz && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingQuiz(null);
                    setFormData({
                      question: "",
                      options: ["", "", "", ""],
                      correct_answer: 0,
                      explanation: "",
                    });
                  }}
                >
                  취소
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">{quiz.question}</h3>
                  <div className="text-sm text-gray-500">
                    정답: {quiz.options[quiz.correct_answer]}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(quiz)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 