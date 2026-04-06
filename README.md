# 🎟️ BookMySeat — Full Stack Ticket Booking System

A scalable full-stack application that allows users to book event seats using a wallet system with strong concurrency control and transaction safety.

---


## 🧠 Project Overview

This system simulates a real-world ticket booking platform with:

* Secure authentication (JWT)
* Wallet-based payments
* Seat reservation with timeout
* Concurrency-safe booking
* Admin dashboard for full control

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Frontend

* React.js (or your framework)
* Tailwind CSS (if used)

---

## 👤 User Features

* 🔐 Register & Login
* 💰 Add money to wallet
* 🎫 View events & available seats
* ⏳ Reserve seats (5-minute lock)
* 💳 Book seats using wallet
* 📜 View booking & transaction history

---

## 👨‍💼 Admin Features

* 📅 Create / Update / Delete events
* 🪑 Manage seats (bulk create)
* 📊 Monitor bookings & payments
* 💸 Process refunds & cancellations

---

## 💰 Wallet System

* Credit / Debit support
* No negative balance allowed
* Uses integer-based transactions (no floating errors)
* Maintains transaction history (ledger)

---

## 🎯 Booking Flow

1. Reserve seats
2. Lock seats for 5 minutes
3. Deduct wallet balance
4. Confirm booking

---

## ⚠️ Critical System Design

### 🔒 Concurrency Handling

* Prevents double booking
* Prevents double spending

### 🔁 Idempotent APIs

* Safe retry for booking/payment

### ⏳ Reservation Expiry

* Auto-release seats after timeout

### 💥 Atomic Transactions

* Booking + Payment succeed or fail together

---

## 🧪 Edge Cases Handled

* Parallel booking requests
* Wallet race conditions
* Expired reservations during payment
* Duplicate API calls
* Partial transaction failures

---

## 📦 API Endpoints (Sample)

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Wallet

* POST /api/wallet/add
* GET /api/wallet/transactions

### Events

* GET /api/events
* POST /api/events (admin)

### Booking

* POST /api/seats/reserve
* POST /api/bookings/confirm

---

## ⚙️ Installation & Setup

### 1. Clone repo

```bash
git clone https://github.com/shameerpc/Eventbooking.git
cd Eventbooking
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Setup environment variables

Create `.env` in backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 4. Run project

```bash
# backend
npm run dev

# frontend
npm start
```

---

## 📂 Folder Structure

```
backend/
frontend/
```

---

## 📮 Postman Collection

https://interstellar-meteor-155735.postman.co/workspace/ecommerce~e6b6d99c-a074-4e32-a0a6-0b6c9b1d530c/collection/17484047-a47969d3-1ee0-45ab-83b2-75143f42ab37?action=share&source=copy-link&creator=17484047

---

## 🧩 Design Decisions

* Used MongoDB transactions for atomic booking
* Implemented seat locking using reservation flag + expiry
* Wallet system uses integer values to avoid precision issues
* JWT used for stateless authentication

---

## 📌 Future Improvements

* Payment gateway integration
* Real-time seat updates (WebSockets)
* Email notifications
* Role-based access control (RBAC)

---

## 🙌 Author

**Shamseer PC**
Full Stack Developer (MERN)

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
