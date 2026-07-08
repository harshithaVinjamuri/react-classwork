import axios from 'axios';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './checkout-header.css';
import './CheckoutPage.css';
import { formatMoney } from '../utils/money';

export function CheckoutPage({cart, fetchCart}){
  const [deliveryOptions,setDeliveryOptions]=useState([]);
  const [paymentSummary, setPaymentSummary]=useState(null);
  const [editingQuantityId, setEditingQuantityId]=useState(null);
  const [newQuantity, setNewQuantity]=useState(1);
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get('/api/delivery-options?expand=estimatedDeliveryTime').then((response)=>{
      setDeliveryOptions(response.data);
    });
  },[]);

  useEffect(() => {
    axios.get('/api/payment-summary').then((response) => {
      setPaymentSummary(response.data);
    });
  }, [cart]);

  const handleDelete = (productId) => {
    axios.delete(`/api/cart-items/${productId}`).then(() => {
      fetchCart();
    });
  };

  const handleUpdateDeliveryOption = (productId, deliveryOptionId) => {
    axios.put(`/api/cart-items/${productId}`, { deliveryOptionId }).then(() => {
      fetchCart();
    });
  };

  const handleUpdateQuantityClick = (cartItem) => {
    setEditingQuantityId(cartItem.productId);
    setNewQuantity(cartItem.quantity);
  };

  const handleSaveQuantity = (productId) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      axios.put(`/api/cart-items/${productId}`, { quantity: newQuantity }).then(() => {
        setEditingQuantityId(null);
        fetchCart();
      });
    }
  };

  const handlePlaceOrder = () => {
    axios.post('/api/orders').then(() => {
      fetchCart();
      navigate('/orders');
    });
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return(
    <>
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (<a className="return-to-home-link" href="/">{cartItemsCount} items</a>)
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 && cart.map((cartItem)=>{
              const selectedDeliveryOption = deliveryOptions.find((deliveryOption)=>{
                return deliveryOption.id === cartItem.deliveryOptionId;
              }) || deliveryOptions[0]; // fallback
              return(
                <div key={cartItem.productId} className="cart-item-container">
                  <div className="delivery-date">
                    Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                  </div>

                  <div className="cart-item-details-grid">
                    <img className="product-image" src={cartItem.product.image} />

                    <div className="cart-item-details">
                      <div className="product-name">
                        {cartItem.product.name}
                      </div>
                      <div className="product-price">
                        {formatMoney(cartItem.product.priceCents)}
                      </div>
                      <div className="product-quantity">
                        <span>
                          Quantity: {' '}
                          {editingQuantityId === cartItem.productId ? (
                            <input 
                              type="number" 
                              value={newQuantity} 
                              onChange={(e) => setNewQuantity(Number(e.target.value))}
                              min="1" max="10"
                              style={{ width: '50px' }}
                            />
                          ) : (
                            <span className="quantity-label">{cartItem.quantity}</span>
                          )}
                        </span>
                        
                        {editingQuantityId === cartItem.productId ? (
                          <span className="update-quantity-link link-primary" onClick={() => handleSaveQuantity(cartItem.productId)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                            Save
                          </span>
                        ) : (
                          <span className="update-quantity-link link-primary" onClick={() => handleUpdateQuantityClick(cartItem)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                            Update
                          </span>
                        )}

                        <span className="delete-quantity-link link-primary" onClick={() => handleDelete(cartItem.productId)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                          Delete
                        </span>
                      </div>
                    </div>

                    <div className="delivery-options">
                      <div className="delivery-options-title">
                        Choose a delivery option:
                      </div>
                      {deliveryOptions.map((deliveryOption)=>{
                        let priceString='FREE SHIPPING';
                        if(deliveryOption.priceCents > 0){
                          priceString= `${formatMoney(deliveryOption.priceCents)} - Shipping`;
                        }
                        return(
                          <div key={deliveryOption.id} className="delivery-option" onClick={() => handleUpdateDeliveryOption(cartItem.productId, String(deliveryOption.id))}>
                            <input type="radio" 
                              checked={String(deliveryOption.id) === String(cartItem.deliveryOptionId)}
                              onChange={() => handleUpdateDeliveryOption(cartItem.productId, String(deliveryOption.id))}
                              className="delivery-option-input"
                              name={`delivery-option-${cartItem.productId}`} />
                            <div>
                              <div className="delivery-option-date">
                                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                              </div>
                              <div className="delivery-option-price">
                                {priceString}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">
              Payment Summary
            </div>

            {paymentSummary && (
              <>
                <div className="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems}):</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.productCostCents)}</div>
                </div>

                <div className="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.shippingCostCents)}</div>
                </div>

                <div className="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostBeforeTaxCents)}</div>
                </div>

                <div className="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.taxCents)}</div>
                </div>

                <div className="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostCents)}</div>
                </div>

                <button className="place-order-button button-primary" onClick={handlePlaceOrder}>
                  Place your order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}