import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmailFun from '../config/sendEmail.js';
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});


export async function registerUserController(request, response) {
    try {
        let user;

        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "provide email, name, password",
                error: true,
                success: false
            })
        }

        user = await UserModel.findOne({ email: email });

        if (user) {
            return response.json({
                message: "User already Registered with this email",
                error: true,
                success: false
            })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        user = new UserModel({
            email: email,
            password: hashPassword,
            name: name,
            otp: verifyCode,
            otpExpires: Date.now() + 600000     // // 10 phút
        });

        await user.save();

        // Send verification email
        await sendEmailFun({
            sendTo: email,
            subject: "Verify email from Ecommerce App",
            text: "Verify email from Ecommerce App",
            html: VerificationEmail(name, verifyCode)
        })

        // Create a JWT token for vertification purposes
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        )

        return response.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully! Please verify your email.",
            token: token
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires && user.otpExpires.getTime() > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({
                message: "Email verified successfully",
                error: false,
                success: true
            })
        }
        else if (!isCodeValid) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }
        else {
            return response.status(400).json({
                message: "OTP expired",
                error: true,
                success: false
            })
        }

    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function loginUserController(request, response) {
    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to admin",
                error: true,
                success: false
            })
        }

        if (user.verify_email !== true) {
            return response.status(400).json({
                message: "Your email is not verify yet please verify your email first",
                error: true,
                success: false
            })
        }

        // Hash(password) then compare with user.password
        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, { last_login_date: new Date() })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', accessToken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return response.json({
            message: "Login successfully",
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
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function logoutController(request, response) {
    try {
        const userId = request.userId   // middleware

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie('accessToken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, { refresh_token: "" })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    }

    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// image upload
var imagesArr = [];

export async function userAvatarController(request, response) {
    try {
        imagesArr = [];

        const userId = request.userId;
        const image = request.files;

        const user = await UserModel.findOne({ _id: userId });

        // first remove image from cloudinary

        // Lấy URL ảnh từ query parameter (ví dụ: /api/user/deleteImage?img=...)
        const imgUrl = user.avatar;

        // Tách URL để lấy tên file cuối cùng (ví dụ: v40aiatsnjnizuwqsh0z.png)
        const urlArr = imgUrl.split("/");
        const avatar_image = urlArr[urlArr.length - 1];

        // Tách tên file để lấy Public ID 
        const imageName = avatar_image.split(".")[0];

        if (imageName) {
            // Thực hiện lệnh xóa (destroy) trên Cloudinary
            const res = await cloudinary.uploader.destroy(
                imageName,
                (error, result) => {
                    // console.log(error, result)
                }
            );
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < image?.length; i++) {

            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                }
            );
        }

        user.avatar = imagesArr[0];
        await user.save();

        return response.status(200).json({
            _id: userId,
            avatar: imagesArr[0]
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// Cần import cloudinary và export hàm này
export async function removeImageFromCloudinary(request, response) {
    // Lấy URL ảnh từ query parameter (ví dụ: /api/remove-image?img=...)
    const imgUrl = request.query.img;

    // Tách URL để lấy tên file cuối cùng (ví dụ: v40aiatsnjnizuwqsh0z.png)
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    // Tách tên file để lấy Public ID 
    const imageName = image.split(".")[0];

    if (imageName) {
        // Thực hiện lệnh xóa (destroy) trên Cloudinary
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {
                // console.log(error, result)
            }
        );

        if (res) {
            response.status(200).send(res);
        }
    }
}


// update user details
// http://localhost:8000/api/user/693e801c253ae54e4acb843a
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId; // //auth middleware
        const { name, email, mobile, password } = request.body;

        const userExist = await UserModel.findById(userId);

        if (!userExist) {
            return response.status(400).send('The user cannot be Updated!');
        }

        let verifyCode = "";

        if (email !== userExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        let hashPassword = "";

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        } else {
            hashPassword = userExist.password;
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                mobile: mobile,
                email: email,
                verify_email: email !== userExist.email ? false : true,     // verify_email = false nếu người dùng cập nhật email, nếu không có email mới thì giữ nguyên (true)
                password: hashPassword,
                otp: verifyCode !== "" ? verifyCode : null,     // Cập nhật OTP: Nếu có verifyCode, lưu verifyCode, ngược lại là null
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : ""       // Nếu có verifyCode, đặt thời gian hết hạn sau 600000ms (10 phút), ngược lại là rỗng
            },
            { new: true } // Trả về đối tượng đã được cập nhật
        );

        if (email !== userExist.email) {
            // Send vertification email
            await sendEmailFun({
                sendTo: email,
                subject: "Verify email from Ecommerce",
                text: "",
                html: VerificationEmail(name, verifyCode)
            })
        }

        return response.json({
            message: "User Updated successfully",
            error: false,
            success: true,
            user: updateUser
        })

        // Khối xử lý lỗi (catch)
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// forgot password
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        else {
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;

            await user.save(0);

            await sendEmailFun({
                sendTo: email,
                subject: "Verify email from Ecommerce",
                text: "",
                html: VerificationEmail(user.name, verifyCode)
            })

            return response.json({
                message: "Check your email",
                error: false,
                success: true
            })
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false
            })
        }

        if (otp !== user.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        if (user.otpExpires < currentTime) {
            return response.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        user.otp = "";
        user.otpExpires = "";

        await user.save();

        return response.status(200).json({
            message: "OTP verified!",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}


// reset password
export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(confirmPassword, salt);

        user.password = hashPassword;
        await user.save();

        return response.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// refresh token controler
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] // [ Bearer token]

        if (!refreshToken) {
            return response.status(400).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id;
        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// get login user details
export async function userDetails(request, response) {
    try {
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: 'User details',
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        })
    }
}