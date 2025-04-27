# 🖥️ Zone 25-14 Frontend

This is the main frontend client for **Zone 25-14** —  
a hybrid platform built for loyalty, rebellion, brotherhood, and limitless creativity.

The frontend acts as the **face of the empire**,  
connecting users to the backend systems, loyalty engines, and the cultural core of Zone 25-14.

---

## 🧠 About the Frontend

Zone 25-14 is not just an e-commerce platform.  
It’s a **movement**, **a lifestyle**, and **a rebellion**.

The frontend is designed to be:

- Lightning-fast
- Modern and clean
- Highly scalable
- Dark/light mode ready
- Fully responsive across devices
- Deeply connected to loyalty, roles, products, and user profiles

---

## 🛠️ Technologies Used

| Stack | Description |
|:------|:------------|
| Next.js 14+ (App Router) | Full-stack React Framework |
| React 18+ | Core frontend library |
| TailwindCSS v4 | Utility-first CSS framework |
| TypeScript | Full typing support |
| Axios | Backend API communication |
| FontAwesome | Icon set integration |
| Context API (Planned) | Global state management (auth, cart, etc.) |

---

## 📋 Project Structure

```bash
zone-25-14-frontend/
├── public/           # Static assets (images, icons, fonts)
├── src/
│   ├── app/          # Pages (Next.js App Router structure)
│   │   ├── login/    # Login page
│   │   ├── register/ # Register page
│   │   ├── profile/  # Profile page
│   │   ├── products/ # Products listing page
│   │   ├── layout.tsx # Global layout
│   │   ├── globals.css # Global Tailwind + Custom CSS
│   ├── components/   # Shared UI components (Button, Input, Card, etc.) (Planned)
│   ├── utils/        # API functions (loginUser, registerUser, fetchProducts, etc.)
│   ├── lib/          # FontAwesome config and utilities
├── .env.local        # Environment variables
├── tailwind.config.ts# Tailwind configuration
├── tsconfig.json     # TypeScript configuration
├── package.json      # Project metadata and dependencies

---

## 🛡️ Key Features Implemented

    Feature                                     | Status
    Global TailwindCSS Styling                  | ✅
    FontAwesome Icon System                     | ✅
    Register / Login / Profile Pages            | ✅
    Product Listing Page                        | ✅
    JWT Token Storage with Axios Interceptors   | ✅
    Dark Theme Base                             | ✅

---

## 📦 How to Run Locally

1.Clone the repository:
    -git clone https://github.com/YOUR-USERNAME/zone-25-14-frontend.git

2.Install dependencies:
    -npm install

3.Create a .env.local file:
    -NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ✅ (Point to your backend server)

4.Start development server:
    -npm run dev
    ✅ Frontend will run at:
    http://localhost:3000/
    
---

## 🎨 Current Pages Available

Page            | Description
/               | Landing Page
/login          | User Login Page
/register       | User Registration Page
/profile        | User Profile Information
/products       | Explore Products Page

---

## 🔥 Future Planned Features

    -Cart System (Add to Cart, Checkout)
    -Wishlist System (Favorites)
    -Order History Page
    -Admin Dashboard
    -Loyalty Progression UI (Levels, Badges)
    -Friends and Messaging System
    -Public Profiles and Public Wishlists
    -Theme Switching (Light/Dark modes toggle)
    -Animated Background Effects (Grid, Lights, Glitch)

---

## 🛡️ Frontend Design Philosophy

    -Minimalistic but powerful
    -Built for speed and scale
    -Deep loyalty and personalization
    -Rebellion in aesthetics, but discipline in structure
    -Designed for dreamers, builders, and outsiders

---