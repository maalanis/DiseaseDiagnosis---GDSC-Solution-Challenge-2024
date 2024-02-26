// server.mjs
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/disease-info', async (req, res) => {
  const { diseaseName } = req.body;
  if (typeof diseaseName !== 'string' || !diseaseName.trim()) {
    return res.status(400).send('Invalid disease name provided');
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const prompt = `Provide detailed information and treatment options for ${diseaseName}.`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error using Gemini API:', error);
    res.status(500).send('Failed to fetch disease information');
  }
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
