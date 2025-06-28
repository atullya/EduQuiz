# import nltk
# import re
# import random
# import math
# from collections import Counter, defaultdict
# from itertools import combinations
# import string
# import sys
# import io
# import json

# # Ensure stdout uses UTF-8 encoding
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# # Use stderr for logs/debug info so stdout stays clean for JSON output
# def log(msg):
#     print(msg, file=sys.stderr)

# # Download required NLTK data if not present
# for resource in [
#     'tokenizers/punkt',
#     'corpora/stopwords',
#     'taggers/averaged_perceptron_tagger',
#     'corpora/wordnet'
# ]:
#     try:
#         nltk.data.find(resource)
#     except LookupError:
#         nltk.download(resource.split('/')[-1])

# from nltk.tokenize import sent_tokenize, word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer
# from nltk.tag import pos_tag

# class MCQGenerator:
#     def __init__(self):
#         self.stop_words = set(stopwords.words('english'))
#         self.lemmatizer = WordNetLemmatizer()
#         # Question patterns omitted for brevity, can be added if needed
    
#     def preprocess_text(self, text):
#         text = re.sub(r'\s+', ' ', text.strip())
#         text = re.sub(r'[^\w\s\.\!\?\,\;\:]', '', text)
#         return text
    
#     def extract_sentences(self, text):
#         sentences = sent_tokenize(text)
#         return [s for s in sentences if len(s.split()) > 5]
    
#     def extract_keywords(self, text, top_n=20):
#         words = word_tokenize(text.lower())
#         words = [w for w in words if w.isalpha() and w not in self.stop_words]
#         words = [self.lemmatizer.lemmatize(w) for w in words]
#         word_count = len(words)
#         tf = Counter(words)
#         tf_scores = {w: c / word_count for w, c in tf.items()}
#         sentences = self.extract_sentences(text)
#         doc_count = len(sentences)
#         df = defaultdict(int)
#         for sentence in sentences:
#             sentence_words = set(word_tokenize(sentence.lower()))
#             sentence_words = {w for w in sentence_words if w.isalpha() and w not in self.stop_words}
#             sentence_words = {self.lemmatizer.lemmatize(w) for w in sentence_words}
#             for w in sentence_words:
#                 df[w] += 1
#         tfidf_scores = {}
#         for w in tf_scores:
#             if df[w] > 0:
#                 idf = math.log(doc_count / df[w])
#                 tfidf_scores[w] = tf_scores[w] * idf
#         top_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
#         return [w for w, s in top_keywords]
    
#     def extract_named_entities(self, text):
#         sentences = sent_tokenize(text)
#         entities = []
#         for sentence in sentences:
#             words = word_tokenize(sentence)
#             pos_tags = pos_tag(words)
#             current_entity = []
#             for word, tag in pos_tags:
#                 if tag in ['NNP', 'NNPS']:
#                     current_entity.append(word)
#                 elif tag in ['NN', 'NNS'] and current_entity:
#                     current_entity.append(word)
#                 else:
#                     if current_entity and len(current_entity) >= 1:
#                         entities.append(' '.join(current_entity))
#                     current_entity = []
#             if current_entity and len(current_entity) >= 1:
#                 entities.append(' '.join(current_entity))
#         entities = list(set(entities))
#         entities = [e for e in entities if len(e.split()) <= 3 and len(e) > 2]
#         return entities
    
#     def calculate_cosine_similarity(self, text1, text2):
#         words1 = word_tokenize(text1.lower())
#         words2 = word_tokenize(text2.lower())
#         words1 = [w for w in words1 if w.isalpha() and w not in self.stop_words]
#         words2 = [w for w in words2 if w.isalpha() and w not in self.stop_words]
#         words1 = [self.lemmatizer.lemmatize(w) for w in words1]
#         words2 = [self.lemmatizer.lemmatize(w) for w in words2]
#         vocab = set(words1 + words2)
#         if not vocab:
#             return 0.0
#         vec1 = [words1.count(w) for w in vocab]
#         vec2 = [words2.count(w) for w in vocab]
#         dot_product = sum(a * b for a, b in zip(vec1, vec2))
#         magnitude1 = math.sqrt(sum(a * a for a in vec1))
#         magnitude2 = math.sqrt(sum(a * a for a in vec2))
#         if magnitude1 == 0 or magnitude2 == 0:
#             return 0.0
#         return dot_product / (magnitude1 * magnitude2)
    
