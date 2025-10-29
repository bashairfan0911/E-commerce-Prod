import mongoose from 'mongoose';
import 'dotenv/config';
import orderModel from './Models/orderModel.js';

// Connect to MongoDB
mongoose.connect(process.env.DBURI)
  .then(() => console.log('✅ Database connected'))
  .catch((error) => console.error('❌ Database connection error:', error));

async function updateOldOrders() {
  try {
    console.log('🔄 Updating old orders with tracking history...');
    
    const orders = await orderModel.find({});
    let updatedCount = 0;

    for (const order of orders) {
      let needsUpdate = false;

      // Add tracking history if missing
      if (!order.trackingHistory || order.trackingHistory.length === 0) {
        order.trackingHistory = [{
          status: order.orderStatus || 'pending',
          message: 'Order placed successfully',
          timestamp: order.createdAt || new Date()
        }];
        needsUpdate = true;
      }

      // Add estimated delivery if missing
      if (!order.estimatedDelivery) {
        const estimatedDelivery = new Date(order.createdAt || new Date());
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);
        order.estimatedDelivery = estimatedDelivery;
        needsUpdate = true;
      }

      // Set default order status if missing
      if (!order.orderStatus) {
        order.orderStatus = 'pending';
        needsUpdate = true;
      }

      // Set default payment method if missing
      if (!order.paymentMethod) {
        order.paymentMethod = 'cash';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await order.save();
        updatedCount++;
        console.log(`✅ Updated order: ${order._id}`);
      }
    }

    console.log(`\n🎉 Update complete!`);
    console.log(`Total orders: ${orders.length}`);
    console.log(`Updated orders: ${updatedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating orders:', error);
    process.exit(1);
  }
}

updateOldOrders();
