import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Edit3,
  Camera,
  FileText,
  Heart,
  Wind,
  Brain,
  Bone,
  Plus,
  Save,
  Image,
  Stethoscope,
  MessageCircle,
  Pill,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";
import { questionnaireStore, type QuestionnaireSubmission } from "@/lib/questionnaire-store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import EnhancedBridgeTherapy from "@/components/EnhancedBridgeTherapy";
import PatientExamination from "@/components/PatientExamination";
// import AnesthesiaRecommendation from "@/components/AnesthesiaRecommendation";

interface ExaminationData {
  vitalSigns: {
    systolic: string;
    diastolic: string;
    heartRate: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  intubationAssessment: {
    mallampati: string;
    thyromental: string;
    neckMovement: string;
    jawMovement: string;
    teethCondition: string;
    overallDifficulty: string;
  };
  asaClassification: {
    class: string;
    description: string;
    reason: string;
  };
  physicalExamNotes: string;
  physicalExamFindings: {
    cardiovascular: string[];
    respiratory: string[];
    nervous: string[];
    skin: string[];
    other: string[];
  };
  completedAt?: string;
  examinedBy?: string;
}

interface PatientRecord {
  id: string;
  name: string;
  age?: number;
  procedure: string;
  date: string;
  status: 'pending' | 'completed' | 'in-progress' | 'submitted' | 'reviewed';
  riskLevel: 'low' | 'medium' | 'high';
  submissionId?: string;
  questionnaireData?: QuestionnaireSubmission['patientData'];
  examinationData?: ExaminationData;
}

const mockPatients: PatientRecord[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    age: 45,
    procedure: "Cholecystektomia laparoskopowa",
    date: "2024-01-15",
    status: "pending",
    riskLevel: "low"
  },
  {
    id: "2",
    name: "Jan Nowak",
    age: 67,
    procedure: "Operacja zaćmy",
    date: "2024-01-16",
    status: "in-progress",
    riskLevel: "medium"
  },
  {
    id: "3",
    name: "Maria Wiśniewska",
    age: 72,
    procedure: "Endoprotezoplastyka stawu biodrowego",
    date: "2024-01-17",
    status: "completed",
    riskLevel: "high"
  }
];