#     def generate_distractors(self, correct_answer, context, num_distractors=3):
#         distractors = []
#         keywords = self.extract_keywords(context, top_n=30)
#         entities = self.extract_named_entities(context)
#         candidates = keywords + entities
#         candidates = [c for c in candidates if c.lower() != correct_answer.lower()]
#         scored_candidates = []
#         for candidate in candidates:
#             context_sim = self.calculate_cosine_similarity(candidate, context)
#             answer_sim = self.calculate_cosine_similarity(candidate, correct_answer)
#             score = context_sim - (answer_sim * 0.5)
#             scored_candidates.append((candidate, score))
#         scored_candidates.sort(key=lambda x: x[1], reverse=True)
#         for candidate, score in scored_candidates:
#             if len(distractors) >= num_distractors:
#                 break
#             is_similar = False
#             for existing in distractors:
#                 if self.calculate_cosine_similarity(candidate, existing) > 0.7:
#                     is_similar = True
#                     break
#             if not is_similar:
#                 distractors.append(candidate)
#         generic_options = [
#             "None of the above",
#             "All of the above",
#             "Cannot be determined",
#             "Not mentioned in the text"
#         ]
#         while len(distractors) < num_distractors:
#             for option in generic_options:
#                 if option not in distractors and len(distractors) < num_distractors:
#                     distractors.append(option)
#         return distractors[:num_distractors]
    
#     def generate_question_from_sentence(self, sentence, context):
#         words = word_tokenize(sentence)
#         pos_tags = pos_tag(words)
#         important_terms = [word for word, tag in pos_tags if tag in ['NN', 'NNS', 'NNP', 'NNPS'] and word.lower() not in self.stop_words]
#         if not important_terms:
#             return None
#         term_scores = {}
#         for term in important_terms:
#             position_score = 1.0 - (words.index(term) / len(words))
#             frequency_score = context.lower().count(term.lower()) / len(context.split())
#             term_scores[term] = position_score + frequency_score
#         if not term_scores:
#             return None
#         correct_answer = max(term_scores.items(), key=lambda x: x[1])[0]
#         question_sentence = sentence.replace(correct_answer, "______")
#         if question_sentence == sentence:
#             patterns = [
#                 f"What is mentioned as {correct_answer} in the text?",
#                 f"According to the text, what refers to {correct_answer}?",
#                 f"Which term is described as {correct_answer}?"
#             ]
#             question_sentence = random.choice(patterns)
#         distractors = self.generate_distractors(correct_answer, context)
#         return {
#             'question': question_sentence,
#             'correct_answer': correct_answer,
#             'distractors': distractors,
#             'source_sentence': sentence
#         }
    
#     def generate_mcqs(self, text, num_questions=5):
#         # No print statements here — keep stdout clean for JSON output
#         text = self.preprocess_text(text)
#         sentences = self.extract_sentences(text)
#         if len(sentences) < num_questions:
#             num_questions = len(sentences)
#         selected_sentences = self.select_diverse_sentences(sentences, num_questions)
#         mcqs = []
#         for i, sentence in enumerate(selected_sentences):
#             mcq = self.generate_question_from_sentence(sentence, text)
#             if mcq:
#                 options = [mcq['correct_answer']] + mcq['distractors']
#                 random.shuffle(options)
#                 correct_index = options.index(mcq['correct_answer'])
#                 correct_letter = chr(65 + correct_index)
#                 formatted_mcq = {
#                     'id': i + 1,
#                     'question': mcq['question'],
#                     'options': {
#                         'A': options[0],
#                         'B': options[1],
#                         'C': options[2] if len(options) > 2 else "None of the above",
#                         'D': options[3] if len(options) > 3 else "All of the above"
#                     },
#                     'correct_answer': correct_letter,
#                     'explanation': f"Based on: {mcq['source_sentence']}"
#                 }
#                 mcqs.append(formatted_mcq)
#         return mcqs
    
