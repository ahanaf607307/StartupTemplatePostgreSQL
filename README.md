# Startup Template PostgreSQL Backend

This is a robust startup template for a backend application using Node.js, Express, PostgreSQL, and Prisma. It includes essential features like authentication (OAuth & Email), OTP verification, and user management.

## 🚀 Features

- **Authentication**: Secure login/registration using `bcrypt` and `jsonwebtoken`.
- **OAuth Integration**: Google Login support via `passport-google-oauth20`.
- **OTP System**: Send and verify OTPs for email verification and password resets.
- **User Management**: Profile management, user roles (System Owner, Business Owner, Staff, Customer), and details retrieval.
- **Validation**: Request body and parameter validation using `Zod`.
- **Database Architecture**: Managed by Prisma ORM with PostgreSQL.
- **Error Handling**: Centralized error management system.
- **Mailing**: Integration with `nodemailer` for automated emails with modern, responsive EJS templates.
- **File Upload System**: Reusable Multer configuration supporting multiple categories (e.g., avatars) with automatic path handling and unique naming.
- **Static Assets**: Dedicated structure for serving uploaded files (e.g., user avatars) statically.
- **Security**: CORS, cookie-parser, and middleware-based authorization.

## 📦 Tech Stack & Packages

### Core
- **Framework**: `express`
- **ORM**: `prisma`
- **Database**: `postgresql` (via `pg`)
- **Runtime**: Node.js (ES Modules)

### Main Dependencies
- **Auth**: `passport`, `passport-google-oauth20`, `passport-local`, `jsonwebtoken`, `bcrypt`
- **Security**: `cors`, `cookie-parser`, `zod` (validation)
- **Utilities**: `axios`, `date-fns`, `dotenv`, `multer` (file uploads), `nodemailer`
- **Cache**: `redis`

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd StartupTemplatePostgreSql
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your configurations (Database URL, JWT secret, OAuth credentials, etc.).

4. **Prisma Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the application**:
   - Development: `npm run dev`
   - Production: `npm start`

## 🛣️ API Routes & CRUD
### BASE URL > http://localhost:8000/api/
### Auth Module (`/api/auth`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/auth/login` | User login with credentials |
| POST | `/auth/refresh-token` | Get a new access token |
| POST | `/auth/logout` | Log out user and clear session |
| POST | `/auth/forgot-password` | Initiate forgot password flow |
| POST | `/auth/verify-forgot-password-otp` | Verify OTP for password reset |
| POST | `/auth/reset-password` | Reset user password (Auth required) |
| POST | `/auth/change-password` | Change user password (Auth required) | OldPassword - NewPassword Required
| GET | `/auth/google` | Initiate Google OAuth login |
| GET | `/auth/google/url` | Get the Google OAuth authorization URL |
| GET | `/auth/google/callback` | Google OAuth callback URL |

### User Module (`/api/user`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/user/register` | Register a new user (Supports optional avatar upload) |
| GET | `/user/profile/me` | Get current logged-in user profile |
| GET | `/user/user-details/:id` | Get specific user details by ID |
| GET | `/user/all` | Get all users with profiles |
| POST | `/user/update-user` | Update user information (Admin only) |
| PATCH | `/user/update-profile` | Update current user profile (Auth required) |
| PATCH | `/user/upload-avatar` | Upload or update user avatar (Auth required) |

### OTP Module (`/api/otp`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/otp/send` | Send OTP to user email |
| POST | `/otp/verify` | Verify the sent OTP |

### Mobile Auth Module (`/api/mobile/auth`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/mobile/auth/login` | Mobile user login |
| POST | `/mobile/auth/refresh-token` | Refresh mobile access token |
| POST | `/mobile/auth/change-password` | Change mobile user password (Auth required) |
| POST | `/mobile/auth/forgot-password` | Initiate forgot password for mobile |
| POST | `/mobile/auth/verify-forgot-password` | Verify OTP for mobile reset |
| POST | `/mobile/auth/reset-password` | Reset mobile user password (Auth required) |

### Mobile User Module (`/api/mobile/user`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/mobile/user/register` | Register a new mobile user (Optional avatar upload) |
| GET | `/mobile/user/profile/me` | Get mobile user profile (Auth required) |
| PATCH | `/mobile/user/update-profile` | Update mobile user profile (Auth required) |

### Mobile OTP Module (`/api/mobile/otp`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/mobile/otp/send` | Send OTP to mobile user email |
| POST | `/mobile/otp/verify` | Verify OTP for mobile user |


---

## 📱 Mobile App Authentication Module

This project includes a dedicated authentication module for mobile applications located in `src/app/modules/MobileApp-Auth`.

- **Usage**: If your project involves a mobile application, you can use this module to handle authentication for any user role.
- **Removal**: If you do not need mobile-specific authentication, you can safely remove it by following these steps:
  1. **Delete Folder**: Delete the `src/app/modules/MobileApp-Auth` directory.
  2. **Clean Router**: In `src/app/router/index.js`, remove the imports and routes for `MobileAuthRoutes`, `MobileUserRoutes`, and `MobileOtpRoutes`.
  3. **Update Middleware**: In `src/app/middleware/checkAuthMiddleware.js`, remove the conditional block that queries `prisma.mobileUser`.
  4. **Remove Seeding**: In `src/app/prisma/seed.js`, remove the `mobileUsers` array and the loop that seeds them.
  5. **Prisma Cleanup**: Delete the `MobileUser` model from `prisma/schema.prisma` and run `npx prisma migrate dev`.

---

## Postman Collection > [POSTMAN]StratupTemplate.postman.json
*Created with ❤️ for rapid development.* ©️ Ahanaf Mubasshir
