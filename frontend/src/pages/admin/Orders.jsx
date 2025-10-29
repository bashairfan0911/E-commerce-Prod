import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;

  th, td {
    padding: 12px 15px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
    color: #333;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  select {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  .update-btn {
    background-color: #4CAF50;
    color: white;
  }

  .view-btn {
    background-color: #2196F3;
    color: white;
  }
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // This would need a backend endpoint to get all orders
      // For now, we'll show a message
      setLoading(false);
      toast.info('Order management coming soon!');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const toastId = toast.loading("Updating order status...");
    try {
      await api.put(`/api/updateorderstatus/${orderId}`, {
        orderStatus: newStatus,
        message: `Order status updated to ${newStatus}`
      });
      
      toast.update(toastId, {
        render: "Order status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      fetchOrders();
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update order status",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (loading) {
    return <h1>Loading orders...</h1>;
  }

  return (
    <div>
      <h5>Order Management</h5>
      <p>View and manage customer orders. Update order status to keep customers informed.</p>
      
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h6>Order Status Options:</h6>
        <ul>
          <li><strong>Pending:</strong> Order received, awaiting confirmation</li>
          <li><strong>Confirmed:</strong> Order confirmed and being prepared</li>
          <li><strong>Processing:</strong> Order is being processed</li>
          <li><strong>Shipped:</strong> Order has been shipped</li>
          <li><strong>Out for Delivery:</strong> Order is out for delivery</li>
          <li><strong>Delivered:</strong> Order has been delivered</li>
          <li><strong>Cancelled:</strong> Order has been cancelled</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          <strong>Note:</strong> To view and manage orders, you would need to implement a backend endpoint 
          to fetch all orders. For now, customers can track their orders from their account page.
        </p>
      </div>    </div>
  );
};

export default Orders;
