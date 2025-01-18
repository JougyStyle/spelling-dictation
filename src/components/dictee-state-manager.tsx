// Types
interface DicteeProgress {
  listId: number;
  currentWordIndex: number;
  userInput: string;
  wordStatuses: {
    revealed: boolean;
    firstTry: boolean;
    attempts: string[];
  }[];
  lastUpdated: string;
}

class DicteeStateManager {
  private static STORAGE_KEY = 'dictee_current_progress';
  
  static saveProgress(progress: DicteeProgress): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          ...progress,
          lastUpdated: new Date().toISOString()
        })
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
    }
  }

  static loadProgress(): DicteeProgress | null {
    try {
      const savedProgress = localStorage.getItem(this.STORAGE_KEY);
      if (!savedProgress) return null;
      
      const progress = JSON.parse(savedProgress);
      
      // Vérifier si la sauvegarde date de plus de 24h
      const lastUpdated = new Date(progress.lastUpdated);
      const isExpired = new Date().getTime() - lastUpdated.getTime() > 24 * 60 * 60 * 1000;
      
      if (isExpired) {
        this.clearProgress();
        return null;
      }
      
      return progress;
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
      return null;
    }
  }

  static clearProgress(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de la progression:', error);
    }
  }

  static hasSavedProgress(listId: number): boolean {
    const progress = this.loadProgress();
    return progress !== null && progress.listId === listId;
  }
}

export default DicteeStateManager;
