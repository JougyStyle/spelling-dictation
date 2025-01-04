import { useState, useEffect  } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Volume2, Check, Eye, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CorrectWordOverlay from './correct-word-overlay';
import Confetti from './confetti';

interface WordStatus {
  revealed: boolean;
  firstTry: boolean;
}

interface PracticeResult {
  date: string;
  score: number;
  listId: number;
  listName: string;
}

interface PracticeViewProps {
  list: {
    id: number;
    name: string;
    words: string[];
  };
  onReturn: () => void;
  onShowStats: () => void;  // Add this prop to the interface
}

const PracticeView: React.FC<PracticeViewProps> = ({ list, onReturn, onShowStats }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [correctWordDisplay, setCorrectWordDisplay] = useState<string | null>(null);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>(
    list.words.map(() => ({ revealed: false, firstTry: true }))
  );
  const [practiceHistory, setPracticeHistory] = useState<PracticeResult[]>(() => {
    const saved = localStorage.getItem('practiceHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showResults, setShowResults] = useState(false);
  const animationDuration: number = 4000;

  useEffect(() => {
    localStorage.setItem('practiceHistory', JSON.stringify(practiceHistory));
  }, [practiceHistory]);

  const playSound = (type = 'success') => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'perfect') {
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
    } else {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
    }
    
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  const saveScore = () => {
    const correctFirstTry = wordStatuses.filter(status => status.firstTry).length;
    const score = Math.round((correctFirstTry / list.words.length) * 100);
    
    const result: PracticeResult = {
      date: new Date().toLocaleDateString('fr-FR'),
      score,
      listId: list.id,
      listName: list.name
    };

    setPracticeHistory(prev => [...prev, result]);
    return score;
  };

  const showAnswer = () => {
    const currentWord = list.words[currentWordIndex];
    const newStatuses = [...wordStatuses];
    newStatuses[currentWordIndex].revealed = true;
    newStatuses[currentWordIndex].firstTry = false;
    setWordStatuses(newStatuses);
    setFeedback(`Le mot était : ${currentWord}`);
    setUserInput(currentWord);
    setIsCorrect(false);
  };

  const handleSubmit = () => {
    const currentWord = list.words[currentWordIndex];
    const correct: boolean = userInput.toLowerCase().trim() === currentWord.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].revealed = true;
      setWordStatuses(newStatuses);
      setFeedback('Bravo ! C\'est la bonne orthographe !');
      
      const isLastWord = currentWordIndex === list.words.length - 1;
      
      if (wordStatuses[currentWordIndex].firstTry) {
        setShowCelebration(true);
        playSound('perfect');
        setCorrectWordDisplay(list.words[currentWordIndex]);
        
        if (isLastWord) {
          const score = saveScore();
          if (wordStatuses.every(status => status.firstTry)) {
            // Sans faute ! Célébration spéciale
            setFeedback('🎉 Incroyable ! Un sans-faute ! 🎉');
            setTimeout(() => {
              setShowCelebration(false);
              setShowResults(true);
            }, animationDuration);
          }
        }
        
        setTimeout(() => {
          setShowCelebration(false);
          setCorrectWordDisplay(null);
        }, animationDuration);
      } else {
        playSound('success');
        if (isLastWord) {
          saveScore();
          setShowResults(true);
        }
      }
      
      if (!isLastWord) {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
          setUserInput('');
          setFeedback('');
          setIsCorrect(null);
        }, animationDuration);
      }
    } else {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].firstTry = false;
      setWordStatuses(newStatuses);
      setFeedback('Pas tout à fait... Essaie encore !');
    }
  };

  const nextWord = () => {
    if (currentWordIndex < list.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserInput('');
      setFeedback('');
      setIsCorrect(null);
    }
  };

  const renderResults = () => {
    const listResults = practiceHistory
      .filter(result => result.listId === list.id)
      .slice(-10);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Ton progrès</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={listResults}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onReturn}
            className="flex-1"
          >
            Retour au menu
          </Button>
          <Button
            onClick={onShowStats}
            className="flex-1"
          >
            Voir les statistiques
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {correctWordDisplay && <CorrectWordOverlay word={correctWordDisplay} />}
        {showCelebration && (
          <Confetti 
            intensity={wordStatuses.every(status => status.firstTry) && 
                      currentWordIndex === list.words.length - 1 ? 'high' : 'normal'} 
          />
        )}
      </AnimatePresence>
      {showResults ? (
        renderResults()
      ) : (
        <>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {list.words.map((word, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded ${
                  wordStatuses[index].revealed
                    ? wordStatuses[index].firstTry
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-200'
                }`}
              >
                {wordStatuses[index].revealed ? word : '•'.repeat(word.length)}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button onClick={() => speak(list.words[currentWordIndex])}>
              <Volume2 className="mr-2" />
              Écouter le mot
            </Button>
          </div>

          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Écris le mot ici..."
            className="text-lg text-center"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={!userInput.trim()}
            >
              <Check className="mr-2" />
              Vérifier
            </Button>

            <Button
              variant="outline"
              onClick={showAnswer}
              className="flex-1"
            >
              <Eye className="mr-2" />
              Voir la réponse
            </Button>
          </div>

          {feedback && (
            <Alert className={isCorrect ? "bg-green-50" : "bg-red-50"}>
              <AlertTitle>{feedback}</AlertTitle>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onReturn}
              className="flex-1"
            >
              <ArrowLeft className="mr-2" />
              Menu
            </Button>

            {wordStatuses[currentWordIndex].revealed && currentWordIndex < list.words.length - 1 && (
              <Button
                onClick={nextWord}
                className="flex-1"
              >
                Mot suivant
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PracticeView;