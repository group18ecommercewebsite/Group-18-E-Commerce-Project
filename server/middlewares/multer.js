import multer from 'multer';
import fs from 'fs'; // Cần thiết để xóa file tạm sau khi upload lên Cloudinary

// 1. Cấu hình nơi lưu trữ tạm thời cho Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Lưu file vào thư mục 'uploads'
    },
    filename: function (req, file, cb) {
        // Đặt tên file bằng timestamp + tên gốc để đảm bảo tên duy nhất
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// 2. Tạo middleware upload
const upload = multer({ storage: storage });

export default upload