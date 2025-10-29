# Sales Management System

A simple sales management system built with Laravel (backend) and Vue 3 (frontend).

## Features

- ✅ Product Management (CRUD)
    - Add, edit, delete products
    - Track stock levels
- ✅ Customer Management (CRUD)
    - Add, edit, delete customers
- ✅ Sales Transaction Management
    - Select customer and products
    - Multiple products per transaction
    - Automatic subtotal and total calculation
    - Stock validation (prevents overselling)
    - Automatic stock reduction after transaction
- ✅ Responsive UI with Tailwind CSS
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

## Tech Stack

### Frontend
- Vue 3
- Vite
- Axios
- Vue Router
- Tailwind CSS 3

## Installation

### Prerequisites
- PHP 8.4+
- Composer
- Node.js 22+
- MySQL
- Laravel Herd (optional) or PHP built-in server

### Frontend Setup

1. Clone the repository
```bash
git clone https://github.com/kevvjoo/simple-sales-system-frontend.git
cd simple-sales-system-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure API URL

Edit `src/axios.js` and set the correct backend URL:

**For Laravel Herd:**
```js
baseURL: 'http://simple-sales-system-api.test/api'
```

**For php artisan serve:**
```js
baseURL: 'http://localhost:8000/api'
```

4. Start development server
```bash
npm run dev
```

Frontend will run at: http://localhost:5173

## Usage

1. Navigate to http://localhost:5173
2. Use the navigation menu to access:
    - **Products**: Manage products and stock
    - **Customers**: Manage customer information
    - **Sales Orders**: Create sales order transactions

### Creating a Sales Transaction

1. Go to Sales Orders page
2. Select a customer
3. Choose date
4. Add products:
    - Select product from dropdown
    - Enter quantity
    - Subtotal calculates automatically
5. Click "Add Product" for multiple items
6. Review total
7. Click "Save Transaction"
8. Stock automatically reduces

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Show product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Show customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Sales Orders
- `GET /api/salesOrders` - List all sales orders transactions
- `POST /api/salesOrders` - Create sales order transaction

## Developer

**Kevin**
- GitHub: [kevvjoo]
- Test Assignment: Junior-Mid Full Stack Developer
- This project was created for educational/assessment purposes.

---

**Built with ❤️ using Vue 3**
