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
useEffect(()=>{
axios.get('http://localhost:3000/api/cart-items').then((response)=>{
    setCart(response.data);
  })
},[])
  

  return (
    <Routes>
      <Route index element={<HomePage cart={cart}/>}></Route>
      <Route path="checkout" element={<CheckoutPage cart={cart}/>}></Route>
      <Route path="orders" element={<OrdersPage/>}/>
      <Route path="tracking" element={<TrackingPage/>}/>
    </Routes>
  )
}

export default App
