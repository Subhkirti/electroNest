import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./modules/customer/components/navbar/navbar";
import Home from "./modules/customer/pages/home";
import Footer from "./modules/customer/components/footer/footer";
import Product from "./modules/customer/components/product/product";
import ProductDetails from "./modules/customer/components/productDetails/productDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container">
        {/* <Product /> */}
        <ProductDetails />

        {/* <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes> */}
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
