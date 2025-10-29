import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      toast.error('No order ID provided');
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log('Fetching order:', orderId);
      const response = await api.get(`/api/showorder/${orderId}`);
      console.log('Order response:', response.data);
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.response?.data?.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const toastId = toast.loading('Cancelling order...');
    try {
      const response = await api.put(`/api/cancelorder/${orderId}`);
      toast.update(toastId, {
        render: 'Order cancelled successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      // Refresh order details
      fetchOrderDetails();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.update(toastId, {
        render: error.response?.data?.message || 'Failed to cancel order',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4169E1',
      processing: '#9370DB',
      shipped: '#20B2AA',
      out_for_delivery: '#FF6347',
      delivered: '#32CD32',
      cancelled: '#DC143C'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'fa-clock',
      confirmed: 'fa-check-circle',
      processing: 'fa-cog',
      shipped: 'fa-truck',
      out_for_delivery: 'fa-shipping-fast',
      delivered: 'fa-check-double',
      cancelled: 'fa-times-circle'
    };
    return icons[status] || 'fa-circle';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Order Pending',
      confirmed: 'Order Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '48px', color: '#629D23' }}></i>
        </div>
        <p>Loading order details...</p>
        <p style={{ fontSize: '12px', color: '#666' }}>Order ID: {orderId || 'Not provided'}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <i className="fa fa-exclamation-circle" style={{ fontSize: '48px', color: '#ff6b6b', marginBottom: '20px' }}></i>
        <p>Order not found</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Order ID: {orderId}</p>
        <Link to="/account/order" style={{ marginTop: '20px', display: 'inline-block' }} className="rts-btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-tracking-area" style={{ padding: '20px' }}>
      <h2 className="title">Order Tracking</h2>
      
      {/* Order Info */}
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
            <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          </div>
          <div>
            <p><strong>Payment Method:</strong> {(order.paymentMethod || 'cash') === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}</p>
            <p style={{ 
              color: getStatusColor(order.orderStatus),
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              <i className={`fa ${getStatusIcon(order.orderStatus)}`}></i> {getStatusLabel(order.orderStatus)}
            </p>
            
            {/* Cancel Button - Only show for pending/confirmed orders */}
            {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
              <button
                onClick={handleCancelOrder}
                className="rts-btn btn-outline"
                style={{
                  marginTop: '10px',
                  backgroundColor: 'white',
                  color: '#dc3545',
                  border: '2px solid #dc3545',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#dc3545';
                }}
              >
                <i className="fa fa-times-circle"></i> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Tracking History</h3>
        <div style={{ position: 'relative', paddingLeft: '40px' }}>
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '15px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: '#ddd'
          }}></div>

          {/* Timeline Items */}
          {order.trackingHistory && order.trackingHistory.length > 0 ? (
            [...order.trackingHistory].reverse().map((track, index) => (
              <div key={index} style={{ 
                position: 'relative',
                marginBottom: '30px',
                paddingLeft: '20px'
              }}>
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-25px',
                  top: '5px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(track.status),
                  border: '3px solid white',
                  boxShadow: '0 0 0 2px ' + getStatusColor(track.status)
                }}></div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                  }}>
                    <strong style={{ color: getStatusColor(track.status) }}>
                      {getStatusLabel(track.status)}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(track.timestamp)}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#666' }}>{track.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#666'
            }}>
              <i className="fa fa-clock" style={{ fontSize: '48px', marginBottom: '10px', color: '#FFA500' }}></i>
              <p>Your order is being processed. Tracking information will be available soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3>Order Items</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          {order.items && order.items.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <img 
                src={item.productId?.images[0]?.url} 
                alt={item.productId?.title}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '15px'
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{item.productId?.title || 'Product'}</h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Quantity: {item.quantity} × ₹{item.productId?.sellingprice || 0}
                </p>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                ₹{(item.productId?.sellingprice || 0) * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div style={{ marginTop: '30px' }}>
          <h3>Shipping Address</h3>
          <div style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <p><strong>{order.shippingAddress.firstname} {order.shippingAddress.lastname}</strong></p>
            <p>{order.shippingAddress.street_address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip_code}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      )}    </div>
  );
}

export default OrderTracking;
