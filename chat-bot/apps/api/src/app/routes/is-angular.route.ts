import { Router } from 'express';
import { OpenAI } from 'openai';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});


router.post('/is-angular', async (req, res) => {
  const question = req.body?.question;
  if (!question) return res.status(400).send('Missing question');

  const prompt = `האם השאלה הזו קשורה ל-Angular? ענה "כן" או "לא" בלבד. השאלה: "${question}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    const answer = completion.choices[0].message.content?.trim();
    res.json({ result: answer });
  } catch (err: any) {
    console.error('❌ שגיאה בשאלה is-angular:', err.message || err);
    res.status(500).send('Error communicating with OpenAI');
  }
});


router.post('/answer', async (req, res) => {
  const question = req.body?.question;
  if (!question) return res.status(400).send('Missing question');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'אתה עוזר מומחה ל-Angular. ענה על השאלה בצורה מקצועית, מדויקת וברורה בעברית.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content?.trim();
    res.json({ result: answer });
  } catch (err: any) {
    console.error('❌ שגיאה בתשובה:', err.message || err);
    res.status(500).send('Error communicating with OpenAI');
  }
});

export default router;
