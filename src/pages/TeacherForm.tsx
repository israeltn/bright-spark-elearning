
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

const TeacherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { users, schools, fetchUsers } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolId: user?.role === "school_admin" ? user.schoolId || "" : "",
    avatar: ""
  });

  useEffect(() => {
    fetchUsers("teacher");

    // If editing, populate form data
    if (id) {
      const teacherToEdit = users.find((u) => u.id === id && u.role === "teacher");
      if (teacherToEdit) {
        setFormData({
          name: teacherToEdit.name,
          email: teacherToEdit.email,
          schoolId: teacherToEdit.schoolId || "",
          avatar: teacherToEdit.avatar || ""
        });
      } else {
        toast.error("Teacher not found");
        navigate("/teachers");
      }
    }
  }, [id, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || (!formData.schoolId && user?.role === "super_admin")) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (id) {
        toast.success("Teacher updated successfully");
      } else {
        toast.success("Teacher added successfully");
      }
      navigate("/teachers");
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast.error("Failed to save teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is authorized to manage teachers
  const canManageTeachers = user?.role === "super_admin" || user?.role === "school_admin";
  
  if (!canManageTeachers) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">You don't have permission to manage teachers.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/teachers")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teachers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter teacher's full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter teacher's email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {user?.role === "super_admin" && (
              <div className="space-y-2">
                <Label htmlFor="schoolId">School <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.schoolId} 
                  onValueChange={(value) => handleSelectChange("schoolId", value)}
                  required
                >
                  <SelectTrigger id="schoolId">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                name="avatar"
                placeholder="Enter URL for avatar image"
                value={formData.avatar}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Leave blank to use system-generated avatar</p>
            </div>

            <div className="rounded-md bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <p className="mt-1 text-sm text-blue-700">
                An email will be sent to the teacher with instructions to set their password and complete their account setup.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/teachers")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : id ? "Update Teacher" : "Add Teacher"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TeacherForm;