#     def select_diverse_sentences(self, sentences, num_questions):
#         if len(sentences) <= num_questions:
#             return sentences
#         selected = []
#         remaining = sentences.copy()
#         first_sentence = random.choice(remaining)
#         selected.append(first_sentence)
#         remaining.remove(first_sentence)
#         while len(selected) < num_questions and remaining:
#             best_sentence = None
#             best_score = -1
#             for sentence in remaining:
#                 similarities = [self.calculate_cosine_similarity(sentence, s) for s in selected]
#                 avg_similarity = sum(similarities) / len(similarities)
#                 diversity_score = 1 - avg_similarity
#                 if diversity_score > best_score:
#                     best_score = diversity_score
#                     best_sentence = sentence
#             if best_sentence:
#                 selected.append(best_sentence)
#                 remaining.remove(best_sentence)
#         return selected

# def main():
    # sample_text = """
    # Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines. 
    # Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. 
    # Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns. 
    # Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language. 
    # Computer vision is another important area of AI that enables machines to interpret and understand visual information from the world. 
    # Robotics combines AI with mechanical engineering to create autonomous machines that can perform tasks in the physical world. 
    # The Turing Test, proposed by Alan Turing in 1950, is a test of a machine's ability to exhibit intelligent behavior equivalent to human intelligence. 
    # Supervised learning is a type of machine learning where algorithms learn from labeled training data. 
    # Unsupervised learning involves finding patterns in data without labeled examples. 
    # Reinforcement learning is a type of machine learning where agents learn to make decisions by receiving rewards or penalties for their actions.
    # """
    
#     generator = MCQGenerator()
#     mcqs = generator.generate_mcqs(sample_text, num_questions=5)
    
#     # Output only JSON to stdout
#     print(json.dumps({
#         "success": True,
#         "mcqs": mcqs,
#         "total_generated": len(mcqs)
#     }, ensure_ascii=False, indent=2))

# if __name__ == "__main__":
#     main()
import nltk
import re
import random
import math
import sys
import io
import json
from collections import Counter, defaultdict

# Ensure UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Download NLTK resources if needed
for resource in [
    'tokenizers/punkt',
    'corpora/stopwords',
    'taggers/averaged_perceptron_tagger',
    'corpora/wordnet'
]:
    try:
        nltk.data.find(resource)
    except LookupError:
        nltk.download(resource.split('/')[-1])

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
        return [s for s in sent_tokenize(text) if len(s.split()) > 5]

    def generate_mcqs(self, text, num_questions=5):
        text = self.preprocess_text(text)
        sentences = self.extract_sentences(text)
        if not sentences:
            return []

        if len(sentences) < num_questions:
            num_questions = len(sentences)

        selected = random.sample(sentences, num_questions)
        mcqs = []
        for i, s in enumerate(selected):
            words = [w for w in word_tokenize(s) if w.isalpha() and w.lower() not in self.stop_words]
            if not words:
                continue
            answer = random.choice(words)
            question = s.replace(answer, "______", 1)
            options = [answer, "Option1", "Option2", "Option3"]
            random.shuffle(options)
            correct = chr(65 + options.index(answer))
            mcqs.append({
                "id": i + 1,
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
        return mcqs

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "Missing args"}))
        return

    platform = sys.argv[1]
    content = sys.argv[2]
    num_q = int(sys.argv[3]) if len(sys.argv) > 3 else 5

    text = ""
    if platform == "text":
        text = content
    elif platform == "pdf":
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(content)
            text = " ".join(page.get_text() for page in doc)
        except Exception as e:
            print(json.dumps({"success": False, "message": f"PDF error: {str(e)}"}))
            return
    else:
        print(json.dumps({"success": False, "message": "Unsupported platform"}))
        return

    generator = MCQGenerator()
    mcqs = generator.generate_mcqs(text, num_q)
    print(json.dumps({"success": True, "mcqs": mcqs, "total_generated": len(mcqs)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
