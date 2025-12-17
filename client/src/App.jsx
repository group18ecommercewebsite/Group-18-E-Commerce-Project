import './App.css'
import { Header } from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import Login  from './pages/Login'
import Register from './pages/Register'

function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' exact={true} element={<Home/>}/>
          <Route path='/login' exact={true} element={<Login/>}/>
          <Route path='/register' exact={true} element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
