import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Callback from "./pages/Callback";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </div>
  );
}

export default App;
