import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});