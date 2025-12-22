# 📚 Server Documentation - E-Commerce API

## 📁 Cấu trúc thư mục

```
server/
├── index.js                 # Entry point - Khởi tạo Express server
├── .env                     # Biến môi trường
├── package.json             # Dependencies
├── config/                  # Cấu hình
│   ├── connectDb.js         # Kết nối MongoDB
│   ├── emailService.js      # Service gửi email (Nodemailer)
│   └── sendEmail.js         # Wrapper function gửi email
├── controllers/             # Business logic
│   ├── user.controller.js   # Xử lý user (auth, profile)
│   ├── category.controller.js # Xử lý danh mục
│   ├── product.controller.js  # Xử lý sản phẩm
│   ├── cart.controller.js     # Xử lý giỏ hàng
│   └── mylist.controller.js   # Xử lý wishlist
├── middlewares/             # Middleware
│   ├── auth.js              # Xác thực JWT token
│   └── multer.js            # Upload file
├── models/                  # MongoDB Schemas
│   ├── user.model.js        # Schema User
│   ├── product.model.js     # Schema Product
│   ├── category.model.js    # Schema Category
│   ├── cartproduct.model.js # Schema Cart Item
│   ├── myList.model.js      # Schema Wishlist
│   ├── order.model.js       # Schema Order
│   └── address.model.js     # Schema Address
├── route/                   # API Routes
│   ├── user.route.js        # Routes /api/user/*
│   ├── category.route.js    # Routes /api/category/*
│   ├── product.route.js     # Routes /api/product/*
│   ├── cart.route.js        # Routes /api/cart/*
│   └── mylist.route.js      # Routes /api/myList/*
└── utils/                   # Utilities
    ├── generatedAccessToken.js  # Tạo Access Token
    ├── generatedRefreshToken.js # Tạo Refresh Token
    └── verifyEmailTemplate.js   # Template email OTP
```

---

