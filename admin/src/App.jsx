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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from './Pages/Dashboard';
import Sidebar from './Components/Sidebar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const Layout = () => (
    <>
      <Header onToggleSidebar={() => setIsSidebarOpen(s => !s)} />

      <section className='main flex'>
        <div className={`sidebarWrapper w-[25%] ${isSidebarOpen ? '' : 'hidden'}`}>
          <Sidebar />
        </div>

        <div className="content flex-1">
          <Dashboard />
        </div>
      </section>
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/sign-up",
      element: <SignUp />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
