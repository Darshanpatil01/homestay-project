import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import UserProtectedRoute from "../components/auth/UserProtectedRoute.jsx";
import ClientProtectedRoute from "../components/auth/ClientProtectedRoute.jsx";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute.jsx";

import RegisterPage from "../pages/auth/RegisterPage.jsx";

import HomePage from "../pages/user/HomePage.jsx";
import HomestaysPage from "../pages/user/HomestaysPage.jsx";
import HomestayDetailsPage from "../pages/user/HomestayDetailsPage.jsx";
import DestinationsPage from "../pages/user/DestinationsPage.jsx";
import DestinationDetailsPage from "../pages/user/DestinationDetailsPage.jsx";
import ExperiencesPage from "../pages/user/ExperiencesPage.jsx";
import AboutPage from "../pages/user/AboutPage.jsx";
import ContactPage from "../pages/user/ContactPage.jsx";
import BookingPage from "../pages/user/BookingPage.jsx";
import MyBookingsPage from "../pages/user/MyBookingsPage.jsx";
import WishlistPage from "../pages/user/WishlistPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import ChangePasswordPage from "../pages/user/ChangePasswordPage.jsx";

import ClientLoginPage from "../pages/client/ClientLoginPage.jsx";
import ClientDashboardPage from "../pages/client/ClientDashboardPage.jsx";
import ClientHomePage from "../pages/client/ClientHomePage.jsx";
import ClientPropertiesPage from "../pages/client/ClientPropertiesPage.jsx";
import ClientBookingsPage from "../pages/client/ClientBookingsPage.jsx";
import ClientProfilePage from "../pages/client/ClientProfilePage.jsx";

import AdminLoginPage from "../pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AdminPropertiesPage from "../pages/admin/AdminPropertiesPage.jsx";
import AdminBookingsPage from "../pages/admin/AdminBookingsPage.jsx";
import AdminProfilePage from "../pages/admin/AdminProfilePage.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public website routes */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/homestays"
        element={<HomestaysPage />}
      />

      <Route
        path="/homestays/:id"
        element={<HomestayDetailsPage />}
      />

      <Route
        path="/destinations"
        element={<DestinationsPage />}
      />

      <Route
        path="/destinations/:id"
        element={<DestinationDetailsPage />}
      />

      <Route
        path="/experiences"
        element={<ExperiencesPage />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Protected user routes */}

      <Route
        path="/booking/:id"
        element={
          <UserProtectedRoute>
            <BookingPage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <UserProtectedRoute>
            <MyBookingsPage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <UserProtectedRoute>
            <WishlistPage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <UserProtectedRoute>
            <ProfilePage />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <UserProtectedRoute>
            <ChangePasswordPage />
          </UserProtectedRoute>
        }
      />

      {/* Client routes */}

      <Route
        path="/client/login"
        element={<ClientLoginPage />}
      />

      <Route
        path="/client/dashboard"
        element={
          <ClientProtectedRoute>
            <ClientDashboardPage />
          </ClientProtectedRoute>
        }
      />

      <Route
        path="/client"
        element={
          <ClientProtectedRoute>
            <ClientHomePage />
          </ClientProtectedRoute>
        }
      />

      <Route
        path="/client/properties"
        element={
          <ClientProtectedRoute>
            <ClientPropertiesPage />
          </ClientProtectedRoute>
        }
      />

      <Route
        path="/client/bookings"
        element={
          <ClientProtectedRoute>
            <ClientBookingsPage />
          </ClientProtectedRoute>
        }
      />

      <Route
        path="/client/profile"
        element={
          <ClientProtectedRoute>
            <ClientProfilePage />
          </ClientProtectedRoute>
        }
      />

      {/* Admin routes */}

      <Route
        path="/admin"
        element={<AdminLoginPage />}
      />

      <Route
        path="/admin/login"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsersPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/properties"
        element={
          <AdminProtectedRoute>
            <AdminPropertiesPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminProtectedRoute>
            <AdminBookingsPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <AdminProtectedRoute>
            <AdminProfilePage />
          </AdminProtectedRoute>
        }
      />

      {/* Unknown route */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;