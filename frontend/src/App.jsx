import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RootElement from "./components/RootElement";
import Home from "./pages/Home";
import Services from "./pages/Services";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminServices from "./pages/admin/AdminServices";
import AdminStaff from "./pages/admin/AdminStaff";
import RescheduleBooking from "./pages/Reschedule";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <RootElement />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "/services",
              element: <Services />,
            },
            {
              path: "/booking/:serviceID?",
              element: <Booking />,
            },
            {
              path: "/my-bookings",
              element: <MyBookings />,
            },
            {
              path: "/bookings/reschedule/:bookingId",
              element: <RescheduleBooking />,
            },
            {
              path: "/admin/bookings",
              element: <AdminBookings />,
            },
            {
              path: "/admin/services",
              element: <AdminServices />,
            },
            {
              path: "/admin/staff",
              element: <AdminStaff />,
            },
            {
              path: "/admin/dashboard",
              element: <AdminDashboard />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
