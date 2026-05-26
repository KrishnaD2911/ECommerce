import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { asyncHandler, ErrorHandler } from '../middleware/error.middleware.js';

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return next(new ErrorHandler('No order items', 400));
  }

  // Optional: Verify prices and calculate server-side, but trusting frontend for this demo
  
  // Create order
  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    status: 'completed', // auto-complete for demo
  });

  // Deduct stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  // Wait, reducing stock should also emit a socket event. 
  // We can import getIO and emit it, but avoiding circular dep if needed.
  // Actually, we can just import getIO here too.
  import('../socket.js').then(({ getIO }) => {
    try {
      getIO().emit('products_updated');
    } catch (e) {
      console.log('Socket not ready');
    }
  });

  res.status(201).json({
    success: true,
    order,
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/v1/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});
