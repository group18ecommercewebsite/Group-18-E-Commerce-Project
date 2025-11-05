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
      <RouterProvider router={router}/>
    </>
  );
}

export default App
