# # import nltk
# # import re
# # import random
# # import math
# # from collections import Counter, defaultdict
# # from itertools import combinations
# # import string
# # import sys
# # import io
# # import json

# # # Ensure stdout uses UTF-8 encoding
# # sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# # # Use stderr for logs/debug info so stdout stays clean for JSON output
# # def log(msg):
# #     print(msg, file=sys.stderr)

# # # Download required NLTK data if not present
# # for resource in [
# #     'tokenizers/punkt',
# #     'corpora/stopwords',
# #     'taggers/averaged_perceptron_tagger',
# #     'corpora/wordnet'
# # ]:
# #     try:
# #         nltk.data.find(resource)
# #     except LookupError:
# #         nltk.download(resource.split('/')[-1])

# # from nltk.tokenize import sent_tokenize, word_tokenize
# # from nltk.corpus import stopwords
# # from nltk.stem import WordNetLemmatizer
# # from nltk.tag import pos_tag

# # class MCQGenerator:
# #     def __init__(self):
# #         self.stop_words = set(stopwords.words('english'))
# #         self.lemmatizer = WordNetLemmatizer()
# #         # Question patterns omitted for brevity, can be added if needed
    
# #     def preprocess_text(self, text):
# #         text = re.sub(r'\s+', ' ', text.strip())
# #         text = re.sub(r'[^\w\s\.\!\?\,\;\:]', '', text)
# #         return text
    
# #     def extract_sentences(self, text):
# #         sentences = sent_tokenize(text)
# #         return [s for s in sentences if len(s.split()) > 5]
    
# #     def extract_keywords(self, text, top_n=20):
# #         words = word_tokenize(text.lower())
# #         words = [w for w in words if w.isalpha() and w not in self.stop_words]
# #         words = [self.lemmatizer.lemmatize(w) for w in words]
# #         word_count = len(words)
# #         tf = Counter(words)
# #         tf_scores = {w: c / word_count for w, c in tf.items()}
# #         sentences = self.extract_sentences(text)
# #         doc_count = len(sentences)
# #         df = defaultdict(int)
# #         for sentence in sentences:
# #             sentence_words = set(word_tokenize(sentence.lower()))
# #             sentence_words = {w for w in sentence_words if w.isalpha() and w not in self.stop_words}
# #             sentence_words = {self.lemmatizer.lemmatize(w) for w in sentence_words}
# #             for w in sentence_words:
# #                 df[w] += 1
# #         tfidf_scores = {}
# #         for w in tf_scores:
# #             if df[w] > 0:
# #                 idf = math.log(doc_count / df[w])
# #                 tfidf_scores[w] = tf_scores[w] * idf
# #         top_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
# #         return [w for w, s in top_keywords]
    
# #     def extract_named_entities(self, text):
# #         sentences = sent_tokenize(text)
# #         entities = []
# #         for sentence in sentences:
# #             words = word_tokenize(sentence)
# #             pos_tags = pos_tag(words)
# #             current_entity = []
# #             for word, tag in pos_tags:
# #                 if tag in ['NNP', 'NNPS']:
# #                     current_entity.append(word)
# #                 elif tag in ['NN', 'NNS'] and current_entity:
# #                     current_entity.append(word)
# #                 else:
# #                     if current_entity and len(current_entity) >= 1:
# #                         entities.append(' '.join(current_entity))
# #                     current_entity = []
# #             if current_entity and len(current_entity) >= 1:
# #                 entities.append(' '.join(current_entity))
# #         entities = list(set(entities))
# #         entities = [e for e in entities if len(e.split()) <= 3 and len(e) > 2]
# #         return entities
    
