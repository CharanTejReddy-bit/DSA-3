/**
 * Multi-Domain Dictionaries & Vocabulary Datasets
 * Preset vocabularies for testing fuzzy search, typos, and multilingual Unicode compatibility
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */

export interface DictionaryPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  sampleQueries: { query: string; expected: string; typoType: string }[];
  words: string[];
}

export const COMMON_ENGLISH_WORDS: string[] = [
  "algorithm", "alignment", "allocate", "alphabet", "amplitude", "analysis", "analytics", "ancestor",
  "angular", "animation", "anticipate", "aperture", "apparatus", "application", "approach", "approximate",
  "architecture", "argument", "arithmetic", "arrangement", "artificial", "assembly", "assignment", "asynchronous",
  "attribute", "authentication", "authority", "automate", "autonomy", "availability", "background", "bandwidth",
  "benchmark", "binary", "binomial", "bipartite", "blueprint", "boolean", "bottleneck", "boundary",
  "broadcast", "browser", "buffer", "burkhard", "bytecode", "cache", "calculate", "calendar",
  "candidate", "capacity", "cardinality", "cascade", "catalog", "category", "certificate", "character",
  "chromosome", "circular", "classifier", "client", "closure", "cluster", "cohesion", "collaboration",
  "collection", "collision", "combination", "command", "commit", "communication", "compact", "comparison",
  "compiler", "complexity", "component", "composite", "compression", "computation", "concatenate", "concurrency",
  "condition", "configuration", "connection", "consistency", "constant", "constraint", "constructor", "container",
  "context", "continuous", "controller", "convergence", "conversion", "coordinate", "correlation", "cryptography",
  "cumulative", "cylinder", "database", "deadlock", "debugger", "decimal", "declaration", "decomposition",
  "decorator", "decryption", "default", "definition", "delegation", "delivery", "dependency", "deployment",
  "derivative", "descriptor", "destination", "destruction", "detector", "deterministic", "development", "diagnostic",
  "diagonal", "diagram", "dictionary", "difference", "differential", "diffusion", "dimension", "direction",
  "directory", "discrete", "discriminant", "dispatcher", "distribution", "document", "domain", "download",
  "dynamic", "efficiency", "eigenvalue", "element", "elevator", "elimination", "embedding", "emission",
  "encryption", "endpoint", "engineering", "enhancement", "enterprise", "entropy", "enumeration", "environment",
  "equilibrium", "equivalence", "escalation", "estimation", "evaluation", "evolution", "exception", "execution",
  "exhaustive", "expansion", "expectation", "experiment", "exponent", "expression", "extraction", "extrapolation",
  "factorial", "factorization", "feedback", "fibonacci", "filesystem", "filtering", "firewall", "flexibility",
  "floating", "flowchart", "fluctuation", "forecasting", "foreign", "formatting", "formulation", "foundation",
  "framework", "frequency", "friction", "function", "fundamental", "garbage", "gateway", "generator",
  "geometric", "gradient", "graphical", "gravitational", "guarantee", "guideline", "hardware", "harmonic",
  "hashmap", "heuristic", "hierarchy", "histogram", "homogeneous", "horizontal", "hyperlink", "hyperplane",
  "hypothesis", "identifier", "immutable", "impedance", "imperative", "implementation", "implication", "indexing",
  "individual", "induction", "inference", "infinite", "infrastructure", "inheritance", "initialization", "injection",
  "innovative", "instruction", "integer", "integration", "integrity", "intelligence", "interaction", "interface",
  "interference", "intermediate", "interpolation", "interpreter", "intersection", "interval", "intrinsic", "inventory",
  "iteration", "javascript", "junction", "kernel", "keyboard", "kinetics", "knowledge", "language",
  "latency", "latitude", "layout", "learning", "levenshtein", "lexical", "library", "lifecycle",
  "linear", "linguistic", "linkage", "literal", "loadbalancer", "location", "logarithm", "logical",
  "longitude", "maintenance", "management", "manipulation", "mathematics", "matrix", "maximum", "measurement",
  "mechanism", "mediator", "memory", "metadata", "metric", "microservice", "middleware", "migration",
  "minimize", "minimum", "mnemonic", "modality", "modeling", "modification", "modular", "modulation",
  "molecular", "momentum", "monitoring", "monotonic", "morphology", "multimedia", "multiplication", "multithreading",
  "mutation", "namespace", "navigation", "neighbor", "network", "neutral", "nominal", "normalization",
  "notation", "notification", "nullpointer", "numerical", "objective", "observable", "observation", "occurrence",
  "operation", "operator", "opportunity", "optical", "optimal", "optimization", "orchestration", "organization",
  "orientation", "oscillation", "output", "overflow", "overhead", "overlay", "override", "package",
  "packet", "paradigm", "parallel", "parameter", "parser", "partition", "password", "pathway",
  "pattern", "payload", "penalty", "percentage", "performance", "perimeter", "periodic", "permission",
  "permutation", "persistence", "perspective", "phenomenon", "philosophy", "pipeline", "platform", "plausibility",
  "pointer", "polarization", "polygon", "polymorphism", "population", "portal", "possession", "potential",
  "precision", "predecessor", "prediction", "preference", "prefix", "premise", "prerequisite", "preprocessing",
  "primitive", "priority", "probability", "procedure", "processing", "processor", "production", "program",
  "programming", "projection", "propagation", "property", "proportional", "protocol", "prototype", "provisioning",
  "pseudo", "publisher", "pyramid", "quadratic", "qualitative", "quantitative", "quantum", "quarantine",
  "query", "queue", "quicksort", "quotient", "radiation", "radius", "randomness", "range",
  "raster", "rational", "reaction", "readability", "realtime", "reasoning", "receiver", "receptive",
  "recognition", "reconstruction", "record", "recovery", "rectangle", "recursion", "recursive", "reduction",
  "redundancy", "refactoring", "reference", "refinement", "reflection", "regression", "regular", "regulation",
  "reinforcement", "relation", "relative", "relaxation", "relevance", "reliability", "remainder", "rendering",
  "replication", "repository", "representation", "reproduction", "requirement", "reservation", "reservoir", "residual",
  "resilience", "resolution", "resonance", "resource", "response", "restriction", "restructuring", "retrieval",
  "reversal", "revolution", "robustness", "rotation", "routing", "runtime", "sampling", "satellite",
  "scalability", "scalar", "scanner", "scenario", "scheduler", "schema", "scientific", "scripting",
  "seamless", "search", "security", "segmentation", "selection", "semantics", "semiconductor", "sentence",
  "sequence", "sequential", "serialization", "server", "service", "session", "shadow", "shortcut",
  "signature", "similarity", "simplification", "simulation", "simultaneous", "singular", "situation", "skeleton",
  "software", "solution", "sort", "sorting", "spectrum", "specification", "spherical", "stability",
  "standardization", "statement", "statistical", "statistics", "storage", "strategy", "stream", "structure",
  "subroutine", "subscriber", "subset", "substitution", "subsystem", "subtraction", "successor", "sufficiency",
  "summarization", "superclass", "supervision", "suppression", "symmetry", "synchronous", "syntax", "synthesis",
  "system", "systematic", "table", "tabular", "taxonomy", "technique", "technology", "template",
  "tensor", "terminal", "terminology", "theorem", "theoretical", "thermal", "threshold", "throughput",
  "timestamp", "token", "tolerance", "topology", "trajectory", "transaction", "transformation", "transition",
  "translation", "transmission", "transposition", "traversal", "tree", "triangle", "trigger", "truncate",
  "tuple", "typography", "uncertainty", "underline", "uniformity", "universe", "unsupervised", "upgrade",
  "upload", "utility", "validation", "valuation", "variable", "variance", "variation", "vector",
  "velocity", "verification", "version", "vertex", "vertical", "vibration", "viewport", "virtualization",
  "visualization", "vocabulary", "voltage", "volume", "vulnerability", "wavelength", "webpage", "websocket",
  "weight", "window", "wireless", "workflow", "workstation", "wrapper", "workspace", "yield"
];

