import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={About} />
         
      <Route path="/" element={Home} />
        <Route path="/users" element={ Users} />
       
      </Routes>
    </Router>
  );
}

export default App;