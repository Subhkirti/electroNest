import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./routes/customer/customerRoutes";
import { Suspense } from "react";
import ErrorBoundary from "./routes/errorBoudnary";

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
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
