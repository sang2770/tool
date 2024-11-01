import { Injectable } from '@nestjs/common';
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
@Injectable()
export class AppService {
  readonly apiKey = "AIzaSyAoJY5ctibzEFzZrQCvEe9LF7UxmM1a3Fk";
  getHello(): string {
    return 'Hello World!';
  }

  async extractInfoFromPDF(file: any): Promise<any> {
    const dataBuffer = file.buffer;
    if (!dataBuffer) {
      return;
    }

    const data = await pdf(dataBuffer);
    // console.log(data.text);


    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Extract and format the following information into JSON: name, age, phone number, birthday, experience (with format body: title, description, company, time), education (with format body: institution, years, major, degree),  summary from the text: ` + data.text;

    const response = await model.generateContent(prompt);
    // console.log(response);

    const candidate = response.response.candidates[0];
    const part = candidate.content.parts[0];
    const text = part.text.slice(part.text.indexOf("```") + 3, part.text.indexOf("```", part.text.indexOf("```") + 3)).slice(4);

    return JSON.parse(text);
  }
}
