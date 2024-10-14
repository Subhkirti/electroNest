import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./routes/customer/customerRoutes";
import { Suspense } from "react";
import ErrorBoundary from "./routes/errorBoudnary";
import AdminRoutes from "./routes/admin/adminRoutes";
import "./App.css";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] items-center justify-center">
          <div className="loader" />
        </div>
      }
    >
      <ErrorBoundary>
        <Routes>
          <Route path="/*" element={<CustomerRoutes />}></Route>
          <Route path="/admin/*" element={<AdminRoutes />}></Route>
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