export const TECH_CS_TERMS: string[] = [
  "abstraction", "accessor", "adjacency", "algorithm", "allocator", "amortized", "ancestor", "asymptotic",
  "autoboxing", "backtracking", "bandwidth", "benchmark", "biconnected", "binarysearch", "bipartite", "bitmask",
  "blockchain", "bloomfilter", "bktree", "bottleneck", "breadthfirst", "bubblesort", "bytecode", "cachemiss",
  "checkpoint", "checksum", "circularlist", "cleancode", "closure", "clustering", "collision", "commitlog",
  "compiler", "complexity", "concatenation", "concurrency", "constructor", "containerization", "coroutine", "crosssite",
  "cryptography", "dag", "deadlock", "debugging", "decompilation", "decorator", "decrement", "depthfirst",
  "dequeue", "deserialization", "deterministic", "difference", "dijkstra", "dimension", "disjointset", "divideconquer",
  "dynamicprogramming", "edgecase", "efficiency", "encapsulation", "encryption", "endianness", "entropy", "enumeration",
  "epoll", "eventdriven", "exception", "execution", "exponential", "expression", "factorization", "fibonacciheap",
  "filesystem", "firewall", "floatingpoint", "forkjoin", "framework", "functional", "garbagecollector", "generator",
  "generics", "gitcommit", "globalvariable", "gradientdescent", "graphtheory", "greedyalgorithm", "hashcollision", "hashmap",
  "hashtable", "heapify", "heapsort", "heuristics", "hyperparameter", "immutable", "indirection", "inheritance",
  "insertion", "insertionsort", "interface", "interprocess", "interpreter", "iteration", "iterator", "javavm",
  "jsonparser", "jwttoken", "kernelspace", "keyvalue", "kruskal", "latency", "leastrecentlyused", "levenshtein",
  "lexicalscope", "lineartime", "linkedlist", "loadbalancer", "lockfree", "logarithmic", "mapreduce", "matrixmultiplication",
  "maximumflow", "memcached", "memoization", "mergesort", "metaprogramming", "microkernel", "microservices", "minimax",
  "monotonic", "mutexlock", "namespace", "neuralnetwork", "nondeterministic", "normalization", "nullpointer", "objectoriented",
  "observable", "octree", "operating", "operator", "optimistic", "optimization", "outofrange", "overflow",
  "overloading", "overriding", "pagination", "parallelism", "parsercombinator", "passbyreference", "pathfinding", "payload",
  "performance", "pipelining", "pointerarithmetic", "polymorphism", "postorder", "predecessor", "prefixsum", "preorder",
  "primality", "primsalgorithm", "priorityqueue", "processscheduler", "profiling", "pseudocode", "quantumcomputing", "quicksort",
  "radixsort", "randomized", "rasterization", "raytracing", "reactiveprogramming", "recursion", "redblacktree", "refactoring",
  "referentialintegrity", "regexengine", "relationaldb", "renderingengine", "repl", "resilience", "restfulapi", "ringbuffer",
  "roundrobin", "runtimeerror", "sanitization", "scalability", "segmenttree", "semaphore", "sentinelnode", "serialization",
  "shadowdom", "shortestpath", "simplexmethod", "singleton", "socketconnection", "sortingalgorithm", "spacetimecomplexity", "sparsematrix",
  "spinlocking", "splaytree", "stackframe", "stackoverflow", "statepattern", "staticanalysis", "streamingapi", "stringmatching",
  "subgraph", "substitution", "subroutine", "suffixarray", "suffixtree", "tailrecursion", "tarjan", "threadpool",
  "timestamping", "topologicalsort", "transposition", "travellingsalesman", "treeheight", "triepruning", "turingcomplete", "twopointers",
  "typeinference", "undirectedgraph", "unification", "unittesting", "userspace", "utf8encoding", "validation", "variadicfunction",
  "vectorization", "virtualmemory", "visitorpattern", "vulnerability", "websocket", "weightedgraph", "windowsliding", "zerocopy"
];

