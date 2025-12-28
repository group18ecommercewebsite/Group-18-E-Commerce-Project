import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import myListRouter from './route/mylist.route.js';
import orderRouter from './route/order.route.js';
import reviewRouter from './route/review.route.js';
import paymentRouter from './route/payment.route.js';
import adminRouter from './route/admin.route.js';
import bannerRouter from './route/banner.route.js';

const app = express();

// Cấu hình CORS cho phép credentials
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Client và Admin URLs
  credentials: true, // Cho phép gửi cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // Parse body JSON with increased limit for image uploads
app.use(cookieParser());
app.use(morgan('dev')); // Ghi log request HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Kiểm tra API chạy
app.get('/', (request, response) => {
  // server to client
  response.json({ message: 'Server is running ' + process.env.PORT });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/myList', myListRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/banner', bannerRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Server is running ' + process.env.PORT);
  });
});
