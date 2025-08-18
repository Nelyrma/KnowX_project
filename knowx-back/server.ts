import express from 'express';
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {  // <-- Add types here
  res.send('API KnowX Ready!');
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
