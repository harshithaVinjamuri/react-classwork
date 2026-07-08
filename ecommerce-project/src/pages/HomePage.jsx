import axios from 'axios';
import './HomePage.css';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { formatMoney } from '../utils/money';
export function HomePage({cart, fetchCart}){
  const[products,setProducts]=useState([]);
  const[quantities, setQuantities]=useState({});
  const[addedMessageVisible, setAddedMessageVisible]=useState({});
  
  useEffect(()=>{
    axios.get('/api/products').then((response)=>{
    setProducts(response.data);
  });
  },[]); 

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    axios.post('/api/cart-items', { productId, quantity }).then(() => {
      fetchCart();
      setAddedMessageVisible((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedMessageVisible((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    });
  };

    return (
        <>
        <title>Ecommerce Project</title>
        <Header cart={cart}/>
    <div className="home-page">
      <div className="products-grid">
        {products.map((product)=>{
          return(
            <div key ={product.id} className="product-container">
          <div className="product-image-container">
            <img className="product-image"
              src= {product.image} />
          </div>

          <div className="product-name limit-text-to-2-lines">
            {product.name}
          </div>

          <div className="product-rating-container">
            <img className="product-rating-stars"
              src={`images/ratings/rating-${product.rating.stars * 10}.png`} />
            <div className="product-rating-count link-primary">
              {product.rating.count}
            </div>
          </div>

          <div className="product-price">
            {formatMoney(product.priceCents)}
          </div>

          <div className="product-quantity-container">
            <select value={quantities[product.id] || 1} onChange={(e) => setQuantities({ ...quantities, [product.id]: Number(e.target.value) })}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div className="product-spacer"></div>

          <div className={`added-to-cart ${addedMessageVisible[product.id] ? 'visible' : ''}`} style={{ opacity: addedMessageVisible[product.id] ? 1 : 0 }}>
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button 
            className="add-to-cart-button button-primary"
            onClick={() => handleAddToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>

          );
        })}
      </div>
    </div>
        </>
    )
}