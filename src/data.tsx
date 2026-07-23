import {
  MapPin, Layers, BookOpen, Mail, Boxes, LineChart, ScanEye, Flag, Cpu,
  Network, BrainCircuit, MessageSquare, GitMerge, Bot, HeartPulse, Sparkles,
  Home as HomeIcon, MailWarning, Code2, type LucideIcon,
} from 'lucide-react'

const GH = 'https://github.com/maheshreddy-ml'

export const CONTACT = {
  email: 'maheshreddygit@gmail.com',
  github: GH,
  linkedin: 'https://linkedin.com/in/maheshreddy',
  handle: 'maheshreddy-ml',
}

export type RouteDef = { path: string; mark: string; title: string; label: string; icon: LucideIcon; note: string; coord: string }

/** The four dedicated routes + their overview cards on Home. */
export const ROUTES: RouteDef[] = [
  { path: '/projects', mark: 'I', title: 'Project Route', label: 'Projects', icon: MapPin, coord: '06 charted builds', note: 'Selected AI/ML builds — from scratch-built GPTs to deployed portals.' },
  { path: '/expertise', mark: 'II', title: 'Expertise Route', label: 'Expertise', icon: Layers, coord: '06 disciplines', note: 'Foundations, scratch code, deep learning, and shipping.' },
  { path: '/research', mark: 'III', title: 'Research Route', label: 'Research', icon: BookOpen, coord: '01 framework · evidence', note: 'Frameworks, comparative studies, and open-source evidence.' },
  { path: '/contact', mark: 'IV', title: 'Correspondence Route', label: 'Contact', icon: Mail, coord: 'open to internships', note: 'Internships, collaboration, engineering roles.' },
]

export const stats = [
  { value: '18+', label: 'Repositories Charted', sub: 'AI / ML systems' },
  { value: '52k', label: 'Training Pairs', sub: 'MiniGPT V2 corpus' },
  { value: "'26", label: 'GSSoC Contributor', sub: 'merged & selected' },
]

export const folioTags = [
  'Scratch ML', 'GPT from Scratch', 'PyTorch', 'TensorFlow', 'NLP', 'Word2Vec',
  'Computer Vision', 'MediaPipe', 'FastAPI', 'MongoDB', 'Open Source', 'Research Writing',
]

export type Project = {
  n: string; name: string; kicker: string; coord: string; icon: LucideIcon
  featured?: boolean; desc: string; tags: string[]; bullets: string[]
  repo: string; live?: string; lang: string
}

