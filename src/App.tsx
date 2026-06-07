import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Overview from "@/pages/Overview";
import Plan from "@/pages/Plan";
import Arrival from "@/pages/Arrival";
import Material from "@/pages/Material";
import Contract from "@/pages/Contract";
import Cost from "@/pages/Cost";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/arrival" element={<Arrival />} />
          <Route path="/material" element={<Material />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/cost" element={<Cost />} />
        </Routes>
      </Layout>
    </Router>
  );
}
