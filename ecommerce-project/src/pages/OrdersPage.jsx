import './OrdersPage.css';
import { Header } from '../components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { formatMoney } from '../utils/money';

export function OrdersPage({ cart, fetchCart }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders?expand=products').then((response) => {
            setOrders(response.data);
        });
    }, []);

    const handleBuyAgain = (productId) => {
        axios.post('/api/cart-items', { productId, quantity: 1 }).then(() => {
            if(fetchCart) fetchCart();
        });
    };

    return (
        <>
            <title>Orders</title>
            <Header cart={cart} />

            <div className="orders-page">
                <div className="page-title">Your Orders</div>

                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="order-container">
                            <div className="order-header">
                                <div className="order-header-left-section">
                                    <div className="order-date">
                                        <div className="order-header-label">Order Placed:</div>
                                        <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                                    </div>
                                    <div className="order-total">
                                        <div className="order-header-label">Total:</div>
                                        <div>{formatMoney(order.totalCostCents)}</div>
                                    </div>
                                </div>

                                <div className="order-header-right-section">
                                    <div className="order-header-label">Order ID:</div>
                                    <div>{order.id}</div>
                                </div>
                            </div>

                            <div className="order-details-grid">
                                {order.products && order.products.map((orderProduct) => (
                                    <div key={orderProduct.productId} style={{ display: 'contents' }}>
                                        <div className="product-image-container">
                                            <img src={orderProduct.product.image} />
                                        </div>

                                        <div className="product-details">
                                            <div className="product-name">
                                                {orderProduct.product.name}
                                            </div>
                                            <div className="product-delivery-date">
                                                Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D')}
                                            </div>
                                            <div className="product-quantity">
                                                Quantity: {orderProduct.quantity}
                                            </div>
                                            <button className="buy-again-button button-primary" onClick={() => handleBuyAgain(orderProduct.productId)}>
                                                <img className="buy-again-icon" src="images/icons/buy-again.png" />
                                                <span className="buy-again-message">Add to Cart</span>
                                            </button>
                                        </div>

                                        <div className="product-actions">
                                            <a href={`/tracking?orderId=${order.id}&productId=${orderProduct.productId}`}>
                                                <button className="track-package-button button-secondary">
                                                    Track package
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}