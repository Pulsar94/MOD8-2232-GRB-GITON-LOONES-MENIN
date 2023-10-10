import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import 'dotenv/config'
import repository from './persistence/repository.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.send('The API is healthy');
});

app.post('/api/v1/transactions', async (req, res) => {
  const transaction = await repository.createTransaction(req.body);
  res.json(transaction);
});

app.get('/api/v1/transactions/:userId', async (req, res) => {
  const transactions = await repository.getTransactionsByUserId(req.params.userId);
  res.json(transactions);
});

app.get('/api/v1/users', async (req, res) => {
  const users = await repository.getUsers();
  res.json(users);
});

app.get('/api/v1/users/:mail', async (req, res) => {
  const user = await repository.getUserByMail(req.params.mail);
  res.json(user);
});

app.patch('/api/v1/users/:id', async (req, res) => {
  const user = await repository.editUser(req.body);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
);