# #     def calculate_cosine_similarity(self, text1, text2):
# #         words1 = word_tokenize(text1.lower())
# #         words2 = word_tokenize(text2.lower())
# #         words1 = [w for w in words1 if w.isalpha() and w not in self.stop_words]
# #         words2 = [w for w in words2 if w.isalpha() and w not in self.stop_words]
# #         words1 = [self.lemmatizer.lemmatize(w) for w in words1]
# #         words2 = [self.lemmatizer.lemmatize(w) for w in words2]
# #         vocab = set(words1 + words2)
# #         if not vocab:
# #             return 0.0
# #         vec1 = [words1.count(w) for w in vocab]
# #         vec2 = [words2.count(w) for w in vocab]
# #         dot_product = sum(a * b for a, b in zip(vec1, vec2))
# #         magnitude1 = math.sqrt(sum(a * a for a in vec1))
# #         magnitude2 = math.sqrt(sum(a * a for a in vec2))
# #         if magnitude1 == 0 or magnitude2 == 0:
# #             return 0.0
# #         return dot_product / (magnitude1 * magnitude2)
    
# #     def generate_distractors(self, correct_answer, context, num_distractors=3):
# #         distractors = []
# #         keywords = self.extract_keywords(context, top_n=30)
# #         entities = self.extract_named_entities(context)
# #         candidates = keywords + entities
# #         candidates = [c for c in candidates if c.lower() != correct_answer.lower()]
# #         scored_candidates = []
# #         for candidate in candidates:
# #             context_sim = self.calculate_cosine_similarity(candidate, context)
# #             answer_sim = self.calculate_cosine_similarity(candidate, correct_answer)
# #             score = context_sim - (answer_sim * 0.5)
# #             scored_candidates.append((candidate, score))
# #         scored_candidates.sort(key=lambda x: x[1], reverse=True)
# #         for candidate, score in scored_candidates:
# #             if len(distractors) >= num_distractors:
# #                 break
# #             is_similar = False
# #             for existing in distractors:
# #                 if self.calculate_cosine_similarity(candidate, existing) > 0.7:
# #                     is_similar = True
# #                     break
# #             if not is_similar:
# #                 distractors.append(candidate)
# #         generic_options = [
# #             "None of the above",
# #             "All of the above",
# #             "Cannot be determined",
# #             "Not mentioned in the text"
# #         ]
# #         while len(distractors) < num_distractors:
# #             for option in generic_options:
# #                 if option not in distractors and len(distractors) < num_distractors:
# #                     distractors.append(option)
# #         return distractors[:num_distractors]
    
# #     def generate_question_from_sentence(self, sentence, context):
# #         words = word_tokenize(sentence)
# #         pos_tags = pos_tag(words)
# #         important_terms = [word for word, tag in pos_tags if tag in ['NN', 'NNS', 'NNP', 'NNPS'] and word.lower() not in self.stop_words]
# #         if not important_terms:
# #             return None
# #         term_scores = {}
# #         for term in important_terms:
# #             position_score = 1.0 - (words.index(term) / len(words))
# #             frequency_score = context.lower().count(term.lower()) / len(context.split())
# #             term_scores[term] = position_score + frequency_score
# #         if not term_scores:
# #             return None
# #         correct_answer = max(term_scores.items(), key=lambda x: x[1])[0]
# #         question_sentence = sentence.replace(correct_answer, "______")
# #         if question_sentence == sentence:
# #             patterns = [
# #                 f"What is mentioned as {correct_answer} in the text?",
# #                 f"According to the text, what refers to {correct_answer}?",
# #                 f"Which term is described as {correct_answer}?"
# #             ]
# #             question_sentence = random.choice(patterns)
# #         distractors = self.generate_distractors(correct_answer, context)
# #         return {
# #             'question': question_sentence,
# #             'correct_answer': correct_answer,
# #             'distractors': distractors,
# #             'source_sentence': sentence
# #         }
    
