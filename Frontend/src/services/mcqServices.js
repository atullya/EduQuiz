import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

class MCQService {
  async generateFromText(numberOfQuestions, textContent) {
    const response = await axios.post(
      `${API_BASE_URL}/mcq/generate-text`,
      { numberOfQuestions, textContent }
      // { withCredentials: true }
    );
    console.log(response.data);
    return response.data.mcqs;
  }

  async generateFromPDF(numberOfQuestions, pdfFile) {
    const formData = new FormData();
    formData.append("numberOfQuestions", numberOfQuestions);
    formData.append("pdfFile", pdfFile);

    const response = await axios.post(
      `${API_BASE_URL}/mcq/generate-pdf`,
      formData
      // { withCredentials: true }
    );
    return response.data.mcqs;
  }

  async testPythonScript() {
    const response = await axios.get(`${API_BASE_URL}/mcq/test-python`, {
      withCredentials: true,
    });
    return response.data;
  }

  async setupPythonDependencies() {
    const response = await axios.post(`${API_BASE_URL}/mcq/setup`, null, {
      withCredentials: true,
    });
    return response.data;
  }
}

export const mcqService = new MCQService();
