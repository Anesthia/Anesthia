interface QuestionnaireSubmission {
  id: string;
  submittedAt: string;
  patientData: {
    personalInfo: {
      fullName: string;
      dateOfBirth: string;
      weight: string;
      height: string;
      plannedProcedure: string;
      procedureDate: string;
    };
    chronicDiseases: {
      cardiovascular: string[];
      vascular: string[];
      respiratory: string[];
      nervous: string[];
      musculoskeletal: string[];
      digestive: string[];
      urinary: string[];
      endocrine: string[];
      other: string[];
    };
    allergies: {
      medications: string[];
      substances: string[];
    };
    currentMedications: string;
    selectedDrugs: Array<{
      id: string;
      drug: {
        id: string;
        name: string;
        activeIngredient: string;
        category: string;
      };
      dosage: string;
      frequency: string;
      notes?: string;
    }>;
    substanceUse: {
      tobacco: string;
      alcohol: string;
      drugs: string;
    };
    anesthesiaHistory: {
      previousAnesthesia: boolean;
      complications: string;
      familyHistory: boolean;
      implants: string;
    };
  };
  status: 'submitted' | 'reviewed' | 'completed';
}

class QuestionnaireStore {
  private submissions: QuestionnaireSubmission[] = [];
  private listeners: ((submissions: QuestionnaireSubmission[]) => void)[] = [];

  constructor() {
    // Load from localStorage on initialization
    const stored = localStorage.getItem('questionnaire-submissions');
    if (stored) {
      try {
        this.submissions = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading stored submissions:', e);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('questionnaire-submissions', JSON.stringify(this.submissions));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.submissions));
  }

  submitQuestionnaire(patientData: QuestionnaireSubmission['patientData']): string {
    const submission: QuestionnaireSubmission = {
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      patientData,
      status: 'submitted'
    };

    this.submissions.push(submission);
    this.saveToStorage();
    return submission.id;
  }

  getSubmissions(): QuestionnaireSubmission[] {
    return [...this.submissions];
  }

  getSubmissionById(id: string): QuestionnaireSubmission | undefined {
    return this.submissions.find(s => s.id === id);
  }

  updateSubmissionStatus(id: string, status: QuestionnaireSubmission['status']) {
    const submission = this.submissions.find(s => s.id === id);
    if (submission) {
      submission.status = status;
      this.saveToStorage();
    }
  }

  subscribe(listener: (submissions: QuestionnaireSubmission[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const questionnaireStore = new QuestionnaireStore();
export type { QuestionnaireSubmission };
