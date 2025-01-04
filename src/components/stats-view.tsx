import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PracticeResult {
  date: string;
  score: number;
  listId: number;
  listName: string;
}

interface StatsViewProps {
  practiceHistory: PracticeResult[];
  selectedList: { id: number; name: string } | null;
  onReturn: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ practiceHistory, selectedList, onReturn }) => {
  const relevantHistory = selectedList 
    ? practiceHistory.filter(result => result.listId === selectedList.id)
    : practiceHistory;

  const getAverageScore = (history: PracticeResult[]) => {
    if (history.length === 0) return 0;
    return Math.round(
      history.reduce((sum, result) => sum + result.score, 0) / history.length
    );
  };

  const getBestScore = (history: PracticeResult[]) => {
    if (history.length === 0) return 0;
    return Math.max(...history.map(result => result.score));
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">
          {selectedList ? `Statistiques : ${selectedList.name}` : 'Statistiques globales'}
        </h3>
        <div className="text-sm text-gray-500">
          Score moyen : {getAverageScore(relevantHistory)}% | 
          Meilleur score : {getBestScore(relevantHistory)}%
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={relevantHistory.slice(-10)}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
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

      {!selectedList && (
        <div className="space-y-2">
          <h4 className="font-medium">Scores par dictée</h4>
          {Array.from(new Set(practiceHistory.map(r => r.listId))).map(listId => {
            const listHistory = practiceHistory.filter(r => r.listId === listId);
            const listName = listHistory[0]?.listName;
            return (
              <div key={listId} className="text-sm">
                {listName} : {getAverageScore(listHistory)}% en moyenne
              </div>
            );
          })}
        </div>
      )}

      <Button
        onClick={onReturn}
        className="w-full"
      >
        <ArrowLeft className="mr-2" />
        Retour
      </Button>
    </div>
  );
};

export default StatsView;