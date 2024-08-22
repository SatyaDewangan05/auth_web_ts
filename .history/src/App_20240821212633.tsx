// App.tsx

import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  const serverIp = "http://localhost:5000";
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn serverIp: String={serverIp} />} />
          <Route path="/signup" element={<SignUp serverIp={serverIp} />} />
          <Route
            path="/dashboard"
            element={<Dashboard serverIp={serverIp} />}
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
