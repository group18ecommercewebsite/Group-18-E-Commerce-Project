// import { useState } from 'react'
// import './App.css'
// import {createBrowserRouter, RouterProvider} from "react-router-dom";
// import Dashboard from './Pages/Dashboard';
// import Header from './Components/Header'
// import Sidebar from './Components/Sidebar';
// import Login from './Pages/Login';
// import SignUp from './Pages/SignUp';

// function App() {
//   const [isSidebarOpen, setisSidebarOpen] = useState(false)
//   const [isLogin, setIsLogin] = useState(false)

//   const router = createBrowserRouter([
//     {
//       path:"/",
//       exact:true,
//       element: (
//         <>
//           <section className='main'>
//             <Header/>
//             <div className='contentMain flex'>
//               <div className='sidebarWrapper w-[25%]'>
//                 <Sidebar/>
//               </div>
//             </div>
//           </section>
//         </>
//       ),
//     },
//     {
//       path: "/login",
//       exact: true,
//       element: (
//         <>
//           <Login />
//         </>
//       )
//     },
//     {
//       path: "/sign-up",
//       exact: true,
//       element: (
//         <>
//           <SignUp />
//         </>
//       )
//     }
//   ]);

//   const values = {
//     isSidebarOpen,
//     setisSidebarOpen,
//     isLogin,
//     setIsLogin
//   }

//   return (
//     <>
//       <Header onToggleSidebar={() => setisSidebarOpen(s => !s)} />
//       <main className="max-w-7xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-gray-700">Admin</h1>
//         <p className="mt-4 text-gray-600">Welcome to the admin dashboard</p>
//       </main>
//       <RouterProvider router={router}/>
//     </>
//   );
// }

// export default App


import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

import Dashboard from './Pages/Dashboard';
import Sidebar from './Components/Sidebar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import AddProductPanel from './Components/AddProductPanel';
import { AddProductProvider } from './Context/AddProductContext';
import BannerPanel from './Components/BannerPanel';
import { BannerProvider } from './Context/BannerContext';
import HomeSlides from './Pages/HomeSlides';
import Categories from './Pages/Categories';
import AddCategory from './Pages/AddCategory';
import EditCategory from './Pages/EditCategory';
import AddSubCategory from './Pages/AddSubCategory';
import Products from './Pages/Products';
import EditProduct from './Pages/EditProduct';
import AddProduct from './Pages/AddProduct';
import Users from './Pages/Users';
import Orders from './Pages/Orders';
import CancellationRequests from './Pages/CancellationRequests';
import Coupons from './Pages/Coupons';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyOTP from './Pages/VerifyOTP';
import ChangePassword from './Pages/ChangePassword';
import Header from './Components/Header';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const Layout = () => (
    <>
      <Header onToggleSidebar={() => setIsSidebarOpen(s => !s)} />

      <section className='main flex h-[calc(100vh-64px)] overflow-hidden'>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className={`content flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'}`}>
          <Outlet />
        </div>
      </section>
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/sign-up",
      element: <SignUp />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/verify-otp",
      element: <VerifyOTP />
    },
    {
      path: "/change-password",
      element: <ChangePassword />
    },
    {
      path: "/home-slides",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <HomeSlides />
        }
      ]
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Products />
        },
        {
          path: "add",
          element: <AddProduct />
        },
        {
          path: "edit/:id",
          element: <EditProduct />
        }
      ]
    },
    {
      path: "/categories",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Categories />
        },
        {
          path: "add",
          element: <AddCategory />
        },
        {
          path: "edit/:id",
          element: <EditCategory />
        }
      ]
    },
    {
      path: "/category/subCat/add",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AddSubCategory />
        }
      ]
    },
    {
      path: "/users",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Users />
        }
      ]
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Orders />
        }
      ]
    },
    {
      path: "/cancellation-requests",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <CancellationRequests />
        }
      ]
    },
    {
      path: "/coupons",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Coupons />
        }
      ]
    }
  ]);

  return (
    <AuthProvider>
      <AddProductProvider>
        <BannerProvider>
          <RouterProvider router={router} />
          <AddProductPanel />
          <BannerPanel />
        </BannerProvider>
      </AddProductProvider>
    </AuthProvider>
  );
}

export default App;
