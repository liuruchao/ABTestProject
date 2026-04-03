import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import configRoutes from './routes/config';
import experimentRoutes from './routes/experiment';
import decisionRoutes from './routes/decision';
import { initDatabase } from './models';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/config', configRoutes);
app.use('/api/experiment', experimentRoutes);
app.use('/api/decision', decisionRoutes);

// 初始化数据库
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`A/B Test Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