## 🔄 Luồng hoạt động tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP Request
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      index.js (Express App)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Middlewares: cors, json, cookieParser, morgan, helmet  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Route matching
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ROUTES (route/)                         │
│  /api/user/* → user.route.js                                   │
│  /api/category/* → category.route.js                           │
│  /api/product/* → product.route.js                             │
│  /api/cart/* → cart.route.js                                   │
│  /api/myList/* → mylist.route.js                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Auth middleware (nếu cần)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARES (middlewares/)                   │
│  auth.js → Verify JWT Token                                     │
│  multer.js → Handle file upload                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Business logic
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONTROLLERS (controllers/)                    │
│  Xử lý logic nghiệp vụ, validation, response                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Database operations
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MODELS (models/)                           │
│  MongoDB Schemas với Mongoose                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Entry Point - index.js

### Chức năng:
1. **Import dependencies**: express, cors, dotenv, cookie-parser, morgan, helmet
2. **Cấu hình middlewares**:
   - `cors()` - Cho phép Cross-Origin requests
   - `express.json()` - Parse JSON body
   - `cookieParser()` - Parse cookies
   - `morgan("dev")` - Log HTTP requests
   - `helmet()` - Security headers
3. **Đăng ký routes**: Map các API endpoints
4. **Kết nối Database**: Gọi `connectDB()` trước khi listen

### API Endpoints:
```javascript
app.use('/api/user', userRouter)      // Authentication, Profile
app.use('/api/category', categoryRouter)  // Categories CRUD
app.use('/api/product', productRouter)    // Products CRUD
app.use('/api/cart', cartRouter)          // Shopping cart
app.use('/api/myList', myListRouter)      // Wishlist
```

---

## 🔐 Authentication Flow

### 1. Đăng ký (Register)
```
POST /api/user/register
Body: { name, email, password }
```

**Flow:**
```
Request → Validate input → Check email exists → Hash password 
→ Generate OTP → Save user (unverified) → Send OTP email → Return token
```

### 2. Xác thực Email (Verify OTP)
```
POST /api/user/verifyEmail
Body: { email, otp }
```

**Flow:**
```
Request → Find user → Validate OTP & expiry → Update verify_email = true 
→ Clear OTP → Return success
```

### 3. Đăng nhập (Login)
```
POST /api/user/login
Body: { email, password }
```

**Flow:**
```
Request → Find user → Check status (Active) → Check verify_email 
→ Compare password → Generate tokens → Set cookies → Return user info
```

### 4. Token System
```
┌─────────────────────────────────────────────────────┐
│                    ACCESS TOKEN                      │
│  - Thời hạn: 5 giờ                                  │
│  - Dùng để: Xác thực API requests                   │
│  - Lưu trữ: Cookie httpOnly + Authorization header  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   REFRESH TOKEN                      │
│  - Thời hạn: 7 ngày                                 │
│  - Dùng để: Lấy Access Token mới                    │
│  - Lưu trữ: Cookie httpOnly + Database              │
└─────────────────────────────────────────────────────┘
```

### 5. Forgot Password Flow
```
POST /api/user/forgot-password     → Gửi OTP qua email
POST /api/user/verify-forgot-password-otp → Xác nhận OTP
POST /api/user/reset-password      → Đặt mật khẩu mới
```

---

## 🛡️ Auth Middleware

**File:** `middlewares/auth.js`

```javascript
// Lấy token từ cookie hoặc header
const token = request.cookies.accessToken || 
              request?.headers?.authorization?.split(" ")[1];

// Verify token
const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

// Gắn userId vào request
request.userId = decode.id;

// Chuyển tiếp
next();
```

**Sử dụng trong routes:**
```javascript
router.get('/protected-route', auth, controller);
```

---

## 📦 Models (Database Schemas)

### User Model
```javascript
{
  name: String,           // Tên người dùng
  email: String,          // Email (unique)
  password: String,       // Mật khẩu đã hash
  avatar: String,         // URL avatar
  mobile: Number,         // Số điện thoại
  verify_email: Boolean,  // Đã xác thực email?
  access_token: String,   // Access token
  refresh_token: String,  // Refresh token
  status: Enum,           // Active | Inactive | Suspended
  role: Enum,             // ADMIN | USER
  otp: String,            // Mã OTP
  otpExpires: Date,       // Thời hạn OTP
  address_details: [ObjectId],  // Ref: Address
  shopping_cart: [ObjectId],    // Ref: CartProduct
  orderHistory: [ObjectId]      // Ref: Order
}
```

### Product Model
```javascript
{
  name: String,           // Tên sản phẩm
  description: String,    // Mô tả
  images: [String],       // Mảng URL ảnh
  brand: String,          // Thương hiệu
  price: Number,          // Giá hiện tại
  oldPrice: Number,       // Giá cũ
  catName: String,        // Tên danh mục
  catId: String,          // ID danh mục
  subCat: String,         // Danh mục con
  countInStock: Number,   // Số lượng tồn
  rating: Number,         // Đánh giá
  isFeatured: Boolean,    // Sản phẩm nổi bật
  discount: Number,       // % giảm giá
  productRam: [String],   // RAM options
  size: [String],         // Size options
  productWeight: [String] // Trọng lượng options
}
```

### Category Model
```javascript
{
  name: String,           // Tên danh mục
  images: [String],       // Ảnh danh mục
  parentId: ObjectId,     // ID danh mục cha (null = root)
  parentCatName: String   // Tên danh mục cha
}
```

### Order Model
```javascript
{
  userId: ObjectId,       // Ref: User
  orderId: String,        // Mã đơn hàng (unique)
  productId: ObjectId,    // Ref: Product
  product_details: {      // Thông tin sản phẩm snapshot
    name: String,
    image: Array
  },
  paymentId: String,      // Mã thanh toán
  payment_status: String, // Trạng thái thanh toán
  delivery_address: ObjectId, // Ref: Address
  subTotalAmt: Number,    // Tạm tính
  totalAmt: Number        // Tổng tiền
}
```

---

## 📤 File Upload Flow (Cloudinary)

**Middleware:** `middlewares/multer.js`

```
Client upload file → Multer save to /uploads folder 
→ Controller upload to Cloudinary → Get secure_url 
→ Delete local file → Save URL to database
```

**Cấu hình Cloudinary:**
```javascript
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});
```

---

## 📧 Email Service

**Files:** `config/emailService.js`, `config/sendEmail.js`

**Cấu hình Nodemailer:**
```javascript
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
```

**Sử dụng:**
```javascript
await sendEmailFun({
    sendTo: email,
    subject: "Verify email",
    html: VerificationEmail(name, otp)
});
```

---

## 🛒 Cart API Flow

### Add to Cart
```
POST /api/cart/add
Headers: { Authorization: Bearer <token> }
Body: { productId }
```

**Flow:**
```
Auth middleware → Get userId → Check item exists in cart 
→ Create CartProduct → Update User.shopping_cart → Response
```

### Get Cart Items
```
GET /api/cart/get
Headers: { Authorization: Bearer <token> }
```

**Flow:**
```
Auth middleware → Get userId → Find CartProducts 
→ Populate productId → Response with product details
```

### Update Quantity
```
PUT /api/cart/update-qty
Body: { _id, qty }
```

### Remove Item
```
DELETE /api/cart/remove/:id
```

---

## 🔑 Environment Variables (.env)

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# JWT Secrets
SECRET_KEY_ACCESS_TOKEN=your_access_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_secret
JSON_WEB_TOKEN_SECRET_KEY=your_jwt_secret

# Email
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
cloudinary_Config_Cloud_Name=your_cloud_name
cloudinary_Config_api_key=your_api_key
cloudinary_Config_api_secret=your_api_secret
```

---

## 📋 API Endpoints Summary

### User Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Đăng ký |
| POST | `/verifyEmail` | ❌ | Xác thực OTP |
| POST | `/login` | ❌ | Đăng nhập |
| GET | `/logout` | ✅ | Đăng xuất |
| GET | `/user-details` | ✅ | Lấy thông tin user |
| PUT | `/:id` | ✅ | Cập nhật user |
| PUT | `/user-avatar` | ✅ | Upload avatar |
| POST | `/forgot-password` | ❌ | Quên mật khẩu |
| POST | `/verify-forgot-password-otp` | ❌ | Xác nhận OTP reset |
| POST | `/reset-password` | ❌ | Đặt lại mật khẩu |
| POST | `/refresh-token` | ❌ | Refresh access token |

### Product Routes (`/api/product`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Lấy danh sách sản phẩm |
| GET | `/:id` | ❌ | Lấy chi tiết sản phẩm |
| POST | `/create` | ✅ | Tạo sản phẩm |
| PUT | `/:id` | ✅ | Cập nhật sản phẩm |
| DELETE | `/:id` | ✅ | Xóa sản phẩm |
| POST | `/upload-images` | ✅ | Upload ảnh sản phẩm |

### Category Routes (`/api/category`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Lấy danh sách danh mục |
| POST | `/create` | ✅ | Tạo danh mục |
| PUT | `/:id` | ✅ | Cập nhật danh mục |
| DELETE | `/:id` | ✅ | Xóa danh mục |

### Cart Routes (`/api/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/add` | ✅ | Thêm vào giỏ hàng |
| GET | `/get` | ✅ | Lấy giỏ hàng |
| PUT | `/update-qty` | ✅ | Cập nhật số lượng |
| DELETE | `/remove/:id` | ✅ | Xóa khỏi giỏ hàng |

### MyList Routes (`/api/myList`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/add` | ✅ | Thêm vào wishlist |
| GET | `/get` | ✅ | Lấy wishlist |
| DELETE | `/remove/:id` | ✅ | Xóa khỏi wishlist |

---

## 🔒 Security Features

1. **Password Hashing**: bcryptjs với salt rounds = 10
2. **JWT Tokens**: Access token (5h) + Refresh token (7d)
3. **HTTP-Only Cookies**: Ngăn XSS attacks
4. **Helmet.js**: Security headers
5. **CORS**: Cross-Origin Resource Sharing
6. **OTP Expiration**: 10 phút

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "error": false,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": true,
  "message": "Error description"
}
```

---

## 🚀 Khởi chạy Server

```bash
# Cài đặt dependencies
npm install

# Chạy development
npm run dev

# Chạy production
npm start
```

Server sẽ chạy tại: `http://localhost:5000`