# #     def generate_mcqs(self, text, num_questions=5):
# #         # No print statements here — keep stdout clean for JSON output
# #         text = self.preprocess_text(text)
# #         sentences = self.extract_sentences(text)
# #         if len(sentences) < num_questions:
# #             num_questions = len(sentences)
# #         selected_sentences = self.select_diverse_sentences(sentences, num_questions)
# #         mcqs = []
# #         for i, sentence in enumerate(selected_sentences):
# #             mcq = self.generate_question_from_sentence(sentence, text)
# #             if mcq:
# #                 options = [mcq['correct_answer']] + mcq['distractors']
# #                 random.shuffle(options)
# #                 correct_index = options.index(mcq['correct_answer'])
# #                 correct_letter = chr(65 + correct_index)
# #                 formatted_mcq = {
# #                     'id': i + 1,
# #                     'question': mcq['question'],
# #                     'options': {
# #                         'A': options[0],
# #                         'B': options[1],
# #                         'C': options[2] if len(options) > 2 else "None of the above",
# #                         'D': options[3] if len(options) > 3 else "All of the above"
# #                     },
# #                     'correct_answer': correct_letter,
# #                     'explanation': f"Based on: {mcq['source_sentence']}"
# #                 }
# #                 mcqs.append(formatted_mcq)
# #         return mcqs
    
# #     def select_diverse_sentences(self, sentences, num_questions):
# #         if len(sentences) <= num_questions:
# #             return sentences
# #         selected = []
# #         remaining = sentences.copy()
# #         first_sentence = random.choice(remaining)
# #         selected.append(first_sentence)
# #         remaining.remove(first_sentence)
# #         while len(selected) < num_questions and remaining:
# #             best_sentence = None
# #             best_score = -1
# #             for sentence in remaining:
# #                 similarities = [self.calculate_cosine_similarity(sentence, s) for s in selected]
# #                 avg_similarity = sum(similarities) / len(similarities)
# #                 diversity_score = 1 - avg_similarity
# #                 if diversity_score > best_score:
# #                     best_score = diversity_score
# #                     best_sentence = sentence
# #             if best_sentence:
# #                 selected.append(best_sentence)
# #                 remaining.remove(best_sentence)
# #         return selected

# # def main():
#     # sample_text = """
#     # Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines. 
#     # Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. 
#     # Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns. 
#     # Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language. 
#     # Computer vision is another important area of AI that enables machines to interpret and understand visual information from the world. 
#     # Robotics combines AI with mechanical engineering to create autonomous machines that can perform tasks in the physical world. 
#     # The Turing Test, proposed by Alan Turing in 1950, is a test of a machine's ability to exhibit intelligent behavior equivalent to human intelligence. 
#     # Supervised learning is a type of machine learning where algorithms learn from labeled training data. 
#     # Unsupervised learning involves finding patterns in data without labeled examples. 
#     # Reinforcement learning is a type of machine learning where agents learn to make decisions by receiving rewards or penalties for their actions.
#     # """
    
# #     generator = MCQGenerator()
# #     mcqs = generator.generate_mcqs(sample_text, num_questions=5)
    
# #     # Output only JSON to stdout
# #     print(json.dumps({
# #         "success": True,
# #         "mcqs": mcqs,
# #         "total_generated": len(mcqs)
# #     }, ensure_ascii=False, indent=2))

# # if __name__ == "__main__":
# #     main()
# # import nltk
# # import re
# # import random
# # import math
# # import sys
# # import io
# # import json
# # from collections import Counter, defaultdict

# # # Ensure UTF-8 output
# # sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# # # Download NLTK resources if needed
# # for resource in [
# #     'tokenizers/punkt',
# #     'corpora/stopwords',
# #     'taggers/averaged_perceptron_tagger',
# #     'corpora/wordnet'
# # ]:
# #     try:
# #         nltk.data.find(resource)
# #     except LookupError:
# #         nltk.download(resource.split('/')[-1])

# # from nltk.tokenize import sent_tokenize, word_tokenize
# # from nltk.corpus import stopwords
# # from nltk.stem import WordNetLemmatizer
# # from nltk.tag import pos_tag

# # class MCQGenerator:
# #     def __init__(self):
# #         self.stop_words = set(stopwords.words('english'))
# #         self.lemmatizer = WordNetLemmatizer()

