import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Details from "./Screens/Details";
import Success from "./Screens/Success";
import Home from "./Screens/Login";
import { Passwordless } from "passwordless-bb";
Passwordless.init(process.env.REACT_APP_BASE_URL, process.env.REACT_APP_CLIENT_ID);
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Home type="Login" />} />
        <Route path="/register" element={<Home type="Register" />} />
        <Route path="/authToken/:accessToken" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