export default function DoctorInterface() {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [consultationImages, setConsultationImages] = useState<string[]>([]);
  const [submittedQuestionnaires, setSubmittedQuestionnaires] = useState<QuestionnaireSubmission[]>([]);
  const [allPatients, setAllPatients] = useState<PatientRecord[]>(mockPatients);
  const [patientExaminations, setPatientExaminations] = useState<Record<string, ExaminationData>>({});
  const [consultationNotes, setConsultationNotes] = useState<Record<string, string>>({});

  // Helper functions for determining tab colors and status
  const hasRiskCardiacConditions = (patient: PatientRecord) => {
    if (!patient.questionnaireData) return false;
    const cardio = patient.questionnaireData.chronicDiseases.cardiovascular || [];

    const riskCardiacConditions = [
      "Choroba wieńcowa / przebyte zawały serca",
      "Niewydolność serca",
      "Wady zastawkowe serca",
      "Wszczepiony rozrusznik / ICD"
    ];

    return cardio.some(condition => riskCardiacConditions.includes(condition));
  };

  const hasSpecificCardiacConditions = (patient: PatientRecord) => {
    if (!patient.questionnaireData) return false;
    const cardio = patient.questionnaireData.chronicDiseases.cardiovascular || [];

    const specificCardiacConditions = [
      "Choroba wieńcowa / przebyte zawały serca",
      "Zaburzenia rytmu serca (np. migotanie przedsionków)",
      "Niewydolność serca"
    ];

    return cardio.some(condition => specificCardiacConditions.includes(condition));
  };

  const needsCardiacReferral = (patient: PatientRecord) => {
    return hasSpecificCardiacConditions(patient) && !hasConsultationImages(patient.id);
  };

  const hasHeartOrLungDiseases = (patient: PatientRecord) => {
    if (!patient.questionnaireData) return false;
    const cardio = patient.questionnaireData.chronicDiseases.cardiovascular || [];
    const respiratory = patient.questionnaireData.chronicDiseases.respiratory || [];

    const riskConditions = [
      "Choroba wieńcowa / przebyte zawały serca",
      "Niewydolność serca",
      "Wady zastawkowe serca",
      "Wszczepiony rozrusznik / ICD",
      "Astma oskrzelowa",
      "POChP (Przewlekła Obturacyjna Choroba Płuc)",
      "Bezdech senny"
    ];

    return [...cardio, ...respiratory].some(condition =>
      riskConditions.includes(condition)
    );
  };

  const hasAnticoagulantDrugs = (patient: PatientRecord) => {
    if (!patient.questionnaireData?.selectedDrugs) return false;

    const anticoagulantCategories = ["Antykoagulanty", "Heparyny", "Leki przeciwpłytkowe"];
    return patient.questionnaireData.selectedDrugs.some(selectedDrug =>
      anticoagulantCategories.includes(selectedDrug.drug.category)
    );
  };

  const hasConsultationImages = (patientId: string) => {
    return consultationImages.length > 0; // This would be patient-specific in real implementation
  };

  const getTabColor = (tabName: string, patient: PatientRecord) => {
    switch (tabName) {
      case 'consultation':
        if (hasRiskCardiacConditions(patient)) {
          return hasConsultationImages(patient.id) ? 'text-green-600' : 'text-red-600';
        }
        return hasConsultationImages(patient.id) ? 'text-green-600' : '';
      case 'therapy':
        return hasAnticoagulantDrugs(patient) ? 'text-red-600' : '';
      default:
        return '';
    }
  };

  useEffect(() => {
    // Load initial submissions
    const submissions = questionnaireStore.getSubmissions();
    setSubmittedQuestionnaires(submissions);

    // Convert submissions to patient records
    const submissionPatients: PatientRecord[] = submissions.map(submission => ({
      id: submission.id,
      name: submission.patientData.personalInfo.fullName || "Nieznany pacjent",
      procedure: submission.patientData.personalInfo.plannedProcedure || "Nieokreślony zabieg",
      date: submission.patientData.personalInfo.procedureDate || new Date(submission.submittedAt).toISOString().split('T')[0],
      status: submission.status === 'submitted' ? 'submitted' : submission.status === 'reviewed' ? 'reviewed' : 'completed',
      riskLevel: 'medium', // Default risk level, could be calculated based on questionnaire data
      submissionId: submission.id,
      questionnaireData: submission.patientData
    }));

    // Merge with existing mock patients
    setAllPatients([...submissionPatients, ...mockPatients]);

    // Subscribe to updates
    const unsubscribe = questionnaireStore.subscribe((submissions) => {
      setSubmittedQuestionnaires(submissions);
      const updatedSubmissionPatients: PatientRecord[] = submissions.map(submission => ({
        id: submission.id,
        name: submission.patientData.personalInfo.fullName || "Nieznany pacjent",
        procedure: submission.patientData.personalInfo.plannedProcedure || "Nieokreślony zabieg",
        date: submission.patientData.personalInfo.procedureDate || new Date(submission.submittedAt).toISOString().split('T')[0],
        status: submission.status === 'submitted' ? 'submitted' : submission.status === 'reviewed' ? 'reviewed' : 'completed',
        riskLevel: 'medium',
        submissionId: submission.id,
        questionnaireData: submission.patientData
      }));
      setAllPatients([...updatedSubmissionPatients, ...mockPatients]);
    });

    return unsubscribe;
  }, []);

  const filteredPatients = allPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.procedure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'reviewed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setConsultationImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const renderEditableSection = (title: string, sectionKey: string, content: string) => (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingSection(editingSection === sectionKey ? null : sectionKey)}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {editingSection === sectionKey ? (
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={() => {}}
              className="min-h-[100px]"
              placeholder="Edytuj informacje..."
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => setEditingSection(null)}>
                <Save className="w-4 h-4 mr-2" />
                Zapisz
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingSection(null)}>
                Anuluj
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">{content || "Brak danych - kliknij edytuj aby dodać informacje"}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              👨‍⚕️ Panel Lekarza - Anestezjologia
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Lista Pacjentów</span>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Szukaj pacjenta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status === 'pending' ? 'Oczekuje' :
                           patient.status === 'completed' ? 'Zakończono' :
                           patient.status === 'in-progress' ? 'W trakcie' :
                           patient.status === 'submitted' ? 'Kwestionariusz wysłany' :
                           patient.status === 'reviewed' ? 'Sprawdzono' : 'Nieznany'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{patient.procedure}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{patient.date}</span>
                        <Badge className={getRiskColor(patient.riskLevel)}>
                          {patient.riskLevel === 'low' ? 'Niskie ryzyko' :
                           patient.riskLevel === 'medium' ? 'Średnie ryzyko' : 'Wysokie ryzyko'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Tabs defaultValue="questionnaire" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5 h-16">
                  <TabsTrigger value="questionnaire" className="flex flex-col items-center gap-1 p-3">
                    <ClipboardList className="w-5 h-5" />
                    <span className="text-xs font-semibold">Kwestionariusz</span>
                  </TabsTrigger>
                  <TabsTrigger value="examination" className="flex flex-col items-center gap-1 p-3">
                    <Stethoscope className="w-5 h-5" />
                    <span className="text-xs font-semibold">Badanie</span>
                  </TabsTrigger>
                  <TabsTrigger value="anesthesia" className="flex flex-col items-center gap-1 p-3">
                    <Activity className="w-5 h-5" />
                    <span className="text-xs font-semibold">Znieczulenie</span>
                  </TabsTrigger>
                  <TabsTrigger value="consultation" className={`flex flex-col items-center gap-1 p-3 ${getTabColor('consultation', selectedPatient)}`}>
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-semibold flex items-center gap-1">
                      Konsultacja
                      {hasRiskCardiacConditions(selectedPatient) && (
                        hasConsultationImages(selectedPatient.id) ?
                          <CheckCircle className="w-3 h-3 text-green-600" /> :
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                      )}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="therapy" className={`flex flex-col items-center gap-1 p-3 ${getTabColor('therapy', selectedPatient)}`}>
                    <Pill className="w-5 h-5" />
                    <span className="text-xs font-semibold flex items-center gap-1">
                      Terapia
                      {hasAnticoagulantDrugs(selectedPatient) && <AlertTriangle className="w-3 h-3 text-red-600" />}
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="questionnaire" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dane Pacjenta: {selectedPatient.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {selectedPatient.age && (
                          <div>
                            <Label>Wiek</Label>
                            <p className="font-medium">{selectedPatient.age} lat</p>
                          </div>
                        )}
                        {selectedPatient.questionnaireData && (
                          <>
                            <div>
                              <Label>Waga</Label>
                              <p className="font-medium">{selectedPatient.questionnaireData.personalInfo.weight} kg</p>
                            </div>
                            <div>
                              <Label>Wzrost</Label>
                              <p className="font-medium">{selectedPatient.questionnaireData.personalInfo.height} cm</p>
                            </div>
                            <div>
                              <Label>Data urodzenia</Label>
                              <p className="font-medium">{selectedPatient.questionnaireData.personalInfo.dateOfBirth}</p>
                            </div>
                          </>
                        )}
                        <div>
                          <Label>Planowany zabieg</Label>
                          <p className="font-medium">{selectedPatient.procedure}</p>
                        </div>
                      </div>

                      {/* E-Referral Information */}
                      {selectedPatient.questionnaireData?.personalInfo.eReferralCode || selectedPatient.questionnaireData?.personalInfo.eReferralImage ? (
                        <Card className="border-blue-200 bg-blue-50 mt-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span>Informacje z E-skierowania</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedPatient.questionnaireData.personalInfo.eReferralCode && (
                              <div>
                                <Label className="text-xs">Kod e-skierowania:</Label>
                                <p className="font-mono text-sm bg-white p-2 rounded border">
                                  {selectedPatient.questionnaireData.personalInfo.eReferralCode}
                                </p>
                              </div>
                            )}

                            {selectedPatient.questionnaireData.personalInfo.eReferralImage && (
                              <div>
                                <Label className="text-xs">Zdjęcie e-skierowania:</Label>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <img
                                      src={selectedPatient.questionnaireData.personalInfo.eReferralImage}
                                      alt="E-skierowanie"
                                      className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>E-skierowanie - {selectedPatient.name}</DialogTitle>
                                    </DialogHeader>
                                    <img
                                      src={selectedPatient.questionnaireData.personalInfo.eReferralImage}
                                      alt="E-skierowanie"
                                      className="w-full h-auto rounded"
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}

                            <div className="bg-white rounded p-2 border">
                              <Label className="text-xs">Metoda wprowadzenia:</Label>
                              <p className="text-sm">
                                {selectedPatient.questionnaireData.personalInfo.eReferralMethod === 'photo' ? '📷 Zdjęcie' :
                                 selectedPatient.questionnaireData.personalInfo.eReferralMethod === 'manual' ? '🔢 Kod' : 'Ręcznie'}
                              </p>
                            </div>

                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Dane zabiegu pobrane automatycznie
                            </Badge>
                          </CardContent>
                        </Card>
                      ) : null}

                      {selectedPatient.submissionId && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-800">Kwestionariusz otrzymany</span>
                          </div>
                          <p className="text-sm text-green-700">
                            Data wysłania: {new Date(submittedQuestionnaires.find(s => s.id === selectedPatient.submissionId)?.submittedAt || '').toLocaleString('pl-PL')}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                              if (selectedPatient.submissionId) {
                                questionnaireStore.updateSubmissionStatus(selectedPatient.submissionId, 'reviewed');
                              }
                            }}
                          >
                            Oznacz jako przejrzane
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {renderEditableSection(
                    "🫀 Układ Sercowo-Naczyniowy",
                    "cardiovascular",
                    selectedPatient.questionnaireData?.chronicDiseases.cardiovascular.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "🫁 Układ Oddechowy",
                    "respiratory",
                    selectedPatient.questionnaireData?.chronicDiseases.respiratory.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "🧠 Układ Nerwowy",
                    "nervous",
                    selectedPatient.questionnaireData?.chronicDiseases.nervous.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "🏥 Układ Endokrynny",
                    "endocrine",
                    selectedPatient.questionnaireData?.chronicDiseases.endocrine.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "🧬 Układ Trawienny",
                    "digestive",
                    selectedPatient.questionnaireData?.chronicDiseases.digestive.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "💧 Układ Moczowy",
                    "urinary",
                    selectedPatient.questionnaireData?.chronicDiseases.urinary.join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "🦴 Układ Mięśniowo-Szkieletowy i Inne",
                    "other",
                    [
                      ...(selectedPatient.questionnaireData?.chronicDiseases.musculoskeletal || []),
                      ...(selectedPatient.questionnaireData?.chronicDiseases.other || [])
                    ].join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {renderEditableSection(
                    "💊 Alergie i Leki",
                    "allergies",
                    [
                      ...(selectedPatient.questionnaireData?.allergies.medications || []),
                      ...(selectedPatient.questionnaireData?.allergies.substances || [])
                    ].join(', ') || "Brak danych - kliknij edytuj aby dodać informacje"
                  )}

                  {(selectedPatient.questionnaireData?.selectedDrugs?.length > 0 || selectedPatient.questionnaireData?.currentMedications) && (
                    <Card className="mb-4">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">💊 Obecnie Przyjmowane Leki</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSection(editingSection === "current-medications" ? null : "current-medications")}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {selectedPatient.questionnaireData?.selectedDrugs?.length > 0 && (
                          <div className="space-y-3 mb-4">
                            <h4 className="font-medium text-gray-900">Leki z bazy POZ:</h4>
                            {selectedPatient.questionnaireData.selectedDrugs.map((selectedDrug, index) => {
                              const isAnticoagulant = ["Antykoagulanty", "Heparyny", "Leki przeciwpłytkowe"].includes(selectedDrug.drug.category);

                              return (
                                <div
                                  key={index}
                                  className={`rounded-lg p-3 border cursor-pointer transition-colors ${
                                    isAnticoagulant
                                      ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                  }`}
                                  onClick={() => {
                                    if (isAnticoagulant) {
                                      // Navigate to therapy tab for anticoagulant drugs
                                      const tabsList = document.querySelector('[value="therapy"]') as HTMLElement;
                                      if (tabsList) tabsList.click();
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`font-medium ${
                                      isAnticoagulant ? 'text-red-900' : 'text-gray-900'
                                    }`}>
                                      {selectedDrug.drug.name}
                                      {isAnticoagulant && (
                                        <AlertTriangle className="w-4 h-4 text-red-600 inline ml-2" />
                                      )}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        isAnticoagulant
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      {selectedDrug.drug.category}
                                    </Badge>
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Dawka:</span> {selectedDrug.dosage}</p>
                                    <p><span className="font-medium">Cz��stotliwość:</span> {selectedDrug.frequency}</p>
                                    {selectedDrug.notes && (
                                      <p><span className="font-medium">Uwagi:</span> {selectedDrug.notes}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                      Substancja czynna: {selectedDrug.drug.activeIngredient}
                                    </p>
                                    {isAnticoagulant && (
                                      <p className="text-xs text-red-600 font-medium mt-2">
                                        ⚠️ Lek przeciwkrzepliwy - kliknij aby przejść do terapii pomostowej
                                      </p>
                                    )}
                                  </div>

                                  {/* Show related conditions for anticoagulants */}
                                  {isAnticoagulant && (
                                    <div className="mt-2 pt-2 border-t border-red-200">
                                      <div className="text-xs text-red-700">
                                        <span className="font-medium">Powiązane choroby:</span>
                                        {(() => {
                                          const cardioConditions = selectedPatient.questionnaireData?.chronicDiseases.cardiovascular || [];
                                          const relevantConditions = cardioConditions.filter(condition =>
                                            condition.includes('migotanie') ||
                                            condition.includes('zawał') ||
                                            condition.includes('wieńcowa') ||
                                            condition.includes('zastawkowe')
                                          );
                                          return relevantConditions.length > 0
                                            ? relevantConditions.join(', ')
                                            : 'Brak bezpośrednio powiązanych chorób w ankiecie';
                                        })()
                                        }
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {selectedPatient.questionnaireData?.currentMedications && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Dodatkowe informacje:</h4>
                            <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border">
                              {selectedPatient.questionnaireData.currentMedications}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {(selectedPatient.questionnaireData?.substanceUse.tobacco ||
                    selectedPatient.questionnaireData?.substanceUse.alcohol ||
                    selectedPatient.questionnaireData?.substanceUse.drugs) && renderEditableSection(
                    "🚬 Używki",
                    "substances",
                    [
                      selectedPatient.questionnaireData?.substanceUse.tobacco && `Tytoń: ${selectedPatient.questionnaireData.substanceUse.tobacco}`,
                      selectedPatient.questionnaireData?.substanceUse.alcohol && `Alkohol: ${selectedPatient.questionnaireData.substanceUse.alcohol}`,
                      selectedPatient.questionnaireData?.substanceUse.drugs && `Inne: ${selectedPatient.questionnaireData.substanceUse.drugs}`
                    ].filter(Boolean).join(', ')
                  )}
                </TabsContent>

                <TabsContent value="examination" className="space-y-4">
                  <PatientExamination
                    patientName={selectedPatient.name}
                    patientId={selectedPatient.id}
                    existingExamination={patientExaminations[selectedPatient.id]}
                    onExaminationComplete={(examinationData) => {
                      setPatientExaminations(prev => ({
                        ...prev,
                        [selectedPatient.id]: examinationData
                      }));

                      // Update patient record with examination data
                      setAllPatients(prev => prev.map(patient =>
                        patient.id === selectedPatient.id
                          ? { ...patient, examinationData, status: 'completed' as const }
                          : patient
                      ));

                      // Update the selected patient to reflect changes
                      setSelectedPatient(prev => prev ? {
                        ...prev,
                        examinationData,
                        status: 'completed' as const
                      } : null);
                    }}
                  />
                </TabsContent>

                <TabsContent value="anesthesia" className="space-y-4">
                  {/* Patient Anesthesia Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>Preferencje Pacjenta - Rodzaj Znieczulenia</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPatient.questionnaireData?.anesthesiaSelection ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="font-medium">Preferowany rodzaj znieczulenia:</Label>
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'general' && (
                                <p className="text-blue-800 font-medium">🏥 Znieczulenie ogólne (narkoza)</p>
                              )}
                              {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'spinal' && (
                                <p className="text-blue-800 font-medium">💉 Znieczulenie podpajęczynówkowe</p>
                              )}
                              {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'epidural' && (
                                <p className="text-blue-800 font-medium">💊 Znieczulenie nadoponowe (epiduralne)</p>
                              )}
                              {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'combined' && (
                                <p className="text-blue-800 font-medium">🔄 Znieczulenie łączone</p>
                              )}
                              {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'no-preference' && (
                                <p className="text-blue-800 font-medium">👨‍⚕️ Brak preferencji - decyzja anestezjologa</p>
                              )}
                              {!selectedPatient.questionnaireData.anesthesiaSelection.preferredType && (
                                <p className="text-gray-600">Pacjent nie wybrał preferencji</p>
                              )}
                            </div>
                          </div>

                          {selectedPatient.questionnaireData.anesthesiaSelection.contraindications.length > 0 && (
                            <div>
                              <Label className="font-medium">Przeciwwskazania i obawy:</Label>
                              <div className="mt-2 space-y-2">
                                {selectedPatient.questionnaireData.anesthesiaSelection.contraindications.map((contraindication, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-800 text-sm">{contraindication}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedPatient.questionnaireData.anesthesiaSelection.specialConsiderations && (
                            <div>
                              <Label className="font-medium">Dodatkowe uwagi pacjenta:</Label>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-gray-800 text-sm">{selectedPatient.questionnaireData.anesthesiaSelection.specialConsiderations}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">Pacjent nie wypełnił sekcji dotyczącej wyboru znieczulenia</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Anesthesia Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Stethoscope className="w-5 h-5" />
                        <span>Rekomendacje Anestezjologiczne</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Procedure-based recommendations */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Rekomendacje dla zabiegu: {selectedPatient.procedure}
                          </h4>
                          {(() => {
                            const procedure = selectedPatient.procedure.toLowerCase();
                            if (procedure.includes('laparoskop') || procedure.includes('brzuch')) {
                              return (
                                <div className="space-y-2 text-green-800 text-sm">
                                  <p>✅ <strong>Zalecane:</strong> Znieczulenie ogólne z intubacją</p>
                                  <p>• Bezpieczeństwo w pozycji Trendelenburga</p>
                                  <p>• Kontrola wentylacji podczas pneumoperitoneom</p>
                                  <p>�� Możliwość szybkiej konwersji na laparotomię</p>
                                </div>
                              );
                            } else if (procedure.includes('zaćma') || procedure.includes('oko')) {
                              return (
                                <div className="space-y-2 text-green-800 text-sm">
                                  <p>✅ <strong>Zalecane:</strong> Znieczulenie miejscowe + sedacja</p>
                                  <p>• Blokada retrobulbarna lub peribulbarna</p>
                                  <p>• Pacjent pozostaje przytomny</p>
                                  <p>• Minimalne ryzyko pooperacyjne</p>
                                </div>
                              );
                            } else if (procedure.includes('biodro') || procedure.includes('endoproteza') || procedure.includes('kończyn')) {
                              return (
                                <div className="space-y-2 text-green-800 text-sm">
                                  <p>✅ <strong>Opcje:</strong> Znieczulenie podpajęczynówkowe lub ogólne</p>
                                  <p>• Subarachnoidalne: mniejsze krwawienie, szybsze wybudzenie</p>
                                  <p>• Ogólne: przy przeciwwskazaniach do regionalnego</p>
                                  <p>• Rozważyć blokadę nerwową na ból pooperacyjny</p>
                                </div>
                              );
                            } else {
                              return (
                                <div className="space-y-2 text-green-800 text-sm">
                                  <p>✅ <strong>Analiza indywidualna:</strong> Wybór znieczulenia zależy od:</p>
                                  <p>• Rodzaju i czasu trwania zabiegu</p>
                                  <p>• Stanu zdrowia pacjenta</p>
                                  <p>• Preferencji pacjenta i anestezjologa</p>
                                </div>
                              );
                            }
                          })()}
                        </div>

                        {/* Patient condition-based contraindications */}
                        {(() => {
                          const cardio = selectedPatient.questionnaireData?.chronicDiseases.cardiovascular || [];
                          const respiratory = selectedPatient.questionnaireData?.chronicDiseases.respiratory || [];
                          const nervous = selectedPatient.questionnaireData?.chronicDiseases.nervous || [];
                          const contraindications = [];

                          if (cardio.includes("Niewydolność serca") || cardio.includes("Choroba wieńcowa / przebyte zawały serca")) {
                            contraindications.push({
                              type: "Choroby serca",
                              warning: "Ostrożnie z znieczuleniem podpajęczynówkowym - ryzyko hipotensji",
                              recommendation: "Rozważyć znieczulenie ogólne z kontrolowaną hipotensją"
                            });
                          }

                          if (respiratory.includes("Astma oskrzelowa") || respiratory.includes("POChP (Przewlekła Obturacyjna Choroba Płuc)")) {
                            contraindications.push({
                              type: "Choroby układu oddechowego",
                              warning: "Ryzyko bronchospazmu przy znieczuleniu ogólnym",
                              recommendation: "Preferować znieczulenie regionalne gdy możliwe"
                            });
                          }

                          if (nervous.includes("Padaczka") || nervous.includes("Stwardnienie rozsiane")) {
                            contraindications.push({
                              type: "Choroby układu nerwowego",
                              warning: "Względne przeciwwskazania do znieczulenia regionalnego",
                              recommendation: "Konsultacja neurologiczna przed zabiegiem"
                            });
                          }

                          if (hasAnticoagulantDrugs(selectedPatient)) {
                            contraindications.push({
                              type: "Leki przeciwkrzepliwe",
                              warning: "Przeciwwskazanie do znieczulenia neuraksjalnego",
                              recommendation: "Należy odstawić zgodnie z wytycznymi terapii pomostowej"
                            });
                          }

                          return contraindications.length > 0 ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Przeciwwskazania i ostrzeżenia
                              </h4>
                              <div className="space-y-3">
                                {contraindications.map((item, index) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-orange-300">
                                    <p className="font-medium text-orange-900">{item.type}</p>
                                    <p className="text-orange-800 text-sm mt-1">⚠️ {item.warning}</p>
                                    <p className="text-orange-700 text-sm mt-1">💡 {item.recommendation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Final recommendation */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-3">🎯 Ostateczna Rekomendacja</h4>
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-3 border border-blue-300">
                              <Label className="font-medium text-blue-900">Zalecany rodzaj znieczulenia:</Label>
                              <RadioGroup className="mt-2 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="general-final" id="general-final" />
                                  <Label htmlFor="general-final" className="text-sm">Znieczulenie ogólne</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="spinal-final" id="spinal-final" />
                                  <Label htmlFor="spinal-final" className="text-sm">Znieczulenie podpajęczynówkowe</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="epidural-final" id="epidural-final" />
                                  <Label htmlFor="epidural-final" className="text-sm">Znieczulenie nadoponowe</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="local-final" id="local-final" />
                                  <Label htmlFor="local-final" className="text-sm">Znieczulenie miejscowe</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="anesthesia-notes" className="font-medium text-blue-900">
                                Uzasadnienie wyboru i dodatkowe uwagi:
                              </Label>
                              <Textarea
                                id="anesthesia-notes"
                                placeholder="Uzasadnij wybór rodzaju znieczulenia, opisz plan anestezjologiczny..."
                                className="mt-2"
                              />
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              <Save className="w-4 h-4 mr-2" />
                              Zapisz Plan Anestezjologiczny
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="consultation" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Zdjęcia z Konsultacji</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Dodaj Zdjęcie
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dodaj Zdjęcie z Konsultacji</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="image-upload">Wybierz zdjęcie</Label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="mt-2"
                              />
                            </div>
                            <Button className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Dodaj Zdjęcie
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {consultationImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {consultationImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Konsultacja ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button variant="secondary" size="sm">
                                  Usuń
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>Brak zdjęć z konsultacji</p>
                          <p className="text-sm">Kliknij "Dodaj Zdjęcie" aby rozpocząć</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notatki z Konsultacji</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Dodaj notatki z konsultacji anestezjologicznej..."
                        className="min-h-[120px]"
                        value={consultationNotes[selectedPatient.id] || ""}
                        onChange={(e) => setConsultationNotes(prev => ({
                          ...prev,
                          [selectedPatient.id]: e.target.value
                        }))}
                      />
                      <Button
                        className="mt-4"
                        onClick={() => {
                          toast.success("Notatki z konsultacji zostały zapisane");
                        }}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Zapisz Notatki
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Automatic Cardiac Referral System */}
                  {needsCardiacReferral(selectedPatient) && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-red-800">
                          <Heart className="w-5 h-5" />
                          <span>Automatyczne Skierowanie - Konsultacja Kardiologiczna</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Alert className="border-red-300 bg-red-100">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-2">
                                <p className="text-red-800 font-medium">
                                  Wykryto choroby serca wymagające konsultacji kardiologicznej:
                                </p>
                                <ul className="text-red-700 text-sm space-y-1 ml-4">
                                  {selectedPatient.questionnaireData?.chronicDiseases.cardiovascular
                                    .filter(condition => [
                                      "Choroba wieńcowa / przebyte zawały serca",
                                      "Zaburzenia rytmu serca (np. migotanie przedsionków)",
                                      "Niewydolność serca"
                                    ].includes(condition))
                                    .map((condition, index) => (
                                      <li key={index}>• {condition}</li>
                                    ))
                                  }
                                </ul>
                              </div>
                            </AlertDescription>
                          </Alert>

                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <h4 className="font-semibold text-red-900 mb-3">Zalecane badania:</h4>
                            <ul className="text-sm text-red-800 space-y-2">
                              <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                <span>ECHO serca z oceną funkcji skurczowej i rozkurczowej</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                <span>EKG spoczynkowe</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                <span>Próba wysiłkowa (jeśli wskazana)</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                <span>Aktualne wyniki laboratoryjne (troponiny, NT-proBNP)</span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-red-200">
                            <div>
                              <p className="font-medium text-red-900">Status konsultacji:</p>
                              <p className="text-sm text-red-700">Brak załączonej dokumentacji kardiologicznej</p>
                            </div>
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              Wymagana konsultacja
                            </Badge>
                          </div>

                          <div className="flex space-x-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-red-600 hover:bg-red-700">
                                  <Camera className="w-4 h-4 mr-2" />
                                  Dodaj Wyniki Konsultacji
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Dodaj Dokumentację Kardiologiczną</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="cardiac-consultation-upload">Wybierz zdjęcia wyników ECHO, EKG, zaleceń:</Label>
                                    <Input
                                      id="cardiac-consultation-upload"
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleImageUpload}
                                      className="mt-2"
                                    />
                                  </div>
                                  <Button className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Dodaj Dokumentację
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              Drukuj Skierowanie
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Risk-based consultation alerts */}
                  {hasRiskCardiacConditions(selectedPatient) && (
                    <Card className="border-orange-200 bg-orange-50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-orange-800">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Wymagana Konsultacja Kardiologiczna/Pulmonologiczna</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-orange-700">
                            Pacjent ma choroby serca lub płuc wymagające dodatkowej konsultacji przed zabiegiem.
                          </p>
                          <div className="flex space-x-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="bg-white">
                                  <Camera className="w-4 h-4 mr-2" />
                                  Dodaj Zdjęcia Konsultacji
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Dodaj Zdjęcia z Konsultacji Specjalistycznej</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="consultation-upload">Wybierz zdjęcia</Label>
                                    <Input
                                      id="consultation-upload"
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleImageUpload}
                                      className="mt-2"
                                    />
                                  </div>
                                  <Button className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Dodaj Zdjęcia Konsultacji
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {hasConsultationImages(selectedPatient.id) && (
                              <Badge className="bg-green-100 text-green-800">
                                Konsultacja załączona
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="therapy" className="space-y-4">
                  {/* Anesthesia-specific anticoagulant guidelines */}
                  {selectedPatient.questionnaireData?.anesthesiaSelection?.preferredType && hasAnticoagulantDrugs(selectedPatient) && (
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-purple-800">
                          <Activity className="w-5 h-5" />
                          <span>Wytyczne Terapii Przeciwkrzepliwej - Rodzaj Znieczulenia</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="font-semibold text-purple-900 mb-2">
                              Wybrany rodzaj znieczulenia: {
                                selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'general' ? 'Ogólne' :
                                selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'spinal' ? 'Podpajęczynówkowe' :
                                selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'epidural' ? 'Nadoponowe' :
                                selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'combined' ? 'Łączone' :
                                'Decyzja anestezjologa'
                              }
                            </p>

                            {(selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'spinal' ||
                              selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'epidural') && (
                              <Alert className="border-red-300 bg-red-100 mt-3">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <div className="space-y-2">
                                    <p className="text-red-800 font-medium">
                                      ⚠️ PRZECIWWSKAZANIE - Znieczulenie neuraksjalalne u pacjenta na lekach przeciwkrzepliwych
                                    </p>
                                    <div className="text-red-700 text-sm space-y-1">
                                      <p><strong>Zwiększone ryzyko:</strong></p>
                                      <p>• Krwiak epiduralny/podpajęczynówkowy</p>
                                      <p>• Uszkodzenie rdzenia kręgowego</p>
                                      <p>• Trwałe deficyty neurologiczne</p>
                                    </div>
                                    <div className="bg-red-200 rounded p-2 mt-2">
                                      <p className="text-red-900 text-sm font-medium">
                                        🔄 KONIECZNA ZMIANA: Rozważyć znieczulenie ogólne lub odstawienie leków zgodnie z wytycznymi
                                      </p>
                                    </div>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                            {selectedPatient.questionnaireData.anesthesiaSelection.preferredType === 'general' && (
                              <Alert className="border-green-300 bg-green-100 mt-3">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <p className="text-green-800">
                                    ✅ Znieczulenie ogólne jest bezpieczne przy kontynuacji terapii przeciwkrzepliwej
                                  </p>
                                  <p className="text-green-700 text-sm mt-1">
                                    Leki przeciwkrzepliwe mogą być kontynuowane w zależności od ryzyka krwawienia zabiegu
                                  </p>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>

                          {/* Time-based guidelines */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-3">⏰ Harmonogram odstawienia leków przed znieczuleniem neuraksjalnym:</h4>
                            <div className="space-y-3 text-sm">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Warfaryna</p>
                                  <p className="text-blue-800">5 dni + INR &lt; 1.4</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Dabigatran</p>
                                  <p className="text-blue-800">2-4 dni (zależnie od funkcji nerek)</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Riwaroksaban</p>
                                  <p className="text-blue-800">72 godziny</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Apiksaban</p>
                                  <p className="text-blue-800">72 godziny</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Klopidogrel</p>
                                  <p className="text-blue-800">7 dni</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded border">
                                  <p className="font-medium text-blue-900">Heparyna LMWH</p>
                                  <p className="text-blue-800">24 godziny</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <EnhancedBridgeTherapy
                    patientName={selectedPatient.name}
                    currentMedications={selectedPatient.questionnaireData?.selectedDrugs || []}
                    patientConditions={[
                      ...(selectedPatient.questionnaireData?.chronicDiseases.cardiovascular || []),
                      ...(selectedPatient.questionnaireData?.chronicDiseases.respiratory || []),
                      ...(selectedPatient.questionnaireData?.chronicDiseases.nervous || [])
                    ]}
                    anesthesiaType={selectedPatient.questionnaireData?.anesthesiaSelection?.preferredType}
                    onBridgeTherapyPlan={(plan) => {
                      console.log('Bridge therapy plan generated:', plan);
                      // Here you would typically save to backend or state management
                    }}
                  />
                </TabsContent>

                {/* AnesthesiaRecommendation temporarily disabled due to component issues */}
              </Tabs>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Wybierz pacjenta z listy aby zobaczyć szczegóły</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