# #     def preprocess_text(self, text):
# #         text = re.sub(r'\s+', ' ', text.strip())
# #         text = re.sub(r'[^\w\s\.\!\?\,\;\:]', '', text)
# #         return text

# #     def extract_sentences(self, text):
# #         return [s for s in sent_tokenize(text) if len(s.split()) > 5]

# #     def generate_mcqs(self, text, num_questions=5):
# #         text = self.preprocess_text(text)
# #         sentences = self.extract_sentences(text)
# #         if not sentences:
# #             return []

# #         if len(sentences) < num_questions:
# #             num_questions = len(sentences)

# #         selected = random.sample(sentences, num_questions)
# #         mcqs = []
# #         for i, s in enumerate(selected):
# #             words = [w for w in word_tokenize(s) if w.isalpha() and w.lower() not in self.stop_words]
# #             if not words:
# #                 continue
# #             answer = random.choice(words)
# #             question = s.replace(answer, "______", 1)
# #             options = [answer, "Option1", "Option2", "Option3"]
# #             random.shuffle(options)
# #             correct = chr(65 + options.index(answer))
# #             mcqs.append({
# #                 "id": i + 1,
# #                 "question": question,
# #                 "options": {
# #                     "A": options[0],
# #                     "B": options[1],
# #                     "C": options[2],
# #                     "D": options[3]
# #                 },
# #                 "correct_answer": correct,
# #                 "explanation": f"From sentence: {s}"
# #             })
# #         return mcqs

# # def main():
# #     if len(sys.argv) < 3:
# #         print(json.dumps({"success": False, "message": "Missing args"}))
# #         return

# #     platform = sys.argv[1]
# #     content = sys.argv[2]
# #     num_q = int(sys.argv[3]) if len(sys.argv) > 3 else 5

# #     text = ""
# #     if platform == "text":
# #         text = content
# #     elif platform == "pdf":
# #         try:
# #             import fitz  # PyMuPDF
# #             doc = fitz.open(content)
# #             text = " ".join(page.get_text() for page in doc)
# #         except Exception as e:
# #             print(json.dumps({"success": False, "message": f"PDF error: {str(e)}"}))
# #             return
# #     else:
# #         print(json.dumps({"success": False, "message": "Unsupported platform"}))
# #         return

# #     generator = MCQGenerator()
# #     mcqs = generator.generate_mcqs(text, num_q)
# #     print(json.dumps({"success": True, "mcqs": mcqs, "total_generated": len(mcqs)}, ensure_ascii=False))

# # if __name__ == "__main__":
# #     main()











# import sys
# import os
# import re
# import random
# import json
# import numpy as np
# import nltk
# import fitz  # PyMuPDF
# from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer
# from nltk import pos_tag, word_tokenize, ne_chunk, sent_tokenize
# from transformers import T5Tokenizer, T5ForConditionalGeneration
# from collections import Counter
# from difflib import SequenceMatcher

# # Download required nltk data (run once)
# for resource in [
#     'punkt', 'stopwords', 'wordnet',
#     'averaged_perceptron_tagger', 'maxent_ne_chunker', 'words'
# ]:
#     try:
#         nltk.data.find(resource)
#     except LookupError:
#         nltk.download(resource)

# # Initialize globals once
# stop_words = set(stopwords.words('english'))
# lemmatizer = WordNetLemmatizer()
# tokenizer = T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl")
# model = T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl")

# def read_pdf_text(file_path):
#     if not os.path.exists(file_path):
#         raise FileNotFoundError(f"PDF file not found: {file_path}")
#     doc = fitz.open(file_path)
#     text = ""
#     for page in doc:
#         text += page.get_text()
#     return text

# def preprocess(text):
#     text = text.lower()
#     text = re.sub(r"[^a-z\s]", " ", text)
#     tokens = nltk.word_tokenize(text)
#     tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words and len(t) > 2]
#     return tokens

