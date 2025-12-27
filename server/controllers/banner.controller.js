import BannerModel from '../models/banner.model.js';
import cloudinary from 'cloudinary';

/**
 * Lấy tất cả banners (Public)
 * GET /api/banner/get
 */
export const getAllBanners = async (request, response) => {
    try {
        const banners = await BannerModel.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            data: banners,
            count: banners.length
        });

    } catch (error) {
        console.error('Get all banners error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Lấy tất cả banners (Admin - bao gồm inactive)
 * GET /api/banner/admin/get
 */
export const getAllBannersAdmin = async (request, response) => {
    try {
        const banners = await BannerModel.find()
            .sort({ order: 1, createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            data: banners,
            count: banners.length
        });

    } catch (error) {
        console.error('Get all banners admin error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Tạo banner mới (Admin only)
 * POST /api/banner/create
 */
export const createBanner = async (request, response) => {
    try {
        const { image, title, link, order, isActive } = request.body;

        if (!image) {
            return response.status(400).json({
                message: 'Hình ảnh là bắt buộc',
                error: true,
                success: false
            });
        }

        const banner = new BannerModel({
            image,
            title: title || '',
            link: link || '',
            order: order || 0,
            isActive: isActive !== false
        });

        const savedBanner = await banner.save();

        console.log('✅ Banner created:', savedBanner._id);

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Thêm banner thành công',
            data: savedBanner
        });

    } catch (error) {
        console.error('Create banner error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Cập nhật banner (Admin only)
 * PUT /api/banner/:id
 */
export const updateBanner = async (request, response) => {
    try {
        const { id } = request.params;
        const { image, title, link, order, isActive } = request.body;

        const banner = await BannerModel.findByIdAndUpdate(
            id,
            { image, title, link, order, isActive },
            { new: true }
        );

        if (!banner) {
            return response.status(404).json({
                message: 'Banner không tồn tại',
                error: true,
                success: false
            });
        }

        console.log('✅ Banner updated:', id);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật banner thành công',
            data: banner
        });

    } catch (error) {
        console.error('Update banner error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Xóa banner (Admin only)
 * DELETE /api/banner/:id
 */
export const deleteBanner = async (request, response) => {
    try {
        const { id } = request.params;

        const banner = await BannerModel.findByIdAndDelete(id);

        if (!banner) {
            return response.status(404).json({
                message: 'Banner không tồn tại',
                error: true,
                success: false
            });
        }

        console.log('✅ Banner deleted:', id);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa banner thành công'
        });

    } catch (error) {
        console.error('Delete banner error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Upload image cho banner (Admin only)
 * POST /api/banner/upload
 */
export const uploadBannerImage = async (request, response) => {
    try {
        const { image } = request.body;

        if (!image) {
            return response.status(400).json({
                message: 'Không có hình ảnh để upload',
                error: true,
                success: false
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(image, {
            folder: 'banners'
        });

        return response.status(200).json({
            success: true,
            error: false,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error('Upload banner image error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Seed initial banners (Admin only - chạy 1 lần)
 * POST /api/banner/seed
 */
export const seedBanners = async (request, response) => {
    try {
        // Kiểm tra xem đã có banner chưa
        const existingCount = await BannerModel.countDocuments();
        if (existingCount > 0) {
            return response.status(400).json({
                message: `Đã có ${existingCount} banners trong database`,
                error: true,
                success: false
            });
        }

        // 6 banners từ HomeSlider
        const initialBanners = [
            {
                image: 'https://api.spicezgold.com/download/file_1734524878924_1721277298204_banner.jpg',
                title: 'Banner 1',
                order: 1,
                isActive: true
            },
            {
                image: 'https://api.spicezgold.com/download/file_1734524930884_NewProject(6).jpg',
                title: 'Banner 2',
                order: 2,
                isActive: true
            },
            {
                image: 'https://api.spicezgold.com/download/file_1734524971122_NewProject(8).jpg',
                title: 'Banner 3',
                order: 3,
                isActive: true
            },
            {
                image: 'https://api.spicezgold.com/download/file_1734524985581_NewProject(11).jpg',
                title: 'Banner 4',
                order: 4,
                isActive: true
            },
            {
                image: 'https://api.spicezgold.com/download/file_1734525002307_1723967638078_slideBanner1.6bbeed1a0c8ffb494f7c.jpg',
                title: 'Banner 5',
                order: 5,
                isActive: true
            },
            {
                image: 'https://api.spicezgold.com/download/file_1734525014348_NewProject(7).jpg',
                title: 'Banner 6',
                order: 6,
                isActive: true
            }
        ];

        const banners = await BannerModel.insertMany(initialBanners);

        console.log('✅ Seeded', banners.length, 'banners');

        return response.status(201).json({
            success: true,
            error: false,
            message: `Đã thêm ${banners.length} banners vào database`,
            data: banners
        });

    } catch (error) {
        console.error('Seed banners error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
