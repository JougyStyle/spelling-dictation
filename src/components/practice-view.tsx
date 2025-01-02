import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Volume2, Check } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import CorrectWordOverlay from './correct-word-overlay';
import Confetti from './confetti';

const PracticeView = ({ list, onReturn }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [correctWordDisplay, setCorrectWordDisplay] = useState(null);
  const [wordStatuses, setWordStatuses] = useState(
    list.words.map(() => ({ revealed: false, firstTry: true }))
  );

  const playSound = (type = 'success') => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    const correct = userInput.toLowerCase().trim() === list.words[currentWordIndex].toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].revealed = true;
      
      if (wordStatuses[currentWordIndex].firstTry) {
        setShowCelebration(true);
        playSound('perfect');
        setCorrectWordDisplay(list.words[currentWordIndex]);
        setTimeout(() => {
          setShowCelebration(false);
          setCorrectWordDisplay(null);
        }, 5000);
      } else {
        playSound('success');
      }
      
      setWordStatuses(newStatuses);
      setFeedback('Bravo ! C\'est la bonne orthographe !');
      
      if (currentWordIndex < list.words.length - 1) {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
          setUserInput('');
          setFeedback('');
          setIsCorrect(null);
        }, 2000);
      } else {
        setFeedback('Félicitations ! Tu as terminé tous les mots !');
      }
    } else {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].firstTry = false;
      setWordStatuses(newStatuses);
      setFeedback('Pas tout à fait... Essaie encore !');
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {correctWordDisplay && <CorrectWordOverlay word={correctWordDisplay} />}
        {showCelebration && <Confetti />}
      </AnimatePresence>

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

      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={!userInput.trim()}
      >
        <Check className="mr-2" />
        Vérifier
      </Button>

      {feedback && (
        <Alert className={isCorrect ? "bg-green-50" : "bg-red-50"}>
          <AlertTitle>{feedback}</AlertTitle>
        </Alert>
      )}

      <Button
        variant="outline"
        onClick={onReturn}
        className="w-full"
      >
        Retour au menu
      </Button>
    </div>
  );
};

export default PracticeView;
