import React from 'react'
import GoogleSuccess from "./pages/GoogleSuccess";
import Frontpage from './pages/Frontpage'
import Welcome from "./components/Welcome";
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Register from './pages/Register'
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import About from './pages/About'
import Trainers from './pages/Trainers'
import AIFitness from './pages/AIFitness'
import AIForm from './pages/AIForm'
import AIResult from './pages/AIResult'
import Plans from './pages/Plans'
import Membership from './pages/Membership'
import Contact  from './pages/Contact';
import Basic from "./pass/Basic";
import Pro from "./pass/Pro";
import Elite from "./pass/Elite";
import Unlimited from "./pass/Unlimited";
import HomeWorkout from "./pass/HomeWorkout";
import PersonalTrainer from "./pass/PersonalTrainer";
import Membership_payment from './payments/Membership_payment';
import OrderSummary from './payments/OrderSummary';
import Scanner from "./pages/Scanner";
import CameraScanner from "./pages/CameraScanner";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from './Admin/AdminDashboard';
import AdminUsers from "./Admin/AdminUsers";
import AdminUserDetails from "./Admin/AdminUserDetails";
import HomeWorkoutPlans from "./pass/HomeWorkoutPlans";
import AddProducts from "./Admin/AddProducts";
import ProductsList from "./Admin/ProductList";
import EditProduct from "./Admin/EditProduct";
import UserProducts from "./pages/UserProducts";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AddExercise from "./Admin/AddExercise";
import AllExercise from "./Admin/AllExercise";
import Exercise from './pages/Exercise';
import EditExercise from './Admin/EditExercise';
import AdminMessages from "./pages/AdminMessages";
import FreeTrial from './pass/FreeTrial';
import AdminEditUser from './pages/AdminEditUser';
import AdminMembership from './Admin/AdminMembership';
import AdminMembershipManager from './Admin/AdminMembershipManager';
import AdminOrders from './Admin/AdminOrders';
import AdminOrderDetails from './Admin/AdminOrderDetails';
import AdminUserOrders from './Admin/AdminUserOrders';
import AdminUserMembership from './Admin/AdminUserMembership';
import MembershipOrderDetails from "./pages/MembershipOrderDetails";
import AdminMembershipOrders from './Admin/AdminMembershipOrders';
import AMorderDetails from './Admin/AMorderDetails';
import AUserMembershipOrders from './Admin/AUserMembershipOrders'
const App = () => {
   return (
    <div>
      <BrowserRouter>

        {/* ⭐ GLOBAL SCROLL FIX */}
        <ScrollToTop />

        <Routes>

          <Route path="/" element={<Frontpage/>} />
          <Route path="/welcome" element={<Welcome/>}/>
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/camera-window" element={<CameraScanner />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/membership" element={<Membership/>}/>
          <Route path="/shop" element={<UserProducts />} />
<Route path="/store" element={<Store />} />
<Route path="/store/:productId" element={<ProductDetails />} />
<Route path="/cart" element={<CartPage />} />
<Route path="/checkout/address" element={<AddressPage />} />
<Route path="/checkout/payment" element={<PaymentPage />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path= "/orders" element={<Orders/>}/>
<Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/trainers" element={<Trainers/>}/>
          <Route path="/ai" element={<AIFitness/>}/>
          <Route path="/aiform" element={<AIForm/>}/>
          <Route path="/airesult" element={<AIResult/>}/>
          <Route path="/plans" element={<Plans/>}/>
          <Route path="/exercise" element={<Exercise/>}/>


<Route path ="/admin" element={<AdminDashboard/>}/>
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/user/:userId" element={<AdminUserDetails />} />
<Route path="/admin/edit-user/:userId" element={<AdminEditUser />} />
<Route path="/add-product" element={<AddProducts />} />
<Route path="/products-list" element={<ProductsList />} />
<Route path="/products-list/:id" element={<EditProduct />} />
<Route path="/admin/add-exercise" element={<AddExercise />} />
<Route path="/admin/edit-exercise/:id" element={<EditExercise/>}/>
<Route path="/admin/exercises" element={<AllExercise />} />
<Route path="/admin/messages" element={<AdminMessages />} />
<Route path ="/admin/trial-membership" element={<AdminMembership/>}/>
<Route path="/admin/plan-memberships" element={<AdminMembershipManager />}/>
<Route path="/admin/orders" element={<AdminOrders />} />
<Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
<Route path="/admin/user/:userId/orders" element={<AdminUserOrders />} />
<Route path="/admin/user/:userId/membership" element={<AdminUserMembership />} />
<Route
  path="/admin/membership-orders"
  element={<AdminMembershipOrders />}
/>
 <Route
    path="/admin/membership-orders/:id"
    element={<AMorderDetails/>}/>
    <Route
  path="/admin/user/:userId/membership-orders"
  element={<AUserMembershipOrders />}
/>
          <Route path="/basic" element={<Basic/>} />
          <Route path="/pro" element={<Pro/>} />
          <Route path="/elite" element={<Elite/>} />
          <Route path="/unlimited" element={<Unlimited/>} />
          <Route path="/home-workout" element={<HomeWorkout/>} />
          <Route path="/personal-trainer" element={<PersonalTrainer/>} />
          <Route path="/free-trial" element={<FreeTrial/>}/>

          <Route path="/home-workout-plans" element={<HomeWorkoutPlans/>} />

          <Route path="/membership-payment" element={<Membership_payment/>}/>
          <Route path="/order-summary" element={<OrderSummary/>}/>
          <Route path="/membership-orders/:id" element={<MembershipOrderDetails />} />

        </Routes>

      </BrowserRouter>
    </div>
  )
}
export default App

