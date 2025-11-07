import re
import random
from typing import List, Dict
from nltk.tokenize import sent_tokenize
from nltk.corpus import wordnet as wn
import nltk
from transformers import pipeline
from keybert import KeyBERT

# Ensure required NLTK data
for pkg in ['punkt', 'wordnet', 'stopwords']:
    try:
        nltk.data.find(f'tokenizers/{pkg}') if pkg == 'punkt' else nltk.data.find(f'corpora/{pkg}')
    except LookupError:
        nltk.download(pkg, quiet=True)


class MCQGenerator:
    def __init__(self):
        # Lightweight models
        print("Loading lightweight models...")
        self.summarizer = pipeline("summarization", model="t5-small", device=-1)  # CPU
        self.kw_model = KeyBERT(model="distilbert-base-uncased")

    def summarize_text(self, text: str, max_length: int = 150) -> str:
        try:
            summary = self.summarizer(text, max_length=max_length, min_length=50, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            print(f"Summarization error: {e}")
            return text

    def extract_keywords(self, text: str, top_n: int = 5) -> List[str]:
        try:
            keywords = self.kw_model.extract_keywords(text, stop_words='english', top_n=top_n)
            return [k[0] if isinstance(k, tuple) else k for k in keywords]
        except Exception as e:
            print(f"Keyword extraction error: {e}")
            return []

    def tokenize_sentences(self, text: str) -> List[str]:
        sentences = sent_tokenize(text)
        return [s.strip() for s in sentences if len(s) > 20]

    def get_distractors_wordnet(self, word: str) -> List[str]:
        word = word.replace(" ", "_").lower()
        distractors = []
        synsets = wn.synsets(word, 'n')
        if synsets:
            try:
                hypernym = synsets[0].hypernyms()
                if hypernym:
                    for hyponym in hypernym[0].hyponyms():
                        name = hyponym.lemmas()[0].name().replace("_", " ").title()
                        if name.lower() != word and name not in distractors:
                            distractors.append(name)
            except Exception:
                pass
        return distractors

    def generate_questions(self, text: str, num_questions: int = 5) -> List[Dict]:
        questions = []

        # Step 1: Summarize
        summary = self.summarize_text(text)

        # Step 2: Extract keywords
        keywords = self.extract_keywords(summary, top_n=num_questions*2)

        # Step 3: Tokenize sentences
        sentences = self.tokenize_sentences(summary)

        # Step 4: Map keywords to sentences
        keyword_sent_map = {}
        for kw in keywords:
            keyword_sent_map[kw] = [s for s in sentences if kw.lower() in s.lower()]

        # Step 5: Generate questions
        idx = 1
        for kw, sents in keyword_sent_map.items():
            if len(questions) >= num_questions or not sents:
                continue

            sentence = sents[0]
            question_text = re.sub(re.escape(kw), " _______ ", sentence, flags=re.IGNORECASE)

            # Distractors
            distractors = self.get_distractors_wordnet(kw)
            if len(distractors) < 3:
                distractors += [kw + "X", kw + "Y", kw + "Z"]  # fallback

            choices = [kw.title()] + distractors[:3]
            random.shuffle(choices)

            questions.append({
                "question": f"{idx}. {question_text}",
                "options": choices,
                "answer": kw.title()
            })
            idx += 1

        return questions
