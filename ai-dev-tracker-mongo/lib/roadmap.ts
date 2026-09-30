// The roadmap. Each item's `id` is what gets saved per user, so keep ids
// stable; wording can change freely.

export type RoadmapItem = { id: string; text: string };
export type Phase = {
  id: string;
  title: string;
  weeks: string;
  items: RoadmapItem[];
  project: { id: string; label: string; text: string };
};

export const ROADMAP: Phase[] = [
  {
    id: "p1",
    title: "Python + math foundations",
    weeks: "Weeks 1–2",
    items: [
      { id: "p1-python", text: "Day 1–2: Python refresh (skip if comfortable)" },
      { id: "p1-numpy", text: "Day 3–4: NumPy + Pandas, Kaggle “Pandas” micro-course" },
      { id: "p1-linalg", text: "Day 5–7: 3Blue1Brown, “Essence of Linear Algebra” (full playlist)" },
      { id: "p1-calc", text: "Day 8–10: 3Blue1Brown, “Essence of Calculus”" },
      { id: "p1-stats", text: "Day 11–14: StatQuest: mean/variance, probability vs likelihood, gradient descent, Bayes" },
    ],
    project: {
      id: "p1-proj",
      label: "Mini project 1 · Data playground",
      text: "Load a CSV in Pandas, clean it, plot basic stats with matplotlib.",
    },
  },
  {
    id: "p2",
    title: "Core ML concepts",
    weeks: "Weeks 3–4",
    items: [
      { id: "p2-ng", text: "Day 15–21: Andrew Ng ML Specialization (Coursera, audit free), do the labs" },
      { id: "p2-nn", text: "Day 22–24: StatQuest neural networks series" },
      { id: "p2-torch", text: "Day 25–28: PyTorch “60 Minute Blitz” + freeCodeCamp PyTorch course" },
    ],
    project: {
      id: "p2-proj",
      label: "Mini project 2 · Basic classifier",
      text: "Build a simple image or text classifier in PyTorch (MNIST or similar).",
    },
  },
  {
    id: "p3",
    title: "Deep learning + transformers",
    weeks: "Weeks 5–7",
    items: [
      { id: "p3-karpathy", text: "Day 29–35: Karpathy, “Neural Networks: Zero to Hero” (build GPT from scratch, don’t skip)" },
      { id: "p3-hf", text: "Day 36–42: Hugging Face NLP Course (huggingface.co/learn)" },
    ],
    project: {
      id: "p3-proj",
      label: "Mini project 3 · Pretrained model API",
      text: "Run a Hugging Face model and wrap it in a small Node.js API endpoint.",
    },
  },
  {
    id: "p4",
    title: "Actual fine-tuning",
    weeks: "Weeks 8–10",
    items: [
      { id: "p4-bert", text: "Day 43–49: Fine-tune BERT for text classification (Colab)" },
      { id: "p4-lora", text: "Day 50–56: LoRA / QLoRA with Hugging Face PEFT on Llama 3.2 1B/3B or Phi-3-mini (Colab)" },
    ],
    project: {
      id: "p4-proj",
      label: "Major project · Fine-tuned summarizer",
      text: "Fine-tune a small model for summarization for your Knowledge Sharing Platform.",
    },
  },
  {
    id: "p5",
    title: "Deployment",
    weeks: "Weeks 11–12",
    items: [
      { id: "p5-quant", text: "Day 57–63: Evaluation + quantization (GGUF / 4-bit)" },
      { id: "p5-serve", text: "Day 64–70: Serve your model with Ollama and call it from a Node.js backend" },
    ],
    project: {
      id: "p5-proj",
      label: "Final project · Ship it",
      text: "Put the fine-tuned, quantized model into your portfolio project end to end.",
    },
  },
  {
    id: "p6",
    title: "Becoming an AI developer",
    weeks: "Weeks 13–14",
    items: [
      { id: "p6-writeups", text: "Write up each model you trained as a short case study with metrics (GitHub + LinkedIn)" },
      { id: "p6-oss", text: "Open one real PR on an open-source ML repo (Hugging Face, Ollama, etc.). Docs fixes count." },
      { id: "p6-jobs", text: "Read 10–15 AI/ML engineer job posts and list the skills you’re still missing" },
      { id: "p6-eval", text: "Learn eval basics: accuracy/F1, before/after comparisons, human eval" },
    ],
    project: {
      id: "p6-proj",
      label: "Capstone · AI developer portfolio",
      text: "One polished repo or site showing every project, the problem it solved, and the stack.",
    },
  },
];

export const ALL_ITEM_IDS: string[] = ROADMAP.flatMap((p) => [
  ...p.items.map((i) => i.id),
  p.project.id,
]);
