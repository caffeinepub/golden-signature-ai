import { AnimatePresence } from "motion/react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import BatchSimulatorPage from "./pages/BatchSimulatorPage";
import CarbonIntelligencePage from "./pages/CarbonIntelligencePage";
import DashboardPage from "./pages/DashboardPage";
import EnergyAnalyticsPage from "./pages/EnergyAnalyticsPage";

type Page = "dashboard" | "energy" | "carbon" | "batch";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage key="dashboard" />;
      case "energy":
        return <EnergyAnalyticsPage key="energy" />;
      case "carbon":
        return <CarbonIntelligencePage key="carbon" />;
      case "batch":
        return <BatchSimulatorPage key="batch" />;
      default:
        return <DashboardPage key="dashboard" />;
    }
  };

  return (
    <div
      className="flex min-h-screen bg-grid-pattern"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main content */}
      <main
        className="flex-1 ml-60 min-h-screen overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #0f1f3d 50%, #0f172a 100%)",
        }}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        </div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
