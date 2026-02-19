import { Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import BlessingsPage from "./pages/BlessingsPage";
import HomePage from "./pages/HomePage";
import JinjaSagashiPage from "./pages/JinjaSagashiPage";
import JyunishiPage from "./pages/JyunishiPage";
import KotowazaPage from "./pages/KotowazaPage";
import NotFoundPage from "./pages/NotFoundPage";
import ShrineDetailPage from "./pages/ShrineDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jinjasagashi" element={<JinjaSagashiPage />} />
      <Route path="/jyunishi" element={<JyunishiPage />} />
      <Route path="/kotowaza" element={<KotowazaPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blessings" element={<BlessingsPage />} />
      <Route path="/jinja/:spotId" element={<ShrineDetailPage />} />
      <Route path="/jinja1" element={<Navigate to="/jinja/1" replace />} />
      <Route path="/jinja2" element={<Navigate to="/jinja/2" replace />} />
      <Route path="/jinja3" element={<Navigate to="/jinja/3" replace />} />
      <Route path="/jinja4" element={<Navigate to="/jinja/4" replace />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route
        path="/jinjasagashi.html"
        element={<Navigate to="/jinjasagashi" replace />}
      />
      <Route path="/jyunishi.html" element={<Navigate to="/jyunishi" replace />} />
      <Route path="/kotowaza.html" element={<Navigate to="/kotowaza" replace />} />
      <Route path="/about.html" element={<Navigate to="/about" replace />} />
      <Route path="/blessings.html" element={<Navigate to="/blessings" replace />} />
      <Route path="/jinja1.html" element={<Navigate to="/jinja/1" replace />} />
      <Route path="/jinja2.html" element={<Navigate to="/jinja/2" replace />} />
      <Route path="/jinja3.html" element={<Navigate to="/jinja/3" replace />} />
      <Route path="/jinja4.html" element={<Navigate to="/jinja/4" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
