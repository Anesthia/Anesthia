import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Heart, Wind, Brain, Bone, Pill, AlertTriangle, FileSignature, Activity, Droplets, Search, Plus, Camera } from "lucide-react";
import { questionnaireStore } from "@/lib/questionnaire-store";
import { toast } from "sonner";
import DrugSearchSelector, { type SelectedDrug } from "@/components/DrugSearchSelector";

interface PatientData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    weight: string;
    height: string;
    plannedProcedure: string;
    procedureDate: string;
    eReferralCode: string;
    eReferralImage: string;
    eReferralMethod: 'manual' | 'photo' | '';
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
  selectedDrugs: SelectedDrug[];
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
  anesthesiaSelection: {
    preferredType: string;
    contraindications: string[];
    specialConsiderations: string;
  };
  cardiacConsultation: {
    hasConsultation: boolean;
    images: string[];
    addLater: boolean;
    showReferral: boolean;
  };
  consultations: {
    cardiologyImages: string[];
    pneumologyImages: string[];
    neurologyImages: string[];
    endocrinologyImages: string[];
    otherImages: string[];
    notes: string;
  };
  consents: {
    dataProcessing: boolean;
    aiUsage: boolean;
    procedureConsent: boolean;
    questionnaireSubmission: boolean;
  };
}