# def extract_named_entities(text):
#     tokens = word_tokenize(text)
#     tagged = pos_tag(tokens)
#     tree = ne_chunk(tagged, binary=False)
#     entities = set()
#     for subtree in tree:
#         if hasattr(subtree, 'label') and subtree.label() in ['PERSON', 'ORGANIZATION', 'GPE', 'LOCATION', 'FACILITY']:
#             entity = ' '.join([token for token, pos in subtree.leaves()])
#             if len(entity) > 1:
#                 entities.add(entity)
#     return list(entities)

# def compute_tf(tokens):
#     tf = {}
#     for word in tokens:
#         tf[word] = tf.get(word, 0) + 1
#     total = len(tokens)
#     for word in tf:
#         tf[word] /= total
#     return tf

# def compute_tf_idf(tf, idf):
#     return {word: tf[word] * idf.get(word, 0.0) for word in tf}

# def cosine_similarity(vec1, vec2):
#     words = set(vec1.keys()).union(set(vec2.keys()))
#     v1 = np.array([vec1.get(w, 0.0) for w in words])
#     v2 = np.array([vec2.get(w, 0.0) for w in words])
#     dot = np.dot(v1, v2)
#     norm1 = np.linalg.norm(v1)
#     norm2 = np.linalg.norm(v2)
#     return dot / (norm1 * norm2) if norm1 and norm2 else 0.0

# def generate_distractors(answer, context, idf, required=3):
#     answer_tokens = preprocess(answer)
#     context_tokens = preprocess(context)
#     answer_vec = compute_tf_idf(compute_tf(answer_tokens), idf)
#     distractors = []
#     used_words = set([t.lower() for t in answer_tokens])

#     for word in set(context_tokens):
#         if word in used_words or word in answer.lower() or answer.lower() in word:
#             continue
#         word_vec = compute_tf_idf(compute_tf([word]), idf)
#         sim = cosine_similarity(answer_vec, word_vec)
#         if 0.1 < sim < 0.9:
#             distractors.append((word, sim))

#     distractors = sorted(distractors, key=lambda x: -x[1])
#     distractor_words = [w for w, _ in distractors]

#     if len(distractor_words) < required:
#         extras = list(set(context_tokens) - set(distractor_words) - set(answer_tokens))
#         random.shuffle(extras)
#         distractor_words += extras[:required - len(distractor_words)]

#     return distractor_words[:required]

# def get_relevant_sentence(text, answer):
#     sentences = sent_tokenize(text)
#     for sent in sentences:
#         if answer.lower() in sent.lower():
#             return sent
#     return text

# def generate_question_rule_based(sentence, answer):
#     if answer.istitle():
#         return f"Who is {answer}?"
#     elif any(word in answer.lower() for word in ['village', 'city', 'place', 'school', 'forest']):
#         return f"Where is {answer} located?"
#     else:
#         return f"What is {answer}?"

# def generate_question_with_fallback(context, answer):
#     sentence = get_relevant_sentence(context, answer)
#     pattern = re.compile(re.escape(answer), re.IGNORECASE)
#     highlighted_sentence = pattern.sub(f"<hl>{answer}</hl>", sentence, count=1)
#     input_text = f"generate question: {highlighted_sentence} answer: {answer}"
#     input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
#     output_ids = model.generate(input_ids, max_length=64, num_beams=4, early_stopping=True)
#     question = tokenizer.decode(output_ids[0], skip_special_tokens=True)

#     if not question or answer.lower() in question.lower():
#         question = generate_question_rule_based(sentence, answer)
#     return question

# def is_similar(q1, q2, threshold=0.85):
#     return SequenceMatcher(None, q1.lower(), q2.lower()).ratio() >= threshold

# def generate_mcqs_from_text(text, desired_mcq_count=5):
#     candidate_answers = extract_named_entities(text)
#     if len(candidate_answers) < desired_mcq_count:
#         freq_words = Counter(preprocess(text)).most_common(50)
#         for word, _ in freq_words:
#             if word not in candidate_answers and word.isalpha() and len(word) > 2:
#                 candidate_answers.append(word)

