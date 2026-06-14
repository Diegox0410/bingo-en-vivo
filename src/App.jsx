import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Publico from "./pages/Publico";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Publico />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;