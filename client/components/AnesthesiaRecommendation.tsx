import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Save, Check, Clock, Zap, Droplets, Target, Heart, FileSignature, PenTool, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnesthesiaType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  patientExplanation: string;
  advantages: string[];
  considerations: string[];
  diagram: string;
  duration: string;
  recovery: string;
}

const anesthesiaTypes: AnesthesiaType[] = [
  {
    id: "general",
    name: "Znieczulenie ogólne",
    icon: Heart,
    description: "Pacjent jest całkowicie nieprzytomny podczas zabiegu",
    patientExplanation: "Otrzyma Pan/Pani leki, które sprawią, że będzie Pan/Pani spać podczas całego zabiegu. Nie będzie Pan/Pani nic pamiętać ani czuć.",
    advantages: [
      "Całkowity brak świadomości",
      "Kontrola oddechu przez anestezjologa",
      "Odpowiednie dla długich zabiegów",
      "Możliwość szybkiej modyfikacji głębokości"
    ],
    considerations: [
      "Wymaga intubacji lub maski krtaniowej",
      "Możliwe nudności po zabiegu",
      "Dłuższy czas wybudzania"
    ],
    diagram: "🧠➡️💉➡️😴➡️🫁(respirator)",
    duration: "Cały czas zabiegu",
    recovery: "1-2 godziny do pełnego wybudzenia"
  },
  {
    id: "spinal",
    name: "Znieczulenie podpajęczynówkowe",
    icon: Target,
    description: "Znieczulenie dolnej połowy ciała przez wkłucie w kanał kręgowy",
    patientExplanation: "Lekarz wprowadzi cienką igłę w plecy, aby podać lek znieczulający. Dolna połowa ciała będzie znieczulona, ale będzie Pan/Pani przytomny.",
    advantages: [
      "Pacjent pozostaje przytomny",
      "Doskonałe znieczulenie dolnej połowy ciała",
      "Mniej leków w organizmie",
      "Szybkie rozpoczęcie działania"
    ],
    considerations: [
      "Możliwy spadek ciśnienia",
      "Ból głowy (rzadko)",
      "Czasowe znieczulenie nóg"
    ],
    diagram: "🦴(kręgosłup)➡️💉➡️🦵(znieczulenie)",
    duration: "2-4 godziny",
    recovery: "Powrót czucia w nogach po 3-6h"
  },
  {
    id: "epidural",
    name: "Znieczulenie zewnątrzoponowe",
    icon: Droplets,
    description: "Ciągłe podawanie leków przez cewnik w przestrzeni zewnątrzoponowej",
    patientExplanation: "Lekarz umieści cienki cewnik w plecach, przez który będą podawane leki przeciwbólowe. Możliwość kontroli bólu przez długi czas.",
    advantages: [
      "Możliwość ciągłego podawania leków",
      "Doskonała kontrola bólu",
      "Pacjent pozostaje przytomny",
      "Możliwość przedłużenia działania"
    ],
    considerations: [
      "Dłuższy czas zakładania",
      "Możliwy spadek ciśnienia",
      "Wymaga monitorowania cewnika"
    ],
    diagram: "🦴➡️🔗(cewnik)➡️💧(ciągłe podawanie)",
    duration: "Kontrolowane - od godzin do dni",
    recovery: "Stopniowy powrót czucia"
  },
  {
    id: "nerve_block",
    name: "Blokada splotu nerwowego",
    icon: Zap,
    description: "Znieczulenie określonej części ciała przez blokadę nerwów",
    patientExplanation: "Lekarz wprowadzi lek w okolicę nerwów odpowiedzialnych za czucie w operowanej części ciała. Ta część będzie znieczulona przez kilka godzin.",
    advantages: [
      "Celowane znieczulenie",
      "Mniej wpływu na cały organizm",
      "Długotrwałe działanie przeciwbólowe",
      "Możliwość łączenia z innymi metodami"
    ],
    considerations: [
      "Ograniczone do określonych zabiegów",
      "Możliwa czasowa słabość mięśni",
      "Wymaga precyzyjnego wykonania"
    ],
    diagram: "🎯(nerw)➡️💉➡️🚫(blokada czucia)",
    duration: "4-12 godzin",
    recovery: "Stopniowy powrót czucia i siły"
  },
  {
    id: "iv_sedation",
    name: "Znieczulenie dożylne krótkie",
    icon: Clock,
    description: "Lekkość sedacja z miejscowym znieczuleniem, bez intubacji",
    patientExplanation: "Otrzyma Pan/Pani leki uspokajające przez wenflon, dzięki czemu będzie Pan/Pani rozluźniony ale przytomny. Miejsce zabiegu zostanie znieczulone miejscowo.",
    advantages: [
      "Szybkie wybudzenie",
      "Mniej inwazyjne",
      "Zachowana spontaniczna wentylacja",
      "Możliwość komunikacji z pacjentem"
    ],
    considerations: [
      "Ograniczone do krótkich zabiegów",
      "Wymaga współpracy pacjenta",
      "Możliwa częściowa pamięć zabiegu"
    ],
    diagram: "🩸(wenflon)➡️💉➡️😌(sedacja)+🏥(miejscowe)",
    duration: "15-60 minut",
    recovery: "15-30 minut do pełnej sprawności"
  },
  {
    id: "bier_block",
    name: "Blokada Biera",
    icon: Target,
    description: "Znieczulenie kończyny przez podanie leku do naczyń przy użyciu opaski",
    patientExplanation: "Na ramię zostanie założona specjalna opaska, a lek znieczulający zostanie podany przez wenflon w dłoni. Cała ręka będzie znieczulona.",
    advantages: [
      "Doskonałe znieczulenie kończyny",
      "Szybkie rozpoczęcie działania",
      "Brak wpływu na resztę organizmu",
      "Szybkie ustąpienie po zabiegu"
    ],
    considerations: [
      "Tylko dla zabiegów kończyn",
      "Ograniczony czas zabiegu (max 90 min)",
      "Dyskomfort z powodu opaski",
      "Wymaga sprawnej opaski"
    ],
    diagram: "🫱(opaska)➡️🩸(wenflon)➡️💉➡️🦾(znieczulenie)",
    duration: "Do 90 minut",
    recovery: "Natychmiastowy powrót czucia"
  }
];

