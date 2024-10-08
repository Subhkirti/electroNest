import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./routes/customerRoutes";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<CustomerRoutes />}></Route>
    </Routes>
  );
}

export default App;
