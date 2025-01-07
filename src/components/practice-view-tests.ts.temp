import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PracticeView from './practice-view';

// Mock des dépendances externes
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Mock du Web Audio API
const mockAudioContext = {
  createOscillator: () => ({
    connect: jest.fn(),
    frequency: {
      setValueAtTime: jest.fn(),
    },
    start: jest.fn(),
    stop: jest.fn(),
  }),
  createGain: () => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  }),
  currentTime: 0,
};

window.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);

// Mock de l'API Speech Synthesis
const mockSpeechSynthesis = {
  speak: jest.fn(),
};
window.speechSynthesis = mockSpeechSynthesis;
window.SpeechSynthesisUtterance = jest.fn();

// Données de test
const mockList = {
  id: 1,
  name: "Test List",
  words: ["bonjour", "monde", "test"],
};

const mockPracticeHistory = [
  {
    date: "2025-01-06T10:00:00.000Z",
    score: 100,
    listId: 1,
    listName: "Test List",
    wordResults: [
      { word: "bonjour", correct: true, attempts: ["bonjour"] },
      { word: "monde", correct: true, attempts: ["monde"] },
      { word: "test", correct: true, attempts: ["test"] },
    ],
    totalAttempts: 3,
  },
];

describe('PracticeView', () => {
  const mockOnReturn = jest.fn();
  const mockOnSaveResult = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial state correctly', () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Vérifie que les mots sont affichés initialement
    mockList.words.forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });

    // Vérifie la présence des boutons de navigation
    expect(screen.getByText('Commencer la dictée')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('starts practice session correctly', async () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Démarre la session
    fireEvent.click(screen.getByText('Commencer la dictée'));

    // Vérifie que l'interface de pratique est affichée
    expect(screen.getByText('Écouter le mot')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Écris le mot ici...')).toBeInTheDocument();
    expect(screen.getByText('Vérifier')).toBeInTheDocument();
  });

  test('handles correct answer submission', async () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Démarre la session
    fireEvent.click(screen.getByText('Commencer la dictée'));

    // Saisit la bonne réponse
    const input = screen.getByPlaceholderText('Écris le mot ici...');
    await userEvent.type(input, 'bonjour');
    
    // Soumet la réponse
    fireEvent.click(screen.getByText('Vérifier'));

    // Vérifie le feedback
    await waitFor(() => {
      expect(screen.getByText('Bravo ! C\'est la bonne orthographe !')).toBeInTheDocument();
    });
  });

  test('handles incorrect answer submission', async () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Démarre la session
    fireEvent.click(screen.getByText('Commencer la dictée'));

    // Saisit une mauvaise réponse
    const input = screen.getByPlaceholderText('Écris le mot ici...');
    await userEvent.type(input, 'incorrect');
    
    // Soumet la réponse
    fireEvent.click(screen.getByText('Vérifier'));

    // Vérifie le feedback
    expect(screen.getByText('Pas tout à fait... Essaie encore !')).toBeInTheDocument();
  });

  test('saves results when practice is complete', async () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Démarre la session et complète tous les mots
    fireEvent.click(screen.getByText('Commencer la dictée'));

    for (const word of mockList.words) {
      const input = screen.getByPlaceholderText('Écris le mot ici...');
      await userEvent.type(input, word);
      fireEvent.click(screen.getByText('Vérifier'));
      
      // Si ce n'est pas le dernier mot, passe au suivant
      if (word !== mockList.words[mockList.words.length - 1]) {
        await waitFor(() => {
          fireEvent.click(screen.getByText('Mot suivant'));
        });
      }
    }

    // Vérifie que onSaveResult a été appelé avec les bons résultats
    expect(mockOnSaveResult).toHaveBeenCalled();
    const savedResult = mockOnSaveResult.mock.calls[0][0];
    expect(savedResult.score).toBe(100);
    expect(savedResult.wordResults.length).toBe(mockList.words.length);
  });

  test('navigates practice history correctly', () => {
    render(
      <PracticeView
        list={mockList}
        onReturn={mockOnReturn}
        onSaveResult={mockOnSaveResult}
        practiceHistory={mockPracticeHistory}
      />
    );

    // Navigue dans l'historique
    fireEvent.click(screen.getByText('Précédent'));
    
    // Vérifie que les détails de la session sont affichés
    expect(screen.getByText('Score total : 100%')).toBeInTheDocument();
    expect(screen.getByText('Nombre total d\'essais : 3')).toBeInTheDocument();
  });
});
