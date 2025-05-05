
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Content from "./pages/Content";
import ContentForm from "./pages/ContentForm";
import ContentDetails from "./pages/ContentDetails";
import Assignments from "./pages/Assignments";
import AssignmentForm from "./pages/AssignmentForm";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Teachers from "./pages/Teachers";
import TeacherForm from "./pages/TeacherForm";
import Schools from "./pages/Schools";
import SchoolForm from "./pages/SchoolForm";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Content Management */}
                <Route path="content" element={<Content />} />
                <Route path="content/create" element={<ContentForm />} />
                <Route path="content/edit/:id" element={<ContentForm />} />
                <Route path="content/:id" element={<ContentDetails />} />
                
                {/* Assignment Management */}
                <Route path="assignments" element={<Assignments />} />
                <Route path="assignments/create" element={<AssignmentForm />} />
                <Route path="assignments/edit/:id" element={<AssignmentForm />} />
                
                {/* Student Management */}
                <Route path="students" element={<Students />} />
                <Route path="students/:id" element={<StudentDetails />} />
                
                {/* Teacher Management */}
                <Route path="teachers" element={<Teachers />} />
                <Route path="teachers/create" element={<TeacherForm />} />
                <Route path="teachers/edit/:id" element={<TeacherForm />} />
                
                {/* School Management */}
                <Route path="schools" element={<Schools />} />
                <Route path="schools/create" element={<SchoolForm />} />
                <Route path="schools/edit/:id" element={<SchoolForm />} />
                
                {/* User Management */}
                <Route path="users" element={<Users />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
