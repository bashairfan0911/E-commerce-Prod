import Razorpay from "razorpay";
import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import cartModel from "../Models/cartModel.js";

// Initialize Razorpay only if credentials are provided
let razorpayInstance = null;

if (process.env.KEY_ID && process.env.KEY_SECRET && 
    process.env.KEY_ID !== 'your_razorpay_key_id' && 
    process.env.KEY_SECRET !== 'your_razorpay_key_secret') {
  razorpayInstance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
  console.log('Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
}


export const createOrder = async (req, res) => {

  const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body

  try {
    // Calculate estimated delivery (5-7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);

    const newOrder = new orderModel({ 
      userId, 
      items, 
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      orderStatus: 'pending',
      estimatedDelivery,
      trackingHistory: [{
        status: 'pending',
        message: 'Order placed successfully',
        timestamp: new Date()
      }]
    })
    
    const user = await userModel.findOne({_id: userId})
    user.order.push(newOrder._id)
    await newOrder.save()
    await user.save()
    
    // Clear the user's cart after order is placed
    await cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } }
    );
    console.log('Cart cleared for user:', userId);
    
    res.status(200).json({message: "Order created", order: newOrder})
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order'});
  }

}

export const showOrder = async(req,res)=>{
  const {orderId} = req.params
  console.log(orderId)

  try {
    const order = await orderModel.findOne({_id: orderId}).populate('items.productId')
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add default tracking history if missing (for old orders)
    if (!order.trackingHistory || order.trackingHistory.length === 0) {
      order.trackingHistory = [{
        status: order.orderStatus || 'pending',
        message: 'Order placed successfully',
        timestamp: order.createdAt || new Date()
      }];
      await order.save();
    }

    // Add default estimated delivery if missing
    if (!order.estimatedDelivery) {
      const estimatedDelivery = new Date(order.createdAt);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);
      order.estimatedDelivery = estimatedDelivery;
      await order.save();
    }

    // Log if any products are missing
    const missingProducts = order.items.filter(item => !item.productId);
    if (missingProducts.length > 0) {
      console.warn(`⚠️  Order ${orderId} has ${missingProducts.length} missing products`);
    }

    res.status(200).json({message: "order fetched successfully", order: order})
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error in finding order'});
  }
}

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, message } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    order.trackingHistory.push({
      status: orderStatus,
      message: message || `Order status updated to ${orderStatus}`,
      timestamp: new Date()
    });

    await order.save();
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  console.log('Cancel order request:', orderId);

  try {
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Current order status:', order.orderStatus);

    // Only allow cancellation if order is not shipped or delivered
    const currentStatus = order.orderStatus || 'pending';
    if (['shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(currentStatus)) {
      console.log('Cannot cancel order with status:', currentStatus);
      return res.status(400).json({ 
        message: `Cannot cancel order that is ${currentStatus}` 
      });
    }

    order.orderStatus = 'cancelled';
    
    // Initialize trackingHistory if it doesn't exist
    if (!order.trackingHistory) {
      order.trackingHistory = [];
    }
    
    order.trackingHistory.push({
      status: 'cancelled',
      message: 'Order cancelled by customer',
      timestamp: new Date()
    });

    await order.save();
    console.log('Order cancelled successfully');
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

export const startPayment = async (req, res) => {
  // Check if Razorpay is configured
  if (!razorpayInstance) {
    return res.status(503).json({ 
      message: "Payment service not configured. Please add Razorpay credentials to .env file" 
    });
  }

  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,
    currency: currency || "INR",
    receipt: `receipt#${Math.random() * 10000}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ message: "Order successfully", order: order });
  } catch (error) {
    res.status(500).json({ message: "No order created" });
  }
};


// Get all orders for admin dashboard
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('userId', 'firstname lastname email')
      .populate('items.productId', 'title images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "All orders fetched successfully",
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message
    });
  }
};
