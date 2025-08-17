import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, CalendarDays, AlertTriangle, Pill, Clock, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectedDrug } from "./DrugSearchSelector";

interface DrugDiscontinuation {
  id: string;
  drugName: string;
  discontinuationDate: string;
  reason: string;
  prescribedBy: string;
  status: 'planned' | 'completed' | 'cancelled';
}

interface BridgeTherapy {
  id: string;
  indication: string;
  clexaneDosage: string;
  startDate: string;
  duration: string;
  monitoringNotes: string;
  status: 'planned' | 'active' | 'completed';
}

interface BridgeTherapyManagerProps {
  patientName: string;
  currentMedications: SelectedDrug[];
  onDiscontinuationOrder: (discontinuation: DrugDiscontinuation) => void;
  onBridgeTherapyOrder: (therapy: BridgeTherapy) => void;
}

export default function BridgeTherapyManager({
  patientName,
  currentMedications,
  onDiscontinuationOrder,
  onBridgeTherapyOrder
}: BridgeTherapyManagerProps) {
  const [selectedDrug, setSelectedDrug] = useState<SelectedDrug | null>(null);
  const [discontinuationForm, setDiscontinuationForm] = useState({
    discontinuationDate: "",
    reason: "",
    prescribedBy: "POZ"
  });
  
  const [bridgeTherapyForm, setBridgeTherapyForm] = useState({
    indication: "",
    clexaneDosage: "",
    startDate: "",
    duration: "5-7 dni",
    monitoringNotes: ""
  });

  const [activeDiscontinuations, setActiveDiscontinuations] = useState<DrugDiscontinuation[]>([]);
  const [activeBridgeTherapies, setActiveBridgeTherapies] = useState<BridgeTherapy[]>([]);
  const [showDiscontinuationDialog, setShowDiscontinuationDialog] = useState(false);
  const [showBridgeTherapyDialog, setShowBridgeTherapyDialog] = useState(false);

  const clexaneDosages = [
    { value: "20mg", label: "20mg (0.2ml) - profilaktyka niska", indication: "< 50kg lub ryzyko krwawienia" },
    { value: "40mg", label: "40mg (0.4ml) - profilaktyka standardowa", indication: "50-90kg" },
    { value: "60mg", label: "60mg (0.6ml) - profilaktyka wysoka", indication: "> 90kg lub wysokie ryzyko" },
    { value: "80mg", label: "80mg (0.8ml) - terapeutyczna niska", indication: "< 60kg" },
    { value: "100mg", label: "100mg (1.0ml) - terapeutyczna standardowa", indication: "60-100kg" },
    { value: "120mg", label: "120mg (1.2ml) - terapeutyczna wysoka", indication: "> 100kg" }
  ];

  const discontinuationReasons = [
    "Przygotowanie do zabiegu chirurgicznego",
    "Wysokie ryzyko krwawienia",
    "Interakcje lekowe",
    "Działania niepożądane",
    "Zmiana terapii",
    "Zakończenie kuracji",
    "Inne"
  ];

  const handleDiscontinuationSubmit = () => {
    if (!selectedDrug || !discontinuationForm.discontinuationDate || !discontinuationForm.reason) return;

    const newDiscontinuation: DrugDiscontinuation = {
      id: `disc-${Date.now()}`,
      drugName: selectedDrug.drug.name,
      discontinuationDate: discontinuationForm.discontinuationDate,
      reason: discontinuationForm.reason,
      prescribedBy: discontinuationForm.prescribedBy,
      status: 'planned'
    };

    setActiveDiscontinuations([...activeDiscontinuations, newDiscontinuation]);
    onDiscontinuationOrder(newDiscontinuation);
    setShowDiscontinuationDialog(false);
    setSelectedDrug(null);
    setDiscontinuationForm({ discontinuationDate: "", reason: "", prescribedBy: "POZ" });
  };

  const handleBridgeTherapySubmit = () => {
    if (!bridgeTherapyForm.indication || !bridgeTherapyForm.clexaneDosage || !bridgeTherapyForm.startDate) return;

    const newBridgeTherapy: BridgeTherapy = {
      id: `bridge-${Date.now()}`,
      indication: bridgeTherapyForm.indication,
      clexaneDosage: bridgeTherapyForm.clexaneDosage,
      startDate: bridgeTherapyForm.startDate,
      duration: bridgeTherapyForm.duration,
      monitoringNotes: bridgeTherapyForm.monitoringNotes,
      status: 'planned'
    };

    setActiveBridgeTherapies([...activeBridgeTherapies, newBridgeTherapy]);
    onBridgeTherapyOrder(newBridgeTherapy);
    setShowBridgeTherapyDialog(false);
    setBridgeTherapyForm({
      indication: "",
      clexaneDosage: "",
      startDate: "",
      duration: "5-7 dni",
      monitoringNotes: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          🩸 Zarządzanie Terapią Przeciwzakrzepową
        </h3>
        <Badge variant="outline" className="text-xs">
          Pacjent: {patientName}
        </Badge>
      </div>

      {/* Current Medications for Discontinuation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Pill className="w-5 h-5" />
            <span>Odstawienie Leków</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentMedications.length > 0 ? (
            <div className="space-y-2">
              {currentMedications.map((drug) => (
                <div
                  key={drug.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{drug.drug.name}</span>
                    <div className="text-sm text-gray-600">
                      {drug.dosage} • {drug.frequency}
                      {drug.notes && ` • ${drug.notes}`}
                    </div>
                  </div>
                  
                  <Dialog open={showDiscontinuationDialog && selectedDrug?.id === drug.id} onOpenChange={(open) => {
                    setShowDiscontinuationDialog(open);
                    if (!open) setSelectedDrug(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDrug(drug)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Odstaw
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Zlecenie Odstawienia Leku</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">
                                Lek do odstawienia: {selectedDrug?.drug.name}
                              </p>
                              <p className="text-sm text-yellow-700">
                                Obecna dawka: {selectedDrug?.dosage} • {selectedDrug?.frequency}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Data odstawienia *</Label>
                          <Input
                            type="date"
                            value={discontinuationForm.discontinuationDate}
                            onChange={(e) => setDiscontinuationForm(prev => ({
                              ...prev,
                              discontinuationDate: e.target.value
                            }))}
                            className="mt-1"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Powód odstawienia *</Label>
                          <select
                            value={discontinuationForm.reason}
                            onChange={(e) => setDiscontinuationForm(prev => ({
                              ...prev,
                              reason: e.target.value
                            }))}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Wybierz powód...</option>
                            {discontinuationReasons.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Zlecający</Label>
                          <select
                            value={discontinuationForm.prescribedBy}
                            onChange={(e) => setDiscontinuationForm(prev => ({
                              ...prev,
                              prescribedBy: e.target.value
                            }))}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="POZ">Lekarz POZ</option>
                            <option value="Specjalista">Lekarz Specjalista</option>
                            <option value="Anestezjolog">Anestezjolog</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={handleDiscontinuationSubmit}
                            disabled={!discontinuationForm.discontinuationDate || !discontinuationForm.reason}
                            className="flex-1"
                          >
                            Złóż Zlecenie
                          </Button>
                          <Button variant="outline" onClick={() => setShowDiscontinuationDialog(false)}>
                            Anuluj
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Brak leków do odstawienia
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bridge Therapy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <span>Terapia Pomostowa (Clexane)</span>
            </div>
            
            <Dialog open={showBridgeTherapyDialog} onOpenChange={setShowBridgeTherapyDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Nowa Terapia
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Zlecenie Terapii Pomostowej</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Wskazanie *</Label>
                    <select
                      value={bridgeTherapyForm.indication}
                      onChange={(e) => setBridgeTherapyForm(prev => ({
                        ...prev,
                        indication: e.target.value
                      }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz wskazanie...</option>
                      <option value="Profilaktyka przedoperacyjna">Profilaktyka przedoperacyjna</option>
                      <option value="Mostowanie antykoagulacji">Mostowanie antykoagulacji</option>
                      <option value="Profilaktyka żylna">Profilaktyka żylna</option>
                      <option value="Leczenie zakrzepicy">Leczenie zakrzepicy</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Dawka Clexane *</Label>
                    <div className="space-y-2">
                      {clexaneDosages.map((dosage) => (
                        <button
                          key={dosage.value}
                          onClick={() => setBridgeTherapyForm(prev => ({
                            ...prev,
                            clexaneDosage: dosage.value
                          }))}
                          className={cn(
                            "w-full p-3 text-left border-2 rounded-lg transition-colors",
                            bridgeTherapyForm.clexaneDosage === dosage.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="font-medium text-gray-900">{dosage.label}</div>
                          <div className="text-sm text-gray-600">{dosage.indication}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Data rozpoczęcia *</Label>
                      <Input
                        type="date"
                        value={bridgeTherapyForm.startDate}
                        onChange={(e) => setBridgeTherapyForm(prev => ({
                          ...prev,
                          startDate: e.target.value
                        }))}
                        className="mt-1"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Czas trwania</Label>
                      <select
                        value={bridgeTherapyForm.duration}
                        onChange={(e) => setBridgeTherapyForm(prev => ({
                          ...prev,
                          duration: e.target.value
                        }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="3 dni">3 dni</option>
                        <option value="5-7 dni">5-7 dni</option>
                        <option value="7-10 dni">7-10 dni</option>
                        <option value="Do odwołania">Do odwołania</option>
                        <option value="Wg wskazań">Według wskazań</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Uwagi dotyczące monitorowania</Label>
                    <Textarea
                      placeholder="np. kontrola morfologii, obserwacja objawów krwawienia..."
                      value={bridgeTherapyForm.monitoringNotes}
                      onChange={(e) => setBridgeTherapyForm(prev => ({
                        ...prev,
                        monitoringNotes: e.target.value
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={handleBridgeTherapySubmit}
                      disabled={!bridgeTherapyForm.indication || !bridgeTherapyForm.clexaneDosage || !bridgeTherapyForm.startDate}
                      className="flex-1"
                    >
                      Złóż Zlecenie
                    </Button>
                    <Button variant="outline" onClick={() => setShowBridgeTherapyDialog(false)}>
                      Anuluj
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeBridgeTherapies.length > 0 ? (
            <div className="space-y-3">
              {activeBridgeTherapies.map((therapy) => (
                <div key={therapy.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{therapy.indication}</span>
                    <Badge className={cn(
                      therapy.status === 'planned' ? "bg-yellow-100 text-yellow-800" :
                      therapy.status === 'active' ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {therapy.status === 'planned' ? 'Zaplanowana' :
                       therapy.status === 'active' ? 'Aktywna' : 'Zakończona'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Clexane:</strong> {therapy.clexaneDosage}</p>
                    <p><strong>Start:</strong> {new Date(therapy.startDate).toLocaleDateString('pl-PL')}</p>
                    <p><strong>Czas trwania:</strong> {therapy.duration}</p>
                    {therapy.monitoringNotes && (
                      <p><strong>Monitorowanie:</strong> {therapy.monitoringNotes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Brak aktywnych terapii pomostowych
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Discontinuations */}
      {activeDiscontinuations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <CalendarDays className="w-5 h-5" />
              <span>Aktywne Zlecenia Odstawienia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeDiscontinuations.map((disc) => (
                <div key={disc.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{disc.drugName}</span>
                    <Badge className={cn(
                      disc.status === 'planned' ? "bg-yellow-100 text-yellow-800" :
                      disc.status === 'completed' ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    )}>
                      {disc.status === 'planned' ? 'Zaplanowane' :
                       disc.status === 'completed' ? 'Wykonane' : 'Anulowane'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Data odstawienia:</strong> {new Date(disc.discontinuationDate).toLocaleDateString('pl-PL')}</p>
                    <p><strong>Powód:</strong> {disc.reason}</p>
                    <p><strong>Zlecający:</strong> {disc.prescribedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
