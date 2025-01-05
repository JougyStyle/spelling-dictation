import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Plus, Edit, Save, X, ArrowLeft, Trash, ArrowRightCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PracticeView from './practice-view';
import StatsView from './stats-view';

interface WordList {
  id: number;
  name: string;
  words: string[];
  difficultWords?: string[];  // Mots difficiles pour l'enfant
}

interface WordResult {
  word: string;
  correct: boolean;
  attempts: string[];  // Liste des essais de l'utilisateur
}

interface PracticeResult {
  date: string;  // ISO string
  score: number;
  listId: number;
  listName: string;
  wordResults: WordResult[];
  totalAttempts: number;  // Nombre total d'essais pour la session
}

const DicteeApp = () => {
  const defaultLists: WordList[] = [
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
  ];

  type View = 'menu' | 'practice' | 'edit' | 'create' | 'stats';
  const [view, setView] = useState<View>('menu');
  const [wordLists, setWordLists] = useState<WordList[]>(() => {
    const saved = localStorage.getItem('dicteeWordLists');
    return saved ? JSON.parse(saved) : defaultLists;
  });
  const [selectedList, setSelectedList] = useState<WordList | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedWords, setEditedWords] = useState('');

  const [practiceHistory, setPracticeHistory] = useState<PracticeResult[]>(() => {
    const saved = localStorage.getItem('practiceHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('practiceHistory', JSON.stringify(practiceHistory));
  }, [practiceHistory]);

  
  useEffect(() => {
    localStorage.setItem('dicteeWordLists', JSON.stringify(wordLists));
  }, [wordLists]);

  const savePracticeResult = (result: PracticeResult) => {
    setPracticeHistory(prev => [...prev, result]);
  };

  const getLastScore = (listId: number) => {
    const listResults = practiceHistory
      .filter(result => result.listId === listId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return listResults[0]?.score;
  };

  const renderScoreDisplay = (list: WordList) => {
    if (!list || !list.words) return null;
    
    const lastScore = getLastScore(list.id);
    if (lastScore === undefined) {
      return `(${list.words.length} mots)`;
    }

    const correctWords = Math.round((lastScore * list.words.length) / 100);
    return (
      <span className={getScoreColor(correctWords, list.words.length)}>
        ({correctWords}/{list.words.length} mots)
      </span>
    );
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "text-green-600";
    if (percentage >= 70) return "text-orange-500";
    return "text-red-500";
  };

  // Analyse des mots difficiles basée sur l'historique complet
  const getDifficultWords = (listId: number): string[] => {
    if (!practiceHistory || practiceHistory.length === 0) return [];

    const listResults = practiceHistory
      .filter(result => result.listId === listId)
      .flatMap(result => result.wordResults || []);

    if (listResults.length === 0) return [];

    const wordStats = listResults.reduce((acc, result) => {
      if (result && !result.correct) {
        acc[result.word] = (acc[result.word] || 0) + 1;
      }
      return acc;
    }, {} as { [word: string]: number });

    return Object.entries(wordStats)
      .filter(([_, failures]) => failures >= 2)
      .map(([word]) => word);
  };

  // Fonction pour obtenir les mots difficiles à partir de l'historique
  const getSuggestedWords = () => {
    if (!practiceHistory || practiceHistory.length === 0) return [];

    // Récupérer tous les résultats de pratique
    const allWordResults = practiceHistory.flatMap(result => result.wordResults || []);

    // Compter les échecs pour chaque mot
    const wordFailures = allWordResults.reduce((acc, result) => {
      if (result && !result.correct) {
        acc[result.word] = (acc[result.word] || 0) + 1;
      }
      return acc;
    }, {} as { [word: string]: number });

    // Filtrer les mots qui sont déjà dans la liste en cours d'édition
    const currentWords = editedWords.split('\n').map(w => w.trim());
    
    // Retourner les mots avec au moins 2 échecs, qui ne sont pas déjà dans la liste
    return Object.entries(wordFailures)
      .filter(([word, failures]) => failures >= 2 && !currentWords.includes(word))
      .map(([word]) => word);
  };

  // Fonction pour ajouter un mot suggéré à la liste
  const addSuggestedWord = (word: string) => {
    const currentWords = editedWords.trim();
    setEditedWords(currentWords ? `${currentWords}\n${word}` : word);
  };

  const addDifficultWordToList = (listId: number, word: string) => {
    setWordLists(lists =>
      lists.map(list =>
        list.id === listId
          ? {
              ...list,
              difficultWords: [...(list.difficultWords || []), word],
              words: list.words.includes(word) ? list.words : [...list.words, word]
            }
          : list
      )
    );
  };

  const renderDifficultWordsSection = (listId: number) => {
    const difficultWords = getDifficultWords(listId);
    if (difficultWords.length === 0) return null;

    return (
      <div className="mt-2">
        <p className="text-sm font-medium mb-1">Mots difficiles de la dictée :</p>
        <div className="flex flex-wrap gap-1">
          {difficultWords.map(word => (
            <Badge
              key={word}
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
              onClick={() => addDifficultWordToList(listId, word)}
            >
              {word} <ArrowRightCircle className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const startPractice = (list: WordList) => {
    setSelectedList(list);
    setView('practice');
  };

  const startEdit = (list: WordList) => {
    setSelectedList(list);
    setEditedName(list.name);
    setEditedWords(list.words.join('\n'));
    setView('edit');
  };

  const startCreate = () => {
    setSelectedList(null);
    setEditedName('');
    setEditedWords('');
    setView('create');
  };

  const saveList = () => {
    const words = editedWords
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (view === 'edit' && selectedList) {
      setWordLists(lists =>
        lists.map(list =>
          list.id === selectedList.id
            ? { ...list, name: editedName, words }
            : list
        )
      );
    } else if (view === 'create') {
      const newId = Math.max(0, ...wordLists.map(list => list.id)) + 1;
      setWordLists(lists => [...lists, { id: newId, name: editedName, words }]);
    }
    setView('menu');
  };

  const deleteList = (listId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
      setWordLists(lists => lists.filter(list => list.id !== listId));
    }
  };

  const renderStats = () => {
    return (
      <StatsView 
        practiceHistory={practiceHistory}
        selectedList={selectedList}
        onReturn={() => {
          setView('menu');
          setSelectedList(null);
        }}
      />
    );
  };

  const renderEditForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('menu')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Nom de la liste"
          value={editedName}
          onChange={e => setEditedName(e.target.value)}
        />
      </div>
      
      <textarea
        className="w-full min-h-[300px] p-2 border rounded"
        placeholder="Entrez les mots (un par ligne)"
        value={editedWords}
        onChange={e => setEditedWords(e.target.value)}
      />

      {/* Section des mots suggérés */}
      {practiceHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">
            Mots souvent mal orthographiés :
          </p>
          <div className="flex flex-wrap gap-2">
            {getSuggestedWords().map((word) => (
              <Badge
                key={word}
                variant="outline"
                className="cursor-pointer hover:bg-slate-100 flex items-center gap-1"
                onClick={() => addSuggestedWord(word)}
              >
                {word}
                <Plus className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setView('menu')}
        >
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button
          onClick={saveList}
          disabled={!editedName.trim() || !editedWords.trim()}
        >
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {view === 'practice' && selectedList ? selectedList.name :
           view === 'edit' ? 'Modifier la liste' :
           view === 'create' ? 'Nouvelle liste' :
           view === 'stats' ? 'Statistiques' :
           'Mes dictées'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {view === 'menu' && (
          <div className="space-y-4">
            <Button
              onClick={startCreate}
              className="w-full justify-center"
              variant="outline"
            >
              <Plus className="mr-2" />
              Nouvelle liste
            </Button>
            {wordLists.map(list => (
              <div key={list.id} className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => startPractice(list)}
                    className="flex-1 justify-start"
                    variant="outline"
                  >
                    <Book className="mr-2" />
                    {list.name} {renderScoreDisplay(list)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(list)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteList(list.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                {renderDifficultWordsSection(list.id)}
              </div>
            ))}
          </div>
        )}
        
        {view === 'practice' && selectedList && (
          <PracticeView
            list={selectedList}
            onReturn={() => {
              setView('menu');
              setSelectedList(null);
            }}
            onSaveResult={savePracticeResult}
            practiceHistory={practiceHistory}
          />
        )}

        {view === 'stats' && renderStats()}


        {(view === 'edit' || view === 'create') && renderEditForm()}
      </CardContent>
    </Card>
  );
};

export default DicteeApp;