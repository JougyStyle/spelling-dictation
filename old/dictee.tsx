import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Volume2, RotateCw, Plus, Book, Check, X, Edit2, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DicteeApp = () => {
  const [view, setView] = useState('menu'); // 'menu', 'practice', 'edit'
  const [wordLists, setWordLists] = useState([
    { id: 5, name: 'Dictée 5', words: [
        'Irlande',
        'fille',
        'père',
        'jour',
        'loup',
        'louve',
        'chasseur',
        'forêt',
        'nuit',
        'différence',
        'fillette',
        'animal',
        'animaux',
        'un ami',
        'une amie',
        'la mère',
        'humain',
        'abri',
        'nature',
        'vivre',
        'rencontrer',
        'petit',
        'petite',
        'en',
        'qui'
    ] },
    { id: 6, name: 'Dictée 6', words: [
        'Sénégal',
        'métier',
        'connaissance',
        'le corps',
        'des yeux',
        'un guerrier',
        'une guerrière',
        'mètre',
        'matière',
        'teinte',
        'beige',
        'brun',
        'peau',
        'tête',
        'gardien',
        'donner',
        'sculpter',
        'atteindre',
        'rappeler',
        'baisser',
        'ancien',
        'ancienne',
        'humain',
        'parfait',
        'fermé',
        'droit',
        'droite',
        'éreinté',
        'très',
        'bien',
        'dont',
        'mais',
        'comme'
    ] },
    { id: 7, name: 'Dictée 7', words: [
        'Afrique',
        'Mali',
        'cité',
        'terre',
        'maçon',
        'année',
        'équipe',
        'façade',
        'bâtiment',
        'passage',
        'commerçant',
        'lieu',
        'tolérance',
        'menacer',
        'abriter',
        'incroyable',
        'célèbre',
        'ancien',
        'ancienne',
        'précieux',
        'précieuse',
        'voici',
        'chaque',
        'presque',
        'ici',
        'pour'
    ] },
    { id: 8, name: 'Dictée 8', words: [
        'la Côte d\'Ivoire',
        'fille',
        'bande dessinée',
        'les parents',
        'frère',
        'singe',
        'temps',
        'fillette',
        'bêtise',
        'peur',
        'caractère',
        'enfance',
        'auteur',
        'autrice',
        'raconter',
        'habiter',
        'se disputer',
        'adorer',
        'petit',
        'drôle',
        'en',
        'avec',
        'tout',
        'rien',
        'vie'
    ] },
    { id: 9, name: 'Dictée 9', words: [
        'Egypte',
        'dieu',
        'mort',
        'voyage',
        'vie',
        'seuil',
        'corps',
        'tombe',
        'objet',
        'réveil',
        'abriter',
        'penser',
        'montrer',
        'trouver',
        'pareil',
        'éternel',
        'personnel',
        'vers',
        'toujours',
        'afin que',
        'dès'
    ] },{ id: 10, name: 'Dictée 10', words: [
        'Afrique du Sud',
        'chanson',
        'voix',
        'planète',
        'chanteur',
        'chanteuse',
        'pays',
        'loi',
        'époque',
        'engagement',
        'exil',
        'résonner',
        'dénoncer',
        'exister',
        'conduire',
        'surnommé',
        'entier',
        'entière',
        'raciste',
        'politique',
        'grâce à',
        'à travers de',
        'dans',
        'malheureusement'
    ] }
  ]);
  const [selectedList, setSelectedList] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newWord, setNewWord] = useState('');
  const [tempWordList, setTempWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Nouveau système de sons
  const playSuccessSound = () => {
    const audio = new Audio();
    // Son court et aigu pour la réussite immédiate
    const successOscillator = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = successOscillator.createOscillator();
    const gainNode = successOscillator.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(successOscillator.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, successOscillator.currentTime); // Note La (A5)
    gainNode.gain.setValueAtTime(0.7, successOscillator.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, successOscillator.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(successOscillator.currentTime + 0.5);
  };

  const playPerfectSound = () => {
    const perfectOscillator = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = perfectOscillator.createOscillator();
    const gainNode = perfectOscillator.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(perfectOscillator.destination);
    
    // Jouer une petite mélodie
    oscillator.type = 'sine';
    const now = perfectOscillator.currentTime;
    
    // Première note
    oscillator.frequency.setValueAtTime(523.25, now); // Do
    gainNode.gain.setValueAtTime(0.7, now);
    
    // Deuxième note
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // Mi
    
    // Troisième note
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // Sol
    
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.start();
    oscillator.stop(now + 0.5);
  };

  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * 100;
      const animationDuration = 0.5 + Math.random() * 0.5;
      const delay = Math.random() * 0.2;
      stars.push(
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            left: `${left}%`,
            top: '50%',
            animation: `star ${animationDuration}s ease-out ${delay}s`,
            opacity: 0,
          }}
        />
      );
    }
    return stars;
  };

  // Styles CSS pour l'animation des étoiles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes star {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translate(-50%, calc(-50% + ${Math.random() * 200 - 100}px)) scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const startEditing = (list) => {
    setEditingList({
      ...list,
      newName: list.name,
      words: [...list.words]
    });
    setView('edit');
  };

  const saveEditedList = () => {
    const updatedLists = wordLists.map(list => 
      list.id === editingList.id 
        ? { ...list, name: editingList.newName, words: editingList.words }
        : list
    );
    setWordLists(updatedLists);
    setEditingList(null);
    setView('menu');
  };

  const addWordToExistingList = () => {
    if (newWord.trim()) {
      setEditingList({
        ...editingList,
        words: [...editingList.words, newWord.trim()]
      });
      setNewWord('');
    }
  };

  const removeWordFromList = (indexToRemove) => {
    setEditingList({
      ...editingList,
      words: editingList.words.filter((_, index) => index !== indexToRemove)
    });
  };

  const deleteList = (listId) => {
    setWordLists(wordLists.filter(list => list.id !== listId));
  };

  // ... (le reste des fonctions existantes reste identique)
  const initializeWordStatuses = (words) => {
    setWordStatuses(words.map(() => ({ revealed: false, firstTry: true })));
  };

  const startPractice = (list) => {
    setSelectedList(list);
    setCurrentWordIndex(0);
    setUserInput('');
    setFeedback('');
    initializeWordStatuses(list.words);
    setView('practice');
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName,
        words: tempWordList
      };
      setWordLists([...wordLists, newList]);
      setNewListName('');
      setTempWordList([]);
    }
  };

  const addWordToTemp = () => {
    if (newWord.trim()) {
      setTempWordList([...tempWordList, newWord.trim()]);
      setNewWord('');
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    speak(selectedList.words[currentWordIndex]);
  };

  const Confetti = () => (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full"
          initial={{
            x: "50%",
            y: "50%",
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );

  const handleSubmit = () => {
    const correct = userInput.toLowerCase().trim() === selectedList.words[currentWordIndex].toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].revealed = true;
      if (wordStatuses[currentWordIndex].firstTry) {
        setShowCelebration(true);
        playPerfectSound(); // Son spécial pour le premier essai réussi
        setTimeout(() => setShowCelebration(false), 1500);
      } else {
        playSuccessSound(); // Son simple pour la réussite après plusieurs essais
      }
      setWordStatuses(newStatuses);
      
      setFeedback('Bravo ! C\'est la bonne orthographe !');
      if (currentWordIndex < selectedList.words.length - 1) {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
          setUserInput('');
          setFeedback('');
          setIsCorrect(null);
        }, 1500);
      } else {
        setFeedback('Félicitations ! Tu as terminé tous les mots !');
      }
    } else {
      const newStatuses = [...wordStatuses];
      newStatuses[currentWordIndex].firstTry = false;
      setWordStatuses(newStatuses);
      setFeedback(`Pas tout à fait... Essaie encore !`);
    }
  };

  const handleReset = () => {
    initializeWordStatuses(selectedList.words);
    setCurrentWordIndex(0);
    setUserInput('');
    setFeedback('');
    setIsCorrect(null);
  };

  if (view === 'edit') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Modifier la liste
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nom de la liste"
            value={editingList.newName}
            onChange={(e) => setEditingList({...editingList, newName: e.target.value})}
            className="mb-4"
          />

          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un mot"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWordToExistingList()}
            />
            <Button onClick={addWordToExistingList} className="shrink-0">
              <Plus />
            </Button>
          </div>

          <div className="space-y-2">
            {editingList.words.map((word, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>{word}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWordFromList(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setView('menu')}
            >
              Annuler
            </Button>
            <Button
              className="w-full"
              onClick={saveEditedList}
              disabled={!editingList.newName.trim() || editingList.words.length === 0}
            >
              <Save className="mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === 'menu') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Mes dictées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liste existante */}
          <div className="space-y-2">
            {wordLists.map(list => (
              <div key={list.id} className="flex gap-2">
                <Button
                  onClick={() => startPractice(list)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Book className="mr-2" />
                  {list.name} ({list.words.length} mots)
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => startEditing(list)}
                >
                  <Edit2 size={20} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => deleteList(list.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            ))}
          </div>

          {/* Création nouvelle liste */}
          <div className="space-y-2 pt-4 border-t">
            <Input
              placeholder="Nom de la nouvelle liste"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un mot"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWordToTemp()}
              />
              <Button onClick={addWordToTemp} className="shrink-0">
                <Plus />
              </Button>
            </div>
            {tempWordList.length > 0 && (
              <div className="p-2 bg-gray-50 rounded">
                {tempWordList.map((word, i) => (
                  <span key={i} className="inline-block bg-white m-1 px-2 py-1 rounded">
                    {word}
                  </span>
                ))}
              </div>
            )}
            <Button 
              onClick={createNewList}
              disabled={!newListName.trim() || tempWordList.length === 0}
              className="w-full"
            >
              Créer la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === 'practice') {
    return (
      <Card className="w-full max-w-md mx-auto relative overflow-hidden">
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {createStars()}
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {selectedList.name} - ({currentWordIndex + 1}/{selectedList.words.length})
          </CardTitle>
        </CardHeader>
        {/* ... (reste du contenu de la vue practice) */}
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto relative overflow-hidden">
      <AnimatePresence>
        {showCelebration && <Confetti />}
      </AnimatePresence>
      
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {selectedList.name} - ({currentWordIndex + 1}/{selectedList.words.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Liste des mots masqués/révélés */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {selectedList.words.map((word, index) => (
            <motion.span
              key={index}
              className={`px-2 py-1 rounded ${
                wordStatuses[index].revealed
                  ? wordStatuses[index].firstTry
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  : 'bg-gray-200'
              }`}
              animate={{
                scale: wordStatuses[index].revealed && index === currentWordIndex - 1 ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {wordStatuses[index].revealed ? word : '•'.repeat(word.length)}
            </motion.span>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button 
            onClick={handleSpeak}
            className="mx-2"
          >
            <Volume2 className="mr-2" />
            Écouter le mot
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="mx-2"
          >
            <RotateCw className="mr-2" />
            Recommencer
          </Button>
        </div>

        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Écris le mot ici..."
          className="text-lg text-center"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
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
          onClick={() => setView('menu')}
          className="w-full"
        >
          Retour au menu
        </Button>
      </CardContent>
    </Card>
  );
};

export default DicteeApp;