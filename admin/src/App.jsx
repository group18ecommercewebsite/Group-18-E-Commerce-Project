import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Sidebar from './Components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const router = createBrowserRouter([
    {
      path:"/",
      exact:true,
      element: (
        <>
          <section className='main'>
            <Header/>
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[25%]'>
                <Sidebar/>
              </div>
            </div>
          </section>
        </>
      ),
      
    },
  ]);

  return (
    <>
      <Header onToggleSidebar={() => setSidebarOpen(s => !s)} />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-700">Admin</h1>
        <p className="mt-4 text-gray-600">Welcome to the admin dashboard</p>
      </main>
      <RouterProvider router={router}/>
    </>
  );
}

export default App
