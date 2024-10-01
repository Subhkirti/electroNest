import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./routes/customerRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
