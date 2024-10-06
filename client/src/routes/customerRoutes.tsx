import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../modules/customer/pages/home";
import Cart from "../modules/customer/components/cart/cart";
import Navbar from "../modules/customer/components/navbar/navbar";
import Footer from "../modules/customer/components/footer/footer";
import Product from "../modules/customer/components/product/product";
import ProductDetails from "../modules/customer/components/productDetails/productDetails";
import Checkout from "../modules/customer/components/checkout/checkout";
import Order from "../modules/customer/components/order/order";
import OrderDetails from "../modules/customer/components/order/orderDetails";
import AppRoutes from "../common/appRoutes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CustomerRoutes() {
  const homePaths = [AppRoutes.home, AppRoutes.login, AppRoutes.register];
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="container">
        <Routes>
          {homePaths.map((path) => (
            <Route key={path} path={path} element={<Home />} />
          ))}
          <Route path="/cart" element={<Cart />}></Route>
          <Route
            path="/:levelOne/:levelTwo/:levelThree"
            element={<Product />}
          ></Route>
          <Route
            path="/product/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/account/order" element={<Order />}></Route>
          <Route
            path="/account/order/:orderId"
            element={<OrderDetails />}
          ></Route>
        </Routes>
      </div>

      {!homePaths.includes(window.location.pathname) && <Footer />}
    </div>
  );
}

export default CustomerRoutes;