interface AnesthesiaRecommendationProps {
  patientName: string;
  plannedProcedure: string;
  onRecommendationSave: (recommendation: AnesthesiaRecommendation) => void;
}

interface AnesthesiaRecommendation {
  recommendedType: string;
  alternativeTypes: string[];
  rationale: string;
  patientConsent: boolean;
  doctorNotes: string;
  timestamp: string;
}

export default function AnesthesiaRecommendation({
  patientName,
  plannedProcedure,
  onRecommendationSave
}: AnesthesiaRecommendationProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [alternativeTypes, setAlternativeTypes] = useState<string[]>([]);
  const [rationale, setRationale] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [showPatientView, setShowPatientView] = useState(false);

  // Consent form state
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [consentChecks, setConsentChecks] = useState({
    procedure: false,
    changes: false,
    questions: false
  });
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAlternativeToggle = (typeId: string) => {
    setAlternativeTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSaveRecommendation = () => {
    if (!selectedType) return;

    const recommendation: AnesthesiaRecommendation = {
      recommendedType: selectedType,
      alternativeTypes,
      rationale,
      patientConsent: false,
      doctorNotes,
      timestamp: new Date().toISOString()
    };

    onRecommendationSave(recommendation);
  };

  const getSelectedTypeInfo = () => {
    return anesthesiaTypes.find(type => type.id === selectedType);
  };

  // Signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    setSignature(dataURL);
    setShowSignatureDialog(false);
  };

  const allConsentsChecked = consentChecks.procedure && consentChecks.changes && consentChecks.questions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          💉 Rekomendacja Znieczulenia
        </h3>
        <div className="flex space-x-2">
          <Button
            variant={showPatientView ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPatientView(true)}
          >
            👤 Widok pacjenta
          </Button>
          <Button
            variant={!showPatientView ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPatientView(false)}
          >
            👨‍⚕️ Widok lekarza
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {showPatientView 
              ? `${patientName} - Proponowane znieczulenie dla zabiegu: ${plannedProcedure}`
              : "Wybór rodzaju znieczulenia"
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPatientView ? (
            // Doctor View
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Rekomendowany rodzaj znieczulenia:
                </Label>
                <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {anesthesiaTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={cn(
                            "relative border-2 rounded-lg p-4 cursor-pointer transition-colors",
                            selectedType === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setSelectedType(type.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={type.id} id={type.id} />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Icon className="w-5 h-5 text-blue-600" />
                                  <Label htmlFor={type.id} className="font-medium cursor-pointer">
                                    {type.name}
                                  </Label>
                                </div>
                                <p className="text-sm text-gray-600">{type.description}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                  <p>⏱️ Czas działania: {type.duration}</p>
                                  <p>🔄 Powrót: {type.recovery}</p>
                                </div>
                              </div>
                            </div>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Info className="w-4 h-4 text-blue-600" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <Icon className="w-6 h-6 text-blue-600" />
                                    <span>{type.name}</span>
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">
                                      📋 Opis dla pacjenta:
                                    </h4>
                                    <p className="text-blue-800">{type.patientExplanation}</p>
                                  </div>
                                  
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      📊 Schemat działania:
                                    </h4>
                                    <p className="text-lg font-mono text-gray-700">{type.diagram}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                                        <Check className="w-4 h-4 mr-1" />
                                        Zalety:
                                      </h4>
                                      <ul className="text-sm text-green-800 space-y-1">
                                        {type.advantages.map((advantage, index) => (
                                          <li key={index}>• {advantage}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                      <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                                        <Info className="w-4 h-4 mr-1" />
                                        Uwagi:
                                      </h4>
                                      <ul className="text-sm text-yellow-800 space-y-1">
                                        {type.considerations.map((consideration, index) => (
                                          <li key={index}>• {consideration}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">⏱️ Czas działania:</span>
                                        <p className="text-gray-600">{type.duration}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">🔄 Czas powrotu:</span>
                                        <p className="text-gray-600">{type.recovery}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Alternatywne opcje (opcjonalne):
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {anesthesiaTypes
                    .filter(type => type.id !== selectedType)
                    .map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleAlternativeToggle(type.id)}
                        className={cn(
                          "p-2 text-sm rounded-lg border-2 transition-colors text-left",
                          alternativeTypes.includes(type.id)
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {type.name}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Uzasadnienie wyboru:</Label>
                <Textarea
                  placeholder="Opisz powody wyboru tego rodzaju znieczulenia w kontekście stanu pacjenta i rodzaju zabiegu..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Dodatkowe uwagi:</Label>
                <Textarea
                  placeholder="Dodatkowe informacje, szczególne wskazania, przeciwwskazania..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleSaveRecommendation}
                disabled={!selectedType || !rationale}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Zapisz Rekomendację
              </Button>
            </div>
          ) : (
            // Patient View
            <div className="space-y-6">
              {selectedType ? (
                <div>
                  {(() => {
                    const selectedTypeInfo = getSelectedTypeInfo();
                    if (!selectedTypeInfo) return null;
                    
                    const Icon = selectedTypeInfo.icon;
                    
                    return (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <Icon className="w-8 h-8 text-blue-600" />
                            <h3 className="text-xl font-semibold text-blue-900">
                              {selectedTypeInfo.name}
                            </h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-blue-900 mb-2">
                                🗣️ Co to oznacza dla Pana/Pani:
                              </h4>
                              <p className="text-blue-800 text-lg leading-relaxed">
                                {selectedTypeInfo.patientExplanation}
                              </p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                              <h4 className="font-medium text-blue-900 mb-3">
                                📊 Jak to działa (uproszczony schemat):
                              </h4>
                              <p className="text-2xl font-mono text-center text-blue-700 bg-blue-100 rounded-lg p-3">
                                {selectedTypeInfo.diagram}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  ⏱️ Jak długo działa:
                                </h4>
                                <p className="text-blue-800">{selectedTypeInfo.duration}</p>
                              </div>
                              
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  🔄 Powrót do normalności:
                                </h4>
                                <p className="text-blue-800">{selectedTypeInfo.recovery}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {rationale && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">
                              🩺 Dlaczego lekarz rekomenduje ten rodzaj znieczulenia:
                            </h4>
                            <p className="text-green-800">{rationale}</p>
                          </div>
                        )}

                        {alternativeTypes.length > 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">
                              🔄 Inne możliwe opcje:
                            </h4>
                            <div className="space-y-2">
                              {alternativeTypes.map(typeId => {
                                const altType = anesthesiaTypes.find(t => t.id === typeId);
                                if (!altType) return null;
                                return (
                                  <p key={typeId} className="text-gray-700">
                                    • {altType.name}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Info className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Lekarz jeszcze nie wybrał rodzaju znieczulenia</p>
                  <p className="text-sm">Rekomendacja pojawi się po przeanalizowaniu Pana/Pani stanu zdrowia</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
