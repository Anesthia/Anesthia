import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Pill,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Printer,
  Download
} from "lucide-react";
import type { SelectedDrug } from "./DrugSearchSelector";

interface BridgeTherapyTemplate {
  drugId: string;
  drugName: string;
  indication: string;
  stopDaysBefore: number;
  bridgeTherapy?: {
    drug: string;
    dosage: string;
    startDay: number;
    endDay: number;
    instructions: string;
  };
  resumeInstructions: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface EnhancedBridgeTherapyProps {
  patientName: string;
  currentMedications: SelectedDrug[];
  patientConditions: string[];
  onBridgeTherapyPlan: (plan: any) => void;
}

const bridgeTherapyTemplates: BridgeTherapyTemplate[] = [
  {
    drugId: "warfarin",
    drugName: "Warfaryna",
    indication: "Migotanie przedsionków / Zaburzenia rytmu",
    stopDaysBefore: 5,
    bridgeTherapy: {
      drug: "Enoksaparyna (Clexane)",
      dosage: "1mg/kg s.c. 2x dziennie",
      startDay: 3,
      endDay: 1,
      instructions: "Ostatnia dawka 12-24h przed zabiegiem"
    },
    resumeInstructions: "Wznowić 12-24h po zabiegu, gdy hemostaza prawidłowa",
    riskLevel: "high"
  },
  {
    drugId: "acenocoumarol",
    drugName: "Acenocoumarol (Sintrom)",
    indication: "Migotanie przedsionków / Zaburzenia rytmu",
    stopDaysBefore: 5,
    bridgeTherapy: {
      drug: "Enoksaparyna (Clexane)",
      dosage: "1mg/kg s.c. 2x dziennie",
      startDay: 3,
      endDay: 1,
      instructions: "Ostatnia dawka 12-24h przed zabiegiem"
    },
    resumeInstructions: "Wznowić 12-24h po zabiegu, gdy hemostaza prawidłowa",
    riskLevel: "high"
  },
  {
    drugId: "rivaroxaban",
    drugName: "Riwaroksaban (Xarelto)",
    indication: "Migotanie przedsionków",
    stopDaysBefore: 2,
    resumeInstructions: "Wznowić 6-10h po zabiegu małoinwazyjnym, 48-72h po dużym zabiegu",
    riskLevel: "medium"
  },
  {
    drugId: "apixaban",
    drugName: "Apiksaban (Eliquis)",
    indication: "Migotanie przedsionków",
    stopDaysBefore: 2,
    resumeInstructions: "Wznowić 6-10h po zabiegu małoinwazyjnym, 48-72h po dużym zabiegu",
    riskLevel: "medium"
  },
  {
    drugId: "dabigatran",
    drugName: "Dabigatran (Pradaxa)",
    indication: "Migotanie przedsionków",
    stopDaysBefore: 2,
    resumeInstructions: "Wznowić 6-10h po zabiegu małoinwazyjnym, 48-72h po dużym zabiegu",
    riskLevel: "medium"
  },
  {
    drugId: "clopidogrel",
    drugName: "Klopidogrel (Plavix)",
    indication: "Profilaktyka przeciwpłytkowa po PCI/stentach",
    stopDaysBefore: 7,
    resumeInstructions: "Wznowić 24h po zabiegu jeśli hemostaza prawidłowa",
    riskLevel: "high"
  },
  {
    drugId: "aspirin",
    drugName: "Kwas acetylosalicylowy (Aspiryna)",
    indication: "Profilaktyka pierwotna/wtórna",
    stopDaysBefore: 7,
    resumeInstructions: "Wznowić 24h po zabiegu",
    riskLevel: "low"
  }
];

export default function EnhancedBridgeTherapy({ 
  patientName, 
  currentMedications, 
  patientConditions,
  onBridgeTherapyPlan 
}: EnhancedBridgeTherapyProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<BridgeTherapyTemplate | null>(null);
  const [surgeryDate, setSurgeryDate] = useState("");
  const [surgeryType, setSurgeryType] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [showPrescription, setShowPrescription] = useState(false);
  const [bridgePlan, setBridgePlan] = useState<any>(null);

  // Filter anticoagulant medications
  const anticoagulantMeds = currentMedications.filter(med => 
    ["Antykoagulanty", "Heparyny", "Leki przeciwpłytkowe"].includes(med.drug.category)
  );

  const handleTemplateSelect = (drugId: string) => {
    const template = bridgeTherapyTemplates.find(t => t.drugId === drugId);
    setSelectedTemplate(template || null);
  };

  const calculateDates = () => {
    if (!surgeryDate || !selectedTemplate) return null;
    
    const surgery = new Date(surgeryDate);
    const stopDate = new Date(surgery);
    stopDate.setDate(surgery.getDate() - selectedTemplate.stopDaysBefore);
    
    let bridgeDates = null;
    if (selectedTemplate.bridgeTherapy) {
      const bridgeStart = new Date(surgery);
      bridgeStart.setDate(surgery.getDate() - selectedTemplate.bridgeTherapy.startDay);
      const bridgeEnd = new Date(surgery);
      bridgeEnd.setDate(surgery.getDate() - selectedTemplate.bridgeTherapy.endDay);
      
      bridgeDates = {
        start: bridgeStart.toLocaleDateString('pl-PL'),
        end: bridgeEnd.toLocaleDateString('pl-PL')
      };
    }
    
    return {
      stopDate: stopDate.toLocaleDateString('pl-PL'),
      bridgeDates,
      surgeryDate: surgery.toLocaleDateString('pl-PL')
    };
  };

  const generateBridgePlan = () => {
    const dates = calculateDates();
    if (!dates || !selectedTemplate) return;

    const plan = {
      patient: patientName,
      medication: selectedTemplate.drugName,
      surgeryDate: dates.surgeryDate,
      surgeryType,
      stopDate: dates.stopDate,
      bridgeTherapy: selectedTemplate.bridgeTherapy ? {
        ...selectedTemplate.bridgeTherapy,
        startDate: dates.bridgeDates?.start,
        endDate: dates.bridgeDates?.end
      } : null,
      resumeInstructions: selectedTemplate.resumeInstructions,
      customInstructions,
      riskLevel: selectedTemplate.riskLevel,
      generatedAt: new Date().toISOString()
    };

    setBridgePlan(plan);
    onBridgeTherapyPlan(plan);
    toast.success("Plan terapii pomostowej został wygenerowany!");
  };

  const generatePrescription = () => {
    if (!bridgePlan || !bridgePlan.bridgeTherapy) return "";

    return `
RECEPTA - TERAPIA POMOSTOWA

Pacjent: ${bridgePlan.patient}
Data zabiegu: ${bridgePlan.surgeryDate}
Rodzaj zabiegu: ${bridgePlan.surgeryType}

ZALECENIA:

1. ODSTAWIENIE LEKU:
   ${bridgePlan.medication} - odstawić ${bridgePlan.stopDate}

2. TERAPIA POMOSTOWA:
   ${bridgePlan.bridgeTherapy.drug}
   Dawkowanie: ${bridgePlan.bridgeTherapy.dosage}
   Od: ${bridgePlan.bridgeTherapy.startDate}
   Do: ${bridgePlan.bridgeTherapy.endDate}
   
   INSTRUKCJE: ${bridgePlan.bridgeTherapy.instructions}

3. WZNOWIENIE PO ZABIEGU:
   ${bridgePlan.resumeInstructions}

${bridgePlan.customInstructions ? `4. DODATKOWE UWAGI:\n   ${bridgePlan.customInstructions}` : ''}

Data wystawienia: ${new Date().toLocaleDateString('pl-PL')}
Lekarz: Dr. Jan Kowalski (przykład)
    `.trim();
  };

  const printPrescription = () => {
    const prescription = generatePrescription();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Recepta - Terapia Pomostowa</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <pre>${prescription}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Pill className="w-6 h-6 text-blue-600" />
          <span>Zaawansowana Terapia Pomostowa</span>
        </h2>
      </div>

      {/* Current Anticoagulant Medications */}
      {anticoagulantMeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Wykryte Leki Przeciwkrzepliwe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anticoagulantMeds.map((med, index) => (
                <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 font-semibold">
                        {med.drug.category}
                      </Badge>
                      <span className="font-semibold text-lg">{med.drug.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect(med.drug.id)}
                      className="bg-blue-50 border-blue-200 text-blue-700"
                    >
                      Użyj Szablonu
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Dawka:</span> {med.dosage}</p>
                    <p><span className="font-medium">Częstotliwość:</span> {med.frequency}</p>
                    {med.notes && <p><span className="font-medium">Uwagi:</span> {med.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Surgery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Informacje o Zabiegu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="surgeryDate">Data zabiegu</Label>
              <Input
                id="surgeryDate"
                type="date"
                value={surgeryDate}
                onChange={(e) => setSurgeryDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="surgeryType">Rodzaj zabiegu</Label>
              <Select value={surgeryType} onValueChange={setSurgeryType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Wybierz rodzaj zabiegu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Zabieg małoinwazyjny (niskie ryzyko krwawienia)</SelectItem>
                  <SelectItem value="moderate">Zabieg umiarkowany (średnie ryzyko krwawienia)</SelectItem>
                  <SelectItem value="major">Zabieg duży (wysokie ryzyko krwawienia)</SelectItem>
                  <SelectItem value="emergency">Zabieg pilny/nagły</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Display */}
      {selectedTemplate && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Szablon Terapii: {selectedTemplate.drugName}</span>
              <Badge className={
                selectedTemplate.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                selectedTemplate.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }>
                {selectedTemplate.riskLevel === 'high' ? 'Wysokie ryzyko' :
                 selectedTemplate.riskLevel === 'medium' ? 'Średnie ryzyko' : 'Niskie ryzyko'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold text-gray-900">Wskazanie</Label>
                <p className="text-gray-700">{selectedTemplate.indication}</p>
              </div>
              <div>
                <Label className="font-semibold text-gray-900">Odstawić przed zabiegiem</Label>
                <p className="text-gray-700">{selectedTemplate.stopDaysBefore} dni</p>
              </div>
            </div>

            {selectedTemplate.bridgeTherapy && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-gray-900 mb-2">Terapia Pomostowa</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lek:</span> {selectedTemplate.bridgeTherapy.drug}</p>
                  <p><span className="font-medium">Dawkowanie:</span> {selectedTemplate.bridgeTherapy.dosage}</p>
                  <p><span className="font-medium">Rozpocząć:</span> {selectedTemplate.bridgeTherapy.startDay} dni przed zabiegiem</p>
                  <p><span className="font-medium">Zakończyć:</span> {selectedTemplate.bridgeTherapy.endDay} dzień przed zabiegiem</p>
                  <p><span className="font-medium">Instrukcje:</span> {selectedTemplate.bridgeTherapy.instructions}</p>
                </div>
              </div>
            )}

            <div>
              <Label className="font-semibold text-gray-900">Wznowienie po zabiegu</Label>
              <p className="text-gray-700">{selectedTemplate.resumeInstructions}</p>
            </div>

            {surgeryDate && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Obliczone Daty</span>
                </h4>
                {(() => {
                  const dates = calculateDates();
                  return dates ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Odstawić lek:</span> {dates.stopDate}</p>
                      {dates.bridgeDates && (
                        <>
                          <p><span className="font-medium">Rozpocząć terapię pomostową:</span> {dates.bridgeDates.start}</p>
                          <p><span className="font-medium">Zakończyć terapię pomostową:</span> {dates.bridgeDates.end}</p>
                        </>
                      )}
                      <p><span className="font-medium">Data zabiegu:</span> {dates.surgeryDate}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Dodatkowe Uwagi</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Dodatkowe instrukcje specyficzne dla pacjenta..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Generate Plan Button */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={generateBridgePlan}
          disabled={!selectedTemplate || !surgeryDate || !surgeryType}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Wygeneruj Plan Terapii
        </Button>
      </div>

      {/* Generated Plan Display */}
      {bridgePlan && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Plan Terapii Pomostowej</span>
              </div>
              <div className="space-x-2">
                {bridgePlan.bridgeTherapy && (
                  <Button variant="outline" size="sm" onClick={printPrescription}>
                    <Printer className="w-4 h-4 mr-2" />
                    Wydrukuj Receptę
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Pokaż Szczegóły
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Szczegółowy Plan Terapii Pomostowej</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                        {JSON.stringify(bridgePlan, null, 2)}
                      </pre>
                      {bridgePlan.bridgeTherapy && (
                        <div>
                          <h4 className="font-semibold mb-2">Recepta do wydruku:</h4>
                          <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded-lg border">
                            {generatePrescription()}
                          </pre>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Plan terapii pomostowej został wygenerowany dla pacjenta {bridgePlan.patient}. 
                {bridgePlan.bridgeTherapy && " Recepta na terapię pomostową gotowa do wydruku."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
