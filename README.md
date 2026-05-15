<div align="center">

<img src="https://img.shields.io/badge/EventPro-Event%20Planning%20System-C9A84C?style=for-the-badge&logo=calendar&logoColor=white" alt="EventPro"/>

# 🎊 EventPro — Event Planning Management System

**A full-stack web application for seamless event planning, vendor management, and secure payments.**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[📸 Screenshots](#-screenshots) • [✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📡 API Docs](#-api-endpoints) • [🏗️ Architecture](#️-architecture)

</div>

---

## 📌 Overview

**EventPro** is a comprehensive event planning and management platform built for Sri Lanka's event industry. It enables clients to book events, administrators to manage requests and assign vendors, and service providers to track their assignments — all within a single, beautifully designed system.

> 🎯 **Use Case:** Wedding planners, corporate event coordinators, birthday party organizers, and any event management business looking for an end-to-end digital solution.

---

## ✨ Features

### 👤 Client Portal
- ✅ Register & Login with **JWT Authentication**
- ✅ **OTP Email Verification** on registration
- ✅ **Forgot Password** via OTP
- ✅ **3-Step Event Booking Wizard** (Category → Details → Confirm)
- ✅ View booking status in real-time
- ✅ View and pay invoices online
- ✅ **Secure Payments** — Card / Bank Transfer / Digital Wallet
- ✅ Download/Print **PDF Invoices**
- ✅ Email notifications for every action

### 🛡️ Admin Panel
- ✅ Full **System Overview** with Charts
- ✅ Manage all event requests
- ✅ **Assign vendors** to events
- ✅ Update event statuses (Approve / Confirm / Cancel)
- ✅ Create and manage **invoices**
- ✅ View all payments and revenue
- ✅ Manage clients (view / delete)
- ✅ Manage **event categories** with images
- ✅ Email alerts sent on every status change

### 🏪 Vendor Portal
- ✅ View assigned events dashboard
- ✅ Track upcoming and completed jobs
- ✅ Real-time assignment stats

### 📧 Email System
- ✅ Booking confirmation emails
- ✅ Invoice notification emails
- ✅ Payment confirmation emails
- ✅ Status update alerts
- ✅ OTP verification emails
- ✅ Beautiful **HTML email templates**

---

🖼️ Screenshots
<br/>
🏠 Landing Page
<img src="https://github.com/user-attachments/assets/266e039e-f2f3-4d84-a519-0241fd65b551" width="100%"/>
<br/>
🔐 Login with OTP Verification
<img src="https://github.com/user-attachments/assets/80951a84-216b-4402-b823-e9552b7471b0" width="100%"/>
<br/>
📝 Register & Email Verify
<img src="https://github.com/user-attachments/assets/0a7c34f6-f1a8-4b2a-98d6-ef39f200cfba" width="100%"/>
<br/>
📊 Admin Dashboard
<img src="https://github.com/user-attachments/assets/1d5b634d-fbc6-4e33-a4f3-3e833b86116f" width="100%"/>
<br/>
📅 Book Event — 3-Step Wizard
<img src="https://github.com/user-attachments/assets/427614ce-4770-4f35-bc6b-1d48bc492c4e" width="100%"/>
<br/>
🧾 My Invoices
<img src="https://github.com/user-attachments/assets/4c013d19-f3f5-4866-8d5d-76b927402668" width="100%"/>
<br/>
💳 Payment Gateway (Card / Bank / Wallet)
<img src="https://github.com/user-attachments/assets/8d3c60c6-2c5b-40fa-b505-c972f35b7da4" width="100%"/>
<br/>
🖨️ Printable Invoice
<img src="https://github.com/user-attachments/assets/93a7dfd9-f212-41c6-9577-55cedbeb535f" width="100%"/>
<br/>
🏪 Vendor Management
<img src="https://github.com/user-attachments/assets/f53a9370-a94c-4e62-bb4d-e7ef482d38bd" width="100%"/>
<br/>
👷 Vendor Dashboard
<img src="https://github.com/user-attachments/assets/c2c88779-0a1f-4d87-aa4d-6b0cb35f0449" width="100%"/>
<br/>
🗂️ Event Categories
<img src="https://github.com/user-attachments/assets/86a5e2e7-d5da-4e01-977e-ee9d9c6c99fb" width="100%"/>



---

## 🏗️ Architecture

```
Event-Planning-Management-System/
│
├── 📁 Back_End/                          # Spring Boot REST API
│   └── src/main/java/lk/ijse/back_end/
│       ├── 📁 config/                    # Security, CORS, JWT Config
│       │   ├── AppConfig.java
│       │   ├── SecurityConfig.java       # Spring Security + CORS
│       │   ├── JwtFilterConfig.java      # JWT Request Filter
│       │   └── WebConfig.java
│       ├── 📁 controller/               # REST API Endpoints
│       │   ├── AuthController.java       # Login, Register, OTP
│       │   ├── EventController.java      # Event CRUD
│       │   ├── InvoiceController.java    # Invoice Management
│       │   ├── PaymentController.java    # Payment Processing
│       │   ├── VendorController.java     # Vendor CRUD
│       │   ├── UserController.java       # User Management
│       │   └── CategoryController.java   # Event Categories
│       ├── 📁 dto/                      # Data Transfer Objects
│       ├── 📁 entity/                   # JPA Entities (DB Models)
│       │   ├── User.java
│       │   ├── Event.java
│       │   ├── Invoice.java
│       │   ├── Payment.java
│       │   ├── Vendor.java
│       │   └── Feedback.java
│       ├── 📁 repository/              # Spring Data JPA Repositories
│       ├── 📁 service/                 # Business Logic Layer
│       │   └── 📁 impl/               # Service Implementations
│       ├── 📁 util/                    # JWT Utility
│       └── 📁 exception/              # Global Exception Handler
│
└── 📁 Front_End/                        # Vanilla HTML/CSS/JS
    ├── index.html                        # Landing Page
    ├── login.html                        # Login + Forgot Password (OTP)
    ├── register.html                     # Register + Email Verify (OTP)
    ├── userDashboard.html                # Client Dashboard
    ├── bookEvent.html                    # 3-Step Event Booking
    ├── myInvoices.html                   # Client Invoices
    ├── payment.html                      # Payment (Card/Bank/Wallet)
    ├── invoiceView.html                  # Printable Invoice
    ├── adminDashboard.html               # Admin Control Panel
    ├── manageVendors.html                # Vendor Management
    ├── vendorDashboard.html              # Vendor Portal
    ├── 📁 css/
    │   └── style.css                     # Global Styles (Dark Gold Theme)
    └── 📁 js/
        └── app.js                        # Shared Utilities & API Client
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend Framework** | Spring Boot 3.2.5 |
| **Language** | Java 17 |
| **Security** | Spring Security + JWT (jjwt 0.11.5) |
| **Database** | MySQL 8.0 |
| **ORM** | Spring Data JPA + Hibernate |
| **Email** | Spring Mail (Gmail SMTP) |
| **API Documentation** | SpringDoc OpenAPI (Swagger UI) |
| **Build Tool** | Maven |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Icons** | Font Awesome 6.5 |
| **Charts** | Chart.js |
| **Fonts** | Google Fonts (Playfair Display + Inter) |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- ☕ **Java 17+** — [Download](https://www.oracle.com/java/technologies/downloads/)
- 🐬 **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)
- 🔧 **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- 🌐 **VS Code** with Live Server extension (for frontend)
- 💡 **IntelliJ IDEA** (recommended for backend)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Event-Planning-Management-System.git
cd Event-Planning-Management-System
```

---

### 2️⃣ Database Setup

MySQL ස්වයංක්‍රීයව database create කරනවා. `application.properties` ලෙ ඔයාගේ MySQL credentials set කරන්න:

```bash
# Navigate to backend config
cd Back_End/src/main/resources/
```

`application.properties` file edit කරන්න:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### 3️⃣ Email (OTP) Setup — Optional but Recommended

Gmail App Password generate කරන්නේ මෙහෙමයි:

1. [myaccount.google.com](https://myaccount.google.com) → **Security**
2. **2-Step Verification** enable කරන්න
3. **App Passwords** → Select app: "Mail" → Generate
4. Generated **16-character password** copy කරන්න

`application.properties` ලෙ add කරන්න:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your.email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
otp.expiry.minutes=5
```

> ⚠️ **Note:** Email config නැතිව OTP console ලෙ print වෙනවා. System work කරනවා.

---

### 4️⃣ Run the Backend

```bash
cd Back_End
./mvnw spring-boot:run
```

Or IntelliJ ලෙ:
- `Back_End` folder open කරන්න
- `BackEndApplication.java` → Run ▶️

✅ Backend running at: `http://localhost:8080`

📖 Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

### 5️⃣ Run the Frontend

VS Code ලෙ `Front_End` folder open කරන්න:

```bash
# Option 1: VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Option 2: Any HTTP server
cd Front_End
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login & get JWT token |
| `POST` | `/api/v1/auth/send-otp` | Send OTP to email |
| `POST` | `/api/v1/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/v1/auth/forgot-password` | Password reset via OTP |

### 📅 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/events/save` | Create new event booking |
| `GET` | `/api/v1/events/all` | Get all events (Admin) |
| `GET` | `/api/v1/events/my-events?email=` | Get client's events |
| `PUT` | `/api/v1/events/{id}/status?status=` | Update event status |
| `PUT` | `/api/v1/events/{id}/assign-vendor?vendorId=` | Assign vendor |
| `DELETE` | `/api/v1/events/{id}` | Delete event |

### 🏪 Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/vendors/all` | Get all vendors |
| `POST` | `/api/v1/vendors/add` | Add new vendor |
| `DELETE` | `/api/v1/vendors/{id}` | Remove vendor |

### 📄 Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/invoices/all` | All invoices (Admin) |
| `GET` | `/api/v1/invoices/client?email=` | Client's invoices |
| `GET` | `/api/v1/invoices/{id}` | Get single invoice |
| `POST` | `/api/v1/invoices/save` | Create invoice |
| `DELETE` | `/api/v1/invoices/{id}` | Delete invoice |

### 💳 Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/payments/checkout` | Process payment |
| `GET` | `/api/v1/payments/all` | All payments (Admin) |

### 👥 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users/all` | All users (Admin) |
| `DELETE` | `/api/v1/users/{id}` | Delete user |

> 📖 Full interactive API docs available at `http://localhost:8080/swagger-ui/index.html` after running the backend.

---

## 🔒 Security

- **JWT Tokens** — 30-day expiry, stateless authentication
- **BCrypt** password hashing
- **Spring Security** — Role-based access control
- **CORS** — Configured for frontend origins
- **OTP** — 6-digit, 5-minute expiry, in-memory store
- All sensitive endpoints require valid JWT in `Authorization: Bearer <token>` header

---

## 🗄️ Database Schema

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── password (BCrypt hashed)
└── role (ADMIN | CLIENT | STAFF)

events
├── id (PK)
├── title
├── type (WEDDING | BIRTHDAY | CORPORATE | ...)
├── date
├── location
├── description
├── status (PENDING | APPROVED | CONFIRMED | CANCELLED)
├── client_id (FK → users)
└── vendor_id (FK → vendors)

vendors
├── id (PK)
├── name
├── type (PHOTOGRAPHY | CATERING | ...)
├── contact
├── price_range
└── description

invoices
├── id (PK)
├── amount
├── issued_date
├── due_date
├── status (UNPAID | PAID)
├── notes
└── event_id (FK → events)

payments
├── id (PK)
├── paid_amount
├── payment_method
├── transaction_id
├── payment_date
├── status
└── invoice_id (FK → invoices)
```

---

## 📁 Frontend Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `index.html` | Marketing homepage with event categories |
| Login | `login.html` | Sign in + Forgot Password with OTP |
| Register | `register.html` | Create account + Email OTP verification |
| Dashboard | `userDashboard.html` | Client event overview |
| Book Event | `bookEvent.html` | 3-step event booking wizard |
| Invoices | `myInvoices.html` | View and pay invoices |
| Payment | `payment.html` | Card / Bank / Wallet payment |
| Invoice View | `invoiceView.html` | Printable invoice page |
| Admin | `adminDashboard.html` | Full admin control panel |
| Vendors | `manageVendors.html` | Vendor management |
| Vendor Portal | `vendorDashboard.html` | Vendor assignment tracking |

---

## ⚙️ Configuration Reference

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | `8080` | Backend port |
| `spring.datasource.url` | `localhost:3306/event_management_db` | MySQL connection |
| `jwt.expiration` | `2592000000` (30 days) | JWT token lifespan in ms |
| `jwt.secretKey` | *(see config)* | JWT signing key |
| `otp.expiry.minutes` | `5` | OTP validity period |
| `spring.mail.username` | — | Gmail address for sending emails |
| `spring.mail.password` | — | Gmail App Password |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## 🐛 Known Issues & Troubleshooting

**❌ 403 Forbidden on login?**
→ CORS config confirm කරන්න. Backend restart කරන්න.

**❌ 400 Bad Request on event booking?**
→ `clientEmail` field send කරනවාද check කරන්න. User database ලෙ register ලෙ check කරන්න.

**❌ JWT expired errors?**
→ LocalStorage clear කරලා re-login කරන්න. (`jwt.expiration` 30 days set කළා)

**❌ Email/OTP not sending?**
→ Gmail App Password correctly configured දැයි confirm. `spring.mail.username` + `password` set කළාද?

**❌ MySQL connection failed?**
→ MySQL service running දැයි confirm. Username/password `application.properties` ලෙ correct දැයි check.

---

Demo Video : https://youtu.be/Gv7yRjj1jVg
## 👨‍💻 Author

<div align="center">

**Shehan Nethsara**

[![GitHub](https://img.shields.io/badge/GitHub-shehan--nethsara-181717?style=flat-square&logo=github)](https://github.com/shehan-nethsara)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/shehan-nethsara)

*IJSE — Institute of Java & Software Engineering, Sri Lanka*

</div>

---

<div align="center">

⭐ **If this project helped you, please give it a star!** ⭐

*Built with ❤️ in Sri Lanka*

</div>
