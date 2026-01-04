# Bike Yard

A modern, comprehensive marketplace and service management platform for the biking community. Bike Yard connects Riders, Sellers, and Mechanics in a seamless ecosystem with a premium "Nothing" inspired aesthetic.

## 🌟 Overview

Bike Yard serves three distinct user roles, each with specialized tools:
- **Riders (Buyers):** Buy bikes/parts, manage their garage, and book services.
- **Sellers:** List inventory, manage sales, and track revenue.
- **Mechanics:** Accept service/inspection jobs, buy parts, and manage their workflow.

## 🚀 Key Features

### 👤 For Riders (Buyers)
- **Marketplace:** Browse and filter a wide range of Bikes and Parts/Accessories.
- **My Garage:** Digital garage to manage owned bikes and view service history.
- **Service Booking:** Request inspections or services directly for garage bikes.
- **Order Management:** Track purchases and view past orders.
- **Smart Search:** Real-time search and filtering by price, category, and bike type.

### 🏪 For Sellers
- **Dashboard:** Real-time overview of Revenue, Items Sold, and Activity.
- **Inventory Management:** Add, Edit, and Delete listings (Bikes & Parts).
- **Order Fulfillment:** Manage order status (Processing, Shipped, Delivered).
- **Sales Analytics:** Visual tracking of sales performance.

### 🔧 For Mechanics
- **Job Board:** View and accept Inspection and Service requests in the area.
- **Active Job Management:** Track ongoing jobs, complete service reports, and mark jobs as done.
- **Part Market:** Dedicated marketplace access to source parts for repairs.
- **Work History:** Log of completed jobs and earnings.

## 🛠️ Tech Stack

**Frontend:**
- **React 19:** Core UI framework.
- **Vite:** Fast build tool and dev server.
- **Redux Toolkit:** robust global state management for Auth, Cart, and Dashboard data.
- **Framer Motion:** Smooth, complex animations and transitions.
- **Tailwind CSS:** Utility-first styling with a custom "Nothing" design system.
- **Lucide React:** Modern, consistent icon set.

**Design:**
- **Aesthetic:** "Nothing" phone inspired design language (Monochrome, Dot Matrix, Red Accents).
- **Dark Mode:** Native dark-themed UI.
- **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bike-yard-frontend.git
    cd bike-yard-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment:**
    - Create a `.env.local` file (copy from `.env.example`).
    - Add necessary API keys and endpoints.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will typically launch at `http://localhost:5173`.

5.  **Build for Production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `src/components/`: specialized components for each role (`seller/`, `mechanic/`, `user/`) and common UI elements.
- `src/store/`: Redux slices for state management (`authSlice`, `buyerSlice`, `sellerSlice`, `mechanicSlice`).
- `src/services/`: API integration services.
- `src/App.jsx`: Main routing and role-based access control logic.