export const projects: Project[] = [
  {
    n: '01', name: 'MiniGPT — Emotional Support', kicker: 'GPT FROM SCRATCH · PYTORCH',
    coord: 'V2 · 7.5/10 · 16k BPE', icon: Bot, featured: true, lang: 'Python',
    repo: `${GH}/MiniGPT-Emotional-Support`,
    desc: 'A modern GPT-style transformer built from the ground up in PyTorch — trained on 52,137 emotional-support dialogue pairs with a custom 16k BPE tokenizer. V2 is a genuinely conversational support chatbot, not a toy.',
    tags: ['PyTorch', 'Transformer', '16k BPE', '52k pairs'],
    bullets: [
      'GPT-style decoder architecture hand-built in PyTorch',
      'Custom 16,000-token BPE tokenizer trained on the corpus',
      '52,137 curated emotional-support conversation pairs',
      'V2 rated 7.5/10 for coherent, supportive replies',
    ],
  },
  {
    n: '02', name: 'AI-Companion · Emora', kicker: 'EMOTION-AWARE · FULL STACK',
    coord: 'FastAPI · MongoDB', icon: HeartPulse, featured: true, lang: 'Python',
    repo: `${GH}/AI-Companion`,
    desc: 'Emora — a living, emotionally aware AI companion. A production-ready FastAPI + MongoDB system with multimodal emotion perception, contextual memory, and stable character modeling so the AI remembers the person, not just the prompt.',
    tags: ['FastAPI', 'MongoDB', 'Emotion AI', 'Pytest'],
    bullets: [
      'Multimodal emotion perception drives the response tone',
      'Contextual long-term memory per companion',
      'Stable character modeling for consistent personality',
      'Deployment-ready, tested with Pytest',
    ],
  },
  {
    n: '03', name: 'Customer Intelligence System', kicker: 'SEGMENTATION · RECOMMENDATION',
    coord: 'retail behaviour data', icon: Boxes, lang: 'Python',
    repo: `${GH}/customer-intelligence-system`,
    desc: 'End-to-end customer segmentation, embedding analysis, and recommendation intelligence that transforms raw retail transactions into meaningful segments, learned embeddings, and evaluation-backed recommendations.',
    tags: ['TensorFlow', 'scikit-learn', 'Pandas', 'Embeddings'],
    bullets: [
      'RFM + clustering to chart customer cohorts',
      'Learned neural embeddings power recommendations',
      'PCA / t-SNE projections make segments legible',
      'Evaluation metrics baked into the pipeline',
    ],
  },
  {
    n: '04', name: 'Student Performance Risk Portal', kicker: 'CLASSIFICATION · LIVE API',
    coord: 'deployed / Render', icon: LineChart, lang: 'HTML',
    repo: `${GH}/Student-Performance-Risk-Portal`,
    live: 'https://student-performance-risk-portal-2.onrender.com',
    desc: 'A production-style early-warning system that turns habit and lifestyle inputs — study hours, attendance, sleep, screen time — into an academic risk level, a confidence score, and practical advice. Live on Render.',
    tags: ['scikit-learn', 'Python API', 'SPA frontend'],
    bullets: [
      'Trained ML pipeline over habit & lifestyle signals',
      'Returns a risk band + calibrated confidence',
      'Polished single-page frontend',
      'Deployed live on Render',
    ],
  },
  {
    n: '05', name: 'Sign Language Detection', kicker: 'VISION · REAL-TIME',
    coord: 'CNN + SignFormer', icon: ScanEye, lang: 'Python',
    repo: `${GH}/Sign_language_detecttion`,
    desc: 'A deep-learning system recognizing sign-language letters from images and live webcam. A baseline CNN backbone is extended with a transformer-style SignFormer, with real-time inference powered by MediaPipe hand landmarks.',
    tags: ['TensorFlow', 'MediaPipe', 'SignFormer', 'CNN'],
    bullets: [
      'Baseline CNN for feature learning & backbone reuse',
      'SignFormer extends CNN features with transformer blocks',
      'Real-time webcam prediction via MediaPipe landmarks',
      'Reproducible end-to-end training pipeline',
    ],
  },
  {
    n: '06', name: 'LSTM Chatbot · Word2Vec', kicker: 'CLASSICAL NLP · PRE-TRANSFORMER',
    coord: 'two-stage pipeline', icon: MessageSquare, lang: 'Python',
    repo: `${GH}/lstm-chatbot-word2vec`,
    desc: 'A conversational model built with classical NLP — exploring how dialogue systems worked before transformers. Word2Vec learns word semantics, an LSTM learns sequential dialogue structure, and together they generate chat-like replies.',
    tags: ['Word2Vec', 'LSTM', 'NLP', 'Sequence Models'],
    bullets: [
      'Word2Vec embeddings capture word semantics',
      'LSTM sequence model learns conversational structure',
      'Next-word prediction generates responses',
      'A study of the pre-transformer dialogue era',
    ],
  },
]

/** Further expeditions — smaller repos surfaced on the Projects page. */
export type MiniRepo = { name: string; note: string; icon: LucideIcon; repo: string; lang: string }
export const moreRepos: MiniRepo[] = [
  { name: 'myMLlib', note: 'A from-scratch ML library — core algorithms on a pure NumPy backend.', icon: Cpu, repo: `${GH}/myMLlib`, lang: 'Python' },
  { name: 'F1-Pit', note: 'Optimal pit-stop windows from telemetry & tyre-degradation curves.', icon: Flag, repo: `${GH}/F1-Pit`, lang: 'Python' },
  { name: 'Breast-Cancer-Detection', note: 'Logistic regression from scratch — no ML libs, 92%+ accuracy.', icon: HeartPulse, repo: `${GH}/Breast-Cancer-Detection`, lang: 'Python' },
  { name: 'shakespeare-text-generator-lstm', note: "Character-level LSTM that writes in the Bard's cadence.", icon: Sparkles, repo: `${GH}/shakespeare-text-generator-lstm`, lang: 'Python' },
  { name: 'Disease-prediction', note: "Bayes' Theorem survival-chance calculator over hospital data.", icon: Network, repo: `${GH}/Disease-prediction`, lang: 'Python' },
  { name: 'Hyderabad House Rent Predictor', note: 'Rent prediction with zero-dependency, hand-rolled ML.', icon: HomeIcon, repo: `${GH}/Hyderabad_House_Rent_Predictor`, lang: 'Python' },
  { name: 'EmailFilterAI', note: 'Spam / intent filtering over email text.', icon: MailWarning, repo: `${GH}/EmailFilterAI`, lang: 'Python' },
  { name: 'AegisAI', note: 'Open-source AI-GRC platform — contributor (LLM Guard & pipelines).', icon: GitMerge, repo: 'https://github.com/SdSarthak/AegisAI', lang: 'Python' },
]

