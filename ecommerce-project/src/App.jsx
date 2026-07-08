import {Routes , Route} from 'react-router';
import { HomePage } from './pages/HomePage'
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import axios from 'axios';
import './App.css'
import {useState, useEffect } from 'react';

function App() {
  const [cart,setCart]=useState([]);

  const fetchCart = () => {
    axios.get('/api/cart-items?expand=product').then((response)=>{
      setCart(response.data);
    });
  };

  useEffect(()=>{
    fetchCart();
  },[])
  

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} fetchCart={fetchCart}/>}></Route>
      <Route path="checkout" element={<CheckoutPage cart={cart} fetchCart={fetchCart}/>}></Route>
      <Route path="orders" element={<OrdersPage cart={cart} fetchCart={fetchCart} />}/>
      <Route path="tracking" element={<TrackingPage/>}/>
    </Routes>
  )
}

export default App
