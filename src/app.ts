import express, { Application } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database'; 

dotenv.config();
const app: Application = express();

app.use(express.json()); // JSON body parser

sequelize
  .authenticate()
  .then(() => console.log('Veritabanına başarıyla bağlanıldı...'))
  .catch((err: Error) => console.log('Veritabanı bağlantı hatası: ' + err.stack));

// Basit bir başlangıç rotası
app.get('/', (req, res) => {
  res.send('EvaExchange API çalışıyor...');
});

// Sunucuyu başlatma
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
