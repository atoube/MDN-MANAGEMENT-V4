import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Projects } from "@/pages/Projects";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { Auth } from "@/pages/Auth";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import Home from "@/pages/Home";
import { ModuleManagement } from "@/pages/ModuleManagement";
import Tasks from "@/pages/Tasks";
import Dashboard from "@/pages/Dashboard";
import Marketing from "@/pages/Marketing";
import Finance from "@/pages/Finance";
import { Employees as EmployeesComponent } from "@/components/employees/Employees";
import Accounting from "@/pages/finance/Accounting";
import Stocks from "@/pages/Stocks";
import Products from "@/pages/stocks/Products";
import Suppliers from "@/pages/stocks/Suppliers";
import Customers from "@/pages/stocks/Customers";
import Reports from "@/pages/stocks/Reports";
import Sellers from "@/pages/Sellers";
import Sales from "@/pages/Sales";
import Deliveries from "@/pages/Deliveries";
import DGI from '@/pages/finance/DGI';
import EmployeeProfile from "@/pages/EmployeeProfile";
import Documents from '@/pages/Documents';
import LeaveRequests from '@/pages/LeaveRequests';
import Purchases from "@/pages/Purchases";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import { UserProfile } from "@/pages/UserProfile";
import NotificationHistory from "@/pages/NotificationHistory";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/module-management" element={<ModuleManagement />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/finance" element={<Finance />}>
          <Route path="accounting" element={<Accounting />} />
        </Route>
        <Route path="finance/dgi" element={<DGI />} />
        <Route path="/employees" element={<EmployeesComponent />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/stocks" element={<Stocks />}>
          <Route index element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/notifications" element={<NotificationHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
