import express from 'express';
import auth from '../middlewares/auth.js';
import {
    addReviewController,
    getProductReviewsController,
    deleteReviewController
} from '../controllers/review.controller.js';

const reviewRouter = express.Router();

// Add review (requires auth)
reviewRouter.post('/add', auth, addReviewController);

// Get reviews for a product (public)
reviewRouter.get('/product/:productId', getProductReviewsController);

// Delete review (requires auth)
reviewRouter.delete('/:reviewId', auth, deleteReviewController);

export default reviewRouter;
