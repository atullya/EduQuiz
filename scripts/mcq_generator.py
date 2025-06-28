import nltk
import re
import random
import math
import json
from collections import Counter, defaultdict
from itertools import combinations
import string
import sys
import io

# Ensure stdout is UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Download NLTK resources if needed
for resource in ['punkt', 'stopwords', 'averaged_perceptron_tagger', 'wordnet']:
    try:
        nltk.data.find(f'tokenizers/{resource}') if resource == 'punkt' else nltk.data.find(f'corpora/{resource}')
    except LookupError:
        nltk.download(resource)

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag

class MCQGenerator:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def preprocess_text(self, text):
        text = re.sub(r'\s+', ' ', text.strip())
        text = re.sub(r'[^\w\s\.\!\?\,\;\:]', '', text)
        return text

    def extract_sentences(self, text):
        sentences = sent_tokenize(text)
        return [s for s in sentences if len(s.split()) > 5]

    def extract_keywords(self, text, top_n=10):
        words = word_tokenize(text.lower())
        words = [self.lemmatizer.lemmatize(w) for w in words if w.isalpha() and w not in self.stop_words]
        tf = Counter(words)
        word_count = len(words)
        tf_scores = {w: c / word_count for w, c in tf.items()}

        sentences = self.extract_sentences(text)
        doc_count = len(sentences)
        df = defaultdict(int)
        for s in sentences:
            unique = set(word_tokenize(s.lower()))
            for w in unique:
                if w.isalpha() and w not in self.stop_words:
                    df[self.lemmatizer.lemmatize(w)] += 1

        tfidf = {}
        for w in tf_scores:
            idf = math.log((doc_count + 1) / (1 + df[w])) + 1
            tfidf[w] = tf_scores[w] * idf

        return [w for w, s in sorted(tfidf.items(), key=lambda x: x[1], reverse=True)[:top_n]]

    def generate_mcqs(self, text, num_questions=5):
        text = self.preprocess_text(text)
        sentences = self.extract_sentences(text)

        if len(sentences) < num_questions:
            num_questions = len(sentences)

        selected = random.sample(sentences, num_questions)
        mcqs = []

        for idx, s in enumerate(selected):
            keywords = self.extract_keywords(s, top_n=1)
            if not keywords:
                continue
            answer = keywords[0]
            question = s.replace(answer, "______", 1)
            options = [answer, "Option1", "Option2", "Option3"]
            random.shuffle(options)
            correct = chr(65 + options.index(answer))

            mcqs.append({
                "id": idx + 1,
                "question": question,
                "options": {
                    "A": options[0],
                    "B": options[1],
                    "C": options[2],
                    "D": options[3]
                },
                "correct_answer": correct,
                "explanation": f"From sentence: {s}"
            })

        return {"success": True, "mcqs": mcqs}

def main():
    # Read args
    platform = sys.argv[1] if len(sys.argv) > 1 else "text"
    num_q = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    content = sys.argv[3] if len(sys.argv) > 3 else ""

    generator = MCQGenerator()
    if platform == "text":
        result = generator.generate_mcqs(content, num_q)
    else:
        result = {"success": False, "message": "Unsupported platform"}

    # Only print JSON to stdout
    print(json.dumps(result), flush=True)

if __name__ == "__main__":
    main()