#     idf = {word: 1.0 for word in preprocess(text)}
#     mcqs = []
#     used_questions = []

#     for answer in candidate_answers:
#         if len(mcqs) >= desired_mcq_count:
#             break
#         # if len(answer.split()) > 5 or len(answer) < 2:
#         if len(answer.split()) > 10:  # Allow longer answers
#             continue

#         distractors = generate_distractors(answer, text, idf, required=3)
#         if len(set(distractors)) < 3:
#             continue

#         question = generate_question_with_fallback(text, answer)
#         if any(is_similar(question, existing_q) for existing_q in used_questions):
#             continue

#         options = distractors[:3] + [answer]
#         random.shuffle(options)

#         mcqs.append({
#             "question": question,
#             "options": {
#                 "A": options[0],
#                 "B": options[1],
#                 "C": options[2],
#                 "D": options[3]
#             },
#             "correct_answer": next(k for k,v in zip(["A","B","C","D"], options) if v == answer),
#             "answer": answer,
#             "explanation": f"Answer found in text context."
#         })
#         used_questions.append(question)

#     return mcqs

# def main():
#     if len(sys.argv) < 3:
#         print(json.dumps({"success": False, "message": "Missing arguments: platform and content/path required"}))
#         return

#     platform = sys.argv[1].lower()
#     content = sys.argv[2]
#     num_q = int(sys.argv[3]) if len(sys.argv) > 3 else 5

#     try:
#         if platform == "pdf":
#             text = read_pdf_text(content)
#         elif platform == "text":
#             text = content
#         else:
#             print(json.dumps({"success": False, "message": "Unsupported platform: use 'text' or 'pdf'"}))
#             return

#         mcqs = generate_mcqs_from_text(text, desired_mcq_count=num_q)
#         print(json.dumps({"success": True, "mcqs": mcqs, "total_generated": len(mcqs)}, ensure_ascii=False))
#     except Exception as e:
#         print(json.dumps({"success": False, "message": str(e)}))


# if __name__ == "__main__":
#     main()









import os
import sys
import re
import json
import random
import numpy as np
import nltk
import fitz  # PyMuPDF
from collections import Counter
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, word_tokenize, ne_chunk, sent_tokenize
from transformers import T5Tokenizer, T5ForConditionalGeneration
from difflib import SequenceMatcher

# ========= ENVIRONMENT CLEANUP =========
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow INFO and WARNING logs

# ========= NLTK DOWNLOAD IF MISSING =========
def ensure_nltk_data():
    resources = {
        'punkt': 'tokenizers/punkt',
        'stopwords': 'corpora/stopwords',
        'wordnet': 'corpora/wordnet',
        'averaged_perceptron_tagger': 'taggers/averaged_perceptron_tagger',
        'maxent_ne_chunker': 'chunkers/maxent_ne_chunker',
        'words': 'corpora/words'
    }
    for key, path in resources.items():
        try:
            nltk.data.find(path)
        except LookupError:
            nltk.download(key)

ensure_nltk_data()

# ========= LOAD MODELS =========
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
tokenizer = T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl", legacy=False)
model = T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl")

# ========= HELPER FUNCTIONS =========
def read_pdf_text(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    doc = fitz.open(file_path)
    return " ".join(page.get_text() for page in doc)

def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    tokens = word_tokenize(text)
    return [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words and len(t) > 2]

def extract_named_entities(text):
    tree = ne_chunk(pos_tag(word_tokenize(text)))
    entities = set()
    for subtree in tree:
        if hasattr(subtree, 'label') and subtree.label() in ['PERSON', 'ORGANIZATION', 'GPE', 'LOCATION', 'FACILITY']:
            entity = ' '.join(token for token, _ in subtree.leaves())
            if len(entity) > 1:
                entities.add(entity)
    return list(entities)

def compute_tf(tokens):
    tf = {}
    for word in tokens:
        tf[word] = tf.get(word, 0) + 1
    total = len(tokens)
    return {word: tf[word] / total for word in tf}

def compute_tf_idf(tf, idf):
    return {word: tf[word] * idf.get(word, 0.0) for word in tf}

def cosine_similarity(vec1, vec2):
    all_words = set(vec1.keys()).union(vec2.keys())
    v1 = np.array([vec1.get(w, 0.0) for w in all_words])
    v2 = np.array([vec2.get(w, 0.0) for w in all_words])
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-10)

