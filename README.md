# Startup Template PostgreSQL Backend

This is a robust startup template for a backend application using Node.js, Express, PostgreSQL, and Prisma. It includes essential features like authentication (OAuth & Email), OTP verification, and user management.

## 🚀 Features

- **Authentication**: Secure login/registration using `bcrypt` and `jsonwebtoken`.
- **OAuth Integration**: Google Login support via `passport-google-oauth20`.
- **OTP System**: Send and verify OTPs for email verification and password resets.
- **User Management**: Profile management, user roles (System Owner, Business Owner, Staff, Customer), and details retrieval.
- **Database Architecture**: Managed by Prisma ORM with PostgreSQL.
- **Error Handling**: Centralized error management system.
- **Mailing**: Integration with `nodemailer` for automated emails.
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

### Auth Module (`/api/auth`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/login` | User login with credentials |
| POST | `/refresh-token` | Get a new access token |
| POST | `/logout` | Log out user and clear session |
| POST | `/forgot-password` | Initiate forgot password flow |
| POST | `/verify-forgot-password-otp` | Verify OTP for password reset |
| POST | `/reset-password` | Reset user password (Auth required) |
| GET | `/google` | Initiate Google OAuth login |
| GET | `/google/callback` | Google OAuth callback URL |

### User Module (`/api/user`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/register` | Register a new user |
| GET | `/profile/me` | Get current logged-in user profile |
| GET | `/user-details/:id` | Get specific user details by ID |
| GET | `/all` | Get all users with profiles |
| POST | `/update-user` | Update user information |

### OTP Module (`/api/otp`)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/send` | Send OTP to user email |
| POST | `/verify` | Verify the sent OTP |

---
*Created with ❤️ for rapid development.* ©️ Ahanaf Mubasshir
