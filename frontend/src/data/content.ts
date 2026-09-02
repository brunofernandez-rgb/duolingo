import type { UiLang } from "@/lib/i18n";

export type TargetLang = "es" | "en" | "fr" | "de" | "it" | "pt";
export type Nivel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface Idioma {
  id: string;
  nombre: Record<UiLang, string>;
  codigo: TargetLang;
  bandera: string;
}

export const IDIOMAS: Idioma[] = [
  {
    id: "idi_es",
    codigo: "es",
    bandera: "https://flagcdn.com/w80/ar.png",
    nombre: { es: "Español", en: "Spanish", pt: "Espanhol" },
  },
  {
    id: "idi_en",
    codigo: "en",
    bandera: "https://flagcdn.com/w80/us.png",
    nombre: { es: "Inglés", en: "English", pt: "Inglês" },
  },
  {
    id: "idi_fr",
    codigo: "fr",
    bandera: "https://flagcdn.com/w80/fr.png",
    nombre: { es: "Francés", en: "French", pt: "Francês" },
  },
  {
    id: "idi_de",
    codigo: "de",
    bandera: "https://flagcdn.com/w80/de.png",
    nombre: { es: "Alemán", en: "German", pt: "Alemão" },
  },
  {
    id: "idi_it",
    codigo: "it",
    bandera: "https://flagcdn.com/w80/it.png",
    nombre: { es: "Italiano", en: "Italian", pt: "Italiano" },
  },
  {
    id: "idi_pt",
    codigo: "pt",
    bandera: "https://flagcdn.com/w80/br.png",
    nombre: { es: "Portugués", en: "Portuguese", pt: "Português" },
  },
];

/** [significado_es, significado_en, significado_pt, en, fr, de, it, pt] */
type Row = [string, string, string, string, string, string, string, string];

export interface Palabra {
  emoji: string;
  significado: Record<UiLang, string>;
  traduccion: Record<TargetLang, string>;
}

interface TemaDef {
  id: string;
  emoji: string;
  titulo: Record<UiLang, string>;
  nivel: Nivel;
  filas: [string, Row][];
}

