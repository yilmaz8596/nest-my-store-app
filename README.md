# My Store - NestJS E-commerce Application

A full-stack e-commerce web application built with NestJS, TypeORM, SQLite, and EJS templates. Features user authentication, product management, and role-based access control.

## 🚀 Features

- **User Authentication**: Registration, login, logout with session management
- **Role-based Access Control**: Admin and regular user roles
- **Product Management**: CRUD operations for products (admin only)
- **File Upload**: Product image upload with multer
- **Responsive UI**: Bootstrap-powered frontend with EJS templates
- **Database**: SQLite with TypeORM for data persistence
- **Session Management**: SQLite-backed session storage
- **Validation**: Class-validator for DTOs and request validation

## � Project Scope / Disclaimer

This repository is an educational/demo project created to demonstrate backend architecture, authentication, deployment workflows, and working with NestJS and TypeORM. It is intentionally scoped to showcase technical patterns and deployment; **payment processing (Stripe/PayPal or similar) is not implemented**.

If you want to add payment integration or other production-grade features (email notifications, real inventory management, analytics), see the "Contributing" section and feel free to open an issue or PR.

## �🛠️ Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: SQLite with TypeORM
- **Frontend**: EJS templates, Bootstrap 5
- **Authentication**: Express sessions with bcrypt password hashing
- **File Upload**: Multer for image handling
- **Validation**: class-validator, class-transformer

## 📁 Project Structure

```
src/
├── entities/           # TypeORM entities
│   ├── product.ts     # Product entity
│   └── user.ts        # User entity
├── DTO/               # Data Transfer Objects
│   ├── product.dto.ts
│   ├── edit.product.dto.ts
│   ├── user.dto.ts
│   └── user.login.dto.ts
├── products/          # Product module
│   ├── controller/    # Product controllers
│   ├── service/       # Product services
│   └── module/        # Product module
├── users/             # User module
│   ├── controller/    # User controllers
│   ├── service/       # User services
│   └── module/        # User module
├── common/            # Shared utilities
│   └── filters/       # Exception filters
├── app.module.ts      # Root module
└── main.ts           # Application entry point

views/                 # EJS templates
├── home.ejs          # Product listing page
├── login.ejs         # Login page
├── sign-up.ejs       # Registration page
├── add-product.ejs   # Add product form (admin)
├── edit-product.ejs  # Edit product form (admin)
├── product-detail.ejs # Product details page
└── includes/
    └── navbar.ejs    # Navigation component

public/
└── images/           # Uploaded product images
```

## 🏗️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nest-my-store-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   SESSION_SECRET=your-super-secret-session-key-change-in-production
   NODE_ENV=development
   ```

4. **Database Setup**
   The SQLite database (`mystore.db`) will be automatically created when you first run the application.

5. **Start the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000/mystore/home`

## 🎯 Usage

### User Registration & Login

1. Visit `/mystore/sign-up` to create a new account
2. Login at `/mystore/login` with your credentials
3. Default role is 'user', admin access requires manual database modification

### Admin Features

- Add new products: `/mystore/add-product`
- Edit existing products: Click "Edit" on any product (visible only to admins)
- Delete products: Available in edit mode
- Upload product images: Handled automatically during product creation/editing

### Regular User Features

- Browse products: `/mystore/home`
- View product details: Click "View" on any product
- User profile management via session

## 🔧 API Endpoints

### Authentication Routes

- `GET /mystore/sign-up` - Registration page
- `POST /mystore/signup` - User registration
- `GET /mystore/login` - Login page
- `POST /mystore/login` - User login
- `GET /mystore/logout` - User logout

### Product Routes

- `GET /mystore/home` - Product listing (homepage)
- `GET /mystore/product/:id` - Product details
- `GET /mystore/add-product` - Add product form (admin only)
- `POST /mystore/add-product` - Create new product (admin only)
- `GET /mystore/edit-product/:id` - Edit product form (admin only)
- `PUT /mystore/edit-product/:id` - Update product (admin only)
- `DELETE /mystore/delete-product/:id` - Delete product (admin only)

## 🗃️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);
```

### Products Table

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  img VARCHAR NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build for production
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

### Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Express sessions with SQLite store
- **HTTP-only Cookies**: Secure session cookies
- **Role-based Access**: Admin-only routes protection
- **Input Validation**: class-validator for request validation
- **File Upload Security**: Configured multer with file type restrictions

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-production-secret-key
```

### Build for Production

```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure the SQLite database file has proper permissions
   - Check if `mystore.db` exists in the root directory

2. **File Upload Issues**
   - Verify the `public/images/` directory exists and is writable
   - Check multer configuration in the product controller

3. **Session Issues**
   - Clear browser cookies and restart the application
   - Verify SESSION_SECRET is set in environment variables

### Database Reset

To reset the database:

```bash
# Stop the application
# Delete the mystore.db file
# Restart the application (database will be recreated)
```

## 📊 Default Data

The application starts with an empty database. To add sample data:

1. Register as a user
2. Manually update the user's role to 'admin' in the database
3. Use the admin interface to add products

## ⭐ Give a Star!

If you found this project helpful or interesting, please consider giving it a ⭐ on GitHub! Your support helps others discover this project and motivates continued development.

---

Built with ❤️ using NestJS
