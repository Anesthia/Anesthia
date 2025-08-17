import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Search, Pill } from "lucide-react";
import { searchDrugs, type Drug } from "@/lib/poz-drugs-database";
import { cn } from "@/lib/utils";

export interface SelectedDrug {
  id: string;
  drug: Drug;
  dosage: string;
  frequency: string;
  notes?: string;
}

interface DrugSearchSelectorProps {
  selectedDrugs: SelectedDrug[];
  onDrugsChange: (drugs: SelectedDrug[]) => void;
  placeholder?: string;
}

export default function DrugSearchSelector({
  selectedDrugs,
  onDrugsChange,
  placeholder = "Wpisz nazwę leku..."
}: DrugSearchSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDrug, setManualDrug] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeOfDay: "",
    notes: ""
  });

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchDrugs(searchQuery, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleDrugSelect = (drug: Drug, selectedDosage?: string) => {
    const newSelectedDrug: SelectedDrug = {
      id: `${drug.id}-${Date.now()}`,
      drug,
      dosage: selectedDosage || drug.commonDosages[0] || "",
      frequency: "1x dziennie",
      notes: ""
    };

    onDrugsChange([...selectedDrugs, newSelectedDrug]);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleDrugRemove = (drugId: string) => {
    onDrugsChange(selectedDrugs.filter(drug => drug.id !== drugId));
  };

  const handleManualDrugAdd = () => {
    if (!manualDrug.name.trim() || !manualDrug.dosage.trim()) return;

    const newSelectedDrug: SelectedDrug = {
      id: `manual-${Date.now()}`,
      drug: {
        id: `manual-${manualDrug.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: manualDrug.name,
        activeIngredient: "Nie określono",
        category: "Lek własny",
        commonDosages: [manualDrug.dosage],
        searchTerms: [manualDrug.name.toLowerCase()]
      },
      dosage: manualDrug.dosage,
      frequency: manualDrug.frequency || "1x dziennie",
      notes: [manualDrug.timeOfDay, manualDrug.notes].filter(Boolean).join(" • ")
    };

    onDrugsChange([...selectedDrugs, newSelectedDrug]);
    setManualDrug({ name: "", dosage: "", frequency: "", timeOfDay: "", notes: "" });
    setShowManualEntry(false);
  };

  const handleDrugUpdate = (drugId: string, updates: Partial<SelectedDrug>) => {
    onDrugsChange(
      selectedDrugs.map(drug => 
        drug.id === drugId ? { ...drug, ...updates } : drug
      )
    );
    setEditingDrug(null);
  };

  const frequencyOptions = [
    "1x dziennie",
    "2x dziennie", 
    "3x dziennie",
    "4x dziennie",
    "co 8 godzin",
    "co 12 godzin",
    "rano",
    "wieczorem",
    "rano i wieczorem",
    "przed posiłkiem",
    "po posiłku",
    "w razie potrzeby",
    "co drugi dzień",
    "wg potrzeb"
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Obecnie Przyjmowane Leki</Label>
        <p className="text-sm text-gray-600 mb-3">
          Wpisz nazwę leku, aby wyszukać z bazy leków POZ
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(e.target.value.length >= 2);
            }}
            className="pl-10"
            onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          />

          {/* Custom Dropdown */}
          {isSearchOpen && (searchResults.length > 0 || (searchQuery.length >= 2 && searchResults.length === 0)) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="flex flex-col items-center py-6">
                  <Pill className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Nie znaleziono leku</p>
                  <p className="text-xs text-gray-500">Sprawdź pisownię lub skontaktuj się z lekarzem</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Leki z bazy POZ
                  </div>
                  {searchResults.map((drug) => (
                    <div
                      key={drug.id}
                      className="px-3 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                    >
                      <div className="flex justify-between items-start w-full mb-3">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 text-base">{drug.name}</span>
                          <div className="text-sm text-gray-600 mt-1">
                            🧪 {drug.activeIngredient}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {drug.category}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700 mb-2">
                          💊 Wybierz dawkę aby dodać:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {drug.commonDosages.map((dosage) => {
                            const isLowDose = parseFloat(dosage) <= 5;
                            const isMediumDose = parseFloat(dosage) > 5 && parseFloat(dosage) <= 20;
                            const isHighDose = parseFloat(dosage) > 20;
                            const isRecommended = drug.commonDosages[0] === dosage;

                            return (
                              <button
                                key={dosage}
                                onClick={() => handleDrugSelect(drug, dosage)}
                                className={cn(
                                  "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md",
                                  "flex flex-col items-center justify-center min-h-[70px] group bg-white",
                                  "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                )}
                              >
                                {/* Visual Pill Representation */}
                                <div className={cn(
                                  "w-6 h-4 rounded-full mb-1.5 transition-colors group-hover:scale-110",
                                  isLowDose ? "bg-green-400" :
                                  isMediumDose ? "bg-yellow-400" : "bg-orange-400"
                                )} />

                                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                                  {dosage}
                                </span>

                                {/* Recommended badge */}
                                {isRecommended && (
                                  <div className="absolute -top-1 -right-1">
                                    <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 border border-green-200">
                                      Typowa
                                    </Badge>
                                  </div>
                                )}

                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick add with default dosage option */}
                        <button
                          onClick={() => handleDrugSelect(drug)}
                          className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          ➕ Dodaj z domyślną dawką ({drug.commonDosages[0]})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Entry Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="text-sm"
          >
            {showManualEntry ? "🔍 Wróć do wyszukiwania" : "✏️ Dodaj lek ręcznie"}
          </Button>
        </div>

        {/* Manual Drug Entry Form */}
        {showManualEntry && (
          <Card className="mt-4 border-2 border-dashed border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nazwa leku *</Label>
                  <Input
                    placeholder="np. Lek nieobjęty bazą, suplement, zioło..."
                    value={manualDrug.name}
                    onChange={(e) => setManualDrug(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Dawka *</Label>
                    <Input
                      placeholder="np. 10mg, 1 tabletka, 5ml"
                      value={manualDrug.dosage}
                      onChange={(e) => setManualDrug(prev => ({ ...prev, dosage: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Częstotliwość</Label>
                    <select
                      value={manualDrug.frequency}
                      onChange={(e) => setManualDrug(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz częstotliwość...</option>
                      {frequencyOptions.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Pora dnia</Label>
                  <select
                    value={manualDrug.timeOfDay}
                    onChange={(e) => setManualDrug(prev => ({ ...prev, timeOfDay: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Wybierz porę dnia...</option>
                    <option value="rano">Rano</option>
                    <option value="w południe">W południe</option>
                    <option value="wieczorem">Wieczorem</option>
                    <option value="na noc">Na noc</option>
                    <option value="przed śniadaniem">Przed śniadaniem</option>
                    <option value="po śniadaniu">Po śniadaniu</option>
                    <option value="przed obiadem">Przed obiadem</option>
                    <option value="po obiedzie">Po obiedzie</option>
                    <option value="przed kolacją">Przed kolacją</option>
                    <option value="po kolacji">Po kolacji</option>
                    <option value="na czczo">Na czczo</option>
                    <option value="z jedzeniem">Z jedzeniem</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Dodatkowe uwagi</Label>
                  <Input
                    placeholder="np. w razie bólu, tylko w weekendy..."
                    value={manualDrug.notes}
                    onChange={(e) => setManualDrug(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={handleManualDrugAdd}
                    disabled={!manualDrug.name.trim() || !manualDrug.dosage.trim()}
                    className="flex-1"
                  >
                    ➕ Dodaj lek
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowManualEntry(false);
                      setManualDrug({ name: "", dosage: "", frequency: "", timeOfDay: "", notes: "" });
                    }}
                  >
                    Anuluj
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Drugs List */}
      {selectedDrugs.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Wybrane leki ({selectedDrugs.length})
          </Label>
          
          {selectedDrugs.map((selectedDrug) => (
            <Card key={selectedDrug.id} className="border border-gray-200">
              <CardContent className="p-4">
                {editingDrug === selectedDrug.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {selectedDrug.drug.name}
                      </span>
                      <Badge variant="outline">{selectedDrug.drug.category}</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          💊 Wybierz dawkę
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {selectedDrug.drug.commonDosages.map((dosage) => {
                            const isSelected = selectedDrug.dosage === dosage;
                            const isLowDose = parseFloat(dosage) <= 5;
                            const isMediumDose = parseFloat(dosage) > 5 && parseFloat(dosage) <= 20;
                            const isHighDose = parseFloat(dosage) > 20;

                            return (
                              <button
                                key={dosage}
                                onClick={() => handleDrugUpdate(selectedDrug.id, { dosage })}
                                className={cn(
                                  "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                                  "flex flex-col items-center justify-center min-h-[80px] group",
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                {/* Visual Pill Representation */}
                                <div className={cn(
                                  "w-8 h-5 rounded-full mb-2 transition-colors",
                                  isSelected ? "bg-blue-500" :
                                  isLowDose ? "bg-green-400" :
                                  isMediumDose ? "bg-yellow-400" : "bg-orange-400"
                                )} />

                                <span className={cn(
                                  "text-sm font-medium transition-colors",
                                  isSelected ? "text-blue-700" : "text-gray-700"
                                )}>
                                  {dosage}
                                </span>

                                {/* Recommended badge for first option */}
                                {selectedDrug.drug.commonDosages[0] === dosage && (
                                  <div className="absolute -top-1 -right-1">
                                    <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                                      Typowa
                                    </Badge>
                                  </div>
                                )}

                                {/* Selection indicator */}
                                {isSelected && (
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Dosage guidance */}
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">Wskazówka dotycząca dawkowania:</p>
                              <p>
                                {selectedDrug.drug.category === "Leki przeciwnadciśnieniowe" &&
                                  "Zazwyczaj zaczyna się od najmniejszej dawki i zwiększa w razie potrzeby."
                                }
                                {selectedDrug.drug.category === "Antybiotyki" &&
                                  "Dawka zależy od ciężkości infekcji i wagi ciała."
                                }
                                {selectedDrug.drug.category === "Leki przeciwcukrzycowe" &&
                                  "Dawka jest dostosowywana do poziomu cukru we krwi."
                                }
                                {selectedDrug.drug.category === "NLPZ" &&
                                  "Używaj najmniejszej skutecznej dawki przez najkrótszy możliwy czas."
                                }
                                {!["Leki przeciwnadciśnieniowe", "Antybiotyki", "Leki przeciwcukrzycowe", "NLPZ"].includes(selectedDrug.drug.category) &&
                                  "Skonsultuj się z lekarzem w sprawie właściwej dawki."
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          ⏰ Jak często przyjmujesz ten lek?
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {frequencyOptions.slice(0, 8).map((freq) => {
                            const isSelected = selectedDrug.frequency === freq;
                            return (
                              <button
                                key={freq}
                                onClick={() => handleDrugUpdate(selectedDrug.id, { frequency: freq })}
                                className={cn(
                                  "p-3 rounded-lg border-2 text-left transition-all duration-200",
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{freq}</span>
                                  {isSelected && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Show remaining options in a dropdown if more than 8 */}
                        {frequencyOptions.length > 8 && (
                          <div className="mt-2">
                            <Label className="text-xs text-gray-600 mb-1 block">Inne opcje:</Label>
                            <select
                              value={frequencyOptions.slice(0, 8).includes(selectedDrug.frequency) ? "" : selectedDrug.frequency}
                              onChange={(e) => e.target.value && handleDrugUpdate(selectedDrug.id, { frequency: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Wybierz inną opcję...</option>
                              {frequencyOptions.slice(8).map((freq) => (
                                <option key={freq} value={freq}>
                                  {freq}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`notes-${selectedDrug.id}`} className="text-sm">
                        Dodatkowe uwagi (opcjonalne)
                      </Label>
                      <Input
                        id={`notes-${selectedDrug.id}`}
                        placeholder="np. z jedzeniem, na czczo..."
                        value={selectedDrug.notes || ""}
                        onChange={(e) => handleDrugUpdate(selectedDrug.id, { notes: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => setEditingDrug(null)}
                      >
                        Zapisz
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingDrug(null)}
                      >
                        Anuluj
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {selectedDrug.drug.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {selectedDrug.drug.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "w-6 h-4 rounded-full",
                              parseFloat(selectedDrug.dosage) <= 5 ? "bg-green-400" :
                              parseFloat(selectedDrug.dosage) <= 20 ? "bg-yellow-400" : "bg-orange-400"
                            )} />
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedDrug.dosage}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">dawka</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                            <span className="text-sm text-gray-700">{selectedDrug.frequency}</span>
                          </div>
                        </div>

                        {selectedDrug.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                            <p className="text-sm text-amber-800">
                              <span className="font-medium">💡 Uwagi:</span> {selectedDrug.notes}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <span>🧪</span>
                          <span>Substancja czynna: {selectedDrug.drug.activeIngredient}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDrug(selectedDrug.id)}
                        className="px-2 py-1 h-8"
                      >
                        Edytuj
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDrugRemove(selectedDrug.id)}
                        className="px-2 py-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedDrugs.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Pill className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Brak wybranych leków</p>
          <p className="text-xs">Wyszukaj i dodaj leki używając pola powyżej</p>
        </div>
      )}
    </div>
  );
}