export const expertise = [
  { icon: Network, title: 'ML Foundations', note: 'Probability, optimization, and evaluation grounded in first principles.' },
  { icon: Cpu, title: 'Scratch Implementations', note: 'GPTs, tokenizers, and classic algorithms rebuilt from NumPy up — no black boxes.' },
  { icon: BrainCircuit, title: 'Deep Learning', note: 'Transformers, CNNs, LSTMs, and embeddings for language and vision.' },
  { icon: MessageSquare, title: 'NLP', note: 'BPE tokenizers, Word2Vec, sequence models, and human-aware language systems.' },
  { icon: LineChart, title: 'Delivery & APIs', note: 'FastAPI + MongoDB services and models that leave the notebook and ship.' },
  { icon: GitMerge, title: 'Open-Source Workflow', note: 'Reviews, merges, and pipeline work across production repos.' },
]

import companionPaper from './imports/AI_Companion_Research_paper.pdf'
import breastCancerPaper from './imports/logisticregression_for_breastCancer.pdf'

export type ResearchItem = {
  tag: string; title: string; note: string; meta: string; pdf?: string; link?: string
}

export const research: ResearchItem[] = [
  {
    tag: 'FRAMEWORK · FIRST AUTHOR', title: 'Emotionally Aware AI Companions',
    note: 'A human-centric methodological approach — multimodal emotion perception, contextual memory, stable character modeling, and ethical safety, so AI remembers the person, not just the prompt. Keywords: Emotional AI, Emotion Recognition, Human–AI Interaction, Ethical AI. Realized in the Emora / AI-Companion build.',
    meta: 'Parul University · 2026',
    pdf: companionPaper,
  },
  {
    tag: 'ANALYSIS · FROM SCRATCH', title: 'Logistic Regression for Breast Cancer Detection',
    note: 'Logistic regression implemented from first principles with no ML libraries — weighing sensitivity, specificity, and interpretability on a real Kaggle dataset for 92%+ accuracy.',
    meta: 'Comparative model study',
    pdf: breastCancerPaper,
  },
  {
    tag: 'OPEN SOURCE · EVIDENCE', title: "GSSoC '26 Contributions",
    note: 'Selected contributor — preprocessing work on Disease-prediction and LLM-Guard / pipeline engineering on the AegisAI AI-GRC platform.',
    meta: 'Merged & selected',
    link: 'https://github.com/SdSarthak/AegisAI',
  },
]

export type SkillGroup = { region: string; mark: string; icon: LucideIcon; skills: string[] }

/** Categorized skill atlas — grouped like map regions. */
export const skillGroups: SkillGroup[] = [
  { region: 'Languages', mark: 'α', icon: Code2, skills: ['Python', 'C / C++', 'SQL', 'JavaScript', 'HTML / CSS', 'Bash'] },
  { region: 'ML & Deep Learning', mark: 'β', icon: BrainCircuit, skills: ['PyTorch', 'TensorFlow', 'Keras', 'scikit-learn', 'Transformers', 'CNNs', 'LSTMs', 'Embeddings'] },
  { region: 'NLP', mark: 'γ', icon: MessageSquare, skills: ['GPT Architecture', 'BPE Tokenizers', 'Word2Vec', 'Attention', 'Sequence Models', 'Text Generation'] },
  { region: 'Computer Vision', mark: 'δ', icon: ScanEye, skills: ['OpenCV', 'MediaPipe', 'SignFormer', 'Image Classification', 'Real-time Inference'] },
  { region: 'Data & Scientific', mark: 'ε', icon: LineChart, skills: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'PCA / t-SNE', 'Feature Engineering'] },
  { region: 'Backend & Deployment', mark: 'ζ', icon: Cpu, skills: ['FastAPI', 'Flask', 'MongoDB', 'REST APIs', 'Render', 'Docker'] },
  { region: 'Tools & Workflow', mark: 'η', icon: GitMerge, skills: ['Git & GitHub', 'Jupyter', 'VS Code', 'Kaggle', 'Pytest', 'Linux'] },
  { region: 'Foundations', mark: 'θ', icon: Network, skills: ['Linear Algebra', 'Probability', 'Optimization', 'Gradient Descent', "Bayes' Theorem", 'Statistics'] },
]

/** Flat list for the scrolling instrument ticker. */
export const skillTicker = [
  'Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Transformers', 'GPT from Scratch',
  'Word2Vec', 'LSTM', 'CNN', 'MediaPipe', 'OpenCV', 'FastAPI', 'MongoDB', 'NumPy', 'Pandas',
  'Matplotlib', 'BPE Tokenizers', 'Attention', 'Docker', 'Git', 'Kaggle', 'Flask', 'REST APIs',
]