const TEMAS: TemaDef[] = [
  {
    id: "presentarse",
    emoji: "👋",
    nivel: "A1",
    titulo: { es: "Presentarse", en: "Introduce yourself", pt: "Apresentar-se" },
    filas: [
      ["👋", ["hola", "hello", "olá", "hello", "bonjour", "hallo", "ciao", "olá"]],
      [
        "😊",
        [
          "mucho gusto",
          "nice to meet you",
          "prazer",
          "nice to meet you",
          "enchanté",
          "freut mich",
          "piacere",
          "prazer",
        ],
      ],
      [
        "🙋",
        [
          "me llamo",
          "my name is",
          "meu nome é",
          "my name is",
          "je m'appelle",
          "ich heiße",
          "mi chiamo",
          "meu nome é",
        ],
      ],
      [
        "❓",
        [
          "¿cómo estás?",
          "how are you?",
          "como vai?",
          "how are you?",
          "comment ça va ?",
          "wie geht's?",
          "come stai?",
          "como vai?",
        ],
      ],
      [
        "🙏",
        ["gracias", "thank you", "obrigado", "thank you", "merci", "danke", "grazie", "obrigado"],
      ],
      [
        "👋",
        ["adiós", "goodbye", "tchau", "goodbye", "au revoir", "tschüss", "arrivederci", "tchau"],
      ],
    ],
  },
  {
    id: "numeros",
    emoji: "🔢",
    nivel: "A1",
    titulo: { es: "Los números", en: "Numbers", pt: "Os números" },
    filas: [
      ["1️⃣", ["uno", "one", "um", "one", "un", "eins", "uno", "um"]],
      ["2️⃣", ["dos", "two", "dois", "two", "deux", "zwei", "due", "dois"]],
      ["3️⃣", ["tres", "three", "três", "three", "trois", "drei", "tre", "três"]],
      ["4️⃣", ["cuatro", "four", "quatro", "four", "quatre", "vier", "quattro", "quatro"]],
      ["5️⃣", ["cinco", "five", "cinco", "five", "cinq", "fünf", "cinque", "cinco"]],
      ["🔟", ["diez", "ten", "dez", "ten", "dix", "zehn", "dieci", "dez"]],
    ],
  },
  {
    id: "familia",
    emoji: "👨‍👩‍👧",
    nivel: "A1",
    titulo: { es: "La familia", en: "Family", pt: "A família" },
    filas: [
      ["👩", ["madre", "mother", "mãe", "mother", "mère", "Mutter", "madre", "mãe"]],
      ["👨", ["padre", "father", "pai", "father", "père", "Vater", "padre", "pai"]],
      ["👧", ["hermana", "sister", "irmã", "sister", "sœur", "Schwester", "sorella", "irmã"]],
      ["👦", ["hermano", "brother", "irmão", "brother", "frère", "Bruder", "fratello", "irmão"]],
      ["👵", ["abuela", "grandmother", "avó", "grandmother", "grand-mère", "Oma", "nonna", "avó"]],
      ["👶", ["bebé", "baby", "bebê", "baby", "bébé", "Baby", "bambino", "bebê"]],
    ],
  },
  {
    id: "comida",
    emoji: "🍎",
    nivel: "A1",
    titulo: { es: "Comida y bebida", en: "Food and drink", pt: "Comida e bebida" },
    filas: [
      ["🍎", ["manzana", "apple", "maçã", "apple", "pomme", "Apfel", "mela", "maçã"]],
      ["🍞", ["pan", "bread", "pão", "bread", "pain", "Brot", "pane", "pão"]],
      ["💧", ["agua", "water", "água", "water", "eau", "Wasser", "acqua", "água"]],
      ["🥛", ["leche", "milk", "leite", "milk", "lait", "Milch", "latte", "leite"]],
      ["🧀", ["queso", "cheese", "queijo", "cheese", "fromage", "Käse", "formaggio", "queijo"]],
      ["☕", ["café", "coffee", "café", "coffee", "café", "Kaffee", "caffè", "café"]],
    ],
  },
  {
    id: "colores",
    emoji: "🎨",
    nivel: "A1",
    titulo: { es: "Los colores", en: "Colors", pt: "As cores" },
    filas: [
      ["🔴", ["rojo", "red", "vermelho", "red", "rouge", "rot", "rosso", "vermelho"]],
      ["🔵", ["azul", "blue", "azul", "blue", "bleu", "blau", "blu", "azul"]],
      ["🟢", ["verde", "green", "verde", "green", "vert", "grün", "verde", "verde"]],
      ["🟡", ["amarillo", "yellow", "amarelo", "yellow", "jaune", "gelb", "giallo", "amarelo"]],
      ["⚫", ["negro", "black", "preto", "black", "noir", "schwarz", "nero", "preto"]],
      ["⚪", ["blanco", "white", "branco", "white", "blanc", "weiß", "bianco", "branco"]],
    ],
  },
  {
    id: "animales",
    emoji: "🐧",
    nivel: "A1",
    titulo: { es: "Los animales", en: "Animals", pt: "Os animais" },
    filas: [
      ["🐧", ["pingüino", "penguin", "pinguim", "penguin", "manchot", "Pinguin", "pinguino", "pinguim"]],
      ["🐶", ["perro", "dog", "cachorro", "dog", "chien", "Hund", "cane", "cachorro"]],
      ["🐱", ["gato", "cat", "gato", "cat", "chat", "Katze", "gatto", "gato"]],
      ["🐦", ["pájaro", "bird", "pássaro", "bird", "oiseau", "Vogel", "uccello", "pássaro"]],
      ["🐟", ["pez", "fish", "peixe", "fish", "poisson", "Fisch", "pesce", "peixe"]],
      ["🐴", ["caballo", "horse", "cavalo", "horse", "cheval", "Pferd", "cavallo", "cavalo"]],
    ],
  },
  {
    id: "ciudad",
    emoji: "🏙️",
    nivel: "A2",
    titulo: { es: "En la ciudad", en: "In the city", pt: "Na cidade" },
    filas: [
      ["🏙️", ["ciudad", "city", "cidade", "city", "ville", "Stadt", "città", "cidade"]],
      ["🛣️", ["calle", "street", "rua", "street", "rue", "Straße", "strada", "rua"]],
      ["🏛️", ["museo", "museum", "museu", "museum", "musée", "Museum", "museo", "museu"]],
      ["🏪", ["tienda", "shop", "loja", "shop", "magasin", "Geschäft", "negozio", "loja"]],
      ["🚉", ["estación", "station", "estação", "station", "gare", "Bahnhof", "stazione", "estação"]],
      ["🌳", ["parque", "park", "parque", "park", "parc", "Park", "parco", "parque"]],
    ],
  },
  {
    id: "viajes",
    emoji: "✈️",
    nivel: "A2",
    titulo: { es: "Viajes", en: "Travel", pt: "Viagens" },
    filas: [
      ["✈️", ["avión", "plane", "avião", "plane", "avion", "Flugzeug", "aereo", "avião"]],
      ["🎟️", ["billete", "ticket", "bilhete", "ticket", "billet", "Ticket", "biglietto", "bilhete"]],
      ["🧳", ["maleta", "suitcase", "mala", "suitcase", "valise", "Koffer", "valigia", "mala"]],
      ["🏨", ["hotel", "hotel", "hotel", "hotel", "hôtel", "Hotel", "albergo", "hotel"]],
      ["🗺️", ["mapa", "map", "mapa", "map", "carte", "Karte", "mappa", "mapa"]],
      ["🏖️", ["playa", "beach", "praia", "beach", "plage", "Strand", "spiaggia", "praia"]],
    ],
  },
  {
    id: "rutina",
    emoji: "⏰",
    nivel: "A2",
    titulo: { es: "Rutina diaria", en: "Daily routine", pt: "Rotina diária" },
    filas: [
      [
        "⏰",
        [
          "despertarse",
          "to wake up",
          "acordar",
          "to wake up",
          "se réveiller",
          "aufwachen",
          "svegliarsi",
          "acordar",
        ],
      ],
      ["🍳", ["desayuno", "breakfast", "café da manhã", "breakfast", "petit-déjeuner", "Frühstück", "colazione", "café da manhã"]],
      ["🚿", ["ducharse", "to shower", "tomar banho", "to shower", "se doucher", "duschen", "farsi la doccia", "tomar banho"]],
      ["📚", ["estudiar", "to study", "estudar", "to study", "étudier", "lernen", "studiare", "estudar"]],
      ["🍽️", ["cenar", "to have dinner", "jantar", "to have dinner", "dîner", "zu Abend essen", "cenare", "jantar"]],
      ["🛏️", ["dormir", "to sleep", "dormir", "to sleep", "dormir", "schlafen", "dormire", "dormir"]],
    ],
  },
  {
    id: "trabajo",
    emoji: "💼",
    nivel: "A2",
    titulo: { es: "El trabajo", en: "Work", pt: "O trabalho" },
    filas: [
      ["💼", ["trabajo", "work", "trabalho", "work", "travail", "Arbeit", "lavoro", "trabalho"]],
      ["🏢", ["oficina", "office", "escritório", "office", "bureau", "Büro", "ufficio", "escritório"]],
      ["👩‍💼", ["jefe", "boss", "chefe", "boss", "patron", "Chef", "capo", "chefe"]],
      ["🤝", ["reunión", "meeting", "reunião", "meeting", "réunion", "Besprechung", "riunione", "reunião"]],
      ["💰", ["sueldo", "salary", "salário", "salary", "salaire", "Gehalt", "stipendio", "salário"]],
      ["📄", ["contrato", "contract", "contrato", "contract", "contrat", "Vertrag", "contratto", "contrato"]],
    ],
  },
];

export interface LessonContent {
  temaId: string;
  emoji: string;
  titulo: Record<UiLang, string>;
  palabras: Palabra[];
}

function rowToPalabra(emoji: string, r: Row): Palabra {
  return {
    emoji,
    significado: { es: r[0], en: r[1], pt: r[2] },
    traduccion: { es: r[0], en: r[3], fr: r[4], de: r[5], it: r[6], pt: r[7] },
  };
}

export const TEMAS_POR_ID: Record<string, LessonContent> = Object.fromEntries(
  TEMAS.map((t) => [
    t.id,
    {
      temaId: t.id,
      emoji: t.emoji,
      titulo: t.titulo,
      palabras: t.filas.map(([e, r]) => rowToPalabra(e, r)),
    },
  ]),
);

export const TEMAS_POR_NIVEL: Record<string, TemaDef[]> = {
  A1: TEMAS.filter((t) => t.nivel === "A1"),
  A2: TEMAS.filter((t) => t.nivel === "A2"),
};

export const NIVELES: Nivel[] = ["A1", "A2", "B1", "B2", "C1"];
