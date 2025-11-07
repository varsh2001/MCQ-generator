import re
import random
import requests
from typing import List, Dict
from keybert import KeyBERT
from nltk.tokenize import sent_tokenize
from flashtext import KeywordProcessor
from nltk.corpus import wordnet as wn
import nltk

# NLTK downloads (quiet)
for resource in ["punkt", "wordnet", "stopwords"]:
    try:
        nltk.data.find(f"tokenizers/{resource}") if resource == "punkt" else nltk.data.find(f"corpora/{resource}")
    except LookupError:
        nltk.download(resource, quiet=True)

class MCQGenerator:
    def __init__(self):
        # Lightweight sentence-transformers model for keyword extraction
        self.bert = KeyBERT(model="all-MiniLM-L6-v2")  # ~82MB, fast, free-tier friendly

    def extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        try:
            keywords = self.bert.extract_keywords(text, stop_words="english", top_n=top_n)
            return [kw[0] if isinstance(kw, tuple) else kw for kw in keywords]
        except Exception as e:
            print(f"Keyword extraction error: {e}")
            return []

    def tokenize_sentences(self, text: str) -> List[str]:
        try:
            sentences = sent_tokenize(text)
            return [s.strip() for s in sentences if len(s) > 20]
        except Exception as e:
            print(f"Sentence tokenization error: {e}")
            return []

    def get_sentences_for_keyword(self, keywords: List[str], sentences: List[str]) -> Dict[str, List[str]]:
        keyword_processor = KeywordProcessor()
        keyword_sentences = {word: [] for word in keywords}
        for word in keywords:
            keyword_processor.add_keyword(word)
        for sentence in sentences:
            found = keyword_processor.extract_keywords(sentence)
            for key in found:
                keyword_sentences[key].append(sentence)
        return keyword_sentences

    def get_distractors_wordnet(self, syn, word: str) -> List[str]:
        distractors = []
        try:
            hypernym = syn.hypernyms()
            if hypernym:
                for item in hypernym[0].hyponyms():
                    name = item.lemmas()[0].name().replace("_", " ").capitalize()
                    if name.lower() != word.lower() and name not in distractors:
                        distractors.append(name)
        except:
            pass
        return distractors

    def get_wordsense(self, sent: str, word: str):
        try:
            synsets = wn.synsets(word, 'n')
            if not synsets:
                return None
            # Simple Lesk overlap algorithm
            sent_words = set(sent.lower().split())
            best_synset = synsets[0]
            max_overlap = 0
            for syn in synsets:
                context = set((syn.definition() + ' ' + ' '.join(syn.examples())).lower().split())
                overlap = len(sent_words.intersection(context))
                if overlap > max_overlap:
                    best_synset = syn
                    max_overlap = overlap
            return best_synset
        except:
            return None

    def generate_questions(self, text: str, num_questions: int = 5) -> List[Dict]:
        sentences = self.tokenize_sentences(text)
        keywords = self.extract_keywords(text, top_n=num_questions*2)
        mapping = self.get_sentences_for_keyword(keywords, sentences)
        
        questions = []
        for idx, keyword in enumerate(mapping):
            if idx >= num_questions:
                break
            if not mapping[keyword]:
                continue
            sent = mapping[keyword][0]
            syn = self.get_wordsense(sent, keyword)
            distractors = self.get_distractors_wordnet(syn, keyword) if syn else []
            if len(distractors) < 3:
                continue
            all_options = [keyword.capitalize()] + distractors[:3]
            random.shuffle(all_options)
            question_text = re.sub(re.escape(keyword), "_______", sent, flags=re.IGNORECASE)
            questions.append({
                "question": f"{idx+1}. {question_text}",
                "options": all_options,
                "answer": keyword.capitalize()
            })
        return questions
