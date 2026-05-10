const { getAllProducts, getProduct, getRecommendedProducts }                            = require('./product');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('./cart');
const { createOrder, verifyPayment, getMyOrders, getSingleOrder } = require('./order');
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getAdminSingleOrder,
    updateOrderStatus,
    adminGetAllProducts,
    getOrdersByUser
} = require('./admin');
const {getAddress,
  saveAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress} = require('./address');

module.exports = {
    getAllProducts,
    getProduct,
    getRecommendedProducts,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    verifyPayment,
    getMyOrders,
    getSingleOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getAdminSingleOrder,
    updateOrderStatus,
    adminGetAllProducts,
    getAddress,
  saveAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getOrdersByUser
};