export const MEDICAL_TERMS: string[] = [
  "acetaminophen", "amoxicillin", "ampicillin", "anaphylaxis", "anesthesia", "aneurysm", "angioplasty", "antibiotic",
  "antidepressant", "antihistamine", "antiinflammatory", "antiseptic", "appendectomy", "arrhythmia", "arteriosclerosis", "asthma",
  "atherosclerosis", "biopsy", "bradycardia", "bronchiectasis", "bronchitis", "carcinogen", "cardiomyopathy", "cardiopulmonary",
  "cardiovascular", "catheterization", "cephalosporin", "chemotherapy", "cholecystectomy", "cholesterol", "cirrhosis", "colonoscopy",
  "corticosteroid", "creatinine", "defibrillator", "dermatitis", "dexamethasone", "diabetes", "diabeticneuropathy", "dialysis",
  "diphenhydramine", "diverticulitis", "dysmenorrhea", "dyspepsia", "dyspnea", "echocardiogram", "electrocardiogram", "encephalitis",
  "endocrinology", "endometriosis", "endoscopy", "eosinophil", "epidemiology", "erythrocyte", "esophagitis", "fibromyalgia",
  "gastroenteritis", "gastrointestinal", "glaucoma", "glomerulonephritis", "hemoglobin", "hemophilia", "hemorrhage", "hepatitis",
  "homeostasis", "hypercholesterolemia", "hyperglycemia", "hypertension", "hyperthyroidism", "hypoglycemia", "hypotension", "hypothyroidism",
  "hysterectomy", "ibuprofen", "immunodeficiency", "immunoglobulin", "immunosuppression", "inflammation", "intravenous", "ischemia",
  "laryngitis", "leukemia", "leukocyte", "lymphadenopathy", "lymphoma", "macular", "melanoma", "meningitis",
  "metabolism", "metastasis", "microbiology", "myasthenia", "myocardial", "myocarditis", "nephrology", "neuropathy",
  "neurotransmitter", "neutropenia", "nitroglycerin", "ophthalmology", "optometry", "osteoarthritis", "osteoporosis", "pancreatitis",
  "pathology", "pediatrics", "penicillin", "pericarditis", "pharyngitis", "platelet", "pneumonia", "pneumothorax",
  "prednisone", "prosthesis", "pulmonary", "radiology", "respiratory", "rheumatoid", "sarcoma", "sedative",
  "sinusitis", "stethoscope", "sulfonamide", "tachycardia", "thrombocytopenia", "thrombosis", "tonsillitis", "tracheostomy",
  "tuberculosis", "ultrasound", "vasculitis", "vasoconstriction", "vasodilation", "venipuncture", "ventricular"
];

