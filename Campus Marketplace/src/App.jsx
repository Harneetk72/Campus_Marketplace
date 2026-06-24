import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./Common/Layout.jsx";

import Dashboard from "./Pages/Dashboard.jsx";
import Chats from "./Pages/Chats.jsx";
import Chat from "./Pages/Chat.jsx"; // ✅ NEW PAGE (IMPORTANT)

import Orders from "./Pages/Orders.jsx";
import Products from "./Pages/Products.jsx";
import MyListing from "./Pages/My-listing.jsx";
import Wishlist from "./Pages/Wishlist.jsx";

import Signup from "./Pages/Signup.jsx";
import Signin from "./Components/Signin.jsx";

import CreateProduct from "./Components/CreateProduct.jsx";
import ProductDetails from "./Components/ProductDetails.jsx";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import MyProfile from "./Pages/My-profile.jsx";  

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,

      children: [

        /* PUBLIC ROUTES */

        {
          path: "",
          element: <Dashboard />,
        },

        {
          path: "dashboard",
          element: <Dashboard />,
        },

        {
          path: "products",
          element: <Products />,
        },

        {
          path: "product/:id",
          element: <ProductDetails />,
        },

        {
          path: "signin",
          element: <Signin />,
        },

        {
          path: "signup",
          element: <Signup />,
        },

        /* CHAT ROUTES */

        {
          path: "chats",
          element: (
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          ),
        },

        {
          path: "chat/:id",
          element: (
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          ),
        },

        /* OTHER PROTECTED ROUTES */

        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },

        {
          path: "wishlist",
          element: (
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          ),
        },

        {
          path: "my-listing",
          element: (
            <ProtectedRoute>
              <MyListing />
            </ProtectedRoute>
          ),
        },

        {
          path: "my-profile",
          element: (
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          ),
        },

        {
          path: "create",
          element: (
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          ),
        },

      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;