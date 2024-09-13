import express, { Application } from 'express';
import dotenv from 'dotenv';
import {connectDatabase} from './config/database'; 

dotenv.config();
const app: Application = express();

app.use(express.json()); // JSON body parser

connectDatabase().then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.error('Database connection error:', error);
});

// Basit bir başlangıç rotası
app.get('/', (req, res) => {
  res.send('EvaExchange API çalışıyor...');
});

// Sunucuyu başlatma
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
