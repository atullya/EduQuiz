import nltk
import re
import random
import math
from collections import Counter, defaultdict
import string

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag

class ImprovedMCQGenerator:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        
        # Enhanced question templates for different types of understanding
        self.question_templates = {
            'definition': [
                "Which of the following best defines {}?",
                "What is the primary characteristic of {}?",
                "How can {} be best described?",
                "{} is primarily known for which of the following?"
            ],
            'relationship': [
                "What is the relationship between {} and {}?",
                "How does {} relate to {}?",
                "Which statement best describes the connection between {} and {}?"
            ],
            'purpose': [
                "What is the main purpose of {}?",
                "Why is {} important?",
                "What does {} aim to achieve?",
                "The primary goal of {} is to:"
            ],
            'comparison': [
                "What distinguishes {} from other similar concepts?",
                "Which feature is unique to {}?",
                "How does {} differ from related concepts?"
            ],
            'application': [
                "In which scenario would {} be most useful?",
                "What is a practical application of {}?",
                "Where is {} commonly used?"
            ],
            'cause_effect': [
                "What is the result of {}?",
                "What causes {}?",
                "Which of the following is an effect of {}?"
            ]
        }
        
        # Keywords that indicate different types of relationships
        self.relationship_indicators = {
            'is': 'definition',
            'are': 'definition', 
            'means': 'definition',
            'refers': 'definition',
            'enables': 'purpose',
            'allows': 'purpose',
            'helps': 'purpose',
            'aims': 'purpose',
            'focuses': 'purpose',
            'combines': 'relationship',
            'includes': 'relationship',
            'contains': 'relationship',
            'uses': 'application',
            'applies': 'application',
            'involves': 'application',
            'causes': 'cause_effect',
            'results': 'cause_effect',
            'leads': 'cause_effect'
        }

    def preprocess_text(self, text):
        """Clean and preprocess the input text"""
        text = re.sub(r'\s+', ' ', text.strip())
        text = re.sub(r'[^\w\s\.\!\?\,\;\:\-$$$$]', '', text)
        return text

    def extract_sentences(self, text):
        """Extract meaningful sentences from text"""
        sentences = sent_tokenize(text)
        
        # Filter sentences that are likely to contain useful information
        meaningful_sentences = []
        for sentence in sentences:
            words = sentence.split()
            if (len(words) >= 8 and len(words) <= 30 and  # Good length
                any(indicator in sentence.lower() for indicator in self.relationship_indicators.keys()) and  # Contains relationship words
                not sentence.startswith(('However', 'Moreover', 'Furthermore', 'Additionally'))):  # Not just connective sentences
                meaningful_sentences.append(sentence)
        
        return meaningful_sentences

    def extract_key_concepts(self, text):
        """Extract key concepts and their contexts"""
        sentences = self.extract_sentences(text)
        concepts = {}
        
        for sentence in sentences:
            words = word_tokenize(sentence)
            pos_tags = pos_tag(words)
            
            # Find noun phrases and proper nouns
            current_phrase = []
            for word, tag in pos_tags:
                if tag in ['NN', 'NNS', 'NNP', 'NNPS', 'JJ'] and word.lower() not in self.stop_words:
                    current_phrase.append(word)
                else:
                    if len(current_phrase) >= 1:
                        concept = ' '.join(current_phrase)
                        if len(concept) > 2 and concept not in concepts:
                            concepts[concept] = {
                                'sentence': sentence,
                                'context': self.get_concept_context(concept, sentence),
                                'type': self.determine_question_type(sentence)
                            }
                    current_phrase = []
            
            # Don't forget the last phrase
            if len(current_phrase) >= 1:
                concept = ' '.join(current_phrase)
                if len(concept) > 2 and concept not in concepts:
                    concepts[concept] = {
                        'sentence': sentence,
                        'context': self.get_concept_context(concept, sentence),
                        'type': self.determine_question_type(sentence)
                    }
        
        return concepts

    def get_concept_context(self, concept, sentence):
        """Extract the context/definition of a concept from its sentence"""
        # Find what comes after the concept
        concept_lower = concept.lower()
        sentence_lower = sentence.lower()
        
        if concept_lower in sentence_lower:
            concept_index = sentence_lower.find(concept_lower)
            after_concept = sentence[concept_index + len(concept):].strip()
            
            # Look for definition patterns
            definition_patterns = [
                r'^[\s,]*is\s+(.+?)[\.\,\;]',
                r'^[\s,]*are\s+(.+?)[\.\,\;]', 
                r'^[\s,]*means\s+(.+?)[\.\,\;]',
                r'^[\s,]*refers\s+to\s+(.+?)[\.\,\;]',
                r'^[\s,]*enables\s+(.+?)[\.\,\;]',
                r'^[\s,]*allows\s+(.+?)[\.\,\;]'
            ]
            
            for pattern in definition_patterns:
                match = re.search(pattern, after_concept, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        
        return sentence

    def determine_question_type(self, sentence):
        """Determine the type of question based on sentence structure"""
        sentence_lower = sentence.lower()
        
        for indicator, q_type in self.relationship_indicators.items():
            if indicator in sentence_lower:
                return q_type
        
        return 'definition'  # Default type

    def generate_conceptual_question(self, concept, concept_data, all_concepts):
        """Generate a conceptual question about the concept"""
        question_type = concept_data['type']
        sentence = concept_data['sentence']
        context = concept_data['context']
        
        # Select appropriate question template
        if question_type in self.question_templates:
            template = random.choice(self.question_templates[question_type])
        else:
            template = random.choice(self.question_templates['definition'])
        
        # Generate the question
        if '{}' in template:
            if template.count('{}') == 1:
                question = template.format(concept)
            else:
                # For relationship questions, find another related concept
                related_concepts = [c for c in all_concepts.keys() if c != concept]
                if related_concepts:
                    related = random.choice(related_concepts)
                    question = template.format(concept, related)
                else:
                    question = self.question_templates['definition'][0].format(concept)
        else:
            question = template
        
        return question, context

    def generate_smart_distractors(self, correct_answer, concept, all_concepts, question_type):
        """Generate intelligent distractors based on question type and context"""
        distractors = []
        
        # Strategy 1: Use contexts from other concepts as distractors
        other_concepts = {k: v for k, v in all_concepts.items() if k != concept}
        
        for other_concept, other_data in other_concepts.items():
            if len(distractors) >= 2:
                break
            
            other_context = other_data['context']
            
            # Make sure the distractor is different enough
            if (other_context != correct_answer and 
                len(other_context.split()) >= 3 and
                not self.is_too_similar(correct_answer, other_context)):
                distractors.append(other_context)
        
        # Strategy 2: Generate plausible but incorrect statements
        if len(distractors) < 3:
            generic_distractors = self.generate_generic_distractors(concept, question_type)
            for distractor in generic_distractors:
                if len(distractors) >= 3:
                    break
                if distractor not in distractors:
                    distractors.append(distractor)
        
        # Strategy 3: Modify the correct answer slightly
        if len(distractors) < 3:
            modified_answer = self.create_modified_answer(correct_answer)
            if modified_answer and modified_answer not in distractors:
                distractors.append(modified_answer)
        
        # Fill remaining slots with generic options
        generic_options = [
            "None of the mentioned options",
            "All of the above statements",
            "Cannot be determined from the given information",
            "Not explicitly mentioned in the text"
        ]
        
        while len(distractors) < 3:
            for option in generic_options:
                if option not in distractors and len(distractors) < 3:
                    distractors.append(option)
        
        return distractors[:3]

    def is_too_similar(self, text1, text2):
        """Check if two texts are too similar"""
        words1 = set(word_tokenize(text1.lower()))
        words2 = set(word_tokenize(text2.lower()))
        
        if not words1 or not words2:
            return False
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        similarity = len(intersection) / len(union)
        return similarity > 0.6

    def generate_generic_distractors(self, concept, question_type):
        """Generate generic but plausible distractors"""
        distractors = []
        
        if question_type == 'definition':
            distractors = [
                f"A method used primarily for data storage and retrieval",
                f"A technique that focuses on user interface design",
                f"A process that handles network communication protocols"
            ]
        elif question_type == 'purpose':
            distractors = [
                f"To provide entertainment and gaming functionality",
                f"To manage financial transactions and accounting",
                f"To control hardware device operations"
            ]
        elif question_type == 'application':
            distractors = [
                f"In social media content creation",
                f"In restaurant menu planning", 
                f"In automotive manufacturing"
            ]
        else:
            distractors = [
                f"A specialized form of database management",
                f"An advanced networking protocol",
                f"A user authentication mechanism"
            ]
        
        return distractors

    def create_modified_answer(self, correct_answer):
        """Create a slightly modified version of the correct answer"""
        words = correct_answer.split()
        if len(words) < 3:
            return None
        
        # Replace some words with similar but incorrect terms
        replacements = {
            'enables': 'requires',
            'allows': 'prevents', 
            'creates': 'destroys',
            'improves': 'reduces',
            'increases': 'decreases',
            'machine': 'human',
            'automatic': 'manual',
            'intelligent': 'simple',
            'complex': 'basic',
            'advanced': 'primitive'
        }
        
        modified_words = []
        for word in words:
            word_lower = word.lower()
            if word_lower in replacements:
                modified_words.append(replacements[word_lower])
            else:
                modified_words.append(word)
        
        modified_answer = ' '.join(modified_words)
        return modified_answer if modified_answer != correct_answer else None

    def generate_mcqs(self, text, num_questions=5):
        """Generate improved MCQs from text"""
        print("Starting improved MCQ generation...")
        
        # Preprocess text
        text = self.preprocess_text(text)
        
        # Extract key concepts
        concepts = self.extract_key_concepts(text)
        
        if len(concepts) < num_questions:
            print(f"Warning: Only {len(concepts)} concepts found for {num_questions} questions")
            num_questions = min(len(concepts), num_questions)
        
        # Select the most important concepts
        concept_items = list(concepts.items())
        selected_concepts = random.sample(concept_items, num_questions)
        
        mcqs = []
        
        for i, (concept, concept_data) in enumerate(selected_concepts):
            print(f"Generating question {i+1}/{num_questions} for concept: {concept}")
            
            # Generate conceptual question
            question, correct_answer = self.generate_conceptual_question(concept, concept_data, concepts)
            
            # Generate smart distractors
            distractors = self.generate_smart_distractors(
                correct_answer, concept, concepts, concept_data['type']
            )
            
            # Format the MCQ
            options = [correct_answer] + distractors
            random.shuffle(options)
            
            # Find correct answer index
            correct_index = options.index(correct_answer)
            correct_letter = chr(65 + correct_index)  # A, B, C, D
            
            formatted_mcq = {
                'id': i + 1,
                'question': question,
                'options': {
                    'A': options[0],
                    'B': options[1],
                    'C': options[2] if len(options) > 2 else "None of the above",
                    'D': options[3] if len(options) > 3 else "All of the above"
                },
                'correct_answer': correct_letter,
                'explanation': f"Based on: {concept_data['sentence']}",
                'concept': concept,
                'question_type': concept_data['type']
            }
            
            mcqs.append(formatted_mcq)
        
        print(f"Generated {len(mcqs)} improved MCQs successfully!")
        return mcqs

def main():
    # Example usage with more detailed text
    sample_text = """
    Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. 
    Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed for every task. 
    Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns in large amounts of data. 
    Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language, enabling machines to understand, interpret, and generate human language. 
    Computer vision is another important area of AI that enables machines to interpret and understand visual information from the world, such as images and videos. 
    Robotics combines AI with mechanical engineering to create autonomous machines that can perform physical tasks in the real world. 
    The Turing Test, proposed by Alan Turing in 1950, is a test of a machine's ability to exhibit intelligent behavior equivalent to or indistinguishable from human intelligence. 
    Supervised learning is a type of machine learning where algorithms learn from labeled training data to make predictions on new, unseen data. 
    Unsupervised learning involves finding hidden patterns in data without labeled examples or predefined outcomes. 
    Reinforcement learning is a type of machine learning where agents learn to make decisions by receiving rewards or penalties for their actions in an environment.
    Neural networks are computing systems inspired by biological neural networks that consist of interconnected nodes or neurons that process information.
    """
    
    # Initialize improved generator
    generator = ImprovedMCQGenerator()
    
    # Generate MCQs
    mcqs = generator.generate_mcqs(sample_text, num_questions=5)
    
    # Display results
    print("\n" + "="*60)
    print("IMPROVED MCQs - CONCEPTUAL QUESTIONS")
    print("="*60)
    
    for mcq in mcqs:
        print(f"\nQuestion {mcq['id']} [{mcq['question_type'].upper()}]: {mcq['question']}")
        print(f"Concept: {mcq['concept']}")
        print("-" * 50)
        for option_key, option_value in mcq['options'].items():
            marker = "✓" if option_key == mcq['correct_answer'] else " "
            print(f"{marker} {option_key}. {option_value}")
        print(f"\nCorrect Answer: {mcq['correct_answer']}")
        print(f"Explanation: {mcq['explanation']}")
        print("-" * 60)

if __name__ == "__main__":
    main()
