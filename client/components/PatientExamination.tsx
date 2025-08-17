import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Heart,
  Activity,
  Thermometer,
  Eye,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Save,
  Play,
  Wind,
  Brain
} from "lucide-react";

interface VitalSigns {
  systolic: string;
  diastolic: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
}

interface IntubationAssessment {
  mallampati: string;
  thyromental: string;
  neckMovement: string;
  jawMovement: string;
  teethCondition: string;
  overallDifficulty: string;
}

interface ASAClassification {
  class: string;
  description: string;
  reason: string;
}

interface ExaminationData {
  vitalSigns: VitalSigns;
  intubationAssessment: IntubationAssessment;
  asaClassification: ASAClassification;
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

interface PatientExaminationProps {
  patientName: string;
  patientId: string;
  onExaminationComplete: (data: ExaminationData) => void;
  existingExamination?: ExaminationData;
}

export default function PatientExamination({ 
  patientName, 
  patientId, 
  onExaminationComplete,
  existingExamination 
}: PatientExaminationProps) {
  const [currentTab, setCurrentTab] = useState("vitals");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>(
    existingExamination?.vitalSigns || {
      systolic: "",
      diastolic: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: ""
    }
  );

  const [intubationAssessment, setIntubationAssessment] = useState<IntubationAssessment>(
    existingExamination?.intubationAssessment || {
      mallampati: "",
      thyromental: "",
      neckMovement: "",
      jawMovement: "",
      teethCondition: "",
      overallDifficulty: ""
    }
  );

  const [asaClassification, setASAClassification] = useState<ASAClassification>(
    existingExamination?.asaClassification || {
      class: "",
      description: "",
      reason: ""
    }
  );

  const [physicalExamNotes, setPhysicalExamNotes] = useState(
    existingExamination?.physicalExamNotes || ""
  );
  
  const [physicalExamFindings, setPhysicalExamFindings] = useState(
    existingExamination?.physicalExamFindings || {
      cardiovascular: [],
      respiratory: [],
      nervous: [],
      skin: [],
      other: []
    }
  );

  const asaClasses = [
    {
      class: "ASA I",
      description: "Pacjent zdrowy",
      details: "Brak chorób organicznych, fizjologicznych, biochemicznych lub psychiatrycznych"
    },
    {
      class: "ASA II", 
      description: "Pacjent z łagodną chorobą ogólnoustrojową",
      details: "Łagodna choroba ogólnoustrojowa bez ograniczeń funkcjonalnych"
    },
    {
      class: "ASA III",
      description: "Pacjent z ciężką chorobą ogólnoustrojową",
      details: "Ciężka choroba ogólnoustrojowa z ograniczeniami funkcjonalnymi"
    },
    {
      class: "ASA IV",
      description: "Pacjent z ciężką chorobą zagrażającą życiu",
      details: "Ciężka choroba ogólnoustrojowa stanowiąca stałe zagrożenie życia"
    },
    {
      class: "ASA V",
      description: "Pacjent umierający",
      details: "Pacjent umierający, u którego nie oczekuje się przeżycia bez operacji"
    },
    {
      class: "ASA VI",
      description: "Dawca narządów",
      details: "Pacjent ze śmiercią mózgu, dawca narządów"
    }
  ];

  const startMonitoring = () => {
    setIsMonitoring(true);
    const interval = setInterval(() => {
      setVitalSigns(prev => ({
        ...prev,
        heartRate: (60 + Math.floor(Math.random() * 40)).toString(),
        systolic: (100 + Math.floor(Math.random() * 40)).toString(),
        diastolic: (60 + Math.floor(Math.random() * 30)).toString(),
        oxygenSaturation: (95 + Math.floor(Math.random() * 5)).toString()
      }));
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      setIsMonitoring(false);
    }, 30000);
  };

  const getVitalStatus = (vital: string, value: string) => {
    const num = parseInt(value);
    switch (vital) {
      case 'heartRate':
        return num >= 60 && num <= 100 ? 'normal' : 'abnormal';
      case 'systolic':
        return num >= 90 && num <= 140 ? 'normal' : 'abnormal';
      case 'diastolic':
        return num >= 60 && num <= 90 ? 'normal' : 'abnormal';
      case 'oxygenSaturation':
        return num >= 95 ? 'normal' : 'abnormal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'normal' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    return status === 'normal' ?
      <CheckCircle className="w-5 h-5 text-green-600" /> :
      <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const handlePhysicalExamFindingChange = (system: keyof typeof physicalExamFindings, finding: string, checked: boolean) => {
    setPhysicalExamFindings(prev => ({
      ...prev,
      [system]: checked
        ? [...prev[system], finding]
        : prev[system].filter(item => item !== finding)
    }));
  };

  const handleSaveExamination = async () => {
    setIsSaving(true);
    
    try {
      const examinationData: ExaminationData = {
        vitalSigns,
        intubationAssessment,
        asaClassification,
        physicalExamNotes,
        physicalExamFindings,
        completedAt: new Date().toISOString(),
        examinedBy: "Dr. Jan Kowalski" // This would come from auth context
      };

      // Call the parent callback
      onExaminationComplete(examinationData);
      
      toast.success("Badanie anestezjologiczne zostało zapisane pomyślnie!");
    } catch (error) {
      toast.error("Wystąpił błąd podczas zapisywania badania");
      console.error("Examination save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isExaminationComplete = () => {
    return vitalSigns.systolic && vitalSigns.heartRate && 
           intubationAssessment.mallampati && asaClassification.class;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            🩺 <span>Badanie Anestezjologiczne</span>
          </h2>
          <p className="text-gray-600">Pacjent: {patientName}</p>
        </div>
        {existingExamination && (
          <Badge className="bg-green-100 text-green-800">
            Badanie ukończone
          </Badge>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="vitals">Parametry Życiowe</TabsTrigger>
          <TabsTrigger value="intubation">Ocena Intubacji</TabsTrigger>
          <TabsTrigger value="physical">Badanie Fizyczne</TabsTrigger>
          <TabsTrigger value="asa">Klasyfikacja ASA</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>Monitorowanie Parametrów Życiowych</span>
              </CardTitle>
              <Button 
                onClick={startMonitoring}
                disabled={isMonitoring}
                className={isMonitoring ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {isMonitoring ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Monitorowanie...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Rozpocznij Monitoring
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Ciśnienie Tętnicze (mmHg)</span>
                    </Label>
                    {getStatusIcon(getVitalStatus('systolic', vitalSigns.systolic))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Skurczowe"
                      value={vitalSigns.systolic}
                      onChange={(e) => setVitalSigns(prev => ({...prev, systolic: e.target.value}))}
                      className={getStatusColor(getVitalStatus('systolic', vitalSigns.systolic))}
                    />
                    <span className="flex items-center">/</span>
                    <Input
                      placeholder="Rozkurczowe"
                      value={vitalSigns.diastolic}
                      onChange={(e) => setVitalSigns(prev => ({...prev, diastolic: e.target.value}))}
                      className={getStatusColor(getVitalStatus('diastolic', vitalSigns.diastolic))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Tętno (ud/min)</span>
                    </Label>
                    {getStatusIcon(getVitalStatus('heartRate', vitalSigns.heartRate))}
                  </div>
                  <Input
                    placeholder="60-100"
                    value={vitalSigns.heartRate}
                    onChange={(e) => setVitalSigns(prev => ({...prev, heartRate: e.target.value}))}
                    className={getStatusColor(getVitalStatus('heartRate', vitalSigns.heartRate))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4" />
                    <span>Temperatura (°C)</span>
                  </Label>
                  <Input
                    placeholder="36.5"
                    value={vitalSigns.temperature}
                    onChange={(e) => setVitalSigns(prev => ({...prev, temperature: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4" />
                    <span>Częstość oddechów (/min)</span>
                  </Label>
                  <Input
                    placeholder="12-20"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => setVitalSigns(prev => ({...prev, respiratoryRate: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Saturacja O₂ (%)</span>
                    </Label>
                    {getStatusIcon(getVitalStatus('oxygenSaturation', vitalSigns.oxygenSaturation))}
                  </div>
                  <Input
                    placeholder="95-100"
                    value={vitalSigns.oxygenSaturation}
                    onChange={(e) => setVitalSigns(prev => ({...prev, oxygenSaturation: e.target.value}))}
                    className={getStatusColor(getVitalStatus('oxygenSaturation', vitalSigns.oxygenSaturation))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intubation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-6 h-6" />
                <span>Ocena Warunków Intubacji</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Klasyfikacja Mallampati</Label>
                    <RadioGroup 
                      value={intubationAssessment.mallampati}
                      onValueChange={(value) => setIntubationAssessment(prev => ({...prev, mallampati: value}))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="I" id="mal-1" className="scale-110" />
                        <Label htmlFor="mal-1" className="flex-1 cursor-pointer">Klasa I - Widoczne: migdałki, filary, podniebienie miękkie</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="II" id="mal-2" className="scale-110" />
                        <Label htmlFor="mal-2" className="flex-1 cursor-pointer">Klasa II - Widoczne: górna część migdałków, filary, podniebienie</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="III" id="mal-3" className="scale-110" />
                        <Label htmlFor="mal-3" className="flex-1 cursor-pointer">Klasa III - Widoczne: podniebienie miękkie i twarde, podstawa języczka</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="IV" id="mal-4" className="scale-110" />
                        <Label htmlFor="mal-4" className="flex-1 cursor-pointer">Klasa IV - Widoczne tylko podniebienie twarde</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Odległość Tyreo-mentalna</Label>
                    <RadioGroup 
                      value={intubationAssessment.thyromental}
                      onValueChange={(value) => setIntubationAssessment(prev => ({...prev, thyromental: value}))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value=">6.5cm" id="tm-normal" />
                        <Label htmlFor="tm-normal">&gt; 6.5 cm (prawidłowa)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6-6.5cm" id="tm-border" />
                        <Label htmlFor="tm-border">6-6.5 cm (graniczny)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="<6cm" id="tm-short" />
                        <Label htmlFor="tm-short">&lt; 6 cm (krótka)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Ruchomość Szyi</Label>
                    <RadioGroup 
                      value={intubationAssessment.neckMovement}
                      onValueChange={(value) => setIntubationAssessment(prev => ({...prev, neckMovement: value}))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="neck-normal" />
                        <Label htmlFor="neck-normal">Prawidłowa (&gt; 35°)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="limited" id="neck-limited" />
                        <Label htmlFor="neck-limited">Ograniczona (15-35°)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="severely-limited" id="neck-severe" />
                        <Label htmlFor="neck-severe">Silnie ograniczona (&lt; 15°)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Otwarcie Ust</Label>
                    <RadioGroup 
                      value={intubationAssessment.jawMovement}
                      onValueChange={(value) => setIntubationAssessment(prev => ({...prev, jawMovement: value}))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value=">4cm" id="jaw-normal" />
                        <Label htmlFor="jaw-normal">&gt; 4 cm (prawidłowe)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-4cm" id="jaw-limited" />
                        <Label htmlFor="jaw-limited">2-4 cm (ograniczone)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="<2cm" id="jaw-severe" />
                        <Label htmlFor="jaw-severe">&lt; 2 cm (silnie ograniczone)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Stan Uzębienia</Label>
                <Textarea
                  placeholder="Opisz stan uzębienia, protezy, koronki, mosty..."
                  value={intubationAssessment.teethCondition}
                  onChange={(e) => setIntubationAssessment(prev => ({...prev, teethCondition: e.target.value}))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Ogólna Ocena Trudności Intubacji</Label>
                <Select
                  value={intubationAssessment.overallDifficulty}
                  onValueChange={(value) => setIntubationAssessment(prev => ({...prev, overallDifficulty: value}))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Wybierz poziom trudności" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Łatwa - brak czynników ryzyka</SelectItem>
                    <SelectItem value="moderate">Umiarkowana - pojedyncze czynniki ryzyka</SelectItem>
                    <SelectItem value="difficult">Trudna - liczne czynniki ryzyka</SelectItem>
                    <SelectItem value="very-difficult">Bardzo trudna - wymaga specjalistycznego sprzętu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-6 h-6" />
                <span>Badanie Fizyczne</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Cardiovascular System */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>🫀 Układ Krążenia</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Tony serca dzwięczne, czyste",
                      "Rytm miarowy",
                      "Tętno wyczuwalne na tętnicach obwodowych",
                      "Brak szmerów sercowych",
                      "Ciśnienie tętnicze prawidłowe",
                      "Brak obrzęków obwodowych",
                      "Żyły szyjne nie uwypuklone"
                    ].map((finding) => (
                      <div key={finding} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={`cardio-${finding}`}
                          checked={physicalExamFindings.cardiovascular.includes(finding)}
                          onCheckedChange={(checked) =>
                            handlePhysicalExamFindingChange('cardiovascular', finding, checked as boolean)
                          }
                          className="scale-110"
                        />
                        <Label htmlFor={`cardio-${finding}`} className="text-sm font-normal flex-1 cursor-pointer">
                          {finding}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Respiratory System */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Wind className="w-5 h-5 text-blue-500" />
                    <span>🫁 Układ Oddechowy</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Szmer pęcherzykowy symetryczny, czysty bez fenomenów patologicznych",
                      "Oddech spokojny, miarowy",
                      "Klatka piersiowa symetryczna",
                      "Brak duszności spoczynkowej",
                      "Brak sinic",
                      "Brak ograniczenia ruchomości klatki piersiowej",
                      "Saturacja tlenu prawidłowa"
                    ].map((finding) => (
                      <div key={finding} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={`resp-${finding}`}
                          checked={physicalExamFindings.respiratory.includes(finding)}
                          onCheckedChange={(checked) =>
                            handlePhysicalExamFindingChange('respiratory', finding, checked as boolean)
                          }
                          className="scale-110"
                        />
                        <Label htmlFor={`resp-${finding}`} className="text-sm font-normal flex-1 cursor-pointer">
                          {finding}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nervous System */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>🧠 Układ Nerwowy</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Pacjent przytomny, współpracujący",
                      "Orientacja auto- i allopsychiczna prawidłowa",
                      "Brak niedowładów kończyn górnych",
                      "Brak niedowładów kończyn dolnych",
                      "Siła mięśniowa kończyn prawidłowa",
                      "Odruchyścięgniste symetryczne, prawidłowe",
                      "Koordynacja ruchowa prawidłowa",
                      "Mowa płynna, zrozumiała"
                    ].map((finding) => (
                      <div key={finding} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={`neuro-${finding}`}
                          checked={physicalExamFindings.nervous.includes(finding)}
                          onCheckedChange={(checked) =>
                            handlePhysicalExamFindingChange('nervous', finding, checked as boolean)
                          }
                          className="scale-110"
                        />
                        <Label htmlFor={`neuro-${finding}`} className="text-sm font-normal flex-1 cursor-pointer">
                          {finding}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">📝 Dodatkowe Uwagi</h3>
                  <Textarea
                    placeholder="Dodatkowe obserwacje, szczególne cechy, patologie nie ujęte powyżej..."
                    value={physicalExamNotes}
                    onChange={(e) => setPhysicalExamNotes(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Klasyfikacja ASA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Wybierz Klasę ASA</Label>
                  <div className="space-y-3">
                    {asaClasses.map((asa) => (
                      <div key={asa.class} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroup 
                            value={asaClassification.class}
                            onValueChange={(value) => {
                              const selectedASA = asaClasses.find(a => a.class === value);
                              setASAClassification(prev => ({
                                ...prev, 
                                class: value,
                                description: selectedASA?.description || ""
                              }));
                            }}
                          >
                            <RadioGroupItem value={asa.class} id={asa.class} />
                          </RadioGroup>
                          <Label htmlFor={asa.class} className="flex-1 cursor-pointer">
                            <div className="font-medium text-lg">{asa.class}</div>
                            <div className="font-medium text-gray-900">{asa.description}</div>
                            <div className="text-sm text-gray-600">{asa.details}</div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {asaClassification.class && (
                  <div>
                    <Label className="text-base font-semibold">Uzasadnienie Klasyfikacji</Label>
                    <Textarea
                      placeholder="Uzasadnij wybór klasyfikacji ASA w oparciu o stan zdrowia pacjenta..."
                      value={asaClassification.reason}
                      onChange={(e) => setASAClassification(prev => ({...prev, reason: e.target.value}))}
                      className="mt-2"
                    />
                  </div>
                )}

                {asaClassification.class && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Wybrana Klasyfikacja:</h3>
                    <p className="text-blue-800">
                      <span className="font-medium">{asaClassification.class}</span> - {asaClassification.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center space-x-4">
        <Button 
          size="lg" 
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSaveExamination}
          disabled={isSaving || !isExaminationComplete()}
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? "Zapisywanie..." : "Zakończ Badanie"}
        </Button>
      </div>

      {!isExaminationComplete() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Wymagane dane:</strong> Aby zakończyć badanie, wypełnij parametry życiowe (ciśnienie, tętno), 
            klasyfikację Mallampati oraz klasyfikację ASA.
          </p>
        </div>
      )}
    </div>
  );
}
