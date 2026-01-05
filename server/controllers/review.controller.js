import ReviewModel from "../models/review.model.js";
import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

// Upload review images to Cloudinary
export async function uploadReviewImages(request, response) {
    try {
        const uploadedImages = [];

        for (const file of request.files) {
            const img = await cloudinary.uploader.upload(
                file.path,
                {
                    folder: 'reviews',
                    quality: 'auto:good'
                }
            );
            uploadedImages.push(img.secure_url);

            // Xóa file tạm sau khi upload lên Cloudinary
            fs.unlinkSync(file.path);
        }

        return response.status(200).json({
            success: true,
            error: false,
            images: uploadedImages
        });
    } catch (error) {
        // Xóa file tạm nếu có lỗi
        if (request.files) {
            request.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Add a review
export const addReviewController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId, rating, review, userName, userAvatar, images } = request.body;

        if (!productId || !rating || !review) {
            return response.status(400).json({
                message: "Product ID, rating, and review are required",
                error: true,
                success: false
            });
        }

        // Check if product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if user already reviewed this product
        const existingReview = await ReviewModel.findOne({ productId, userId });
        if (existingReview) {
            return response.status(400).json({
                message: "You have already reviewed this product",
                error: true,
                success: false
            });
        }

        // Create review
        const newReview = new ReviewModel({
            productId,
            userId,
            userName: userName || 'Anonymous',
            userAvatar: userAvatar || '',
            rating,
            review,
            images: images || []
        });

        await newReview.save();

        // Update product average rating
        const allReviews = await ReviewModel.find({ productId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await ProductModel.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10 });

        return response.status(201).json({
            message: "Review added successfully",
            error: false,
            success: true,
            data: newReview
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get reviews for a product
export const getProductReviewsController = async (request, response) => {
    try {
        const { productId } = request.params;

        const reviews = await ReviewModel.find({ productId })
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
            : 0;

        // Count by rating
        const ratingCounts = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        };

        return response.status(200).json({
            error: false,
            success: true,
            data: {
                reviews,
                stats: {
                    totalReviews,
                    avgRating: Math.round(avgRating * 10) / 10,
                    ratingCounts
                }
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Delete a review (only owner can delete)
export const deleteReviewController = async (request, response) => {
    try {
        const userId = request.userId;
        const { reviewId } = request.params;

        const review = await ReviewModel.findById(reviewId);
        
        if (!review) {
            return response.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            });
        }

        if (review.userId.toString() !== userId) {
            return response.status(403).json({
                message: "You can only delete your own reviews",
                error: true,
                success: false
            });
        }

        const productId = review.productId;
        await ReviewModel.findByIdAndDelete(reviewId);

        // Update product average rating
        const remainingReviews = await ReviewModel.find({ productId });
        const avgRating = remainingReviews.length > 0 
            ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length 
            : 0;
        await ProductModel.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10 });

        return response.status(200).json({
            message: "Review deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
