import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ProtectedRoute from './components/ProtectedRoute'

// Lazy load all pages
const Home = lazy(() => import('./pages/Home/Home'))
const Error404 = lazy(() => import('./pages/Error404'))
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'))
const Cart = lazy(() => import('./pages/Cart/Cart'))
const Login = lazy(() => import('./pages/User/Login'))
const Signup = lazy(() => import('./pages/User/Signup'))
const Account = lazy(() => import('./pages/User/Account'))
const UserDetails = lazy(() => import('./pages/User/UserDetails'))
const Order = lazy(() => import('./pages/User/Order'))
const OrderTracking = lazy(() => import('./pages/User/OrderTracking'))
const Address = lazy(() => import('./pages/User/Address'))
const AccountDetails = lazy(() => import('./pages/User/AccountDetails'))
const Logout = lazy(() => import('./pages/User/Logout'))
const Products = lazy(() => import('./pages/Products/Products'))
const SingleProduct = lazy(() => import('./pages/Products/SingleProduct'))
const Layout = lazy(() => import('./pages/admin/Layout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AllProducts = lazy(() => import('./pages/admin/AllProducts'))
const AddProduct = lazy(() => import('./pages/admin/AddProduct'))
const EditProduct = lazy(() => import('./pages/admin/EditProduct'))
const Category = lazy(() => import('./pages/admin/Category'))
const AddCategory = lazy(() => import('./pages/admin/AddCategory'))
const Orders = lazy(() => import('./pages/admin/Orders'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Checkout = lazy(() => import('./pages/User/Checkout'))


function App() {

  return (
    <>
     <ToastContainer 
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="light"
     />
     <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>}>
     <Routes>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
      <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
      <Route path='/checkout/:orderId' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>

      <Route path='/account' element={<ProtectedRoute><Account/></ProtectedRoute>}>
        <Route index element={<UserDetails/>}/>
        <Route path='order' element={<Order/>}/>
        <Route path='ordertracking' element={<OrderTracking/>}/>
        <Route path='address' element={<Address/>}/>
        <Route path='accountdetails' element={<AccountDetails/>}/>
        <Route path='logout' element={<Logout/>}/>
      </Route>

      <Route path='/singleProduct/:id' element={<SingleProduct/>}/>
      <Route path={'/products'} element={<Products/>}/>
      <Route path={'/products/:catname'} element={<Products/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route path='/admin/login' element={<AdminLogin/>}/>

      <Route path='/admin' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='allproducts' element={<AllProducts/>}/>
        <Route path='addproduct' element={<AddProduct/>}/>
        <Route path='editproduct/:id' element={<EditProduct/>}/>
        <Route path='allcategory' element={<Category/>}/>
        <Route path='addcategory' element={<AddCategory/>}/>
        <Route path='orders' element={<Orders/>}/>
      </Route>



      <Route path='*' element={<Error404/>}/>
     </Routes>
     </Suspense>
    </>
  )
}

export default App
