import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import venderRoutes from './routes/vendor.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello from SAAS Backend!');
});

app.use('/api/users', userRoutes);
app.use("/api/vendors", venderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
