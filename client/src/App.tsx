import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./routes/customer/customerRoutes";
import { Suspense } from "react";
import "react-multi-carousel/lib/styles.css";
import ErrorBoundary from "./routes/errorBoudnary";
import AdminRoutes from "./routes/admin/adminRoutes";
import "./App.css";
import { ScrollToTop } from "./modules/customer/utils/homeUtils";
import { ToastContainer } from "react-toastify";
import Loader from "./common/components/loader";
import { useSelector } from "react-redux";
import { RootState } from "./store/storeTypes";

function App() {
  const { logoutLoader } = useSelector((state: RootState) => state.auth);

  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] items-center justify-center">
          <div className="loader" />
        </div>
      }
    >
      <ErrorBoundary>
        <ScrollToTop />
        <ToastContainer toastClassName="font-montserrat text-black" />
        <Routes>
          <Route path="/*" element={<CustomerRoutes />}></Route>
          <Route path="/admin/*" element={<AdminRoutes />}></Route>
        </Routes>
        {logoutLoader && <Loader suspenseLoader={true} fixed={true} />}
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
