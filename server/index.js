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


const app = express();
app.use(cors()); // Cho phép CORS (test Postman)
//app.options('*', cors());

app.use(express.json()); // Parse body JSON
app.use(cookieParser());
app.use(morgan("dev")); // Ghi log request HTTP
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// Kiểm tra API chạy
app.get('/', (request, response) => {
    // server to client 
    response.json({ message: "Server is running " + process.env.PORT });
});

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running " + process.env.PORT);
    })
})
