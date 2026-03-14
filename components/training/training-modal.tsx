'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
}

interface Training {
  id: string;
  title: string;
  description: string;
  duration: number;
  points: number;
  tags: string[];
  difficulty: string;
  progress: number;
  thumbnail: string;
  content: string;
  quiz: Quiz[];
}

interface TrainingModalProps {
  training: Training | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrainingModal({ training, isOpen, onClose }: TrainingModalProps) {
  const t = useTranslations('Training');
  const tModal = useTranslations('Training.Modal');
  const tDiff = useTranslations('Training.Difficulty');
  const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'result'>('content');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { user, setUser } = useAppStore();
  const { toast } = useToast();

  if (!training) return null;

  const resetModal = () => {
    setCurrentStep('content');
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const startQuiz = () => {
    setCurrentStep('quiz');
    setSelectedAnswers(new Array(training.quiz.length).fill(-1));
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < training.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    training.quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / training.quiz.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    setCurrentStep('result');

    // Se passou (70% ou mais), adiciona pontos
    if (finalScore >= 70 && user) {
      const updatedUser = {
        ...user,
        score: {
          ...user.score,
          total: user.score.total + training.points
        }
      };
      setUser(updatedUser);

      toast({
        title: tModal('toastSuccessTitle'),
        description: tModal('toastSuccessDesc', { points: training.points }),
      });
    }
  };

  const difficultyColors = {
    'básico': 'bg-green-100 text-green-800',
    'intermediário': 'bg-yellow-100 text-yellow-800',
    'avançado': 'bg-red-100 text-red-800'
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'básico': return tDiff('basic');
      case 'intermediário': return tDiff('intermediate');
      case 'avançado': return tDiff('advanced');
      default: return difficulty;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-primary" />
            {training.title}
          </DialogTitle>
          <DialogDescription>
            {training.description}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'content' && (
          <div className="space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={training.thumbnail}
                alt={training.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('duration', { duration: training.duration })}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {t('points', { points: training.points })}
              </div>
              <Badge className={difficultyColors[training.difficulty as keyof typeof difficultyColors]}>
                {getDifficultyLabel(training.difficulty)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {training.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="prose prose-sm max-w-none">
              <p>{training.content}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                {tModal('cancelBtn')}
              </Button>
              <Button onClick={startQuiz} className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
                {tModal('startQuizBtn', { count: training.quiz.length })}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {tModal('questionHeader', { current: currentQuestion + 1, total: training.quiz.length })}
              </h3>
              <Progress 
                value={((currentQuestion + 1) / training.quiz.length) * 100} 
                className="w-32"
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <h4 className="text-base font-medium mb-4">
                  {training.quiz[currentQuestion].question}
                </h4>

                <div className="space-y-3">
                  {training.quiz[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto p-4 ${
                        selectedAnswers[currentQuestion] === index 
                          ? 'bg-brand-primary hover:bg-brand-primary/90' 
                          : ''
                      }`}
                      onClick={() => selectAnswer(index)}
                    >
                      <span className="mr-3 font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                {tModal('previousBtn')}
              </Button>
              
              <div className="flex-1" />
              
              {currentQuestion < training.quiz.length - 1 ? (
                <Button
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion] === -1}
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  {tModal('nextBtn')}
                </Button>
              ) : (
                <Button
                  onClick={finishQuiz}
                  disabled={selectedAnswers[currentQuestion] === -1}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {tModal('finishBtn')}
                </Button>
              )}
            </div>
          </div>
        )}

        {currentStep === 'result' && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              {score >= 70 ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                {score >= 70 ? tModal('resultTitleSuccess') : tModal('resultTitleFail')}
              </h3>
              <p className="text-lg text-muted-foreground">
                {tModal('resultMessage', { score })}
              </p>
            </div>

            {score >= 70 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {tModal('trainingCompletedMsg')}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  {tModal('earnedPointsMsg', { points: training.points })}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  {tModal('minScoreMsg')}
                </p>
                <p className="text-red-700 text-sm mt-1">
                  {tModal('reviewContentMsg')}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {score < 70 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep('content');
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                  }}
                  className="flex-1"
                >
                  {tModal('reviewBtn')}
                </Button>
              )}
              <Button
                onClick={handleClose}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
              >
                {tModal('doneBtn')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}