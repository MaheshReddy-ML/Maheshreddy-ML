export type Step = { name: string; note: string };
export type Study = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  color: string;
  year: string;
  question: string;
  approach: string;
  tech: string[];
  steps: Step[];
  evidence: { value: string; label: string }[];
  observations: string[];
  limits: string;
  repoPattern: string;
  paper?: string;
};
const step = (name: string, note: string): Step => ({ name, note });
export const studies: Study[] = [
  {
    slug: 'emora',
    name: 'Emora',
    subtitle: 'Local-first, emotion-aware AI companion',
    category: 'AI Systems',
    color: 'blue',
    year: '2026',
    question:
      'How can a companion retain useful context while giving people control over what it remembers?',
    approach:
      'A browser-based companion with quantized Qwen3-4B inference on Apple Silicon. Selective persistent memory, bounded conversational context, and deterministic emotion estimation guide responses; a constrained Companion Brain coordinates the avatar.',
    tech: [
      'Qwen3-4B',
      'MLX',
      'FastAPI',
      'MongoDB',
      'Qwen2-VL',
      'Qwen3-TTS',
      'Kokoro',
      'WebGL',
      'VRM',
    ],
    steps: [
      step(
        'Conversation',
        'Text enters with bounded context. Trusted instructions remain separate from user content.',
      ),
      step(
        'Selective memory',
        'Only selected information persists. Users can edit, export, and delete memory.',
      ),
      step(
        'Qwen3-4B · MLX',
        'Quantized inference runs locally on Apple Silicon. Local-first refers to this inference pipeline, not a claim that every optional service is offline.',
      ),
      step(
        'Emotion & personality',
        'Deterministic emotion estimation and personality profiles shape interaction; this is not a diagnostic assessment.',
      ),
      step(
        'Companion Brain',
        'Constrained avatar behavior keeps actions within defined bounds.',
      ),
      step(
        'Voice & avatar',
        'Qwen3-TTS / Kokoro and a WebGL VRM avatar provide voice and a visual presence. Camera processing is opt-in.',
      ),
    ],
    evidence: [
      { value: '169 / 170', label: 'tests passed; 1 skipped' },
      { value: 'Local-first', label: 'Apple Silicon inference' },
      { value: 'Opt-in', label: 'camera processing' },
    ],
    observations: [
      'Persistent memory is a product decision as much as a model decision. The implementation includes user editing, export, and deletion.',
      'Privacy controls, bounded avatar actions, trusted-context separation, and non-diagnostic boundaries are part of the implementation.',
      'The résumé records automated verification and local Qwen3-4B / TTS benchmarks. Benchmark values are not supplied.',
    ],
    limits:
      'Test counts describe the résumé’s reported evaluation snapshot, not a fresh run or independent validation. No clinical effectiveness claim is made.',
    repoPattern: '^AI-Companion$',
    paper: 'https://doi.org/10.5281/zenodo.22267180',
  },
  {
    slug: 'sentinelai',
    name: 'SentinelAI',
    subtitle: 'Enterprise AI governance for financial AI systems',
    category: 'AI Systems',
    color: 'green',
    year: '2026',
    question:
      'Can natural-language convenience coexist with fully traceable financial decisions?',
    approach:
      'A local MLX model extracts a structured financial request. Six independent rule-driven expert domains evaluate it using versioned JSON rules. An aggregator combines the domain decisions into a governance report.',
    tech: [
      'Python',
      'Pydantic',
      'Local MLX LLM',
      'Rule-Based Expert Systems',
      'Typer',
      'Rich',
    ],
    steps: [
      step(
        'User request',
        'A financial request arrives through the CLI or a natural-language prompt.',
      ),
      step(
        'Local LLM',
        'The on-device MLX model interprets language. It does not own the approve, review, or block decision.',
      ),
      step(
        'Structured request',
        'Pydantic provides the schema boundary between natural-language extraction and rule evaluation.',
      ),
      ...['Policy', 'Fraud', 'Risk', 'Compliance', 'Spend', 'Audit'].map(
        (name) =>
          step(
            name,
            `${name} is an independent expert domain. Decisions come from deterministic, versioned JSON rules with decision-rule traceability.`,
          ),
      ),
      step(
        'Decision aggregator',
        'Combines the independent domain decisions. The model does not override the deterministic result.',
      ),
      step(
        'Governance report',
        'Produces a traceable CLI report; chunked batch analysis supports multiple requests.',
      ),
    ],
    evidence: [
      { value: '6', label: 'independent expert domains' },
      { value: 'JSON rules', label: 'versioned decisions' },
      { value: 'On-device', label: 'language understanding' },
    ],
    observations: [
      'Separate interpretation from authority: the language model extracts; deterministic rules decide.',
      'Versioned rules make each decision traceable to the policy that produced it.',
      'Chunked batch processing extends the same decision path to multiple requests.',
    ],
    limits:
      'This diagram explains the documented architecture. It does not execute financial rules or provide compliance advice.',
    repoPattern: '^SentinelAI$',
  },
  {
    slug: 'minigpt',
    name: 'MiniGPT Emotional Support V2',
    subtitle: 'A GPT-style transformer, from the inside out',
    category: 'NLP',
    color: 'pink',
    year: '2026',
    question:
      'Can a small, locally trainable transformer learn empathetic response patterns?',
    approach:
      'Implemented a GPT-style transformer from scratch in PyTorch, including RMSNorm, SwiGLU, and weight tying. Training used 52,137 pairs from three emotional-support corpora and a custom 16k-vocabulary BPE tokenizer.',
    tech: [
      'Python',
      'PyTorch',
      'Transformer',
      'RMSNorm',
      'SwiGLU',
      'Weight tying',
      'BPE',
      'NLP',
      'Language modeling',
    ],
    steps: [
      step(
        'Text',
        'Training examples are emotional-support dialogue pairs. The corpus contains 52,137 pairs across three sources.',
      ),
      step(
        'BPE tokenizer',
        'Byte Pair Encoding repeatedly merges frequent token pairs to form a subword vocabulary. The custom vocabulary has 16,000 entries.',
      ),
      step(
        'Token embeddings',
        'Maps discrete token IDs to learned vectors that the transformer can operate on.',
      ),
      step(
        'RMSNorm',
        'Rescales activations using their root mean square. Unlike LayerNorm, it does not subtract the mean.',
      ),
      step(
        'Self-attention',
        'A causal attention mask allows each position to use earlier tokens without seeing future tokens during training.',
      ),
      step(
        'RMSNorm · feed-forward',
        'Normalization precedes the feed-forward sublayer to control activation scale.',
      ),
      step(
        'SwiGLU',
        'Why this activation? A SiLU-activated gate modulates a second linear projection, creating a gated feed-forward transformation.',
      ),
      step(
        'LM head · weight tying',
        'Projects the hidden state to vocabulary logits. Weight tying shares parameters between token embeddings and the output projection.',
      ),
      step(
        'Generated response',
        'Next-token predictions form a response. This educational diagram does not run the trained model.',
      ),
    ],
    evidence: [
      { value: '52,137', label: 'training pairs' },
      { value: '16k', label: 'custom BPE vocabulary' },
      { value: '4 → 7.5 / 10', label: 'internal V1 → V2 evaluation' },
    ],
    observations: [
      'Building the transformer exposes the connections between tokenization, normalization, attention, and generation.',
      'The résumé reports an improvement from 4/10 to 7.5/10 on internal evaluation. These are not externally benchmarked scores.',
      'An emotional-support model still requires clear boundaries; training intent is not evidence of clinical benefit.',
    ],
    limits:
      'Internal evaluation rubric and held-out protocol are not specified in the résumé. No clinical or general benchmark claim is implied.',
    repoPattern: '^MiniGPT-Emotional-Support$',
  },
  {
    slug: 'sign-language',
    name: 'Sign Language Detection System',
    subtitle: 'From hand movement to letter prediction',
    category: 'Computer Vision',
    color: 'yellow',
    year: '2026',
    question:
      'How can image models and hand landmarks support real-time letter recognition?',
    approach:
      'Built a baseline CNN and a transformer-based SignFormer architecture, with a MediaPipe hand-landmark pipeline for live webcam inference.',
    tech: [
      'Python',
      'TensorFlow',
      'Keras',
      'CNN',
      'Transformer',
      'SignFormer',
      'MediaPipe',
    ],
    steps: [
      step(
        'Camera',
        'Live webcam frames provide input for the implemented inference pipeline.',
      ),
      step(
        'Hand detection',
        'Locate the relevant hand region before extracting landmarks.',
      ),
      step(
        'MediaPipe landmarks',
        'Represent hand structure as landmarks for the live pipeline.',
      ),
      step(
        'CNN / SignFormer',
        'A baseline convolutional model and a transformer-based SignFormer are the documented model approaches.',
      ),
      step(
        'Letter prediction',
        'Translate recognized hand gestures into letters; full language translation is not claimed.',
      ),
    ],
    evidence: [
      { value: 'CNN', label: 'baseline architecture' },
      { value: 'SignFormer', label: 'transformer approach' },
      { value: 'MediaPipe', label: 'live hand landmarks' },
    ],
    observations: [
      'The project combines model architecture work with a live camera input pipeline.',
      'The supported output is letter prediction, not translation of complete signed conversations.',
    ],
    limits:
      'No accuracy or latency figure is supplied in the résumé. This portfolio does not access the camera or run inference.',
    repoPattern: '^Sign_language_detect(?:ion|tion)$',
  },
  {
    slug: 'student-risk',
    name: 'Student Performance Risk Portal',
    subtitle: 'ML → API → a real-world application',
    category: 'Machine Learning',
    color: 'lavender',
    year: '2026',
    question:
      'Can habit and lifestyle signals flag academic risk before grades slip?',
    approach:
      'Deployed a scikit-learn classification pipeline behind a REST API on Render, returning a risk level, confidence scores, and actionable recommendations for students or advisors.',
    tech: ['Python', 'scikit-learn', 'Pandas', 'REST API', 'Render'],
    steps: [
      step(
        'Student data',
        'Habit and lifestyle data form the documented input.',
      ),
      step(
        'Feature processing',
        'Prepare the input features for the classification pipeline.',
      ),
      step(
        'scikit-learn model',
        'A trained classification model estimates academic risk.',
      ),
      step(
        'Risk level',
        'Returns a risk category, not a determination of a student’s future.',
      ),
      step(
        'Confidence',
        'Reports the model’s confidence score; the résumé does not specify calibration.',
      ),
      step(
        'Recommendations',
        'Provides actionable recommendations through the REST API.',
      ),
    ],
    evidence: [
      { value: 'REST API', label: 'model delivery' },
      { value: 'Render', label: 'documented deployment' },
      { value: 'Risk + confidence', label: 'prediction response' },
    ],
    observations: [
      'The system carries a model beyond a notebook into an API-backed application.',
      'Risk output and recommendations make the prediction consumable by students or advisors.',
    ],
    limits:
      'Render deployment is documented in the résumé. Availability of a live demo depends on the repository’s current homepage. No accuracy or calibration claim is added.',
    repoPattern: '^Student-Performance-Risk-Portal$',
  },
  {
    slug: 'customer-intelligence',
    name: 'Customer Intelligence System',
    subtitle: 'Classical clustering meets learned representations',
    category: 'Machine Learning',
    color: 'green',
    year: '2026',
    question:
      'Does combining classical clustering with a learned embedding space improve customer segmentation?',
    approach:
      'Engineered RFM behavioral features from UCI Online Retail data, evaluated K-Means clusters using silhouette scores, and added a neural embedding layer exposed through FastAPI.',
    tech: [
      'Python',
      'TensorFlow',
      'Keras',
      'scikit-learn',
      'Pandas',
      'FastAPI',
    ],
    steps: [
      step(
        'Retail data',
        'UCI Online Retail transactions provide the dataset.',
      ),
      step(
        'RFM features',
        'Recency, frequency, and monetary value summarize customer behavior.',
      ),
      step('K-Means', 'Clusters customers in the engineered feature space.'),
      step(
        'Silhouette evaluation',
        'Measures how well points fit their cluster compared with neighboring clusters.',
      ),
      step(
        'Customer segments',
        'Interpretable cohorts emerge from the RFM-based clustering.',
      ),
      step(
        'Neural embedding',
        'A learned representation is added to investigate segmentation beyond classical features.',
      ),
      step('FastAPI', 'Exposes the embedding layer for downstream use.'),
    ],
    evidence: [
      { value: 'UCI Retail', label: 'source dataset' },
      { value: 'RFM + K-Means', label: 'classical baseline' },
      { value: 'Embeddings', label: 'learned representations' },
    ],
    observations: [
      'A classical baseline establishes a point of comparison for the learned embedding space.',
      'Silhouette evaluation is named in the résumé, but no numerical score is provided.',
    ],
    limits:
      'The résumé describes an investigation, not a demonstrated quantitative improvement over the baseline.',
    repoPattern: '^customer-intelligence-system$',
  },
  {
    slug: 'logistic-regression',
    name: 'Logistic Regression Research',
    subtitle: 'Feature scaling & gradient descent, from scratch',
    category: 'Research',
    color: 'yellow',
    year: '2025',
    question:
      'How does feature scaling change the behavior of gradient descent?',
    approach:
      'Implemented the full gradient descent training pipeline in Python and NumPy, comparing min-max normalization with standardization on the Breast Cancer Wisconsin dataset sourced through Kaggle.',
    tech: [
      'Python',
      'NumPy',
      'Logistic Regression',
      'Gradient Descent',
      'Min-Max Normalization',
      'Standardization',
    ],
    steps: [
      step(
        'Dataset',
        'Breast Cancer Wisconsin data provides the classification problem.',
      ),
      step(
        'Feature scaling',
        'Compare min-max normalization, (x − min) / (max − min), with standardization, (x − μ) / σ.',
      ),
      step(
        'Gradient descent',
        'Update weights iteratively in the direction that reduces the logistic loss.',
      ),
      step(
        'Logistic regression',
        'Apply the sigmoid function to the linear score to model a class probability.',
      ),
      step(
        'Evaluation',
        'The résumé reports 92%+ accuracy for the from-scratch pipeline.',
      ),
    ],
    evidence: [
      { value: '92%+', label: 'résumé-reported accuracy' },
      { value: '2', label: 'scaling approaches' },
      { value: 'From scratch', label: 'Python / NumPy pipeline' },
    ],
    observations: [
      'Feature scales influence the conditioning of the optimization problem and the behavior of gradient descent.',
      'Min-max normalization bounds a feature’s range; standardization centers and rescales by standard deviation.',
      'The study is independent, self-published research from 2025.',
    ],
    limits:
      'The résumé does not specify split details or accuracy by scaler. The interactive comparison is illustrative and is not a reproduction of the experiment.',
    repoPattern: '^Breast-Cancer-Detection$',
  },
];
export const getStudy = (slug: string) => studies.find((s) => s.slug === slug);
export const skillGroups = [
  ['Programming', 'Python', 'C', 'SQL'],
  [
    'Machine Learning',
    'scikit-learn',
    'Feature Engineering',
    'Hyperparameter Tuning',
    'Model Evaluation',
    'K-Means Clustering',
    'Classification',
  ],
  [
    'Deep Learning',
    'PyTorch',
    'TensorFlow',
    'Keras',
    'NumPy',
    'Pandas',
    'Transformer Architecture',
    'CNN',
    'RNN',
    'LSTM',
    'Neural Networks',
  ],
  [
    'NLP & LLMs',
    'Word2Vec',
    'TF-IDF',
    'BPE Tokenization',
    'Text Classification',
    'Sequence Modeling',
    'Language Modeling',
    'Generative Text Models',
  ],
  [
    'Computer Vision',
    'Image Classification',
    'Real-Time Object Detection',
    'Image Preprocessing',
    'Feature Extraction',
    'MediaPipe',
  ],
  [
    'Data Science',
    'RFM Analysis',
    'Behavioral Feature Engineering',
    'Silhouette Score Evaluation',
    'Data Preprocessing',
  ],
  ['Deployment & APIs', 'FastAPI', 'REST API Development', 'Render'],
  [
    'Software Engineering',
    'OOP',
    'Data Structures and Algorithms',
    'DBMS',
    'Git',
    'GitHub',
    'Open-Source Development',
  ],
  ['Tools', 'Jupyter Notebook', 'VS Code', 'Google Colab', 'Kaggle'],
  [
    'Research Areas',
    'Multimodal AI',
    'Emotion Recognition',
    'Human-AI Interaction',
    'Ethical AI Design',
    'Curriculum Learning',
    'Reinforcement Learning Concepts',
  ],
];
