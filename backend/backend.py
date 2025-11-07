import re
import random
import requests
from typing import List, Dict, Tuple
from summarizer import Summarizer
from keybert import KeyBERT
from nltk.tokenize import sent_tokenize
from flashtext import KeywordProcessor
from nltk.corpus import wordnet as wn
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


class MCQGenerator:
    def __init__(self):
        """Initialize the MCQ generator with required models."""
        self.summarizer = Summarizer()
        self.bert = KeyBERT()
    
    def summarize_text(self, text: str, min_length: int = 60, max_length: int = 500, ratio: float = 0.4) -> str:
        """Summarize the input text using BERT."""
        try:
            result = self.summarizer(text, min_length=min_length, max_length=max_length, ratio=ratio)
            summarized_text = ''.join(result)
            return summarized_text
        except Exception as e:
            print(f"Error in summarization: {e}")
            # Return original text if summarization fails
            return text
    
    def extract_keywords(self, text: str, top_n: int = 15) -> List[str]:
        """Extract keywords from text using KeyBERT."""
        try:
            keywords = self.bert.extract_keywords(text, stop_words="english", top_n=top_n)
            results = []
            for scored_keywords in keywords:
                for keyword in scored_keywords:
                    if isinstance(keyword, str):
                        results.append(keyword)
            return results
        except Exception as e:
            print(f"Error in keyword extraction: {e}")
            return []
    
    def tokenize_sentences(self, text: str) -> List[str]:
        """Tokenize text into sentences."""
        try:
            sentences = [sent_tokenize(text)]
            sentences = [y for x in sentences for y in x]
            sentences = [sentence.strip() for sentence in sentences if len(sentence) > 20]
            return sentences
        except Exception as e:
            print(f"Error in sentence tokenization: {e}")
            return []
    
    def get_sentences_for_keyword(self, keywords: List[str], sentences: List[str]) -> Dict[str, List[str]]:
        """Map keywords to sentences containing them."""
        keyword_processor = KeywordProcessor()
        keyword_sentences = {}
        
        for word in keywords:
            keyword_sentences[word] = []
            keyword_processor.add_keyword(word)
        
        for sentence in sentences:
            keywords_found = keyword_processor.extract_keywords(sentence)
            for key in keywords_found:
                keyword_sentences[key].append(sentence)
        
        for key in keyword_sentences.keys():
            values = keyword_sentences[key]
            values = sorted(values, key=len, reverse=True)
            keyword_sentences[key] = values
        
        return keyword_sentences
    
    def get_distractors_wordnet(self, syn, word: str) -> List[str]:
        """Get distractors from WordNet."""
        distractors = []
        word = word.lower()
        orig_word = word
        
        if len(word.split()) > 0:
            word = word.replace(" ", "_")
        
        try:
            hypernym = syn.hypernyms()
            if len(hypernym) == 0:
                return distractors
            
            for item in hypernym[0].hyponyms():
                name = item.lemmas()[0].name()
                if name == orig_word:
                    continue
                name = name.replace("_", " ")
                name = " ".join(w.capitalize() for w in name.split())
                if name is not None and name not in distractors:
                    distractors.append(name)
        except Exception as e:
            print(f"Error getting WordNet distractors for {word}: {e}")
        
        return distractors
    
    def get_wordsense(self, sent: str, word: str):
        """Get word sense from WordNet using simple Lesk algorithm."""
        word = word.lower()
        
        if len(word.split()) > 0:
            word = word.replace(" ", "_")
        
        try:
            synsets = wn.synsets(word, 'n')
            if not synsets:
                return None
            
            # Simple Lesk algorithm: find synset with most word overlap in definition
            sent_words = set(sent.lower().split())
            best_synset = synsets[0]
            max_overlap = 0
            
            for synset in synsets:
                # Get definition and examples
                definition = synset.definition().lower()
                examples = ' '.join(synset.examples()).lower()
                
                # Get hypernym and hyponym definitions for more context
                hypernym_defs = []
                hyponym_defs = []
                for hyp in synset.hypernyms()[:2]:  # Top 2 hypernyms
                    hypernym_defs.append(hyp.definition().lower())
                for hyp in synset.hyponyms()[:2]:  # Top 2 hyponyms
                    hyponym_defs.append(hyp.definition().lower())
                
                # Combine all context
                context = (definition + ' ' + examples + ' ' + 
                          ' '.join(hypernym_defs) + ' ' + 
                          ' '.join(hyponym_defs)).split()
                
                # Count word overlap
                overlap = len(sent_words.intersection(set(context)))
                if overlap > max_overlap:
                    max_overlap = overlap
                    best_synset = synset
            
            return best_synset
        except Exception as e:
            print(f"Error getting wordsense for {word}: {e}")
            # Return first synset as fallback
            try:
                synsets = wn.synsets(word, 'n')
                if synsets:
                    return synsets[0]
            except:
                pass
            return None
    
    def get_distractors_conceptnet(self, word: str) -> List[str]:
        """Get distractors from ConceptNet."""
        word = word.lower()
        original_word = word
        
        if len(word.split()) > 0:
            word = word.replace(" ", "_")
        
        distractor_list = []
        
        try:
            url = f"http://api.conceptnet.io/query?node=/c/en/{word}/n&rel=/r/PartOf&start=/c/en/{word}&limit=5"
            obj = requests.get(url, timeout=5).json()
            
            for edge in obj.get('edges', []):
                link = edge['end']['term']
                
                url2 = f"http://api.conceptnet.io/query?node={link}&rel=/r/PartOf&end={link}&limit=10"
                obj2 = requests.get(url2, timeout=5).json()
                
                for edge2 in obj2.get('edges', []):
                    word2 = edge2['start']['label']
                    if word2 not in distractor_list and original_word.lower() not in word2.lower():
                        distractor_list.append(word2)
        except Exception as e:
            print(f"ConceptNet error for {word}: {e}")
        
        return distractor_list
    
    def generate_questions(self, text: str, num_questions: int = 10) -> List[Dict]:
        """Generate MCQ questions from text."""
        try:
            # Step 1: Summarize text
            print("Summarizing text...")
            summarized_text = self.summarize_text(text)
            
            if not summarized_text or len(summarized_text) < 50:
                raise ValueError("Summarized text is too short")
            
            # Step 2: Extract keywords
            print("Extracting keywords...")
            key_words = self.extract_keywords(summarized_text, top_n=num_questions * 2)
            
            if not key_words:
                raise ValueError("No keywords extracted")
            
            # Step 3: Tokenize sentences
            print("Tokenizing sentences...")
            sentences = self.tokenize_sentences(summarized_text)
            
            if not sentences:
                raise ValueError("No sentences found")
            
            # Step 4: Map keywords to sentences
            print("Mapping keywords to sentences...")
            keyword_sentence_mapping = self.get_sentences_for_keyword(key_words, sentences)
            
            # Step 5: Generate distractors and questions
            print("Generating distractors...")
            key_distractor_list = {}
            answers = []
            
            for keyword in keyword_sentence_mapping:
                if len(answers) >= num_questions:
                    break
                
                if keyword not in keyword_sentence_mapping or len(keyword_sentence_mapping[keyword]) == 0:
                    continue
                
                wordsense = self.get_wordsense(keyword_sentence_mapping[keyword][0], keyword)
                
                if wordsense:
                    distractors = self.get_distractors_wordnet(wordsense, keyword)
                    if len(distractors) == 0:
                        distractors = self.get_distractors_conceptnet(keyword)
                else:
                    distractors = self.get_distractors_conceptnet(keyword)
                
                if len(distractors) >= 3:  # Need at least 3 distractors for 4 options
                    key_distractor_list[keyword] = distractors
                    answers.append(keyword)
            
            if not key_distractor_list:
                raise ValueError("Could not generate enough distractors")
            
            # Step 6: Create questions
            print("Creating questions...")
            questions = []
            index = 1
            
            for keyword in list(key_distractor_list.keys())[:num_questions]:
                if keyword not in keyword_sentence_mapping or len(keyword_sentence_mapping[keyword]) == 0:
                    continue
                
                sentence = keyword_sentence_mapping[keyword][0]
                pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                output = pattern.sub(" _______ ", sentence)
                
                # Create question
                question_text = f"{index}. {output}"
                
                # Create options
                choices = [keyword.capitalize()] + key_distractor_list[keyword]
                top4choices = choices[:4]
                random.shuffle(top4choices)
                
                # Find correct answer
                correct_answer = keyword.capitalize()
                
                questions.append({
                    'question': question_text,
                    'options': top4choices,
                    'answer': correct_answer
                })
                
                index += 1
            
            return questions
        
        except Exception as e:
            print(f"Error in generate_questions: {e}")
            raise