export const MULTILINGUAL_TERMS: string[] = [
  // English
  "algorithm", "computer", "programming", "database", "structure", "university", "technology", "library", "search", "network",
  // Hindi (Devanagari)
  "नमस्ते", "कंप्यूटर", "प्रोग्रामिंग", "अल्गोरिदम", "डेटा", "संरचना", "विश्वविद्यालय", "प्रौद्योगिकी", "पुस्तकालय", "खोज",
  "नेटवर्क", "सॉफ्टवेयर", "स्मृति", "संचालन", "भाषा", "ज्ञान", "सूचना", "प्रणाली", "सुरक्षा", "संसाधन",
  // Telugu
  "నమస్కారం", "కంప్యూటర్", "ప్రోగ్రామింగ్", "అల్గోరిథం", "డేటా", "నిర్మాణం", "విశ్వవిద్యాలయం", "సాంకేతికత", "గ్రంథాలయం", "శోధన",
  "నెట్‌వర్క్", "సాఫ్ట్‌వేర్", "మెమరీ", "ఆపరేషన్", "భాష", "జ్ఞానం", "సమాచారం", "వ్యవస్థ", "భద్రత", "వనరులు",
  // Spanish
  "algoritmo", "computadora", "programacion", "estructura", "universidad", "tecnologia", "biblioteca", "busqueda", "red", "memoria",
  "desarrollo", "seguridad", "informacion", "sistema", "ingenieria", "operacion", "aplicacion", "interfaz", "conexion", "servidor",
  // French
  "algorithme", "ordinateur", "programmation", "structure", "universite", "technologie", "bibliotheque", "recherche", "reseau", "memoire",
  // German
  "algorithmus", "computer", "programmierung", "datenbank", "struktur", "universitat", "technologie", "bibliothek", "netzwerk", "speicher"
];

