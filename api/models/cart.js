const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      imgId: String,
      name: String,
      description: String,
      price: Number,
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
