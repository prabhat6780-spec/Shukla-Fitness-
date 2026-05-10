const express = require('express');
const {upload} = require('../config/multer');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');
const {
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
} = require('../controllers/products');

// Public
router.get('/products',                         getAllProducts);
router.get("/products/recommended/:productId", getRecommendedProducts);
router.get('/products/:productId',              getProduct);

// User Protected
router.get('/cart',                             verifyToken, getCart);
router.post('/cart/add',                        verifyToken, addToCart);
router.put('/cart/update',                      verifyToken, updateCartItem);
router.delete('/cart/remove',                   verifyToken, removeFromCart);
router.delete('/cart/clear',                    verifyToken, clearCart);
router.post('/orders/create',                   verifyToken, createOrder);
router.post('/orders/verify-payment',           verifyToken, verifyPayment);
router.get('/orders',                           verifyToken, getMyOrders);
router.get('/orders/:orderId',                  verifyToken, getSingleOrder);
router.get('/address', verifyToken, getAddress);
router.post('/address', verifyToken, saveAddress);
router.put('/address/:addressId', verifyToken, updateAddress);
router.delete('/address/:addressId', verifyToken, deleteAddress);
router.put('/address/default/:addressId', verifyToken, setDefaultAddress);


// Admin Only
router.get('/admin/products',                   verifyToken, isAdmin, adminGetAllProducts);
router.post('/admin/products',verifyToken,  isAdmin,  upload.array('images', 5), addProduct);
router.put('/admin/products/:productId',        verifyToken, isAdmin, upload.array('images', 5), updateProduct);
router.delete('/admin/products/:productId',     verifyToken, isAdmin, deleteProduct);
router.get('/admin/orders',                     verifyToken, isAdmin, getAllOrders);
router.get('/admin/orders/:orderId',            verifyToken, isAdmin, getAdminSingleOrder);
router.put('/admin/orders/:orderId/status',     verifyToken, isAdmin, updateOrderStatus);
router.get("/admin/users/:userId/orders", verifyToken, isAdmin, getOrdersByUser);
module.exports = router;