export const PRESET_DICTIONARIES: DictionaryPreset[] = [
  {
    id: "tech-cs",
    name: "CS & Tech Algorithms",
    category: "Computer Science",
    description: "Data Structures, Algorithms, Systems Architecture, and Design Patterns vocabulary.",
    sampleQueries: [
      { query: "algrithm", expected: "algorithm", typoType: "Omission / Deletion ('o')" },
      { query: "burtree", expected: "bktree", typoType: "Substitution ('u'->'k')" },
      { query: "dinamik", expected: "dynamicprogramming", typoType: "Phonetic typo" },
      { query: "dijikstra", expected: "dijkstra", typoType: "Insertion ('i')" },
      { query: "qucksort", expected: "quicksort", typoType: "Omission ('i')" },
      { query: "polymorphsm", expected: "polymorphism", typoType: "Omission ('i')" },
    ],
    words: TECH_CS_TERMS,
  },
  {
    id: "common-english",
    name: "Common English Corpus",
    category: "General",
    description: "Curated dataset of 450+ everyday English vocabulary words covering multiple domains.",
    sampleQueries: [
      { query: "analisys", expected: "analysis", typoType: "Substitution ('i' for 'y')" },
      { query: "reccursion", expected: "recursion", typoType: "Duplicate insertion ('c')" },
      { query: "paralel", expected: "parallel", typoType: "Missing character ('l')" },
      { query: "defanition", expected: "definition", typoType: "Vowel typo ('a'->'i')" },
      { query: "neccesary", expected: "necessary", typoType: "Double consonant typo" },
    ],
    words: COMMON_ENGLISH_WORDS,
  },
  {
    id: "medical",
    name: "Medical & Pharmacopeia",
    category: "Biomedical",
    description: "Complex pharmaceutical names, anatomical structures, and diagnostic conditions.",
    sampleQueries: [
      { query: "acetaminofen", expected: "acetaminophen", typoType: "Phonetic ('f' for 'ph')" },
      { query: "arhythmia", expected: "arrhythmia", typoType: "Omission ('r')" },
      { query: "pnumonia", expected: "pneumonia", typoType: "Missing prefix 'e'" },
      { query: "diabtes", expected: "diabetes", typoType: "Omission ('e')" },
      { query: "ibuprofin", expected: "ibuprofen", typoType: "Vowel typo ('i' for 'e')" },
    ],
    words: MEDICAL_TERMS,
  },
  {
    id: "multilingual",
    name: "Multilingual Unicode Set",
    category: "International",
    description: "Multilingual strings in UTF-8: English, Hindi (Devanagari), Telugu, Spanish, German & French.",
    sampleQueries: [
      { query: "नमस्त", expected: "नमस्ते", typoType: "Hindi matra missing ('े')" },
      { query: "కంపుటర్", expected: "కంప్యూటర్", typoType: "Telugu vowel gunintham error" },
      { query: "algoritm", expected: "algoritmo", typoType: "Spanish truncated suffix" },
      { query: "progrmacion", expected: "programacion", typoType: "Spanish vowel omission" },
    ],
    words: MULTILINGUAL_TERMS,
  },
];

/**
 * Generates an expanded synthetic dictionary of size N for large-scale Big-O benchmarks
 */
export function generateSyntheticDictionary(baseWords: string[], targetSize: number): string[] {
  const result = new Set<string>(baseWords);
  const prefixes = ["sub", "pre", "post", "hyper", "multi", "auto", "micro", "macro", "semi", "inter", "ultra", "anti"];
  const suffixes = ["able", "ible", "ment", "ness", "tion", "sion", "ize", "ise", "logy", "graphy", "ism", "ist"];

  let cycle = 0;
  while (result.size < targetSize) {
    const base = baseWords[cycle % baseWords.length];
    const prefix = prefixes[(cycle * 3) % prefixes.length];
    const suffix = suffixes[(cycle * 7) % suffixes.length];

    if (cycle % 3 === 0) {
      result.add(`${prefix}${base}`);
    } else if (cycle % 3 === 1) {
      result.add(`${base}${suffix}`);
    } else {
      result.add(`${prefix}${base}${suffix}`);
    }
    cycle++;

    if (cycle > targetSize * 3) break;
  }

  return Array.from(result);
}
