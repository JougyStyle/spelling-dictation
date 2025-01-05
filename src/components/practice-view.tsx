import { useState, useEffect  } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Volume2, Check, Eye, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import CorrectWordOverlay from './correct-word-overlay';
import Confetti from './confetti';


interface WordResult {
  word: string;
  correct: boolean;
  attempts: string[];
}

interface PracticeResult {
  date: string;
  score: number;
  listId: number;
  listName: string;
  wordResults: WordResult[];
  totalAttempts: number;
}

interface PracticeViewProps {
  list: {
    id: number;
    name: string;
    words: string[];
  };
  onReturn: () => void;
  onSaveResult: (result: PracticeResult) => void;
  practiceHistory: PracticeResult[];
}

const PracticeView: React.FC<PracticeViewProps> =({ 
  list, 
  onReturn, 
  onSaveResult,
  practiceHistory 
})  => {
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [correctWordDisplay, setCorrectWordDisplay] = useState<string | null>(null);
  const [wordStatuses, setWordStatuses] = useState<{
    revealed: boolean;
    firstTry: boolean;
    attempts: string[];
  }[]>(
    list.words.map(() => ({ 
      revealed: false, 
      firstTry: true,
      attempts: []
    }))
  );

  const animationDuration: number = 4000;
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const listHistory = practiceHistory
    .filter(result => result.listId === list.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    const startNewSession = () => {
      setIsActiveSession(true);
      setHistoryIndex(null);
      setCurrentWordIndex(0);
      setUserInput('');
      setFeedback('');
      setIsCorrect(null);
      setWordStatuses(list.words.map(() => ({
        revealed: false,
        firstTry: true,
        attempts: []
      })));
    };

  const navigateHistory = (direction: 'prev' | 'next') => {
    if (!listHistory.length) return;
    
    if (direction === 'prev') {
      if (historyIndex === null) {
        setHistoryIndex(0);
      } else if (historyIndex < listHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
      }
    } else if (direction === 'next') {
      if (historyIndex !== null && historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
      } else if (historyIndex === 0) {
        setHistoryIndex(null);
      }
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentPracticeInfo = () => {
    if (isActiveSession) return "Session en cours";
    if (historyIndex === null) return "Choisir une session";
    return formatDateTime(listHistory[historyIndex].date);
  };

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
    
    const wordResults = list.words.map((word, index) => ({
      word,
      correct: wordStatuses[index].firstTry,
      attempts: wordStatuses[index].attempts
    }));
  
    const totalAttempts = wordStatuses.reduce(
      (sum, status) => sum + status.attempts.length, 
      0
    );
  
    const result: PracticeResult = {
      date: new Date().toISOString(),
      score,
      listId: list.id,
      listName: list.name,
      wordResults,
      totalAttempts
    };
  
    onSaveResult(result);
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
    const correct = userInput.toLowerCase().trim() === currentWord.toLowerCase();
    setIsCorrect(correct);

    const newStatuses = [...wordStatuses];
    newStatuses[currentWordIndex].attempts.push(userInput.trim());
    
        const isLastWord = currentWordIndex === list.words.length - 1;

    if (correct) {
      newStatuses[currentWordIndex].revealed = true;
      setWordStatuses(newStatuses);
      setFeedback('Bravo ! C\'est la bonne orthographe !');
      if (wordStatuses[currentWordIndex].firstTry) {
        setShowCelebration(true);
        playSound('perfect');
        setCorrectWordDisplay(list.words[currentWordIndex]);
        setTimeout(() => {
          setShowCelebration(false);
          setCorrectWordDisplay(null);
        }, animationDuration);
      } else {
        playSound('success');
        if (isLastWord) {
          saveScore();
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

    if (isLastWord) {
      // Sauvegarde des résultats
      const wordResults: WordResult[] = list.words.map((word, index) => ({
        word,
        correct: wordStatuses[index].firstTry,
        attempts: wordStatuses[index].attempts
      }));

      const totalAttempts = wordStatuses.reduce(
        (sum, status) => sum + status.attempts.length, 
        0
      );

      const correctFirstTry = wordStatuses.filter(status => status.firstTry).length;
      const score = Math.round((correctFirstTry / list.words.length) * 100);

      const result: PracticeResult = {
        date: new Date().toISOString(),
        score,
        listId: list.id,
        listName: list.name,
        wordResults,
        totalAttempts
      };
      console.log("isLastWord", result);
      onSaveResult(result);
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

  const renderWordList = () => {
    if (historyIndex === null) {
      if (!isActiveSession) {
        // Affichage initial des mots masqués
        return list.words.map((word, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded bg-gray-200"
          >
            {'•'.repeat(word.length)}
          </span>
        ));
      }
      // Session active - affichage normal avec les statuts
      return list.words.map((word, index) => (
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
      ));
    }

    // Affichage d'une session historique
    const historicalResults = listHistory[historyIndex].wordResults;
    return list.words.map((word, index) => {
      const result = historicalResults.find(r => r.word === word);
      return (
        <span
          key={index}
          className={`px-2 py-1 rounded ${
            result?.correct
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {word}
        </span>
      );
    });
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
      
      {!isActiveSession && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigateHistory('prev')}
            disabled={historyIndex === listHistory.length - 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          
          <span className="font-medium">{getCurrentPracticeInfo()}</span>
          
          <Button
            variant="outline"
            onClick={() => navigateHistory('next')}
            disabled={historyIndex === null}
          >
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {renderWordList()}
      </div>
      

      {historyIndex !== null && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Détails de la session :</h3>
          <div className="text-sm">
            <p>Score total : {listHistory[historyIndex].score}%</p>
            <p>Nombre total d'essais : {listHistory[historyIndex].totalAttempts}</p>
          </div>
        </div>
      )}

      {!isActiveSession && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onReturn}
            className="flex-1"
          >
            <ArrowLeft className="mr-2" />
            Menu
          </Button>
          <Button onClick={startNewSession} className="px-8">
            <Play className="mr-2 h-4 w-4" />
            {historyIndex === null ? 'Commencer la dictée' : 'Nouvelle session'}
          </Button>
        </div>
      )}

      {isActiveSession && (
        <>
          {/* Interface de pratique active */}
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