def generate_distractors(answer, context, idf, required=3):
    answer_tokens = preprocess(answer)
    context_tokens = preprocess(context)
    answer_vec = compute_tf_idf(compute_tf(answer_tokens), idf)
    distractors = []
    used_words = set(t.lower() for t in answer_tokens)

    for word in set(context_tokens):
        if word in used_words or word in answer.lower() or answer.lower() in word:
            continue
        word_vec = compute_tf_idf(compute_tf([word]), idf)
        sim = cosine_similarity(answer_vec, word_vec)
        if 0.1 < sim < 0.9:
            distractors.append((word, sim))

    distractors = sorted(distractors, key=lambda x: -x[1])
    distractor_words = [w for w, _ in distractors]

    if len(distractor_words) < required:
        extras = list(set(context_tokens) - set(distractor_words) - set(answer_tokens))
        random.shuffle(extras)
        distractor_words += extras[:required - len(distractor_words)]

    return distractor_words[:required]

def get_relevant_sentence(text, answer):
    for sent in sent_tokenize(text):
        if answer.lower() in sent.lower():
            return sent
    return text

def generate_question_with_fallback(context, answer):
    sentence = get_relevant_sentence(context, answer)
    input_text = f"generate question: <hl> {answer} </hl> {sentence}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    output_ids = model.generate(input_ids, max_length=64, num_beams=4, early_stopping=True)
    question = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    if not question or answer.lower() in question.lower():
        question = f"What is {answer}?"
    return question

def is_similar(q1, q2, threshold=0.85):
    return SequenceMatcher(None, q1.lower(), q2.lower()).ratio() >= threshold

def generate_mcqs_from_text(text, desired_mcq_count=5):
    candidate_answers = extract_named_entities(text)
    if len(candidate_answers) < desired_mcq_count:
        freq_words = Counter(preprocess(text)).most_common(50)
        for word, _ in freq_words:
            if word not in candidate_answers:
                candidate_answers.append(word)

    idf = {word: 1.0 for word in preprocess(text)}
    mcqs = []
    used_questions = []

    for answer in candidate_answers:
        if len(mcqs) >= desired_mcq_count:
            break
        if len(answer.split()) > 5 or len(answer) < 2:
            continue

        distractors = generate_distractors(answer, text, idf)
        if len(set(distractors)) < 3:
            continue

        question = generate_question_with_fallback(text, answer)
        if any(is_similar(question, q) for q in used_questions):
            continue

        options = distractors[:3] + [answer]
        random.shuffle(options)
        mcqs.append({
            "question": question,
            "options": options,
            "answer": answer
        })
        used_questions.append(question)

    return mcqs

# ========= MAIN FUNCTION =========
def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "Missing arguments"}))
        return

    platform = sys.argv[1]
    content = sys.argv[2]
    num_q = int(sys.argv[3]) if len(sys.argv) > 3 else 5

    try:
        if platform == "text":
            input_text = content
        elif platform == "pdf":
            input_text = read_pdf_text(content)
        else:
            raise ValueError("Unsupported platform")

        mcqs = generate_mcqs_from_text(input_text, num_q)
        print(json.dumps({
            "success": True,
            "mcqs": mcqs,
            "total_generated": len(mcqs)
        }, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"success": False, "message": str(e)}))

if __name__ == "__main__":
    main()
