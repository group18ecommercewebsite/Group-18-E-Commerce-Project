import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { uploadImages, createCategory, getCategories, getCategoriesCount, getSubCategoriesCount, getCategory, deleteCategory, removeImageFromCloudinary, updateCategory } from '../controllers/category.controller.js';

const categoryRouter = Router();
// Test Postman
categoryRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);
categoryRouter.post('/create', auth, createCategory);
categoryRouter.get('/get', getCategories);  // Public - không cần auth
categoryRouter.get('/get/count', auth, getCategoriesCount);
categoryRouter.get('/get/count/subCat', auth, getSubCategoriesCount);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, deleteCategory);
categoryRouter.put('/:id', auth, updateCategory);


export default categoryRouter;