import re
import os
import random
import numpy as np
import nltk
import fitz
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, word_tokenize, ne_chunk, sent_tokenize
from transformers import T5Tokenizer, T5ForConditionalGeneration
from collections import Counter
from difflib import SequenceMatcher

# Download once (safe to call multiple times)
# nltk.download("punkt")
# nltk.download("stopwords")
# nltk.download("wordnet")
# nltk.download("averaged_perceptron_tagger")
# nltk.download("maxent_ne_chunker")
# nltk.download("words")

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()


# ✅ Only use local model cache
tokenizer = T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl", local_files_only=True)
model = T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl", local_files_only=True)

# tokenizer = T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl")
# model = T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl")


def read_pdf_text(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    tokens = word_tokenize(text)
    return [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words and len(t) > 2]


def extract_named_entities(text):
    tokens = word_tokenize(text)
    tagged = pos_tag(tokens)
    tree = ne_chunk(tagged, binary=False)
    entities = set()
    for subtree in tree:
        if hasattr(subtree, "label") and subtree.label() in [
            "PERSON",
            "ORGANIZATION",
            "GPE",
            "LOCATION",
            "FACILITY",
        ]:
            entity = " ".join([token for token, pos in subtree.leaves()])
            if len(entity) > 1:
                entities.add(entity)
    return list(entities)


def compute_tf(tokens):
    tf = {}
    for word in tokens:
        tf[word] = tf.get(word, 0) + 1
    total = len(tokens)
    return {word: count / total for word, count in tf.items()}


def compute_tf_idf(tf, idf):
    return {word: tf[word] * idf.get(word, 0.0) for word in tf}


def cosine_similarity(vec1, vec2):
    words = set(vec1.keys()).union(set(vec2.keys()))
    v1 = np.array([vec1.get(w, 0.0) for w in words])
    v2 = np.array([vec2.get(w, 0.0) for w in words])
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8)


def generate_distractors(answer, context, idf, required=3):
    answer_tokens = preprocess(answer)
    context_tokens = preprocess(context)
    answer_vec = compute_tf_idf(compute_tf(answer_tokens), idf)
    distractors = []
    used_words = set(answer_tokens)

    for word in set(context_tokens):
        if word in used_words or word in answer.lower():
            continue
        word_vec = compute_tf_idf(compute_tf([word]), idf)
        sim = cosine_similarity(answer_vec, word_vec)
        if 0.1 < sim < 0.9:
            distractors.append((word, sim))

    distractors = sorted(distractors, key=lambda x: -x[1])
    distractor_words = [w for w, _ in distractors]

    if len(distractor_words) < required:
        extras = list(set(context_tokens) - set(distractor_words) - used_words)
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
    pattern = re.compile(re.escape(answer), re.IGNORECASE)
    highlighted = pattern.sub(f"<hl>{answer}</hl>", sentence, count=1)
    input_text = f"generate question: {highlighted} answer: {answer}"
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
        freq_words = Counter(preprocess(text)).most_common(100)
        for word, _ in freq_words:
            if word not in candidate_answers and word.isalpha() and len(word) > 2:
                candidate_answers.append(word)

    idf = {word: 1.0 for word in preprocess(text)}
    mcqs = []
    used_questions = []

    for answer in candidate_answers:
        if len(mcqs) >= desired_mcq_count:
            break
        if len(answer.split()) > 5 or len(answer) < 2:
            continue

        distractors = generate_distractors(answer, text, idf, required=3)
        if len(set(distractors)) < 2:
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
