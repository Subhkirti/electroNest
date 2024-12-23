import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./routes/customer/customerRoutes";
import { Suspense, useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import ErrorBoundary from "./routes/errorBoudnary";
import AdminRoutes from "./routes/admin/adminRoutes";
import "./App.css";
import { ScrollToTop } from "./modules/customer/utils/homeUtils";
import { ToastContainer } from "react-toastify";
import Loader from "./common/components/loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/storeTypes";
import { logout } from "./store/customer/auth/action";
import { getCurrentUser } from "./modules/customer/utils/localStorageUtils";

function App() {
  const { logoutLoader } = useSelector((state: RootState) => state.auth);
  const user = getCurrentUser();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.expiresAt && new Date(user?.expiresAt).getTime() <= new Date().getTime()) {
      dispatch(logout());
    }
  }, []);

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
