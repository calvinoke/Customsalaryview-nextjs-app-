# 💼 Salary Management System

A modern web application built with **Next.js 14** and **TypeScript** for managing salaries securely and efficiently.  
Includes **role-based access** for Admin and User, commission tracking, and a responsive, mobile-friendly interface.

---

## 🚀 Features
- **🔐 Secure Authentication** with role-based dashboards (Admin & User)
- **📊 Salary & Commission Tracking** with detailed views
- **📱 Fully Responsive UI** for desktop, tablet, and mobile
- **🎨 Modern Design** powered by Tailwind CSS
- **⚡ Fast Navigation** using Next.js App Router

---

## 🛠 Tech Stack
- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom `AuthProviderWrapper`
- **Routing**: Next.js `Link`
- **Deployment Ready**: Works with Vercel, Railway, or any Node.js hosting

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](docs/screenshots/homepage.png)

### 🔑 Login Page
![Login Page](docs/screenshots/login.png)

### 📝 Register Page
![Register Page](docs/screenshots/register.png)

> **Note:** Place your screenshot images in `docs/screenshots/` for them to display correctly.

---

## 📂 Project Structure
app/
layout.tsx # Root layout, global styles, and AuthProvider
page.tsx / HomePage # Landing page with features and navigation
login/ # Login page
register/ # Registration page
providers/ # Auth context provider
public/ # Static assets
styles/ # Global styles (globals.css)

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/salary-management-system.git
cd salary-management-system
2️⃣ Install dependencies
bash
Copy
Edit
npm install
3️⃣ Set environment variables
Create a .env.local file in the project root and add:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:8000
4️⃣ Run the development server
bash
Copy
Edit
npm run dev