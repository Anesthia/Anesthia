export interface Drug {
  id: string;
  name: string;
  activeIngredient: string;
  category: string;
  commonDosages: string[];
  searchTerms: string[];
}

export const pozDrugsDatabase: Drug[] = [
  // Leki przeciwnadciśnieniowe
  {
    id: "amlodipine",
    name: "Amlodipina",
    activeIngredient: "amlodipine",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["2.5mg", "5mg", "10mg"],
    searchTerms: ["amlodipina", "amlodipine", "norvasc", "tenox", "kalpress", "amlonor"]
  },
  {
    id: "enalapril",
    name: "Enalapril",
    activeIngredient: "enalapril",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["2.5mg", "5mg", "10mg", "20mg"],
    searchTerms: ["enalapril", "enap", "enapril", "renipril", "berlipril", "enacard"]
  },
  {
    id: "losartan",
    name: "Losartan",
    activeIngredient: "losartan",
    category: "Leki przeciwnadciśnieniowe", 
    commonDosages: ["25mg", "50mg", "100mg"],
    searchTerms: ["losartan", "cozaar", "lozap", "fortzaar", "losacor"]
  },
  {
    id: "bisoprolol",
    name: "Bisoprolol",
    activeIngredient: "bisoprolol",
    category: "Beta-blokery",
    commonDosages: ["1.25mg", "2.5mg", "5mg", "10mg"],
    searchTerms: ["bisoprolol", "bisocard", "concor", "emcor", "monocor"]
  },
  {
    id: "hydrochlorothiazide",
    name: "Hydrochlorotiazyd",
    activeIngredient: "hydrochlorothiazide",
    category: "Diuretyki",
    commonDosages: ["12.5mg", "25mg"],
    searchTerms: ["hydrochlorotiazyd", "hctz", "microzide", "disothiazide", "hydrosaluric"]
  },

  // Leki przeciwcukrzycowe
  {
    id: "metformin",
    name: "Metformina",
    activeIngredient: "metformin",
    category: "Leki przeciwcukrzycowe",
    commonDosages: ["500mg", "850mg", "1000mg"],
    searchTerms: ["metformina", "metformin", "glucophage", "siofor", "metfogamma", "metformax"]
  },
  {
    id: "gliclazide",
    name: "Gliklazydu",
    activeIngredient: "gliclazide", 
    category: "Leki przeciwcukrzycowe",
    commonDosages: ["30mg", "60mg", "80mg"],
    searchTerms: ["gliklazydu", "gliclazide", "diabeton", "diaprel", "gliclada", "glyrelan"]
  },
  {
    id: "insulin",
    name: "Insulina",
    activeIngredient: "insulin",
    category: "Insuliny",
    commonDosages: ["j.m.", "wg potrzeb"],
    searchTerms: ["insulina", "insulin", "humulin", "novorapid", "lantus", "actrapid", "protaphane", "levemir", "apidra"]
  },

  // Leki przeciwzakrzepowe
  {
    id: "warfarin",
    name: "Warfaryna",
    activeIngredient: "warfarin",
    category: "Antykoagulanty",
    commonDosages: ["1mg", "3mg", "5mg"],
    searchTerms: ["warfaryna", "warfarin", "coumadin", "marevan", "warfin"]
  },
  {
    id: "acenocoumarol",
    name: "Acenocoumarol",
    activeIngredient: "acenocoumarol",
    category: "Antykoagulanty", 
    commonDosages: ["1mg", "4mg"],
    searchTerms: ["acenocoumarol", "sintrom", "acenocumarol", "syncumar"]
  },
  {
    id: "clopidogrel",
    name: "Klopidogrel",
    activeIngredient: "clopidogrel",
    category: "Leki przeciwpłytkowe",
    commonDosages: ["75mg"],
    searchTerms: ["klopidogrel", "clopidogrel", "plavix", "trombex", "clopisan", "plagril"]
  },
  {
    id: "aspirin",
    name: "Kwas acetylosalicylowy",
    activeIngredient: "acetylsalicylic acid",
    category: "Leki przeciwpłytkowe",
    commonDosages: ["75mg", "100mg", "150mg"],
    searchTerms: ["aspiryna", "aspirin", "acard", "polocard", "kwas acetylosalicylowy"]
  },
  // Nowe antykoagulanty doustne (NOAC)
  {
    id: "rivaroxaban",
    name: "Riwaroksaban",
    activeIngredient: "rivaroxaban",
    category: "Antykoagulanty",
    commonDosages: ["10mg", "15mg", "20mg"],
    searchTerms: ["riwaroksaban", "rivaroxaban", "xarelto"]
  },
  {
    id: "apixaban",
    name: "Apiksaban",
    activeIngredient: "apixaban",
    category: "Antykoagulanty",
    commonDosages: ["2.5mg", "5mg"],
    searchTerms: ["apiksaban", "apixaban", "eliquis"]
  },
  {
    id: "dabigatran",
    name: "Dabigatran",
    activeIngredient: "dabigatran",
    category: "Antykoagulanty",
    commonDosages: ["75mg", "110mg", "150mg"],
    searchTerms: ["dabigatran", "pradaxa"]
  },
  {
    id: "edoxaban",
    name: "Edoksaban",
    activeIngredient: "edoxaban",
    category: "Antykoagulanty",
    commonDosages: ["30mg", "60mg"],
    searchTerms: ["edoksaban", "edoxaban", "lixiana"]
  },
  // Heparyny domowe
  {
    id: "enoxaparin",
    name: "Enoksaparyna",
    activeIngredient: "enoxaparin",
    category: "Heparyny",
    commonDosages: ["20mg", "40mg", "60mg", "80mg", "100mg"],
    searchTerms: ["enoksaparyna", "enoxaparin", "clexane", "lovenox"]
  },
  {
    id: "nadroparin",
    name: "Nadroparyna",
    activeIngredient: "nadroparin",
    category: "Heparyny",
    commonDosages: ["2850j.m.", "3800j.m.", "5700j.m.", "7600j.m."],
    searchTerms: ["nadroparyna", "nadroparin", "fraxiparine"]
  },
  {
    id: "dalteparin",
    name: "Dalteparyna",
    activeIngredient: "dalteparin",
    category: "Heparyny",
    commonDosages: ["2500j.m.", "5000j.m.", "7500j.m.", "10000j.m."],
    searchTerms: ["dalteparyna", "dalteparin", "fragmin"]
  },
  // Dodatkowe leki przeciwpłytkowe
  {
    id: "ticagrelor",
    name: "Tikagrelor",
    activeIngredient: "ticagrelor",
    category: "Leki przeciwpłytkowe",
    commonDosages: ["60mg", "90mg"],
    searchTerms: ["tikagrelor", "ticagrelor", "brilique"]
  },
  {
    id: "prasugrel",
    name: "Prasugrel",
    activeIngredient: "prasugrel",
    category: "Leki przeciwpłytkowe",
    commonDosages: ["5mg", "10mg"],
    searchTerms: ["prasugrel", "efient"]
  },

  // Leki przeciwbólowe
  {
    id: "paracetamol",
    name: "Paracetamol",
    activeIngredient: "paracetamol",
    category: "Analgetyki",
    commonDosages: ["500mg", "1000mg"],
    searchTerms: ["paracetamol", "acetaminophen", "apap", "efferalgan", "panadol", "codipar", "rapidol"]
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    activeIngredient: "ibuprofen",
    category: "NLPZ",
    commonDosages: ["200mg", "400mg", "600mg"],
    searchTerms: ["ibuprofen", "ibuprom", "nurofen", "advil", "ibufen", "solpaflex"]
  },
  {
    id: "diclofenac",
    name: "Diklofenak",
    activeIngredient: "diclofenac",
    category: "NLPZ",
    commonDosages: ["25mg", "50mg", "75mg"],
    searchTerms: ["diklofenak", "diclofenac", "voltaren", "cataflam", "olfen", "diclac"]
  },
  {
    id: "tramadol",
    name: "Tramadol",
    activeIngredient: "tramadol",
    category: "Opioidy",
    commonDosages: ["50mg", "100mg", "150mg", "200mg"],
    searchTerms: ["tramadol", "tramal", "contramal", "amadol", "dolzam"]
  },

  // Leki na żołądek
  {
    id: "omeprazole",
    name: "Omeprazol",
    activeIngredient: "omeprazole",
    category: "Inhibitory pompy protonowej",
    commonDosages: ["10mg", "20mg", "40mg"],
    searchTerms: ["omeprazol", "omeprazole", "losec", "tulzol", "bioprazol", "omessa"]
  },
  {
    id: "pantoprazole",
    name: "Pantoprazol",
    activeIngredient: "pantoprazole",
    category: "Inhibitory pompy protonowej",
    commonDosages: ["20mg", "40mg"],
    searchTerms: ["pantoprazol", "pantoprazole", "controloc", "nolpaza", "zipantola", "pantopan"]
  },
  {
    id: "ranitidine",
    name: "Ranitydyna",
    activeIngredient: "ranitidine",
    category: "Blokery H2",
    commonDosages: ["150mg", "300mg"],
    searchTerms: ["ranitydyna", "ranitidine", "zantac", "ranigast", "histac", "ranisan"]
  },

  // Antybiotyki
  {
    id: "amoxicillin",
    name: "Amoksycylina",
    activeIngredient: "amoxicillin",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg", "1000mg"],
    searchTerms: ["amoksycylina", "amoxicillin", "amoxil", "ospamox", "duomox", "flemoxin"]
  },
  {
    id: "azithromycin",
    name: "Azytromycyna",
    activeIngredient: "azithromycin",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg"],
    searchTerms: ["azytromycyna", "azithromycin", "sumamed", "zetamax", "azimycin", "zitromax"]
  },
  {
    id: "clarithromycin",
    name: "Klarytromycyna",
    activeIngredient: "clarithromycin", 
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg"],
    searchTerms: ["klarytromycyna", "clarithromycin", "klacid", "fromilid", "clabax", "clarem"]
  },
  {
    id: "ciprofloxacin",
    name: "Ciprofloksacyna",
    activeIngredient: "ciprofloxacin",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg", "750mg"],
    searchTerms: ["ciprofloksacyna", "ciprofloxacin", "ciprinol", "quintor", "ciproxin", "ciprobay"]
  },

  // Leki na cholesterol
  {
    id: "atorvastatin",
    name: "Atorwastatyna",
    activeIngredient: "atorvastatin",
    category: "Statyny",
    commonDosages: ["10mg", "20mg", "40mg", "80mg"],
    searchTerms: ["atorwastatyna", "atorvastatin", "lipitor", "tulip", "sortis", "torvacard"]
  },
  {
    id: "simvastatin",
    name: "Simwastatyna",
    activeIngredient: "simvastatin",
    category: "Statyny",
    commonDosages: ["10mg", "20mg", "40mg"],
    searchTerms: ["simwastatyna", "simvastatin", "zocor", "apo-simva", "simgal", "vasilip"]
  },

  // Leki na tarczycę
  {
    id: "levothyroxine",
    name: "Lewotyroksyna",
    activeIngredient: "levothyroxine",
    category: "Hormony tarczycy",
    commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg", "150mcg"],
    searchTerms: ["lewotyroksyna", "levothyroxine", "euthyrox", "letrox", "eferox", "thyro-4"]
  },
  {
    id: "methimazole",
    name: "Tiamazol",
    activeIngredient: "methimazole",
    category: "Leki antytyreoidalne",
    commonDosages: ["5mg", "10mg"],
    searchTerms: ["tiamazol", "methimazole", "thyrozol", "metizol", "mercazole"]
  },

  // Leki psychotropowe (podstawowe w POZ)
  {
    id: "sertraline",
    name: "Sertralina",
    activeIngredient: "sertraline",
    category: "Antydepresanty",
    commonDosages: ["25mg", "50mg", "100mg"],
    searchTerms: ["sertralina", "sertraline", "zoloft", "sertagen", "setaloft", "asentra"]
  },
  {
    id: "escitalopram",
    name: "Escitalopram",
    activeIngredient: "escitalopram",
    category: "Antydepresanty",
    commonDosages: ["5mg", "10mg", "20mg"],
    searchTerms: ["escitalopram", "cipralex", "lexapro", "escilex", "selectra", "elicea"]
  },
  {
    id: "lorazepam",
    name: "Lorazepam",
    activeIngredient: "lorazepam",
    category: "Benzodiazepiny",
    commonDosages: ["0.5mg", "1mg", "2mg"],
    searchTerms: ["lorazepam", "ativan", "lorafen", "emotival", "sinestron"]
  },

  // Leki na alergię
  {
    id: "cetirizine",
    name: "Cetyryzyna",
    activeIngredient: "cetirizine",
    category: "Antyhistaminowe",
    commonDosages: ["5mg", "10mg"],
    searchTerms: ["cetyryzyna", "cetirizine", "zyrtec", "alerid", "amertil", "letizen"]
  },
  {
    id: "loratadine",
    name: "Loratadyna",
    activeIngredient: "loratadine",
    category: "Antyhistaminowe",
    commonDosages: ["10mg"],
    searchTerms: ["loratadyna", "loratadine", "claritin", "claritine", "lomilan", "flonidan"]
  },

  // Witaminy i suplementy
  {
    id: "vitamin-d3",
    name: "Witamina D3",
    activeIngredient: "cholecalciferol",
    category: "Witaminy",
    commonDosages: ["1000j.m.", "2000j.m.", "4000j.m."],
    searchTerms: ["witamina d3", "vitamin d3", "cholecalciferol", "vigantol", "detriferol", "devaron"]
  },
  {
    id: "vitamin-b12",
    name: "Witamina B12",
    activeIngredient: "cyanocobalamin",
    category: "Witaminy",
    commonDosages: ["500mcg", "1000mcg"],
    searchTerms: ["witamina b12", "vitamin b12", "cyanocobalamin", "cobalamin", "rubranova", "medivitan"]
  },
  {
    id: "folic-acid",
    name: "Kwas foliowy",
    activeIngredient: "folic acid",
    category: "Witaminy",
    commonDosages: ["0.4mg", "5mg"],
    searchTerms: ["kwas foliowy", "folic acid", "folacin", "folian", "folacyna", "foliber"]
  },

  // Leki na kaszel i przeziębienie
  {
    id: "dextromethorphan",
    name: "Dekstrometorfan",
    activeIngredient: "dextromethorphan",
    category: "Leki przeciwkaszlowe",
    commonDosages: ["15mg", "30mg"],
    searchTerms: ["dekstrometorfan", "dextromethorphan", "robitussin", "acodin", "tussin", "tussidane"]
  },
  {
    id: "acetylcysteine",
    name: "Acetylcysteina",
    activeIngredient: "acetylcysteine",
    category: "Mukolityki",
    commonDosages: ["200mg", "600mg"],
    searchTerms: ["acetylcysteina", "acetylcysteine", "acc", "fluimucil", "mucobene", "aceteks"]
  },

  // Dodatkowe leki przeciwnadciśnieniowe
  {
    id: "perindopril",
    name: "Perindopril",
    activeIngredient: "perindopril",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["2mg", "4mg", "8mg", "10mg"],
    searchTerms: ["perindopril", "prestarium", "perineva", "coversyl", "prenessa", "perstarium"]
  },
  {
    id: "ramipril",
    name: "Ramipril",
    activeIngredient: "ramipril",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["1.25mg", "2.5mg", "5mg", "10mg"],
    searchTerms: ["ramipril", "altace", "tritace", "piramil", "amprilan", "cardace"]
  },
  {
    id: "valsartan",
    name: "Walsartan",
    activeIngredient: "valsartan",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["40mg", "80mg", "160mg", "320mg"],
    searchTerms: ["walsartan", "valsartan", "diovan", "nortivan", "tareg", "valsacor"]
  },
  {
    id: "telmisartan",
    name: "Telmisartan",
    activeIngredient: "telmisartan",
    category: "Leki przeciwnadciśnieniowe",
    commonDosages: ["20mg", "40mg", "80mg"],
    searchTerms: ["telmisartan", "micardis", "telmizek", "pritor", "tolura"]
  },
  {
    id: "indapamide",
    name: "Indapamid",
    activeIngredient: "indapamide",
    category: "Diuretyki",
    commonDosages: ["1.5mg", "2.5mg"],
    searchTerms: ["indapamid", "indapamide", "tertensif", "rawel", "natrilix", "indix"]
  },
  {
    id: "furosemide",
    name: "Furosemid",
    activeIngredient: "furosemide",
    category: "Diuretyki",
    commonDosages: ["20mg", "40mg"],
    searchTerms: ["furosemid", "furosemide", "lasix", "furorese", "furix", "furon"]
  },
  {
    id: "spironolactone",
    name: "Spironolakton",
    activeIngredient: "spironolactone",
    category: "Diuretyki",
    commonDosages: ["25mg", "50mg", "100mg"],
    searchTerms: ["spironolakton", "spironolactone", "verospiron", "aldactone", "spirix", "spirono"]
  },

  // Więcej beta-blokerów
  {
    id: "metoprolol",
    name: "Metoprolol",
    activeIngredient: "metoprolol",
    category: "Beta-blokery",
    commonDosages: ["25mg", "50mg", "100mg", "200mg"],
    searchTerms: ["metoprolol", "betaloc", "corvitol", "egis", "metcard", "vasocardin"]
  },
  {
    id: "propranolol",
    name: "Propranolol",
    activeIngredient: "propranolol",
    category: "Beta-blokery",
    commonDosages: ["10mg", "40mg", "80mg"],
    searchTerms: ["propranolol", "inderal", "obsidan", "sumial", "anaprilinum", "propra"]
  },
  {
    id: "nebivolol",
    name: "Nebivolol",
    activeIngredient: "nebivolol",
    category: "Beta-blokery",
    commonDosages: ["2.5mg", "5mg", "10mg"],
    searchTerms: ["nebivolol", "nebilet", "lobivon", "hypoloc", "binelol"]
  },

  // Rozszerzenie leków przeciwcukrzycowych
  {
    id: "glimepiride",
    name: "Glimepiryd",
    activeIngredient: "glimepiride",
    category: "Leki przeciwcukrzycowe",
    commonDosages: ["1mg", "2mg", "3mg", "4mg"],
    searchTerms: ["glimepiryd", "glimepiride", "amaryl", "diaprel", "glimepirid", "solosa"]
  },
  {
    id: "sitagliptin",
    name: "Sitagliptyna",
    activeIngredient: "sitagliptin",
    category: "Leki przeciwcukrzycowe",
    commonDosages: ["25mg", "50mg", "100mg"],
    searchTerms: ["sitagliptyna", "sitagliptin", "januvia", "xelevia", "tesavel", "ristfor"]
  },
  {
    id: "empagliflozin",
    name: "Empagliflozyna",
    activeIngredient: "empagliflozin",
    category: "Leki przeciwcukrzycowe",
    commonDosages: ["10mg", "25mg"],
    searchTerms: ["empagliflozyna", "empagliflozin", "jardiance", "boehringer"]
  },

  // Więcej statyn
  {
    id: "rosuvastatin",
    name: "Rosuwastatyna",
    activeIngredient: "rosuvastatin",
    category: "Statyny",
    commonDosages: ["5mg", "10mg", "20mg", "40mg"],
    searchTerms: ["rosuwastatyna", "rosuvastatin", "crestor", "rosart", "roswera", "roxera"]
  },
  {
    id: "pravastatin",
    name: "Prawastatyna",
    activeIngredient: "pravastatin",
    category: "Statyny",
    commonDosages: ["10mg", "20mg", "40mg"],
    searchTerms: ["prawastatyna", "pravastatin", "lipostat", "pravachol", "pravaselect"]
  },

  // Leki na żołądek - rozszerzenie
  {
    id: "lansoprazole",
    name: "Lansoprazol",
    activeIngredient: "lansoprazole",
    category: "Inhibitory pompy protonowej",
    commonDosages: ["15mg", "30mg"],
    searchTerms: ["lansoprazol", "lansoprazole", "prevacid", "lanzul", "agopton", "lanzap"]
  },
  {
    id: "esomeprazole",
    name: "Ezomeprazol",
    activeIngredient: "esomeprazole",
    category: "Inhibitory pompy protonowej",
    commonDosages: ["20mg", "40mg"],
    searchTerms: ["ezomeprazol", "esomeprazole", "nexium", "emanera", "esoxx", "esopral"]
  },
  {
    id: "sucralfate",
    name: "Sukralfat",
    activeIngredient: "sucralfate",
    category: "Leki ochronne żołądka",
    commonDosages: ["1g"],
    searchTerms: ["sukralfat", "sucralfate", "venter", "ulcogant", "andapsin"]
  },
  {
    id: "domperidone",
    name: "Domperidon",
    activeIngredient: "domperidone",
    category: "Leki przeciwwymiotne",
    commonDosages: ["10mg"],
    searchTerms: ["domperidon", "domperidone", "motilium", "domstal", "gastroperidone"]
  },

  // Więcej antybiotyków
  {
    id: "doxycycline",
    name: "Doksycyklina",
    activeIngredient: "doxycycline",
    category: "Antybiotyki",
    commonDosages: ["100mg", "200mg"],
    searchTerms: ["doksycyklina", "doxycycline", "vibramycin", "doxybene", "unidox", "doxyhexal"]
  },
  {
    id: "cephalexin",
    name: "Cefaleksyna",
    activeIngredient: "cephalexin",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg", "1000mg"],
    searchTerms: ["cefaleksyna", "cephalexin", "keflex", "ospexin", "lexin", "ceporex"]
  },
  {
    id: "erythromycin",
    name: "Erytromycyna",
    activeIngredient: "erythromycin",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg"],
    searchTerms: ["erytromycyna", "erythromycin", "erycin", "erythrocin", "sinerit", "ilosone"]
  },
  {
    id: "clindamycin",
    name: "Klindamycyna",
    activeIngredient: "clindamycin",
    category: "Antybiotyki",
    commonDosages: ["150mg", "300mg", "600mg"],
    searchTerms: ["klindamycyna", "clindamycin", "dalacin", "cleocin", "clindacin", "sobelin"]
  },
  {
    id: "trimethoprim-sulfamethoxazole",
    name: "Kotrimoksazol",
    activeIngredient: "trimethoprim + sulfamethoxazole",
    category: "Antybiotyki",
    commonDosages: ["400mg+80mg", "800mg+160mg"],
    searchTerms: ["kotrimoksazol", "bactrim", "biseptol", "sumetrolim", "septrin", "berlocid"]
  },

  // Leki przeciwbólowe - rozszerzenie
  {
    id: "naproxen",
    name: "Naproksen",
    activeIngredient: "naproxen",
    category: "NLPZ",
    commonDosages: ["220mg", "250mg", "500mg"],
    searchTerms: ["naproksen", "naproxen", "nalgesin", "flanax", "aleve", "proxen"]
  },
  {
    id: "piroxicam",
    name: "Piroksikam",
    activeIngredient: "piroxicam",
    category: "NLPZ",
    commonDosages: ["10mg", "20mg"],
    searchTerms: ["piroksikam", "piroxicam", "feldene", "reufen", "flogene", "roxicam"]
  },
  {
    id: "meloxicam",
    name: "Meloksikam",
    activeIngredient: "meloxicam",
    category: "NLPZ",
    commonDosages: ["7.5mg", "15mg"],
    searchTerms: ["meloksikam", "meloxicam", "movalis", "arthrex", "mobic", "melox"]
  },
  {
    id: "nimesulide",
    name: "Nimesulid",
    activeIngredient: "nimesulide",
    category: "NLPZ",
    commonDosages: ["100mg"],
    searchTerms: ["nimesulid", "nimesulide", "nimed", "aulin", "mesulid", "sulidin"]
  },
  {
    id: "metamizole",
    name: "Metamizol",
    activeIngredient: "metamizole",
    category: "Analgetyki",
    commonDosages: ["500mg"],
    searchTerms: ["metamizol", "metamizole", "pyralgina", "analgin", "piramidon", "novaminsulfon"]
  },
  {
    id: "codeine",
    name: "Kodeina",
    activeIngredient: "codeine",
    category: "Opioidy",
    commonDosages: ["15mg", "30mg", "60mg"],
    searchTerms: ["kodeina", "codeine", "solpadeine", "codipar", "codipront", "tussoret"]
  },

  // Leki antyhistaminowe - rozszerzenie
  {
    id: "fexofenadine",
    name: "Feksofenadyna",
    activeIngredient: "fexofenadine",
    category: "Antyhistaminowe",
    commonDosages: ["120mg", "180mg"],
    searchTerms: ["feksofenadyna", "fexofenadine", "allegra", "telfast", "fexofast", "altiva"]
  },
  {
    id: "desloratadine",
    name: "Desloratadyna",
    activeIngredient: "desloratadine",
    category: "Antyhistaminowe",
    commonDosages: ["5mg"],
    searchTerms: ["desloratadyna", "desloratadine", "aerius", "azomyr", "dasselta", "deslorina"]
  },
  {
    id: "levocetirizine",
    name: "Lewocetyryzyna",
    activeIngredient: "levocetirizine",
    category: "Antyhistaminowe",
    commonDosages: ["5mg"],
    searchTerms: ["lewocetyryzyna", "levocetirizine", "xyzal", "zenaro", "alairgix", "suprastinex"]
  },
  {
    id: "chlorpheniramine",
    name: "Chlorfeniramin",
    activeIngredient: "chlorpheniramine",
    category: "Antyhistaminowe",
    commonDosages: ["4mg"],
    searchTerms: ["chlorfeniramin", "chlorpheniramine", "polaramine", "histex", "allergina", "feniramina"]
  },

  // Leki na kaszel i przeziębienie - rozszerzenie
  {
    id: "guaifenesin",
    name: "Gwaifenezyna",
    activeIngredient: "guaifenesin",
    category: "Mukolityki",
    commonDosages: ["200mg", "400mg"],
    searchTerms: ["gwaifenezyna", "guaifenesin", "mucinex", "bisolvon", "robitussin", "expectorant"]
  },
  {
    id: "bromhexine",
    name: "Bromheksyna",
    activeIngredient: "bromhexine",
    category: "Mukolityki",
    commonDosages: ["8mg", "12mg"],
    searchTerms: ["bromheksyna", "bromhexine", "bisolvon", "solmux", "mucofar", "mucospas"]
  },
  {
    id: "ambroxol",
    name: "Ambroksol",
    activeIngredient: "ambroxol",
    category: "Mukolityki",
    commonDosages: ["15mg", "30mg"],
    searchTerms: ["ambroksol", "ambroxol", "mucosolvan", "flavamed", "mucobron", "halixol"]
  },

  // Witaminy i suplementy - rozszerzenie
  {
    id: "calcium-carbonate",
    name: "Węglan wapnia",
    activeIngredient: "calcium carbonate",
    category: "Witaminy",
    commonDosages: ["500mg", "1000mg", "1500mg"],
    searchTerms: ["węglan wapnia", "calcium", "wapń", "calcium carbonate", "calcid", "calperos"]
  },
  {
    id: "magnesium",
    name: "Magnez",
    activeIngredient: "magnesium",
    category: "Witaminy",
    commonDosages: ["200mg", "300mg", "400mg"],
    searchTerms: ["magnez", "magnesium", "magne", "magvit", "magnezin", "slow-mag"]
  },
  {
    id: "iron",
    name: "Żelazo",
    activeIngredient: "iron",
    category: "Witaminy",
    commonDosages: ["14mg", "28mg", "65mg"],
    searchTerms: ["żelazo", "iron", "ferro", "tardyferon", "sorbifer", "aktiferrin"]
  },
  {
    id: "vitamin-c",
    name: "Witamina C",
    activeIngredient: "ascorbic acid",
    category: "Witaminy",
    commonDosages: ["500mg", "1000mg"],
    searchTerms: ["witamina c", "vitamin c", "kwas askorbinowy", "ascorbic acid", "celaskon", "acifort"]
  },
  {
    id: "vitamin-e",
    name: "Witamina E",
    activeIngredient: "tocopherol",
    category: "Witaminy",
    commonDosages: ["100j.m.", "200j.m.", "400j.m."],
    searchTerms: ["witamina e", "vitamin e", "tocopherol", "tokoferol", "ephynal", "evitol"]
  },
  {
    id: "omega3",
    name: "Omega-3",
    activeIngredient: "omega-3 fatty acids",
    category: "Witaminy",
    commonDosages: ["500mg", "1000mg"],
    searchTerms: ["omega 3", "omega-3", "kwasy omega", "rybii tłuszcz", "fish oil", "möller"]
  },

  // Leki na tarczycę - rozszerzenie
  {
    id: "propylthiouracil",
    name: "Propylotiouracyl",
    activeIngredient: "propylthiouracil",
    category: "Leki antytyreoidalne",
    commonDosages: ["50mg", "100mg"],
    searchTerms: ["propylotiouracyl", "propylthiouracil", "ptu", "propycil"]
  },

  // Leki na układ moczowy
  {
    id: "tamsulosin",
    name: "Tamsulosyna",
    activeIngredient: "tamsulosin",
    category: "Leki na prostatę",
    commonDosages: ["0.2mg", "0.4mg"],
    searchTerms: ["tamsulosyna", "tamsulosin", "omnic", "flomax", "pradif", "urimax"]
  },
  {
    id: "finasteride",
    name: "Finasteryd",
    activeIngredient: "finasteride",
    category: "Leki na prostatę",
    commonDosages: ["1mg", "5mg"],
    searchTerms: ["finasteryd", "finasteride", "proscar", "propecia", "penester", "finpros"]
  },
  {
    id: "doxazosin",
    name: "Doksazosyna",
    activeIngredient: "doxazosin",
    category: "Leki na prostatę",
    commonDosages: ["1mg", "2mg", "4mg", "8mg"],
    searchTerms: ["doksazosyna", "doxazosin", "cardura", "doxar", "alfadil", "doxura"]
  },

  // Leki na skórę
  {
    id: "hydrocortisone",
    name: "Hydrokortyzon",
    activeIngredient: "hydrocortisone",
    category: "Steroidy miejscowe",
    commonDosages: ["0.5%", "1%"],
    searchTerms: ["hydrokortyzon", "hydrocortisone", "locoid", "cortef", "hydrocortison", "cortisol"]
  },
  {
    id: "betamethasone",
    name: "Betametazon",
    activeIngredient: "betamethasone",
    category: "Steroidy miejscowe",
    commonDosages: ["0.05%", "0.1%"],
    searchTerms: ["betametazon", "betamethasone", "diprosone", "betnovate", "celestamine", "belogent"]
  },

  // Leki okulistyczne
  {
    id: "timolol-eye",
    name: "Timolol krople do oczu",
    activeIngredient: "timolol",
    category: "Leki okulistyczne",
    commonDosages: ["0.25%", "0.5%"],
    searchTerms: ["timolol", "krople do oczu", "timpilo", "nyolol", "timoptol", "cusimolol"]
  },
  {
    id: "artificial-tears",
    name: "Sztuczne łzy",
    activeIngredient: "hypromellose",
    category: "Leki okulistyczne",
    commonDosages: ["0.3%", "0.5%"],
    searchTerms: ["sztuczne łzy", "artificial tears", "lacrisifi", "hycosan", "vidisic", "artelac"]
  },

  // Leki ginekologiczne
  {
    id: "clotrimazole",
    name: "Klotrimazol",
    activeIngredient: "clotrimazole",
    category: "Leki przeciwgrzybicze",
    commonDosages: ["1%", "100mg", "500mg"],
    searchTerms: ["klotrimazol", "clotrimazole", "canesten", "antifungol", "kandyzol", "fungizid"]
  },
  {
    id: "metronidazole",
    name: "Metronidazol",
    activeIngredient: "metronidazole",
    category: "Antybiotyki",
    commonDosages: ["250mg", "500mg"],
    searchTerms: ["metronidazol", "metronidazole", "flagyl", "entizol", "clont", "metrogyl"]
  },

  // Leki na jelita
  {
    id: "loperamide",
    name: "Loperamid",
    activeIngredient: "loperamide",
    category: "Leki przeciwbiegunkowe",
    commonDosages: ["2mg"],
    searchTerms: ["loperamid", "loperamide", "imodium", "stoperan", "lopedium", "diarstop"]
  },
  {
    id: "diosmectite",
    name: "Diosmektyt",
    activeIngredient: "diosmectite",
    category: "Leki przeciwbiegunkowe",
    commonDosages: ["3g"],
    searchTerms: ["diosmektyt", "diosmectite", "smecta", "neo-diastop", "diastop", "ecosmectin"]
  },
  {
    id: "simethicone",
    name: "Symetikon",
    activeIngredient: "simethicone",
    category: "Leki na wzdęcia",
    commonDosages: ["40mg", "80mg"],
    searchTerms: ["symetikon", "simethicone", "espumisan", "bobotic", "sab simplex", "simicol"]
  },

  // Leki na bezsennośc
  {
    id: "zolpidem",
    name: "Zolpidem",
    activeIngredient: "zolpidem",
    category: "Leki nasenne",
    commonDosages: ["5mg", "10mg"],
    searchTerms: ["zolpidem", "stilnox", "hypnogen", "sanval", "ambien", "ivadal"]
  },
  {
    id: "zopiclone",
    name: "Zopiklon",
    activeIngredient: "zopiclone",
    category: "Leki nasenne",
    commonDosages: ["3.75mg", "7.5mg"],
    searchTerms: ["zopiklon", "zopiclone", "imovane", "somnosan", "zimovane", "zopitin"]
  },

  // Dodatkowe leki różne
  {
    id: "allopurinol",
    name: "Allopurynol",
    activeIngredient: "allopurinol",
    category: "Leki na podagrę",
    commonDosages: ["100mg", "300mg"],
    searchTerms: ["allopurynol", "allopurinol", "milurit", "zyloric", "allopur", "purinol"]
  },
  {
    id: "colchicine",
    name: "Kolchicyna",
    activeIngredient: "colchicine",
    category: "Leki na podagrę",
    commonDosages: ["0.5mg", "1mg"],
    searchTerms: ["kolchicyna", "colchicine", "colcrys", "colchimax", "goutnil"]
  }
];

export function searchDrugs(query: string, limit: number = 10): Drug[] {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return pozDrugsDatabase
    .filter(drug => 
      drug.searchTerms.some(term => 
        term.toLowerCase().includes(lowercaseQuery)
      )
    )
    .sort((a, b) => {
      // Prioritize exact matches at the beginning
      const aExactMatch = a.searchTerms.some(term => 
        term.toLowerCase().startsWith(lowercaseQuery)
      );
      const bExactMatch = b.searchTerms.some(term => 
        term.toLowerCase().startsWith(lowercaseQuery)
      );
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function getDrugById(id: string): Drug | undefined {
  return pozDrugsDatabase.find(drug => drug.id === id);
}

export function getDrugsByCategory(category: string): Drug[] {
  return pozDrugsDatabase.filter(drug => drug.category === category);
}

export function getAllCategories(): string[] {
  const categories = Array.from(new Set(pozDrugsDatabase.map(drug => drug.category)));
  return categories.sort();
}
