import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import CustomerLayout from './components/CustomerLayout';
import RequireRole from './components/RequireRole';

import Home from './pages/customer/Home';
import Category from './pages/customer/Category';
import ShopList from './pages/customer/ShopList';
import ShopDetails from './pages/customer/ShopDetails';
import Product from './pages/customer/Product';
import Cart from './pages/customer/Cart';
import PlaceOrder from './pages/customer/PlaceOrder';
import Tracking from './pages/customer/Tracking';
import { About, Help, Contact } from './pages/customer/InfoPages';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SellerRegistration from './pages/auth/SellerRegistration';
import DriverRegistration from './pages/auth/DriverRegistration';

import SellerDashboard from './pages/seller/SellerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer-facing routes — share the Header/Footer layout */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/shops" element={<ShopList />} />
              <Route path="/shop/:id" element={<ShopDetails />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/order/:orderId/tracking" element={<Tracking />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/seller/register" element={<SellerRegistration />} />
              <Route path="/driver/register" element={<DriverRegistration />} />
            </Route>

            {/* Role-specific dashboards — their own interface, gated by login */}
            <Route
              path="/seller/dashboard"
              element={
                <RequireRole role="seller">
                  <SellerDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/driver/dashboard"
              element={
                <RequireRole role="driver">
                  <DriverDashboard />
                </RequireRole>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
