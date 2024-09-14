import express, { Application } from 'express';
import dotenv from 'dotenv';
import initialize from './config/database/initDatabase';

dotenv.config();
const app: Application = express();

app.use(express.json()); // JSON body parser

initialize(); // Initialize the database connection and models

// Basit bir başlangıç rotası
app.get('/', (req, res) => {
  res.send('EvaExchange API çalışıyor...');
});

// Sunucuyu başlatma
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
