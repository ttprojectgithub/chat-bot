import 'dotenv/config';
console.log('OPENAI KEY:', process.env.OPENAI_API_KEY);

import express from 'express';
import isAngularRoute from './app/routes/is-angular.route'; 

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use('/api', isAngularRoute);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