export default function PatientQuestionnaire() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allergies, setAllergies] = useState({
    medications: [] as string[],
    substances: [] as string[],
    customMedications: "",
    customSubstances: "",
    selectedAntibiotics: [] as string[]
  });
  const [showAntibioticsDialog, setShowAntibioticsDialog] = useState(false);
  const [showConsultationAlert, setShowConsultationAlert] = useState(false);
  const [showCardiacDialog, setShowCardiacDialog] = useState(false);
  const [cardiacConsultation, setCardiacConsultation] = useState({
    hasConsultation: false,
    images: [] as string[],
    addLater: false,
    showReferral: false
  });
  const [consultationImages, setConsultationImages] = useState<string[]>([]);
  const [patientData, setPatientData] = useState<PatientData>({
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      weight: "",
      height: "",
      plannedProcedure: "",
      procedureDate: "",
      eReferralCode: "",
      eReferralImage: "",
      eReferralMethod: ""
    },
    chronicDiseases: {
      cardiovascular: [],
      vascular: [],
      respiratory: [],
      nervous: [],
      musculoskeletal: [],
      digestive: [],
      urinary: [],
      endocrine: [],
      other: []
    },
    allergies: {
      medications: [],
      substances: []
    },
    currentMedications: "",
    selectedDrugs: [],
    substanceUse: {
      tobacco: "",
      alcohol: "",
      drugs: ""
    },
    anesthesiaHistory: {
      previousAnesthesia: false,
      complications: "",
      familyHistory: false,
      implants: ""
    },
    anesthesiaSelection: {
      preferredType: "",
      contraindications: [],
      specialConsiderations: ""
    },
    cardiacConsultation: {
      hasConsultation: false,
      images: [],
      addLater: false,
      showReferral: false
    },
    consultations: {
      cardiologyImages: [],
      pneumologyImages: [],
      neurologyImages: [],
      endocrinologyImages: [],
      otherImages: [],
      notes: ""
    },
    consents: {
      dataProcessing: false,
      aiUsage: false,
      procedureConsent: false,
      questionnaireSubmission: false
    }
  });

  const sections = [
    { id: 0, title: "Informacje o Pacjencie", icon: Heart },
    { id: 1, title: "Choroby Przewlekłe - Serce i Naczynia", icon: Heart },
    { id: 2, title: "Choroby Przewlekłe - Układ Oddechowy", icon: Wind },
    { id: 3, title: "Choroby Przewlekłe - Układ Nerwowy", icon: Brain },
    { id: 4, title: "Choroby Przewlekłe - Układ Endokrynny", icon: Pill },
    { id: 5, title: "Choroby Przewlekłe - Układ Trawienny", icon: Activity },
    { id: 6, title: "Choroby Przewlekłe - Układ Moczowy", icon: Droplets },
    { id: 7, title: "Choroby Przewlekłe - Inne", icon: Bone },
    { id: 8, title: "Alergie i Uczulenia", icon: AlertTriangle },
    { id: 9, title: "Leki i Używki", icon: Pill },
    { id: 10, title: "Historia Anestezjologiczna", icon: Heart },
    { id: 11, title: "Wybór Rodzaju Znieczulenia", icon: Activity },
    { id: 12, title: "Podpisy i Oświadczenia", icon: FileSignature }
  ];

  const cardiovascularOptions = [
    "Nadciśnienie tętnicze",
    "Choroba wieńcowa / przebyte zawały serca",
    "Zaburzenia rytmu serca (np. migotanie przedsionków)",
    "Niewydolność serca",
    "Wady zastawkowe serca",
    "Wszczepiony rozrusznik / ICD"
  ];

  const respiratoryOptions = [
    "Astma oskrzelowa",
    "POChP (Przewlekła Obturacyjna Choroba Płuc)",
    "Bezdech senny",
    "Przewlekłe zapalenie oskrzeli",
    "Rozstrzenie oskrzeli",
    "Częste infekcje dróg oddechowych"
  ];

  const nervousOptions = [
    "Padaczka",
    "Udar mózgu lub TIA",
    "Choroba Parkinsona",
    "Stwardnienie rozsiane",
    "Myasthenia gravis",
    "Zaburzenia nerwowo-mięśniowe"
  ];

  const commonAntibiotics = [
    { name: "Amoksycylina", brands: ["Ospamox", "Duomox", "Flemoxin"] },
    { name: "Azytromycyna", brands: ["Sumamed", "Azimycin", "Zitromax"] },
    { name: "Klarytromycyna", brands: ["Klacid", "Fromilid", "Clabax"] },
    { name: "Ciprofloksacyna", brands: ["Ciprinol", "Ciproxin", "Ciprobay"] },
    { name: "Doksycyklina", brands: ["Vibramycin", "Doxybene", "Unidox"] },
    { name: "Cefaleksyna", brands: ["Ospexin", "Lexin", "Ceporex"] },
    { name: "Erytromycyna", brands: ["Erycin", "Sinerit", "Ilosone"] },
    { name: "Klindamycyna", brands: ["Dalacin", "Clindacin", "Sobelin"] },
    { name: "Kotrimoksazol", brands: ["Biseptol", "Bactrim", "Septrin"] },
    { name: "Metronidazol", brands: ["Flagyl", "Entizol", "Metrogyl"] }
  ];

  const riskCardiacConditions = [
    "Choroba wieńcowa / przebyte zawały serca",
    "Niewydolność serca",
    "Wady zastawkowe serca",
    "Wszczepiony rozrusznik / ICD"
  ];

  const specificCardiacConditions = [
    "Choroba wieńcowa / przebyte zawały serca",
    "Zaburzenia rytmu serca (np. migotanie przedsionków)",
    "Niewydolność serca"
  ];

  const checkForRiskConditions = (conditions: string[]) => {
    return conditions.some(condition => riskCardiacConditions.includes(condition));
  };

  // Define conditions requiring consultations
  const consultationRequirements = {
    cardiology: [
      "Choroba wieńcowa / przebyte zawały serca",
      "Niewydolność serca",
      "Wady zastawkowe serca",
      "Wszczepiony rozrusznik / ICD",
      "Zaburzenia rytmu serca (np. migotanie przedsionków)"
    ],
    pneumology: [
      "Astma oskrzelowa",
      "POChP (Przewlekła Obturacyjna Choroba Płuc)",
      "Bezdech senny"
    ],
    neurology: [
      "Padaczka",
      "Udar mózgu lub TIA",
      "Choroba Parkinsona",
      "Stwardnienie rozsiane"
    ],
    endocrinology: [
      "Cukrzyca typu 1",
      "Niedoczynność tarczycy (hipotyroza)",
      "Nadczynność tarczycy (hipertyroza)",
      "Choroba Addisona"
    ]
  };

  const getRequiredConsultations = () => {
    const required: string[] = [];
    const allConditions = [
      ...patientData.chronicDiseases.cardiovascular,
      ...patientData.chronicDiseases.respiratory,
      ...patientData.chronicDiseases.nervous,
      ...patientData.chronicDiseases.endocrine
    ];

    if (allConditions.some(condition => consultationRequirements.cardiology.includes(condition))) {
      required.push('Kardiologia');
    }
    if (allConditions.some(condition => consultationRequirements.pneumology.includes(condition))) {
      required.push('Pulmonologia');
    }
    if (allConditions.some(condition => consultationRequirements.neurology.includes(condition))) {
      required.push('Neurologia');
    }
    if (allConditions.some(condition => consultationRequirements.endocrinology.includes(condition))) {
      required.push('Endokrynologia');
    }

    return required;
  };

  const getAllSelectedConditions = () => {
    return [
      ...patientData.chronicDiseases.cardiovascular,
      ...patientData.chronicDiseases.respiratory,
      ...patientData.chronicDiseases.nervous,
      ...patientData.chronicDiseases.endocrine,
      ...patientData.chronicDiseases.digestive,
      ...patientData.chronicDiseases.urinary,
      ...patientData.chronicDiseases.other
    ].filter(condition => condition.length > 0);
  };

  const getHighRiskConditions = () => {
    const allConditions = getAllSelectedConditions();
    const highRisk = [
      "Choroba wieńcowa / przebyte zawały serca",
      "Niewydolność serca",
      "Astma oskrzelowa",
      "POChP (Przewlekła Obturacyjna Choroba Płuc)",
      "Padaczka",
      "Cukrzyca typu 1",
      "Przewlekła choroba nerek"
    ];
    return allConditions.filter(condition => highRisk.includes(condition));
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

  const handleCardiacImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCardiacConsultation(prev => ({
            ...prev,
            images: [...prev.images, e.target?.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const endocrineOptions = [
    "Cukrzyca typu 1",
    "Cukrzyca typu 2",
    "Niedoczynność tarczycy (hipotyroza)",
    "Nadczynność tarczycy (hipertyroza)",
    "Choroba Hashimoto",
    "Choroba Gravesa-Basedowa",
    "Wole tarczycy",
    "Guzy tarczycy",
    "Choroba Addisona",
    "Zespół Cushinga",
    "Zaburzenia przytarczyc",
    "Osteoporoza",
    "Zespół metaboliczny",
    "Otyłość (BMI > 30)",
    "Zaburzenia hormonów płciowych",
    "Zespół policystycznych jajników (PCOS)",
    "Zaburzenia przysadki",
    "Zaburzenia nadnerczy"
  ];

  const handleCheckboxChange = (section: keyof PatientData['chronicDiseases'], value: string, checked: boolean) => {
    const newConditions = checked
      ? [...patientData.chronicDiseases[section], value]
      : patientData.chronicDiseases[section].filter(item => item !== value);

    setPatientData(prev => ({
      ...prev,
      chronicDiseases: {
        ...prev.chronicDiseases,
        [section]: newConditions
      }
    }));

    // Check for specific cardiac conditions that require dialog
    if (section === 'cardiovascular' && checked && specificCardiacConditions.includes(value)) {
      setShowCardiacDialog(true);
    }

    // Check for risk conditions that require consultation
    if (section === 'cardiovascular' && checked && riskCardiacConditions.includes(value)) {
      setShowConsultationAlert(true);
    }
  };

  const handleAllergyChange = (category: 'medications' | 'substances', item: string, checked: boolean) => {
    setAllergies(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], item]
        : prev[category].filter(allergen => allergen !== item)
    }));

    // Show antibiotics dialog if "Antybiotyki" is selected
    if (item === "Antybiotyki" && checked) {
      setShowAntibioticsDialog(true);
    }
  };

  const handleSubmitQuestionnaire = async () => {
    // Basic validation
    if (!patientData.personalInfo.fullName.trim()) {
      toast.error("Proszę podać imię i nazwisko");
      setCurrentSection(0);
      return;
    }

    if (!patientData.personalInfo.plannedProcedure.trim()) {
      toast.error("Proszę podać planowany zabieg");
      setCurrentSection(0);
      return;
    }

    // Consent validation
    if (!patientData.consents.dataProcessing || !patientData.consents.aiUsage ||
        !patientData.consents.procedureConsent || !patientData.consents.questionnaireSubmission) {
      toast.error("Proszę zaakceptować wszystkie wymagane oświadczenia");
      setCurrentSection(9);
      return;
    }

    setIsSubmitting(true);

    try {
      // Update patient data with current cardiac consultation state
      const finalPatientData = {
        ...patientData,
        cardiacConsultation: cardiacConsultation
      };

      const submissionId = questionnaireStore.submitQuestionnaire(finalPatientData);
      toast.success("Kwestionariusz został wysłany pomyślnie!");

      // Navigate to a success page or back to home
      setTimeout(() => {
        navigate("/", {
          state: {
            message: "Kwestionariusz został wysłany. Dziękujemy!",
            submissionId
          }
        });
      }, 1500);
    } catch (error) {
      toast.error("Wystąpił błąd podczas wysyłania kwestionariusza");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfoSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Imię i Nazwisko</Label>
          <Input
            id="fullName"
            value={patientData.personalInfo.fullName || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Data urodzenia</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientData.personalInfo.dateOfBirth || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
            }))}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Waga (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={patientData.personalInfo.weight || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, weight: e.target.value }
            }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="height">Wzrost (cm)</Label>
          <Input
            id="height"
            type="number"
            value={patientData.personalInfo.height || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, height: e.target.value }
            }))}
            className="mt-1"
          />
        </div>
      </div>

      {/* E-Referral Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileSignature className="w-5 h-5 text-blue-600" />
            <span>E-skierowanie na zabieg</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              Wybierz sposób wprowadzenia danych z e-skierowania. System automatycznie wypełni informacje o zabiegu.
            </p>
          </div>

          <RadioGroup
            value={patientData.personalInfo.eReferralMethod}
            onValueChange={(value: 'manual' | 'photo') => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, eReferralMethod: value }
            }))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="photo" id="referral-photo" />
              <Label htmlFor="referral-photo" className="font-medium">
                📷 Zrób zdjęcie e-skierowania
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="referral-code" />
              <Label htmlFor="referral-code" className="font-medium">
                🔢 Wpisz kod e-skierowania
              </Label>
            </div>
          </RadioGroup>

          {/* Photo Upload */}
          {patientData.personalInfo.eReferralMethod === 'photo' && (
            <div className="space-y-3">
              <Label htmlFor="referral-image" className="text-sm font-medium">
                Zrób lub wybierz zdjęcie e-skierowania:
              </Label>
              <Input
                id="referral-image"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const imageData = event.target?.result as string;

                      // Mock AI/OCR processing - simulate different procedures based on random selection
                      const mockProcedures = [
                        {
                          procedure: "Cholecystektomia laparoskopowa",
                          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          extractedCode: "ESK-2024-001234567",
                          confidence: "95%"
                        },
                        {
                          procedure: "Operacja zaćmy lewego oka",
                          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          extractedCode: "ESK-2024-002345678",
                          confidence: "92%"
                        },
                        {
                          procedure: "Artroskopia stawu kolanowego",
                          date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          extractedCode: "ESK-2024-005678901",
                          confidence: "88%"
                        }
                      ];

                      const selectedProcedure = mockProcedures[Math.floor(Math.random() * mockProcedures.length)];

                      setPatientData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          eReferralImage: imageData,
                          plannedProcedure: selectedProcedure.procedure,
                          procedureDate: selectedProcedure.date,
                          eReferralCode: selectedProcedure.extractedCode
                        }
                      }));

                      toast.success(`Zdjęcie e-skierowania zostało przetworzone!\n🤖 AI rozpoznało: ${selectedProcedure.procedure}\n📊 Pewność: ${selectedProcedure.confidence}\n🔢 Wykryty kod: ${selectedProcedure.extractedCode}`);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mt-1"
              />
              {patientData.personalInfo.eReferralImage && (
                <div className="mt-3">
                  <img
                    src={patientData.personalInfo.eReferralImage}
                    alt="E-skierowanie"
                    className="max-w-full h-32 object-cover rounded-lg border border-blue-300"
                  />
                  <p className="text-green-700 text-sm mt-2 font-medium">
                    ✅ Zdjęcie e-skierowania zostało wczytane
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Manual Code Entry */}
          {patientData.personalInfo.eReferralMethod === 'manual' && (
            <div className="space-y-3">
              <Label htmlFor="referral-code-input" className="text-sm font-medium">
                Kod e-skierowania:
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="referral-code-input"
                  placeholder="np. ESK-2024-001234567"
                  value={patientData.personalInfo.eReferralCode}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, eReferralCode: e.target.value }
                  }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const referralCode = patientData.personalInfo.eReferralCode.trim();
                    if (referralCode) {
                      // Mock e-referral database lookup
                      const mockEReferrals: Record<string, { procedure: string; date: string; doctor: string; clinic: string }> = {
                        'ESK-2024-001234567': {
                          procedure: 'Cholecystektomia laparoskopowa',
                          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          doctor: 'Dr. Anna Kowalska',
                          clinic: 'Szpital Wojewódzki w Warszawie'
                        },
                        'ESK-2024-002345678': {
                          procedure: 'Operacja zaćmy prawego oka',
                          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          doctor: 'Dr. Piotr Nowak',
                          clinic: 'Centrum Okulistyczne'
                        },
                        'ESK-2024-003456789': {
                          procedure: 'Endoprotezoplastyka stawu biodrowego',
                          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          doctor: 'Dr. Marek Wiśniewski',
                          clinic: 'Szpital Ortopedyczny'
                        },
                        'ESK-2024-004567890': {
                          procedure: 'Resekcja nowotworu jelita grubego',
                          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          doctor: 'Prof. dr hab. Maria Lewandowska',
                          clinic: 'Centrum Onkologii'
                        }
                      };

                      const referralData = mockEReferrals[referralCode];
                      if (referralData) {
                        setPatientData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            plannedProcedure: referralData.procedure,
                            procedureDate: referralData.date
                          }
                        }));
                        toast.success(`Dane z e-skierowania zostały pobrane pomyślnie!\nLekarz: ${referralData.doctor}\nPlacówka: ${referralData.clinic}`);
                      } else {
                        // Generic fallback for any other code
                        setPatientData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            plannedProcedure: "Zabieg diagnostyczny",
                            procedureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                          }
                        }));
                        toast.success("Dane z e-skierowania zostały pobrane pomyślnie!");
                      }
                    } else {
                      toast.error("Proszę wprowadzić kod e-skierowania");
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Pobierz
                </Button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Wprowadź kod e-skierowania, a system automatycznie pobierze szczegóły zabiegu</p>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium">Przykładowe kody do testowania:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li><code className="bg-white px-1 rounded">ESK-2024-001234567</code> - Cholecystektomia</li>
                    <li><code className="bg-white px-1 rounded">ESK-2024-002345678</code> - Operacja zaćmy</li>
                    <li><code className="bg-white px-1 rounded">ESK-2024-003456789</code> - Endoproteza biodra</li>
                    <li><code className="bg-white px-1 rounded">ESK-2024-004567890</code> - Operacja onkologiczna</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traditional Manual Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Dane zabiegu</h3>
          {(patientData.personalInfo.eReferralCode || patientData.personalInfo.eReferralImage) && (
            <Badge className="bg-green-100 text-green-800">
              Wypełnione automatycznie z e-skierowania
            </Badge>
          )}
        </div>

        <div>
          <Label htmlFor="plannedProcedure">Planowany zabieg</Label>
          <Input
            id="plannedProcedure"
            value={patientData.personalInfo.plannedProcedure || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, plannedProcedure: e.target.value }
            }))}
            className="mt-1"
            placeholder="Nazwa planowanego zabiegu..."
          />
        </div>

        <div>
          <Label htmlFor="procedureDate">Data zabiegu</Label>
          <Input
            id="procedureDate"
            type="date"
            value={patientData.personalInfo.procedureDate || ""}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, procedureDate: e.target.value }
            }))}
            className="mt-1"
        />
      </div>

      {/* Dynamic Medical Summary */}
      {getAllSelectedConditions().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Podsumowanie Stanu Zdrowia</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* High Risk Conditions */}
            {getHighRiskConditions().length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-semibold text-red-900 mb-2">🚨 Choroby wysokiego ryzyka anestezjologicznego:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  {getHighRiskConditions().map((condition, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Selected Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Wszystkie zaznaczone choroby ({getAllSelectedConditions().length}):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800 text-sm">
                {getAllSelectedConditions().map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Consultations */}
            {getRequiredConsultations().length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-semibold text-purple-900 mb-2">👨‍⚕️ Wymagane konsultacje specjalistyczne:</h4>
                <div className="space-y-2">
                  {getRequiredConsultations().map((specialty, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 mr-2">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Consultation Upload Section */}
      {getRequiredConsultations().length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <span>Konsultacje Specjalistyczne</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
              <p className="text-purple-800 text-sm">
                Na podstawie zaznaczonych chorób, zalecamy załączenie konsultacji specjalistycznych.
                Możesz dodać je teraz lub na końcu wypełniania kwestionariusza.
              </p>
            </div>

            {getRequiredConsultations().includes('Kardiologia') && (
              <div className="space-y-2">
                <Label className="font-medium text-purple-900">💖 Konsultacja kardiologiczna (ECHO, EKG, zalecenia):</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPatientData(prev => ({
                            ...prev,
                            consultations: {
                              ...prev.consultations,
                              cardiologyImages: [...prev.consultations.cardiologyImages, event.target?.result as string]
                            }
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      toast.success("Zdjęcia konsultacji kardiologicznej zostały dodane");
                    }
                  }}
                  className="mt-1"
                />
                {patientData.consultations.cardiologyImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.consultations.cardiologyImages.map((image, index) => (
                      <img key={index} src={image} alt={`Kardiologia ${index + 1}`} className="w-16 h-16 object-cover rounded border" />
                    ))}
                    <Badge className="bg-green-100 text-green-800">
                      {patientData.consultations.cardiologyImages.length} zdjęć
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {getRequiredConsultations().includes('Pulmonologia') && (
              <div className="space-y-2">
                <Label className="font-medium text-purple-900">🫁 Konsultacja pulmonologiczna (spirometria, RTG klatki piersiowej):</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPatientData(prev => ({
                            ...prev,
                            consultations: {
                              ...prev.consultations,
                              pneumologyImages: [...prev.consultations.pneumologyImages, event.target?.result as string]
                            }
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      toast.success("Zdjęcia konsultacji pulmonologicznej zostały dodane");
                    }
                  }}
                  className="mt-1"
                />
                {patientData.consultations.pneumologyImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.consultations.pneumologyImages.map((image, index) => (
                      <img key={index} src={image} alt={`Pulmonologia ${index + 1}`} className="w-16 h-16 object-cover rounded border" />
                    ))}
                    <Badge className="bg-green-100 text-green-800">
                      {patientData.consultations.pneumologyImages.length} zdjęć
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {getRequiredConsultations().includes('Neurologia') && (
              <div className="space-y-2">
                <Label className="font-medium text-purple-900">🧠 Konsultacja neurologiczna (EEG, rezonans, zalecenia):</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPatientData(prev => ({
                            ...prev,
                            consultations: {
                              ...prev.consultations,
                              neurologyImages: [...prev.consultations.neurologyImages, event.target?.result as string]
                            }
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      toast.success("Zdjęcia konsultacji neurologicznej zostały dodane");
                    }
                  }}
                  className="mt-1"
                />
                {patientData.consultations.neurologyImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.consultations.neurologyImages.map((image, index) => (
                      <img key={index} src={image} alt={`Neurologia ${index + 1}`} className="w-16 h-16 object-cover rounded border" />
                    ))}
                    <Badge className="bg-green-100 text-green-800">
                      {patientData.consultations.neurologyImages.length} zdjęć
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {getRequiredConsultations().includes('Endokrynologia') && (
              <div className="space-y-2">
                <Label className="font-medium text-purple-900">🏥 Konsultacja endokrynologiczna (TSH, HbA1c, zalecenia):</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPatientData(prev => ({
                            ...prev,
                            consultations: {
                              ...prev.consultations,
                              endocrinologyImages: [...prev.consultations.endocrinologyImages, event.target?.result as string]
                            }
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      toast.success("Zdjęcia konsultacji endokrynologicznej zostały dodane");
                    }
                  }}
                  className="mt-1"
                />
                {patientData.consultations.endocrinologyImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.consultations.endocrinologyImages.map((image, index) => (
                      <img key={index} src={image} alt={`Endokrynologia ${index + 1}`} className="w-16 h-16 object-cover rounded border" />
                    ))}
                    <Badge className="bg-green-100 text-green-800">
                      {patientData.consultations.endocrinologyImages.length} zdjęć
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-medium text-purple-900">📝 Dodatkowe uwagi dotyczące konsultacji:</Label>
              <Textarea
                placeholder="Dodatkowe informacje, zalecenia specjalistów, planowane badania..."
                value={patientData.consultations.notes}
                onChange={(e) => setPatientData(prev => ({
                  ...prev,
                  consultations: { ...prev.consultations, notes: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );

  const renderCheckboxSection = (title: string, options: string[], section: keyof PatientData['chronicDiseases']) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
          <Checkbox
            id={option}
            checked={patientData.chronicDiseases[section].includes(option)}
            onCheckedChange={(checked) => handleCheckboxChange(section, option, checked as boolean)}
            className="scale-110"
          />
          <Label htmlFor={option} className="text-sm font-normal flex-1 cursor-pointer leading-relaxed">
            {option}
          </Label>
        </div>
      ))}
      <div>
        <Label htmlFor={`${section}-other`}>Inne:</Label>
        <Input
          id={`${section}-other`}
          placeholder="Opisz inne choroby..."
          className="mt-1"
          value=""
          onChange={() => {}}
        />
      </div>
    </div>
  );

  const getCurrentSectionContent = () => {
    switch (currentSection) {
      case 0:
        return renderPersonalInfoSection();
      case 1:
        return (
          <div className="space-y-6">
            {renderCheckboxSection("🫀 Układ Sercowo-Naczyniowy", cardiovascularOptions, 'cardiovascular')}

            {/* Cardiac Consultation Dialog */}
            <Dialog open={showCardiacDialog} onOpenChange={setShowCardiacDialog}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span>Konsultacja Kardiologiczna</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Ze względu na zaznaczone choroby serca zalecamy przeprowadzenie konsultacji
                      kardiologicznej z wynikami ECHO serca przed zabiegiem anestezjologicznym.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Czy posiada Pan/Pani konsultację kardiologiczną?</Label>

                    <RadioGroup
                      value={cardiacConsultation.hasConsultation ? "yes" : cardiacConsultation.addLater ? "later" : "no"}
                      onValueChange={(value) => {
                        if (value === "yes") {
                          setCardiacConsultation(prev => ({ ...prev, hasConsultation: true, addLater: false, showReferral: false }));
                        } else if (value === "later") {
                          setCardiacConsultation(prev => ({ ...prev, hasConsultation: false, addLater: true, showReferral: false }));
                        } else {
                          setCardiacConsultation(prev => ({ ...prev, hasConsultation: false, addLater: false, showReferral: true }));
                        }
                      }}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="has-consultation" />
                        <Label htmlFor="has-consultation">Tak, mam konsultację - dodam teraz</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="later" id="add-later" />
                        <Label htmlFor="add-later">Mam konsultację - dodam na końcu wypełniania ankiety</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-consultation" />
                        <Label htmlFor="no-consultation">Nie mam konsultacji kardiologicznej</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {cardiacConsultation.hasConsultation && (
                    <div className="space-y-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <Label className="text-sm font-semibold">Dodaj zdjęcia konsultacji kardiologicznej i wyników ECHO:</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleCardiacImageUpload}
                        className="mt-2"
                      />
                      {cardiacConsultation.images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-green-700 font-medium">
                            Dodano {cardiacConsultation.images.length} zdjęć konsultacji
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {cardiacConsultation.addLater && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-yellow-800">
                          Pamiętaj o dodaniu zdjęć konsultacji kardiologicznej przed zakończeniem ankiety.
                          Znajdziesz odpowiednią sekcję na końcu kwestionariusza.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {cardiacConsultation.showReferral && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-orange-800 font-medium">
                          W panelu lekarza zostanie automatycznie wygenerowane skierowanie na konsultację kardiologiczną.
                        </p>
                        <p className="text-orange-700 text-sm mt-1">
                          Zalecamy wykonanie konsultacji kardiologicznej z ECHO serca przed planowanym zabiegiem.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowCardiacDialog(false)}
                    >
                      Anuluj
                    </Button>
                    <Button
                      onClick={() => setShowCardiacDialog(false)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Zatwierdź
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      case 2:
        return renderCheckboxSection("🫁 Układ Oddechowy", respiratoryOptions, 'respiratory');
      case 3:
        return renderCheckboxSection("🧠 Układ Nerwowy", nervousOptions, 'nervous');
      case 4:
        return renderCheckboxSection("🏥 Układ Endokrynny", endocrineOptions, 'endocrine');
      case 5:
        return renderCheckboxSection("🧬 Układ Trawienny", [
          "Refluks żołądkowo-przełykowy / GERD",
          "Choroba wrzodowa żołądka",
          "Marskość w��troby",
          "Wirusowe zapalenie wątroby",
          "Nieswoiste zapalenia jelit (IBD)",
          "Choroba Crohna",
          "Wrzodziejące zapalenie jelita grubego",
          "Zespó�� jelita drażliwego (IBS)",
          "Kamica żółciowa",
          "Zapalenie trzustki",
          "Choroba uchytkowa jelita",
          "Nieprawidłowe testy wątrobowe"
        ], 'digestive');
      case 6:
        return renderCheckboxSection("💧 Układ Moczowy", [
          "Przewlekła choroba nerek",
          "Kamica nerkowa",
          "Leczenie dializami",
          "Częste infekcje układu moczowego",
          "Przetoka tętniczo-żylna (dla dializy)",
          "Przeszczep nerki",
          "Nadciśnienie nerkowe",
          "Nerczyce",
          "Przerost prostaty",
          "Zaburzenia mikcji",
          "Niewydolność nerek",
          "Torbielowatość nerek"
        ], 'urinary');
      case 7:
        return renderCheckboxSection("🦴 Układ Mięśniowo-Szkieletowy i Inne", [
          "Reumatoidalne zapalenie stawów",
          "Zesztywniające zapalenie stawów kręgosłupa",
          "Dyskopatia (choroba krążków międzykręgowych)",
          "Skolioza",
          "Zaburzenia mięśniowe (np. dystrofie)",
          "Ograniczona ruchomość szyi lub żuchwy",
          "Choroba zwyrodnieniowa stawów",
          "Fibromialgia",
          "Osteoporoza",
          "Przepuklina krążka międzykręgowego",
          "Kręgozmyk",
          "Urazy kręgosłupa w wywiadzie",
          "Choroby hematologiczne",
          "Nowotwory złośliwe",
          "Choroby autoimmunologiczne",
          "Zaburzenia krzepnięcia krwi",
          "HIV/AIDS",
          "Inne choroby zakaźne"
        ], 'other');
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">🌡️ Alergie / Uczulenia</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium">🧪 Leki / Substancje czynne:</h4>
              {[
                "Propofol",
                "Lateks",
                "Antybiotyki",
                "Znieczulenia miejscowe",
                "NLPZ (np. ibuprofen, ketoprofen)",
                "Paracetamol",
                "Leki przeciwwymiotne",
                "Opioidy (np. morfina, fentanyl)"
              ].map((med) => (
                <div key={med} className="flex items-center space-x-2">
                  <Checkbox
                    id={med}
                    checked={allergies.medications.includes(med)}
                    onCheckedChange={(checked) => handleAllergyChange('medications', med, checked as boolean)}
                  />
                  <Label htmlFor={med} className="text-sm font-normal">{med}</Label>
                </div>
              ))}

              {/* Manual input for custom medications */}
              <div className="mt-4">
                <Label htmlFor="customMedications" className="text-sm font-medium">Inne leki (wpisz ręcznie):</Label>
                <Input
                  id="customMedications"
                  placeholder="Wpisz nazwy leków, na które jesteś uczulony..."
                  value={allergies.customMedications}
                  onChange={(e) => setAllergies(prev => ({ ...prev, customMedications: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">🧴 Inne substancje istotne anestezjologicznie:</h4>
              {[
                "Jod (środki kontrastowe, antyseptyki)",
                "Metale (np. tytan, nikiel - używane w implantach)",
                "Środki dezynfekcyjne (np. chlorheksydyna)",
                "Barwniki diagnostyczne"
              ].map((substance) => (
                <div key={substance} className="flex items-center space-x-2">
                  <Checkbox
                    id={substance}
                    checked={allergies.substances.includes(substance)}
                    onCheckedChange={(checked) => handleAllergyChange('substances', substance, checked as boolean)}
                  />
                  <Label htmlFor={substance} className="text-sm font-normal">{substance}</Label>
                </div>
              ))}

              {/* Manual input for custom substances */}
              <div className="mt-4">
                <Label htmlFor="customSubstances" className="text-sm font-medium">Inne substancje (wpisz ręcznie):</Label>
                <Input
                  id="customSubstances"
                  placeholder="Wpisz nazwy substancji, na które jesteś uczulony..."
                  value={allergies.customSubstances}
                  onChange={(e) => setAllergies(prev => ({ ...prev, customSubstances: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Consultation Alert for Risk Conditions */}
            {showConsultationAlert && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="text-orange-800 font-medium">
                      Wykryto choroby wymagające konsultacji kardiologicznej przed zabiegiem!
                    </p>
                    <p className="text-orange-700 text-sm">
                      Ze względu na zaznaczone choroby serca zalecamy przeprowadzenie konsultacji
                      kardiologicznej i załączenie dokumentacji do ankiety.
                    </p>
                    <div className="flex space-x-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white">
                            <Camera className="w-4 h-4 mr-2" />
                            Dodaj Zdjęcia Konsultacji
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dodaj Zdjęcia z Konsultacji Kardiologicznej</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="consultation-upload">Wybierz zdjęcia wyników, zaleceń, EKG:</Label>
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
                              Dodaj Zdjęcia
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConsultationAlert(false)}
                      >
                        Zamknij
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Show selected antibiotics if any */}
            {allergies.selectedAntibiotics.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Wybrane antybiotyki powodujące alergie:</h4>
                <div className="flex flex-wrap gap-2">
                  {allergies.selectedAntibiotics.map((antibiotic) => (
                    <Badge key={antibiotic} variant="outline" className="bg-red-100 text-red-800">
                      {antibiotic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Antibiotics Selection Dialog */}
            <Dialog open={showAntibioticsDialog} onOpenChange={setShowAntibioticsDialog}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Wybierz antybiotyki, na które jesteś uczulony</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Zaznacz konkretne antybiotyki, które powodują u Ciebie reakcje alergiczne:
                  </p>
                  {commonAntibiotics.map((antibiotic) => (
                    <div key={antibiotic.name} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox
                          id={antibiotic.name}
                          checked={allergies.selectedAntibiotics.includes(antibiotic.name)}
                          onCheckedChange={(checked) => {
                            setAllergies(prev => ({
                              ...prev,
                              selectedAntibiotics: checked
                                ? [...prev.selectedAntibiotics, antibiotic.name]
                                : prev.selectedAntibiotics.filter(ab => ab !== antibiotic.name)
                            }));
                          }}
                        />
                        <Label htmlFor={antibiotic.name} className="font-medium">
                          {antibiotic.name}
                        </Label>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        Nazwy handlowe: {antibiotic.brands.join(", ")}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setShowAntibioticsDialog(false)}>
                      Anuluj
                    </Button>
                    <Button onClick={() => setShowAntibioticsDialog(false)}>
                      Zatwierdź wybór
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <DrugSearchSelector
              selectedDrugs={patientData.selectedDrugs}
              onDrugsChange={(drugs) => setPatientData(prev => ({
                ...prev,
                selectedDrugs: drugs
              }))}
              placeholder="Wpisz nazwę leku (np. Amlodipina, Metformina)..."
            />

            <div>
              <Label className="text-base font-semibold">Dodatkowe informacje o lekach</Label>
              <Textarea
                placeholder="Dodatkowe informacje o lekach, suplementach lub ziołach nie objętych powyższą listą..."
                className="mt-2"
                value={patientData.currentMedications || ""}
                onChange={(e) => setPatientData(prev => ({
                  ...prev,
                  currentMedications: e.target.value
                }))}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚬 Używki</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Tytoń:</Label>
                  <RadioGroup className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-smoke" id="no-smoke" />
                      <Label htmlFor="no-smoke">Nie palę</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="smoke" id="smoke" />
                      <Label htmlFor="smoke">Palę</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quit" id="quit" />
                      <Label htmlFor="quit">Rzuciłem palenie</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="font-medium">Alkohol:</Label>
                  <RadioGroup className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-alcohol" id="no-alcohol" />
                      <Label htmlFor="no-alcohol">Nie piję alkoholu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasional" id="occasional" />
                      <Label htmlFor="occasional">Okazjonalnie</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular">Regularnie</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">📝 Dodatkowe Informacje dla Anestezjologa</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Czy miał/a Pan/Pani wcześniej znieczulenie ogólne lub regionalne?</Label>
                <RadioGroup className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prev-yes" />
                    <Label htmlFor="prev-yes">TAK</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prev-no" />
                    <Label htmlFor="prev-no">NIE</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="complications">Czy wystąpiły jakieś powikłania?</Label>
                <Textarea
                  id="complications"
                  placeholder="Opisz ewentualne powikłania..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="font-medium">Czy w rodzinie wystąpiły powikłania anestezjologiczne?</Label>
                <RadioGroup className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family-yes" id="family-yes" />
                    <Label htmlFor="family-yes">TAK</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family-no" id="family-no" />
                    <Label htmlFor="family-no">NIE</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="implants">Czy ma Pan/Pani implanty, protezy, aparaty ortodontyczne?</Label>
                <Textarea
                  id="implants"
                  placeholder="Opisz rodzaj i lokalizację..."
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">💉 Wybór Rodzaju Znieczulenia</h3>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                Na podstawie Państwa chorób przewlekłych i planowanego zabiegu, anestezjolog wybierze najbezpieczniejszy
                rodzaj znieczulenia. Poniżej możecie Państwo zaznaczyć swoje preferencje lub przeciwwskazania.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">Preferowany rodzaj znieczulenia:</Label>
                <RadioGroup
                  value={patientData.anesthesiaSelection.preferredType}
                  onValueChange={(value) => setPatientData(prev => ({
                    ...prev,
                    anesthesiaSelection: { ...prev.anesthesiaSelection, preferredType: value }
                  }))}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="general" id="general" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="general" className="font-medium cursor-pointer">
                          Znieczulenie ogólne (narkoza)
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Pacjent śpi podczas całego zabiegu. Zalecane przy dużych operacjach, operacjach brzucha, klatki piersiowej.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="spinal" id="spinal" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="spinal" className="font-medium cursor-pointer">
                          Znieczulenie podpajęczynówkowe (subarachnoidalne)
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Lek podawany do przestrzeni podpajęczynówkowej kręgosłupa. Zalecane przy operacjach brzucha, miednicy, kończyn dolnych.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="epidural" id="epidural" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="epidural" className="font-medium cursor-pointer">
                          Znieczulenie nadoponowe (epiduralne)
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Lek podawany do przestrzeni nadoponowej. Możliwość długotrwałego znieczulenia, kontrola bólu pooperacyjnego.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="combined" id="combined" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="combined" className="font-medium cursor-pointer">
                          Znieczulenie łączone (kombinowane)
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Połączenie różnych technik znieczulenia dla uzyskania optymalnego efektu.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="no-preference" id="no-preference" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="no-preference" className="font-medium cursor-pointer">
                          Brak preferencji - decyzja anestezjologa
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Pozostawiam wybór rodzaju znieczulenia lekarzowi anestezjologowi.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Przeciwwskazania lub obawy dotyczące znieczulenia:</Label>
                <div className="space-y-3">
                  {[
                    "Lęk przed znieczuleniem ogólnym",
                    "Problemy z kręgosłupem (dyskopatia, operacje kręgosłupa)",
                    "Zaburzenia krzepnięcia krwi",
                    "Przyjmowanie leków przeciwkrzepliwych",
                    "Infekcje skóry w miejscu podania znieczulenia",
                    "Problemy neurologiczne",
                    "Wcześniejsze powikłania po znieczuleniu regionalnym"
                  ].map((contraindication) => (
                    <div key={contraindication} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={contraindication}
                        checked={patientData.anesthesiaSelection.contraindications.includes(contraindication)}
                        onCheckedChange={(checked) => {
                          const newContraindications = checked
                            ? [...patientData.anesthesiaSelection.contraindications, contraindication]
                            : patientData.anesthesiaSelection.contraindications.filter(item => item !== contraindication);

                          setPatientData(prev => ({
                            ...prev,
                            anesthesiaSelection: {
                              ...prev.anesthesiaSelection,
                              contraindications: newContraindications
                            }
                          }));
                        }}
                      />
                      <Label htmlFor={contraindication} className="text-sm font-normal cursor-pointer">
                        {contraindication}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="special-considerations" className="text-base font-semibold">
                  Dodatkowe uwagi dotyczące znieczulenia:
                </Label>
                <Textarea
                  id="special-considerations"
                  placeholder="Opisz swoje obawy, wcześniejsze doświadczenia, specjalne życzenia..."
                  className="mt-2"
                  value={patientData.anesthesiaSelection.specialConsiderations}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    anesthesiaSelection: { ...prev.anesthesiaSelection, specialConsiderations: e.target.value }
                  }))}
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-amber-800 font-medium mb-1">Ważne:</p>
                  <p className="text-amber-700 text-sm">
                    Ostateczny wybór rodzaju znieczulenia zawsze należy do anestezjologa i zależy od
                    Państwa stanu zdrowia, rodzaju zabiegu oraz aktualnych wskazań medycznych.
                    Podane preferencje będą wzięte pod uwagę podczas konsultacji.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">���� Podpisy i Oświadczenia</h3>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-4">
                Przed wysłaniem kwestionariusza należy zapoznać się z poniższymi oświadczeniami i wyrazić zgodę na ich treść.
              </p>
            </div>

            <div className="space-y-6">
              {/* Zgoda na przetwarzanie danych */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataProcessing"
                    checked={patientData.consents.dataProcessing}
                    onCheckedChange={(checked) => setPatientData(prev => ({
                      ...prev,
                      consents: { ...prev.consents, dataProcessing: checked as boolean }
                    }))}
                    className="mt-1 scale-110"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dataProcessing" className="text-sm font-semibold cursor-pointer">
                        Zgoda na przetwarzanie danych osobowych *
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pełna treść zgody na przetwarzanie danych osobowych</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm leading-relaxed space-y-4">
                            <p>
                              <strong>ZGODA NA PRZETWARZANIE DANYCH OSOBOWYCH</strong>
                            </p>
                            <p>
                              Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w niniejszym kwestionariuszu
                              przez placówkę medyczną w celu przygotowania do zabiegu anestezjologicznego oraz dokumentacji medycznej.
                              Zgoda obejmuje dane o stanie zdrowia, które są danymi szczególnej kategorii zgodnie z RODO.
                            </p>
                            <p>
                              <strong>Cel przetwarzania:</strong> Przygotowanie do zabiegu anestezjologicznego, dokumentacja medyczna,
                              zapewnienie bezpieczeństwa pacjenta podczas zabiegu.
                            </p>
                            <p>
                              <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO (zgoda) oraz Art. 9 ust. 2 lit. a RODO
                              (zgoda na przetwarzanie danych szczególnych kategorii).
                            </p>
                            <p>
                              <strong>Odbiorcy danych:</strong> Personel medyczny bezpośrednio zaangażowany w zabieg anestezjologiczny
                              oraz powiązane procedury medyczne.
                            </p>
                            <p>
                              <strong>Okres przechowywania:</strong> Dane będą przechowywane przez okres wymagany przepisami prawa
                              dotyczącymi dokumentacji medycznej.
                            </p>
                            <p>
                              <strong>Prawa pacjenta:</strong> Przysługuje Panu/Pani prawo dostępu do danych, ich sprostowania,
                              usunięcia, ograniczenia przetwarzania, przenoszenia oraz prawo wniesienia skargi do organu nadzorczego.
                              Zgodę można wycofać w dowolnym momencie.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w niniejszym kwestionariuszu
                      przez placówkę medyczną w celu przygotowania do zabiegu anestezjologicznego oraz dokumentacji medycznej.
                      Zgoda obejmuje dane o stanie zdrowia, które są danymi szczególnej kategorii zgodnie z RODO.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zgoda na wykorzystanie AI */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="aiUsage"
                    checked={patientData.consents.aiUsage}
                    onCheckedChange={(checked) => setPatientData(prev => ({
                      ...prev,
                      consents: { ...prev.consents, aiUsage: checked as boolean }
                    }))}
                    className="mt-1 scale-110"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="aiUsage" className="text-sm font-semibold cursor-pointer">
                        Zgoda na wspomaganie AI w analizie danych medycznych *
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pełna treść zgody na wykorzystanie AI</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm leading-relaxed space-y-4">
                            <p>
                              <strong>ZGODA NA WSPOMAGANIE AI W ANALIZIE DANYCH MEDYCZNYCH</strong>
                            </p>
                            <p>
                              Wyrażam zgodę na wykorzystanie systemów sztucznej inteligencji do analizy danych zawartych
                              w kwestionariuszu w celu wspomagania procesu diagnostycznego i planowania anestezji.
                              Systemy AI służą wyłącznie do wspomagania decyzji medycznych, które zawsze podejmuje lekarz.
                              Dane są przetwarzane z zachowaniem najwyższych standardów bezpieczeństwa i poufności.
                            </p>
                            <p>
                              <strong>Cel wykorzystania AI:</strong> Analiza wzorców w danych medycznych, wspomaganie
                              identyfikacji czynników ryzyka, optymalizacja protokołów anestezjologicznych.
                            </p>
                            <p>
                              <strong>Ograniczenia:</strong> AI nie zastępuje decyzji lekarza, służy wyłącznie jako narzędzie
                              wspomagające. Wszystkie kluczowe decyzje medyczne podejmuje wykwalifikowany personel medyczny.
                            </p>
                            <p>
                              <strong>Bezpieczeństwo:</strong> Systemy AI są certyfikowane do użytku medycznego,
                              regularnie audytowane i aktualizowane zgodnie z najnowszymi standardami bezpieczeństwa.
                            </p>
                            <p>
                              <strong>Prawo do sprzeciwu:</strong> Pacjent może w dowolnym momencie wycofać zgodę na
                              wykorzystanie AI bez wpływu na jakość opieki medycznej.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Wyrażam zgodę na wykorzystanie system��w sztucznej inteligencji do analizy danych zawartych
                      w kwestionariuszu w celu wspomagania procesu diagnostycznego i planowania anestezji.
                      Systemy AI służą wyłącznie do wspomagania decyzji medycznych, które zawsze podejmuje lekarz.
                      Dane są przetwarzane z zachowaniem najwyższych standardów bezpieczeństwa i poufności.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zgoda na zabieg */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="procedureConsent"
                    checked={patientData.consents.procedureConsent}
                    onCheckedChange={(checked) => setPatientData(prev => ({
                      ...prev,
                      consents: { ...prev.consents, procedureConsent: checked as boolean }
                    }))}
                    className="mt-1 scale-110"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="procedureConsent" className="text-sm font-semibold cursor-pointer">
                        Oświadczenie o zgodzie na zabieg i jego konsekwencje *
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pełna treść oświadczenia o zgodzie na zabieg</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm leading-relaxed space-y-4">
                            <p>
                              <strong>OŚWIADCZENIE O ZGODZIE NA ZABIEG ANESTEZJOLOGICZNY</strong>
                            </p>
                            <p>
                              Oświadczam, że zostałem poinformowany o planowanym zabiegu anestezjologicznym i jego konsekwencjach.
                              Wyrażam zgodę na przeprowadzenie anestezji oraz związanych z nią procedur medycznych.
                            </p>
                            <p>
                              <strong>Informacje o zabiegu:</strong> Anestezja może obejmować znieczulenie ogólne,
                              regionalne lub miejscowe, w zależności od rodzaju zabiegu i stanu zdrowia pacjenta.
                            </p>
                            <p>
                              <strong>Możliwe powikłania:</strong> Jak każda procedura medyczna, anestezja niesie ze sobą
                              pewne ryzyko, w tym: nudności i wymioty, ból gardła, reakcje alergiczne, zaburzenia rytmu serca,
                              aspiracja, uszkodzenie zębów podczas intubacji, rzadko: poważne powikłania sercowo-naczyniowe.
                            </p>
                            <p>
                              <strong>Moje zobowiązania:</strong> Zobowiązuję się do:
                              • Podania prawdziwych informacji o stanie zdrowia
                              • Przestrzegania zaleceń przedoperacyjnych
                              • Poinformowania o wszelkich zmianach stanu zdrowia
                              • Stawienia się na konsultację anestezjologiczną
                            </p>
                            <p>
                              <strong>Zgoda świadoma:</strong> Potwierdzam, że otrzymałem zrozumiałe wyjaśnienia
                              dotyczące planowanej anestezji i mam możliwość zadania pytań.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Oświadczam, że zostałem poinformowany o planowanym zabiegu anestezjologicznym i jego konsekwencjach.
                      Wyrażam zgodę na przeprowadzenie anestezji oraz związanych z nią procedur medycznych.
                      Jestem świadomy możliwych powikłań i ryzyka związanego z anestezją, które zostały mi przedstawione
                      przez zespół medyczny. Akceptuję konieczność dalszej konsultacji z anestezjologiem przed zabiegiem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zgoda na wysłanie ankiety */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="questionnaireSubmission"
                    checked={patientData.consents.questionnaireSubmission}
                    onCheckedChange={(checked) => setPatientData(prev => ({
                      ...prev,
                      consents: { ...prev.consents, questionnaireSubmission: checked as boolean }
                    }))}
                    className="mt-1 scale-110"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="questionnaireSubmission" className="text-sm font-semibold cursor-pointer">
                        Potwierdzenie wysłania kwestionariusza *
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pełna treść potwierdzenia wysłania kwestionariusza</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm leading-relaxed space-y-4">
                            <p>
                              <strong>POTWIERDZENIE WYSŁANIA KWESTIONARIUSZA ANESTEZJOLOGICZNEGO</strong>
                            </p>
                            <p>
                              Potwierdzam, że wszystkie podane przeze mnie informacje są prawdziwe i kompletne według mojej najlepszej wiedzy.
                              Wyrażam zgodę na przekazanie tego kwestionariusza lekarzowi anestezjologowi w celu przygotowania do zabiegu.
                            </p>
                            <p>
                              <strong>Prawdziwość danych:</strong> Oświadczam, ��e wszystkie informacje zawarte w kwestionariuszu
                              są zgodne z prawdą i obejmują wszystkie istotne aspekty mojego stanu zdrowia.
                            </p>
                            <p>
                              <strong>Aktualizacja informacji:</strong> Zobowiązuję się do niezwłocznego poinformowania
                              zespołu medycznego o wszelkich zmianach w stanie zdrowia, które mogłyby wpłynąć na
                              bezpieczeństwo anestezji.
                            </p>
                            <p>
                              <strong>Konsekwencje nieprawdziwych danych:</strong> Jestem świadomy, że podanie
                              nieprawdziwych lub niepełnych informacji może zagrozić mojemu bezpieczeństwu podczas anestezji.
                            </p>
                            <p>
                              <strong>Dalsze kroki:</strong> Po wysłaniu kwestionariusza zostanę skierowany na
                              konsultację anestezjologiczną, podczas której lekarz omówi ze mną plan anestezji.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Potwierdzam, że wszystkie podane przeze mnie informacje są prawdziwe i kompletne według mojej najlepszej wiedzy.
                      Wyrażam zgodę na przekazanie tego kwestionariusza lekarzowi anestezjologowi w celu przygotowania do zabiegu.
                      Zobowiązuję się do poinformowania zespołu medycznego o wszelkich zmianach w stanie zdrowia
                      przed planowanym zabiegiem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Validation */}
            {getRequiredConsultations().length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Sprawdzenie Konsultacji Specjalistycznych</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="text-blue-800 font-medium mb-2">
                        Czy dodałeś wszystkie wymagane konsultacje?
                      </p>
                      <p className="text-blue-700 text-sm">
                        Na podstawie zaznaczonych chorób wymagane są następujące konsultacje:
                      </p>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    {getRequiredConsultations().map((specialty, index) => {
                      const hasImages = specialty === 'Kardiologia' ? patientData.consultations.cardiologyImages.length > 0 :
                                      specialty === 'Pulmonologia' ? patientData.consultations.pneumologyImages.length > 0 :
                                      specialty === 'Neurologia' ? patientData.consultations.neurologyImages.length > 0 :
                                      specialty === 'Endokrynologia' ? patientData.consultations.endocrinologyImages.length > 0 : false;

                      return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                          hasImages ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {hasImages ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`font-medium ${hasImages ? 'text-green-900' : 'text-red-900'}`}>
                              {specialty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasImages ? (
                              <Badge className="bg-green-100 text-green-800">
                                Dodano konsultację
                              </Badge>
                            ) : (
                              <>
                                <Badge className="bg-red-100 text-red-800">
                                  Brak konsultacji
                                </Badge>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs">
                                      <Camera className="w-3 h-3 mr-1" />
                                      Dodaj teraz
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Dodaj konsultację - {specialty}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Label>Zdjęcia konsultacji, wyników badań, zaleceń:</Label>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files) {
                                            Array.from(files).forEach(file => {
                                              const reader = new FileReader();
                                              reader.onload = (event) => {
                                                const imageData = event.target?.result as string;
                                                setPatientData(prev => ({
                                                  ...prev,
                                                  consultations: {
                                                    ...prev.consultations,
                                                    ...(specialty === 'Kardiologia' && { cardiologyImages: [...prev.consultations.cardiologyImages, imageData] }),
                                                    ...(specialty === 'Pulmonologia' && { pneumologyImages: [...prev.consultations.pneumologyImages, imageData] }),
                                                    ...(specialty === 'Neurologia' && { neurologyImages: [...prev.consultations.neurologyImages, imageData] }),
                                                    ...(specialty === 'Endokrynologia' && { endocrinologyImages: [...prev.consultations.endocrinologyImages, imageData] })
                                                  }
                                                }));
                                              };
                                              reader.readAsDataURL(file);
                                            });
                                            toast.success(`Zdjęcia konsultacji ${specialty.toLowerCase()} zostały dodane`);
                                          }
                                        }}
                                      />
                                      <Button className="w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Dodaj Zdjęcia
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {getRequiredConsultations().every(specialty => {
                    return specialty === 'Kardiologia' ? patientData.consultations.cardiologyImages.length > 0 :
                           specialty === 'Pulmonologia' ? patientData.consultations.pneumologyImages.length > 0 :
                           specialty === 'Neurologia' ? patientData.consultations.neurologyImages.length > 0 :
                           specialty === 'Endokrynologia' ? patientData.consultations.endocrinologyImages.length > 0 : false;
                  }) ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-green-800 font-medium">
                          ✅ Wszystkie wymagane konsultacje zostały dodane!
                        </p>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-orange-800 font-medium mb-2">
                          ⚠️ Brakuje niektórych konsultacji specjalistycznych
                        </p>
                        <p className="text-orange-700 text-sm">
                          Możesz kontynuować bez wszystkich konsultacji, ale zalecamy ich załączenie
                          przed wizytą anestezjologiczną dla bezpieczeństwa zabiegu.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Ważne:</strong> Wszystkie powyższe oświadczenia są wymagane do wysłania kwestionariusza.
                Kwestionariusz zostanie przekazany bezpośrednio do lekarza anestezjologa,
                który skontaktuje się z Państwem w razie potrzeby dodatkowych informacji.
              </p>
            </div>
          </div>
        );
      default:
        return <div>Nieznana sekcja</div>;
    }
  };

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
              ���� Kwestionariusz Anestezjologiczny
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Sekcja {currentSection + 1} z {sections.length}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Hidden on mobile/tablet, shown as horizontal scroll on medium screens */}
          <div className="xl:col-span-1">
            {/* Mobile/Tablet Horizontal Navigation */}
            <div className="xl:hidden mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`flex-shrink-0 p-3 rounded-lg flex flex-col items-center space-y-1 transition-colors min-w-[100px] ${
                        currentSection === index
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium text-center leading-tight">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden xl:block space-y-2">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      currentSection === index
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const Icon = sections[currentSection].icon;
                    return <Icon className="w-6 h-6" />;
                  })()}
                  <span>{sections[currentSection].title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getCurrentSectionContent()}
                
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                  >
                    Poprzednia
                  </Button>
                  
                  {currentSection === sections.length - 1 ? (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSubmitQuestionnaire}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wysyłanie..." : "Zakończ i Wyślij"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                    >
                      Następna
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
