import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
    getAllBanners,
    getAllBannersAdmin,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage
} from '../controllers/banner.controller.js';

const bannerRouter = Router();

// Public routes
bannerRouter.get('/get', getAllBanners);

// Admin routes
bannerRouter.get('/admin/get', auth, getAllBannersAdmin);
bannerRouter.post('/create', auth, createBanner);
bannerRouter.put('/:id', auth, updateBanner);
bannerRouter.delete('/:id', auth, deleteBanner);
bannerRouter.post('/upload', auth, uploadBannerImage);

export default bannerRouter;

