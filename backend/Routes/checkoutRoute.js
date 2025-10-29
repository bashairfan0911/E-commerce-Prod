import express from 'express'
import { createOrder, showOrder, startPayment, updateOrderStatus, cancelOrder, getAllOrders } from '../Controller/checkoutController.js'

const route = express.Router()


route.post('/createorder', createOrder);
route.get('/showorder/:orderId', showOrder);
route.post('/startpayment', startPayment);
route.put('/updateorderstatus/:orderId', updateOrderStatus);
route.put('/cancelorder/:orderId', cancelOrder);
route.get('/allorders', getAllOrders);


export default route;
