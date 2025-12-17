import './App.css';
import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';


function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/login" exact={true} element={<Login />} />
          <Route path="/register" exact={true} element={<Register />} />
          <Route path="/productListing" exact={true} element={<ProductListing />} />
          <Route path="/product/:id" exact={true} element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
