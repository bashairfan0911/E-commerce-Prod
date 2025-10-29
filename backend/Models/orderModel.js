import mongoose from 'mongoose'

const { Schema } = mongoose

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId , ref: 'Product'},
            quantity: { type: Number, min: 1 }
        }
    ],
    totalAmount: {
        type: Number,
        min: 0
    },
    paymentId: {
        type: String
    },
    receipt: {
        type: String
    },
    status: {
        type: String,
        enum: ['created', 'failed', 'paid'],
        default: 'created'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'online'],
        default: 'cash'
    },
    shippingAddress: {
        firstname: String,
        lastname: String,
        email: String,
        country: String,
        street_address: String,
        city: String,
        state: String,
        zip_code: String,
        phone: String
    },
    trackingHistory: [{
        status: String,
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    estimatedDelivery: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const orderModel = mongoose.model('Order', orderSchema)

export default orderModel