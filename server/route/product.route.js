import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createProduct, deleteProduct, getAllFeaturedProducts, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdLavelCatId, getAllProductsByThirdLavelCatName, getProduct, getProductsCount, removeImageFromCloudinary, updateProduct, uploadImages } from '../controllers/product.controller.js';


const productRouter = Router();
// Test API Postman
productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);
productRouter.post('/create', auth, createProduct);
productRouter.get('/getAllProducts', getAllProducts);
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId);
productRouter.get('/getAllProductsByCatName', getAllProductsByCatName);
productRouter.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId);
productRouter.get('/getAllProductsBySubCatName', getAllProductsBySubCatName);
productRouter.get('/getAllProductsByThirdLavelCatId/:id', getAllProductsByThirdLavelCatId);
productRouter.get('/getAllProductsByThirdLavelCatName', getAllProductsByThirdLavelCatName);
productRouter.get('/getAllProductsByPrice', getAllProductsByPrice);
productRouter.get('/getAllProductsByRating', getAllProductsByRating);
productRouter.get('/getAllProductsCount', getProductsCount);
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts);
productRouter.delete('/deleteProduct/:id', deleteProduct);
productRouter.get('/getProduct/:id', getProduct);
productRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
productRouter.put('/updateProduct/:id', auth, updateProduct);



export default productRouter;