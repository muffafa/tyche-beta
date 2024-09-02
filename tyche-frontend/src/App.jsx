import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:network/:address" element={<WalletDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
