import { useState } from 'react'
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const router = createBrowserRouter([
    {
      path:"/",
      exact:true,
      element: (
        <>
          <section className='main min-h-screen bg-gray-50'>
            <Header onToggleSidebar={() => setSidebarOpen(s => !s)} sidebarOpen={sidebarOpen} />
            <div className='contentMain flex'>
              <Sidebar isOpen={sidebarOpen}/>
              <div className={`contentWrapper flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[18%]' : 'ml-[70px]'}`}>
                <Dashboard/>
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App
