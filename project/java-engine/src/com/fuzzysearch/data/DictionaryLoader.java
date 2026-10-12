package com.fuzzysearch.data;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Multi-domain vocabulary provider and dictionary loader
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class DictionaryLoader {

    public static final List<String> TECH_CS_WORDS = Arrays.asList(
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
    );

    public static final List<String> COMMON_ENGLISH = Arrays.asList(
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
        "molecular", "momentum", "monitoring", "monotonic", "morphology", "multimedia", "multiplication", "multithreading"
    );

    public static final List<String> MEDICAL_WORDS = Arrays.asList(
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
    );

    public static final List<String> MULTILINGUAL_WORDS = Arrays.asList(
        // English
        "algorithm", "computer", "programming", "database", "structure", "university", "technology", "library", "search", "network",
        // Hindi (Devanagari)
        "नमस्ते", "कंप्यूटर", "प्रोग्रामिंग", "अल्गोरिदम", "डेटा", "संरचना", "विश्वविद्यालय", "प्रौद्योगिकी", "पुस्तकालय", "खोज",
        "नेटवर्क", "सॉफ्टवेयर", "स्मृति", "संचालन", "भाषा", "ज्ञान", "सूचना", "प्रणाली", "सुरक्षा", "संसाधन",
        // Telugu
        "నమస్కారం", "కంప్యూటర్", "ప్రోగ్రామింగ్", "అల్గోరిథం", "డేటా", "నిర్మాణం", "విశ్వవిద్యాలయం", "సాంకేతికత", "గ్రంథాలయం", "శోధన",
        "నెట్‌వర్క్", "సాఫ్ట్‌వేర్", "మెమరీ", "ఆపరేషన్", "భాష", "జ్ఞానం", "సమాచారం", "వ్యవస్థ", "భద్రత", "వనరులు",
        // Spanish
        "algoritmo", "computadora", "programacion", "estructura", "universidad", "tecnologia", "biblioteca", "busqueda", "red", "memoria"
    );

    public static List<String> loadFromFile(File file) throws IOException {
        List<String> list = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty()) {
                    list.add(line);
                }
            }
        }
        return list;
    }

    public static List<String> generateSynthetic(List<String> base, int targetSize) {
        Set<String> set = new LinkedHashSet<>(base);
        String[] prefixes = {"sub", "pre", "post", "hyper", "multi", "auto", "micro", "macro", "semi", "inter"};
        String[] suffixes = {"able", "ment", "ness", "tion", "ize", "logy", "ism", "ist"};

        int cycle = 0;
        while (set.size() < targetSize) {
            String b = base.get(cycle % base.size());
            String p = prefixes[(cycle * 3) % prefixes.length];
            String s = suffixes[(cycle * 7) % suffixes.length];

            if (cycle % 3 == 0) set.add(p + b);
            else if (cycle % 3 == 1) set.add(b + s);
            else set.add(p + b + s);

            cycle++;
            if (cycle > targetSize * 4) break;
        }

        return new ArrayList<>(set);
    }
}
