import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import {
    addReviewController,
    getProductReviewsController,
    deleteReviewController,
    uploadReviewImages
} from '../controllers/review.controller.js';

const reviewRouter = express.Router();

// Upload review images (requires auth)
reviewRouter.post('/uploadImages', auth, upload.array('images', 5), uploadReviewImages);

// Add review (requires auth)
reviewRouter.post('/add', auth, addReviewController);

// Get reviews for a product (public)
reviewRouter.get('/product/:productId', getProductReviewsController);

// Delete review (requires auth)
reviewRouter.delete('/:reviewId', auth, deleteReviewController);

export default reviewRouter;
