import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user details to get order IDs
        const token = localStorage.getItem('token');
        const response = await api.get('/api/userdetails', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userOrders = response.data.user.order || [];
        
        // Fetch each order details
        const orderPromises = userOrders.map(orderId => 
          api.get(`/api/showorder/${orderId}`)
        );
        
        const orderResponses = await Promise.all(orderPromises);
        const ordersData = orderResponses.map(res => res.data.order);
        
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    console.log('Cancelling order:', orderId);
    const toastId = toast.loading("Cancelling order...");
    try {
      const response = await api.put(`/api/cancelorder/${orderId}`);
      console.log('Cancel response:', response.data);
      
      // Update the order in the list
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, orderStatus: 'cancelled' }
          : order
      ));

      toast.update(toastId, {
        render: "Order cancelled successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error('Cancel error:', error);
      toast.update(toastId, {
        render: error.response?.data?.message || "Failed to cancel order",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const canCancelOrder = (order) => {
    return !['shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(order.orderStatus);
  };

  const filteredOrders = showCancelled 
    ? orders 
    : orders.filter(order => order.orderStatus !== 'cancelled');

  if (loading) {
    return (
      <div className="order-table-account">
        <div className="h2 title">Your Orders</div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className="order-table-account">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="h2 title">Your Orders</div>
          <label style={{ fontSize: '14px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show cancelled orders
          </label>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.items.length} item(s)</td>
                    <td>
                      ₹{order.totalAmount}
                      {order.orderStatus === 'cancelled' && (
                        <span style={{ 
                          display: 'block', 
                          color: '#dc3545', 
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          CANCELLED
                        </span>
                      )}
                    </td>
                    <td>
                      <Link 
                        to={`/account/ordertracking?orderId=${order._id}`} 
                        className="btn-small d-block"
                        style={{ marginBottom: '5px' }}
                      >
                        Track Order
                      </Link>
                      <Link 
                        to={`/checkout/${order._id}`} 
                        className="btn-small d-block"
                        style={{ marginBottom: '5px' }}
                      >
                        View Details
                      </Link>
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="btn-small d-block"
                          style={{ 
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    You have not ordered yet. <Link to="/products">Start Shopping</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Order;
