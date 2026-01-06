import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/user.model.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLoginController(request, response) {
    try {
        const { credential } = request.body;

        if (!credential) {
            return response.status(400).json({
                message: "Credential is required",
                error: true,
                success: false
            });
        }

        // Xác thực token từ Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Tìm user với googleId hoặc email
        let user = await UserModel.findOne({
            $or: [
                { googleId: googleId },
                { email: email }
            ]
        });

        if (user) {
            // User đã tồn tại
            if (!user.googleId) {
                // User đã đăng ký bằng email/password, liên kết với Google
                user.googleId = googleId;
                if (!user.avatar && picture) {
                    user.avatar = picture;
                }
                await user.save();
            }

            // Kiểm tra trạng thái user
            if (user.status !== "Active") {
                return response.status(400).json({
                    message: "Tài khoản bị khóa. Vui lòng liên hệ admin",
                    error: true,
                    success: false
                });
            }
        } else {
            // Tạo user mới
            user = new UserModel({
                name: name,
                email: email,
                googleId: googleId,
                avatar: picture || "",
                verify_email: true, // Email từ Google đã được xác thực
                status: "Active"
            });
            await user.save();
        }

        // Tạo tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        // Cập nhật last login
        await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });

        // Set cookies
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', accessToken, cookiesOption);
        response.cookie('refreshToken', refreshToken, cookiesOption);

        return response.json({
            message: "Đăng nhập Google thành công",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    mobile: user.mobile,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        return response.status(500).json({
            message: error.message || "Đăng nhập Google thất bại",
            error: true,
            success: false
        });
    }
}
