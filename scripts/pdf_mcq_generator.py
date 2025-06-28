import PyPDF2
import io
from mcq_generator import MCQGenerator

def extract_text_from_pdf(pdf_file_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            return text
    except Exception as e:
        print(f"Error reading PDF: {str(e)}")
        return None

def generate_mcqs_from_pdf(pdf_path, num_questions=5):
    """Generate MCQs from PDF file"""
    print(f"Extracting text from PDF: {pdf_path}")
    
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        print("Failed to extract text from PDF")
        return []
    
    print(f"Extracted {len(text)} characters from PDF")
    
    # Initialize MCQ generator
    generator = MCQGenerator()
    
    # Generate MCQs
    mcqs = generator.generate_mcqs(text, num_questions)
    
    return mcqs

def main():
    # Example usage with PDF
    pdf_path = "sample.pdf"  # Replace with your PDF path
    
    try:
        mcqs = generate_mcqs_from_pdf(pdf_path, num_questions=3)
        
        # Display results
        print("\n" + "="*50)
        print("MCQs GENERATED FROM PDF")
        print("="*50)
        
        for mcq in mcqs:
            print(f"\nQuestion {mcq['id']}: {mcq['question']}")
            print("-" * 40)
            for option_key, option_value in mcq['options'].items():
                marker = "✓" if option_key == mcq['correct_answer'] else " "
                print(f"{marker} {option_key}. {option_value}")
            print(f"\nCorrect Answer: {mcq['correct_answer']}")
            print(f"Explanation: {mcq['explanation']}")
            print("-" * 50)
            
    except FileNotFoundError:
        print(f"PDF file not found: {pdf_path}")
        print("Please provide a valid PDF file path")

if __name__ == "__main__":
    main()
