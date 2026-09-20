import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transaction from "./pages/Transaction/Transaction";
import Goals from "./pages/Goals/Goals";
import Profile from "./pages/Profile/Profile";
import Onboarding from "./pages/Onboarding/Onboarding";
import Statistics from "./pages/Statistics/Statistics";
import Settings from "./pages/Settings/Settings";
import Income from "./pages/Income/Income";
import Savings from "./pages/Savings/Savings";
import Expenses from "./pages/Expenses/Expenses";
import Feed from "./pages/Feed/Feed";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/feed" element={<Feed />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/income" element={<Income />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                </Routes>
        </BrowserRouter>
    );
}

export default App;