import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import PracticeView from './practice-view';

const DicteeApp = () => {
  const defaultLists = [
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

  const [view, setView] = useState('menu');
  const [wordLists, setWordLists] = useState(() => {
    const saved = localStorage.getItem('dicteeWordLists');
    return saved ? JSON.parse(saved) : defaultLists;
  });
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    localStorage.setItem('dicteeWordLists', JSON.stringify(wordLists));
  }, [wordLists]);

  const startPractice = (list) => {
    setSelectedList(list);
    setView('practice');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {view === 'practice' ? selectedList.name : 'Mes dictées'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {view === 'menu' && (
          <div className="space-y-4">
            {wordLists.map(list => (
              <Button
                key={list.id}
                onClick={() => startPractice(list)}
                className="w-full justify-start"
                variant="outline"
              >
                <Book className="mr-2" />
                {list.name} ({list.words.length} mots)
              </Button>
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DicteeApp;
