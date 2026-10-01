// The roadmap. Every `id` (module, task, project) is what gets saved per user
// for progress and notes, so keep ids stable; wording can change freely.
// Some ids (p1-*, p2-*, ...) come from the old phase layout and are kept so
// existing progress carries over.

// One search to type into YouTube ("yt") or a web search ("web").
export type Search = { q: string; on: "yt" | "web" };

export type Task = {
  id: string;
  title: string;
  learn: string;
  keywords: string[];
  // First entry is the best resource to start with.
  search: Search[];
};

export type Module = {
  id: string;
  week: string;
  title: string;
  goal: string;
  nodeTip?: string;
  tasks: Task[];
  project: Task & { label: string };
};

export const TOTAL_WEEKS = 21;

const yt = (q: string): Search => ({ q, on: "yt" });
const web = (q: string): Search => ({ q, on: "web" });

export const ROADMAP: Module[] = [
  {
    id: "m01",
    week: "Week 1",
    title: "Python for a JavaScript developer",
    goal: "Get productive in Python and the notebook workflow every ML tutorial uses.",
    nodeTip:
      "Map what you already know: npm → pip/uv, package.json → pyproject.toml, node_modules → .venv, arrays/objects → lists/dicts. Indentation is syntax.",
    tasks: [
      {
        id: "p1-python",
        title: "Python syntax through JS eyes",
        learn: "Lists, dicts, comprehensions, f-strings, functions, classes, imports, type hints. Skip anything you'd skip in a JS beginner course.",
        keywords: ["list comprehension", "dict", "f-string", "*args **kwargs", "type hints", "dataclass"],
        search: [yt("Python for JavaScript developers"), web("Kaggle Learn Python course"), yt("Corey Schafer Python list comprehensions")],
      },
      {
        id: "m01-env",
        title: "Environments and packages",
        learn: "Virtual environments, pip vs uv, requirements.txt and pyproject.toml. The Python version of npm install.",
        keywords: ["venv", "pip", "uv", "pyproject.toml", "requirements.txt"],
        search: [yt("uv python package manager tutorial"), yt("Corey Schafer python venv virtual environment")],
      },
      {
        id: "m01-colab",
        title: "Jupyter notebooks and Google Colab",
        learn: "Run cells, install packages with !pip, switch to the free T4 GPU runtime, mount Google Drive to keep files.",
        keywords: ["Jupyter notebook", "Google Colab", "Colab GPU runtime", "!pip install", "mount Google Drive"],
        search: [yt("Google Colab tutorial for beginners"), web("Colab change runtime type GPU")],
      },
    ],
    project: {
      id: "m01-proj",
      label: "Mini project · Port a Node script",
      title: "Rewrite a small Node script you've written before (a CLI, a file parser, an API call) in Python, with a venv and a requirements file.",
      learn: "Proves you can ship working Python, not just read it.",
      keywords: ["requests", "argparse", "pathlib", "json module"],
      search: [web("python requests library quickstart"), web("python argparse tutorial")],
    },
  },
  {
    id: "m02",
    week: "Week 2",
    title: "NumPy, Pandas and plotting",
    goal: "Handle data the way ML code does: whole arrays and dataframes, not loops.",
    nodeTip:
      "A DataFrame is an array of objects with SQL superpowers. The mindset shift is vectorization: operate on whole arrays instead of writing for-loops.",
    tasks: [
      {
        id: "p1-numpy",
        title: "NumPy arrays and vectorization",
        learn: "Shapes, indexing, slicing, broadcasting, dot products. Shape errors are the #1 PyTorch bug later, so get comfortable here.",
        keywords: ["ndarray", "shape", "broadcasting", "axis", "reshape", "dot product"],
        search: [web("NumPy the absolute basics for beginners"), yt("NumPy tutorial freeCodeCamp"), yt("numpy broadcasting explained")],
      },
      {
        id: "m02-pandas",
        title: "Pandas DataFrames",
        learn: "Load a CSV, select and filter, groupby, merge, handle missing values.",
        keywords: ["DataFrame", "groupby", "merge", "fillna", "value_counts"],
        search: [web("Kaggle Learn Pandas course"), yt("Corey Schafer pandas tutorial")],
      },
      {
        id: "m02-plot",
        title: "Plotting with Matplotlib and Seaborn",
        learn: "Line, bar, histogram, scatter. You'll plot loss curves for the rest of this roadmap.",
        keywords: ["matplotlib pyplot", "histogram", "scatter plot", "seaborn"],
        search: [web("Kaggle Learn Data Visualization course"), yt("Corey Schafer matplotlib tutorial")],
      },
    ],
    project: {
      id: "p1-proj",
      label: "Mini project 1 · Data playground",
      title: "Pick a Kaggle dataset you find interesting, clean it in Pandas, and answer 3 questions about it with charts in a Colab notebook.",
      learn: "Your first end-to-end data workflow.",
      keywords: ["Kaggle datasets", "exploratory data analysis", "data cleaning"],
      search: [yt("exploratory data analysis pandas project"), web("Kaggle datasets")],
    },
  },
  {
    id: "m03",
    week: "Week 3",
    title: "The math you actually need",
    goal: "Intuition, not proofs: vectors, matrices, derivatives, probability.",
    nodeTip: "Watch for intuition, then write each idea in NumPy. Writing the code is how it sticks.",
    tasks: [
      {
        id: "p1-linalg",
        title: "Linear algebra intuition",
        learn: "Vectors, matrix multiplication as a transformation, dot product, and why nearly everything in ML is a matrix multiply.",
        keywords: ["vector", "matrix multiplication", "dot product", "linear transformation"],
        search: [yt("3Blue1Brown Essence of linear algebra"), web("Mathematics for Machine Learning book free pdf")],
      },
      {
        id: "p1-calc",
        title: "Derivatives and gradients",
        learn: "Derivative as slope, the chain rule (this is backprop), partial derivatives, the gradient.",
        keywords: ["derivative", "chain rule", "partial derivative", "gradient"],
        search: [yt("3Blue1Brown Essence of calculus"), yt("StatQuest the chain rule")],
      },
      {
        id: "p1-stats",
        title: "Probability and statistics",
        learn: "Mean and variance, distributions, probability vs likelihood, Bayes' rule, softmax and cross-entropy.",
        keywords: ["normal distribution", "likelihood", "Bayes theorem", "softmax", "cross entropy"],
        search: [yt("StatQuest statistics fundamentals"), yt("StatQuest probability vs likelihood"), yt("StatQuest cross entropy")],
      },
      {
        id: "m03-gd",
        title: "Gradient descent",
        learn: "How a model learns: compute the loss, take its gradient, step a little downhill, repeat.",
        keywords: ["loss function", "learning rate", "gradient descent", "mean squared error"],
        search: [yt("StatQuest gradient descent step by step")],
      },
    ],
    project: {
      id: "m03-proj",
      label: "Mini project · Gradient descent from scratch",
      title: "Fit a line to noisy data using only NumPy and your own gradient descent loop. Plot the loss going down.",
      learn: "The same loop powers every model you'll train later.",
      keywords: ["linear regression", "MSE", "learning rate"],
      search: [yt("linear regression from scratch python numpy gradient descent")],
    },
  },
  {
    id: "m04",
    week: "Weeks 4–5",
    title: "Classic machine learning",
    goal: "Learn the vocabulary and workflow every ML job assumes: features, train/test split, overfitting, metrics.",
    nodeTip: "scikit-learn feels like a well-designed npm library: every model has the same fit() / predict() API.",
    tasks: [
      {
        id: "p2-ng",
        title: "Supervised learning fundamentals",
        learn: "Linear and logistic regression, cost functions, regularization. Course 1 of Andrew Ng's Machine Learning Specialization (free to audit), and do the labs.",
        keywords: ["supervised learning", "logistic regression", "regularization", "cost function"],
        search: [yt("Andrew Ng Machine Learning Specialization"), web("Coursera Machine Learning Specialization audit")],
      },
      {
        id: "m04-sklearn",
        title: "The scikit-learn workflow",
        learn: "Train/test split, pipelines, cross-validation, decision trees and random forests.",
        keywords: ["train_test_split", "cross validation", "random forest", "pipeline", "feature engineering"],
        search: [web("Kaggle Learn Intro to Machine Learning"), web("scikit-learn getting started"), yt("scikit-learn full course freeCodeCamp")],
      },
      {
        id: "m04-metrics",
        title: "Overfitting and evaluation metrics",
        learn: "Bias vs variance, overfitting, accuracy vs precision/recall/F1, the confusion matrix.",
        keywords: ["overfitting", "bias variance tradeoff", "precision recall", "F1 score", "confusion matrix"],
        search: [yt("StatQuest bias and variance"), yt("StatQuest confusion matrix"), yt("StatQuest sensitivity and specificity")],
      },
    ],
    project: {
      id: "m04-proj",
      label: "Mini project · Kaggle submission",
      title: "Enter the Kaggle Titanic or House Prices competition with a scikit-learn model and submit. Beat your first score at least once.",
      learn: "Real leaderboard feedback on your own model.",
      keywords: ["Kaggle competition", "feature engineering", "submission"],
      search: [web("Kaggle Titanic competition"), yt("Kaggle Titanic tutorial scikit-learn")],
    },
  },
  {
    id: "m05",
    week: "Week 6",
    title: "Neural networks from scratch",
    goal: "Understand what's inside a neural network by building one without a framework.",
    nodeTip: "After the Python version, port micrograd to TypeScript. If you can rebuild it in your strongest language, you understand it.",
    tasks: [
      {
        id: "p2-nn",
        title: "Neural network intuition",
        learn: "Neurons, layers, activation functions, the forward pass, backpropagation.",
        keywords: ["neuron", "activation function", "ReLU", "backpropagation", "hidden layer"],
        search: [yt("3Blue1Brown neural networks"), yt("StatQuest neural networks")],
      },
      {
        id: "p3-karpathy",
        title: "Build micrograd",
        learn: "Karpathy's tiny autograd engine: backprop by hand, then a small neural net. Code along, don't just watch.",
        keywords: ["autograd", "computational graph", "backpropagation", "micrograd"],
        search: [yt("Karpathy spelled-out intro to neural networks building micrograd"), web("github karpathy micrograd")],
      },
    ],
    project: {
      id: "m05-proj",
      label: "Mini project · micrograd in TypeScript",
      title: "Port micrograd to TypeScript, train it on a tiny dataset in Node, and publish it on GitHub.",
      learn: "A portfolio piece that shows both your JS strength and real ML understanding.",
      keywords: ["autograd", "backprop", "TypeScript"],
      search: [web("micrograd javascript port")],
    },
  },
  {
    id: "m06",
    week: "Weeks 7–8",
    title: "PyTorch",
    goal: "Train real models with the framework almost every fine-tuning tool is built on.",
    nodeTip: "The training loop is ML's middleware chain: the same five lines everywhere (forward, loss, backward, step, zero_grad).",
    tasks: [
      {
        id: "p2-torch",
        title: "Tensors, autograd and the training loop",
        learn: "Tensors on the GPU, nn.Module, optimizers, loss functions, writing the training loop yourself.",
        keywords: ["tensor", "nn.Module", "optimizer", "loss.backward()", "training loop", "CUDA"],
        search: [web("learnpytorch.io Zero to Mastery"), yt("PyTorch for Deep Learning full course freeCodeCamp"), web("PyTorch Learn the Basics tutorial")],
      },
      {
        id: "m06-data",
        title: "Datasets, DataLoaders and checkpoints",
        learn: "Dataset and DataLoader, batches and epochs, train/validation split, saving and loading weights.",
        keywords: ["Dataset", "DataLoader", "batch size", "epoch", "state_dict"],
        search: [web("PyTorch datasets and dataloaders tutorial"), yt("PyTorch Dataset DataLoader explained")],
      },
      {
        id: "m06-cnn",
        title: "CNNs for images",
        learn: "Convolutions, pooling, and why CNNs work so well for images.",
        keywords: ["convolution", "pooling", "CNN", "feature map"],
        search: [yt("StatQuest convolutional neural networks"), web("learnpytorch.io computer vision")],
      },
    ],
    project: {
      id: "p2-proj",
      label: "Mini project 2 · Basic classifier",
      title: "Train a FashionMNIST classifier in PyTorch. Plot train vs validation loss and get above 90% test accuracy.",
      learn: "Your first full PyTorch training run.",
      keywords: ["FashionMNIST", "image classification", "validation loss"],
      search: [yt("PyTorch FashionMNIST classifier tutorial")],
    },
  },
  {
    id: "m07",
    week: "Week 9",
    title: "Your first fine-tune: transfer learning",
    goal: "Fine-tuning starts here: take a pretrained model and adapt it to your own data.",
    nodeTip: "Hugging Face Spaces is like Vercel for model demos: push a repo, get a URL.",
    tasks: [
      {
        id: "m07-transfer",
        title: "Transfer learning with a pretrained CNN",
        learn: "Freeze the backbone, replace the head, fine-tune on a small dataset. fast.ai lessons 1–2 are the fastest route.",
        keywords: ["transfer learning", "pretrained model", "ResNet", "freezing layers", "fine-tuning"],
        search: [web("fast.ai Practical Deep Learning for Coders"), web("PyTorch transfer learning tutorial")],
      },
      {
        id: "m07-gradio",
        title: "Demo apps with Gradio and HF Spaces",
        learn: "Wrap a model in a web UI in a few lines and host it for free.",
        keywords: ["Gradio", "Hugging Face Spaces", "model demo"],
        search: [web("Gradio quickstart"), yt("deploy gradio app on hugging face spaces")],
      },
    ],
    project: {
      id: "m07-proj",
      label: "Mini project · Custom image classifier",
      title: "Collect ~100 images per class of something you care about, fine-tune a pretrained ResNet, and deploy it as a Gradio app on Hugging Face Spaces.",
      learn: "A live, shareable fine-tuned model.",
      keywords: ["image dataset", "fine-tune ResNet", "Gradio"],
      search: [yt("fastai lesson 1 is it a bird")],
    },
  },
  {
    id: "m08",
    week: "Week 10",
    title: "Language models from scratch",
    goal: "Understand how text becomes numbers and how a model predicts the next token.",
    tasks: [
      {
        id: "m08-makemore",
        title: "Bigram and MLP language models",
        learn: "Karpathy's makemore parts 1–2: next-character prediction, embeddings, sampling.",
        keywords: ["language model", "bigram", "embedding", "negative log likelihood", "sampling"],
        search: [yt("Karpathy makemore")],
      },
      {
        id: "m08-tokens",
        title: "Tokenization",
        learn: "Byte-pair encoding, why models see tokens and not characters, and the bugs tokenizers cause.",
        keywords: ["tokenizer", "BPE", "byte pair encoding", "vocabulary"],
        search: [yt("Karpathy let's build the GPT tokenizer"), web("tiktokenizer")],
      },
      {
        id: "m08-embed",
        title: "Embeddings",
        learn: "Words as vectors and cosine similarity. You'll use these again for RAG.",
        keywords: ["word embeddings", "cosine similarity", "word2vec"],
        search: [yt("StatQuest word embedding and word2vec")],
      },
    ],
    project: {
      id: "m08-proj",
      label: "Mini project · Name generator",
      title: "Train a character-level model on a list of names (or usernames, product names) and generate new ones.",
      learn: "A tiny language model you fully understand.",
      keywords: ["character-level model", "sampling", "temperature"],
      search: [web("github karpathy makemore")],
    },
  },
  {
    id: "m09",
    week: "Weeks 11–12",
    title: "Transformers and attention",
    goal: "Build a GPT from scratch so LLMs stop being magic.",
    tasks: [
      {
        id: "m09-attn",
        title: "Attention, visually",
        learn: "Self-attention, queries/keys/values, multi-head attention, positional encoding.",
        keywords: ["self-attention", "query key value", "multi-head attention", "positional encoding"],
        search: [yt("3Blue1Brown attention in transformers visually explained"), web("Jay Alammar The Illustrated Transformer"), yt("StatQuest transformer neural networks")],
      },
      {
        id: "m09-gpt",
        title: "Let's build GPT",
        learn: "Karpathy's GPT-from-scratch video. Code along end to end; it's the most valuable video on this list.",
        keywords: ["decoder-only transformer", "causal mask", "layer norm", "residual connection"],
        search: [yt("Karpathy let's build GPT from scratch in code spelled out"), web("github karpathy nanoGPT")],
      },
    ],
    project: {
      id: "m09-proj",
      label: "Mini project · nanoGPT on your own text",
      title: "Train a tiny GPT on a text corpus you pick (song lyrics, your blog, a book) on Colab and sample from it.",
      learn: "You've now trained a transformer yourself.",
      keywords: ["nanoGPT", "character-level GPT", "text corpus"],
      search: [web("github karpathy nanoGPT")],
    },
  },
  {
    id: "m10",
    week: "Week 13",
    title: "The Hugging Face ecosystem",
    goal: "Use the libraries real fine-tuning happens in: transformers, datasets, tokenizers, the Hub.",
    nodeTip: "The Hub is the npm registry for models. Transformers.js runs many of the same models directly in Node.",
    tasks: [
      {
        id: "p3-hf",
        title: "Hugging Face LLM Course",
        learn: "Chapters 1–4: pipelines, models, tokenizers, sharing to the Hub.",
        keywords: ["pipeline", "AutoModel", "AutoTokenizer", "Hugging Face Hub"],
        search: [web("Hugging Face LLM Course"), yt("Hugging Face transformers tutorial")],
      },
      {
        id: "m10-datasets",
        title: "The datasets library",
        learn: "Load, map, filter, and push your own dataset to the Hub.",
        keywords: ["load_dataset", "dataset.map", "push_to_hub"],
        search: [web("Hugging Face datasets quickstart")],
      },
      {
        id: "m10-tjs",
        title: "Transformers.js in Node",
        learn: "Run embedding and classification models in Node with @huggingface/transformers, no Python needed.",
        keywords: ["Transformers.js", "ONNX", "@huggingface/transformers"],
        search: [web("Transformers.js documentation"), yt("Transformers.js Node.js tutorial")],
      },
    ],
    project: {
      id: "p3-proj",
      label: "Mini project 3 · Pretrained model API",
      title: "Build an Express or Fastify API that runs a Hugging Face model (sentiment or summarization) with Transformers.js.",
      learn: "Bridges your Node skills and ML.",
      keywords: ["Transformers.js", "Express", "model inference API"],
      search: [web("Transformers.js server side inference Node")],
    },
  },
  {
    id: "m11",
    week: "Week 14",
    title: "Fine-tuning encoder models",
    goal: "Fine-tune a pretrained transformer for classification and prove it got better.",
    tasks: [
      {
        id: "p4-bert",
        title: "Fine-tune BERT / DistilBERT for text classification",
        learn: "Tokenize a dataset, Trainer and TrainingArguments, train on the free Colab GPU.",
        keywords: ["BERT", "DistilBERT", "Trainer API", "TrainingArguments", "sequence classification"],
        search: [web("Hugging Face text classification task guide"), yt("fine tune BERT text classification hugging face")],
      },
      {
        id: "m11-eval",
        title: "Evaluate before and after",
        learn: "Baseline vs fine-tuned, F1 and the confusion matrix using the evaluate library.",
        keywords: ["evaluate library", "baseline", "F1", "validation set"],
        search: [web("Hugging Face evaluate quick tour")],
      },
      {
        id: "m11-hub",
        title: "Publish your model with a model card",
        learn: "Push to the Hub and document data, metrics and limitations.",
        keywords: ["model card", "push_to_hub", "Hugging Face Hub"],
        search: [web("Hugging Face model cards guide")],
      },
    ],
    project: {
      id: "m11-proj",
      label: "Mini project · Domain classifier",
      title: "Fine-tune DistilBERT on a dataset you build or pick (support tickets, GitHub issues, reviews). Push it to the Hub with a model card and metrics.",
      learn: "Your first fine-tuned transformer that others can use.",
      keywords: ["custom dataset", "DistilBERT", "model card"],
      search: [yt("fine tune DistilBERT custom dataset")],
    },
  },
  {
    id: "m12",
    week: "Weeks 15–16",
    title: "Fine-tuning LLMs with LoRA / QLoRA",
    goal: "The main event: instruction-tune a small open LLM on your own data on a free GPU.",
    nodeTip: "Data prep is most of the work, and it's just ETL. Write the scripts that clean data into JSONL chat format in Node.",
    tasks: [
      {
        id: "m12-sft",
        title: "How LLM fine-tuning works",
        learn: "Pretraining vs supervised fine-tuning vs preference tuning, chat templates, instruction datasets in JSONL.",
        keywords: ["supervised fine-tuning", "instruction tuning", "chat template", "JSONL dataset"],
        search: [web("Maxime Labonne LLM course github"), web("Hugging Face chat templates"), yt("fine-tuning LLMs explained")],
      },
      {
        id: "p4-lora",
        title: "LoRA and QLoRA with PEFT",
        learn: "Why you don't train all the weights: rank, alpha, target modules, loading the model in 4-bit.",
        keywords: ["LoRA", "QLoRA", "PEFT", "rank and alpha", "bitsandbytes 4-bit"],
        search: [yt("LoRA low rank adaptation explained"), web("Hugging Face PEFT LoRA guide")],
      },
      {
        id: "m12-unsloth",
        title: "Fine-tune on Colab with TRL / Unsloth",
        learn: "SFTTrainer and Unsloth's free Colab notebooks for Llama 3.2 1B/3B, Qwen or Gemma.",
        keywords: ["TRL SFTTrainer", "Unsloth", "Llama 3.2", "Qwen", "Colab T4"],
        search: [web("Unsloth fine-tuning notebooks"), web("TRL SFTTrainer documentation"), yt("Unsloth fine tune Llama Colab")],
      },
      {
        id: "m12-data",
        title: "Build your own dataset",
        learn: "Collect, clean and format 500–2,000 examples. Generate synthetic examples, deduplicate, keep a held-out test set.",
        keywords: ["dataset curation", "synthetic data", "data leakage", "deduplication"],
        search: [yt("how to create a dataset for LLM fine-tuning")],
      },
    ],
    project: {
      id: "p4-proj",
      label: "Major project · Fine-tuned summarizer",
      title: "Fine-tune a small LLM with QLoRA to summarize posts for your Knowledge Sharing Platform. Write the data-prep script in Node, train in Colab.",
      learn: "The headline project of your portfolio.",
      keywords: ["QLoRA", "summarization", "instruction dataset"],
      search: [yt("fine tune LLM for summarization QLoRA")],
    },
  },
  {
    id: "m13",
    week: "Week 17",
    title: "Evaluation and preference tuning",
    goal: "Measure whether your fine-tune actually helped, and learn how models get aligned.",
    tasks: [
      {
        id: "p6-eval",
        title: "Evaluate your fine-tuned LLM",
        learn: "ROUGE for summaries, a held-out test set, before/after comparisons, human ratings and LLM-as-a-judge.",
        keywords: ["ROUGE", "held-out test set", "human evaluation", "LLM-as-a-judge"],
        search: [web("Hugging Face evaluate ROUGE"), yt("LLM evaluation explained"), web("LLM as a judge guide")],
      },
      {
        id: "m13-bench",
        title: "Benchmarks",
        learn: "What MMLU-style benchmarks measure, how to run them, and why contamination matters.",
        keywords: ["lm-evaluation-harness", "MMLU", "benchmark contamination"],
        search: [web("EleutherAI lm-evaluation-harness")],
      },
      {
        id: "m13-dpo",
        title: "Preference tuning (DPO) basics",
        learn: "How chosen/rejected pairs steer a model, and how DPO replaces full RLHF.",
        keywords: ["DPO", "RLHF", "preference dataset", "chosen rejected"],
        search: [yt("DPO direct preference optimization explained"), web("TRL DPO Trainer")],
      },
    ],
    project: {
      id: "m13-proj",
      label: "Mini project · Eval report",
      title: "Compare base vs fine-tuned summarizer on 50 held-out examples with ROUGE and your own 1–5 ratings. Write it up.",
      learn: "Numbers that prove your model works.",
      keywords: ["ROUGE", "before after comparison", "eval report"],
      search: [web("how to evaluate a fine-tuned LLM")],
    },
  },
  {
    id: "m14",
    week: "Week 18",
    title: "Quantize and serve locally",
    goal: "Turn your fine-tuned model into something a Node app can call.",
    nodeTip: "Ollama exposes an HTTP API and an official `ollama` npm package, so your model becomes just another service.",
    tasks: [
      {
        id: "p5-quant",
        title: "Quantization and GGUF",
        learn: "4/8-bit quantization, merging the LoRA adapter, exporting GGUF, the quality vs size trade-off.",
        keywords: ["quantization", "GGUF", "Q4_K_M", "llama.cpp", "merge LoRA adapter"],
        search: [yt("LLM quantization explained"), web("Unsloth save to GGUF"), web("llama.cpp GGUF")],
      },
      {
        id: "p5-serve",
        title: "Serve with Ollama, call it from Node",
        learn: "Write a Modelfile, `ollama create`, use the REST API and stream responses in Node.",
        keywords: ["Ollama Modelfile", "ollama create", "ollama npm", "streaming"],
        search: [web("Ollama import GGUF Modelfile"), web("ollama-js npm"), yt("Ollama Node.js tutorial")],
      },
    ],
    project: {
      id: "p5-proj",
      label: "Final project · Ship it",
      title: "Put your fine-tuned, quantized model behind a Node.js API and use it in a real feature of your portfolio project, end to end.",
      learn: "Data → training → deployment, all yours.",
      keywords: ["Ollama", "Node.js API", "local LLM"],
      search: [yt("build app with Ollama and Node.js")],
    },
  },
  {
    id: "m15",
    week: "Weeks 19–20",
    title: "AI apps with Node: RAG and agents",
    goal: "Where your Node experience pays off most: building products around models.",
    nodeTip: "You already use MongoDB. Atlas Vector Search adds RAG to this exact stack with no new database.",
    tasks: [
      {
        id: "m15-rag",
        title: "Embeddings and RAG",
        learn: "Chunking, embedding, vector search, stuffing retrieved context into the prompt, and when RAG beats fine-tuning.",
        keywords: ["RAG", "chunking", "vector search", "embeddings", "reranking"],
        search: [web("MongoDB Atlas Vector Search RAG tutorial"), yt("RAG from scratch")],
      },
      {
        id: "m15-sdk",
        title: "Vercel AI SDK / LangChain.js",
        learn: "Streaming chat UIs, provider-agnostic model calls, structured output.",
        keywords: ["Vercel AI SDK", "streamText", "LangChain.js", "structured output"],
        search: [web("Vercel AI SDK docs"), web("LangChain.js docs")],
      },
      {
        id: "m15-tools",
        title: "Tool calling and agents",
        learn: "Let a model call your functions, the agent loop, and the Model Context Protocol.",
        keywords: ["function calling", "tool use", "agent loop", "MCP"],
        search: [yt("LLM tool calling explained"), web("Model Context Protocol docs")],
      },
    ],
    project: {
      id: "m15-proj",
      label: "Major project · RAG app",
      title: "Build a Next.js/Node app that answers questions over your own documents with Atlas Vector Search and your Ollama model (or an API model).",
      learn: "The most in-demand AI engineering skill, on a stack you already know.",
      keywords: ["RAG app", "Atlas Vector Search", "Next.js"],
      search: [yt("build RAG app Next.js MongoDB")],
    },
  },
  {
    id: "m16",
    week: "Week 21",
    title: "Becoming an AI developer",
    goal: "Turn what you built into proof someone will hire you for.",
    tasks: [
      {
        id: "p6-writeups",
        title: "Write up every model you trained",
        learn: "A short case study per project with the problem, data, metrics and what you'd do next (GitHub + LinkedIn).",
        keywords: ["ML case study", "project write-up", "model card"],
        search: [web("machine learning portfolio project write-up examples")],
      },
      {
        id: "p6-oss",
        title: "Open one real open-source PR",
        learn: "Hugging Face, Ollama, Transformers.js, etc. Docs fixes count.",
        keywords: ["good first issue", "open source contribution"],
        search: [web("huggingface transformers good first issue"), web("transformers.js good first issue")],
      },
      {
        id: "p6-jobs",
        title: "Read 10–15 AI/ML engineer job posts",
        learn: "List the skills that keep showing up that you don't have yet, and pick the next one to learn.",
        keywords: ["AI engineer", "ML engineer", "LLM engineer"],
        search: [web("AI engineer job description skills")],
      },
    ],
    project: {
      id: "p6-proj",
      label: "Capstone · AI developer portfolio",
      title: "One polished repo or site showing every project, the problem it solved, and the stack.",
      learn: "Everything above, in one link.",
      keywords: ["developer portfolio", "AI projects"],
      search: [web("AI engineer portfolio examples")],
    },
  },
];

export const ALL_ITEM_IDS: string[] = ROADMAP.flatMap((m) => [
  ...m.tasks.map((t) => t.id),
  m.project.id,
]);

// Notes can go on a whole module as well as on each task and project.
export const NOTE_IDS: string[] = [...ROADMAP.map((m) => m.id), ...ALL_ITEM_IDS];

export function searchUrl(s: Search): string {
  const q = encodeURIComponent(s.q);
  return s.on === "yt"
    ? `https://www.youtube.com/results?search_query=${q}`
    : `https://www.google.com/search?q=${q}`;
}
