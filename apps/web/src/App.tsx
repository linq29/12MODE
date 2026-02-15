import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShrinePage from "./pages/ShrinePage";

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>十二支詣</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shrines/:spotId" element={<ShrinePage />} />
        </Routes>
      </main>
    </div>
  );
}
