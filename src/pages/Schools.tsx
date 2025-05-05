
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, MoreHorizontal, Plus, Search, School, Trash, Users, GraduationCap } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

const Schools = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schools, fetchSchools } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  // Filter schools based on search term and status
  const filteredSchools = schools.filter((school) => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? school.subscriptionStatus === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("School deleted successfully");
      // Refresh the school list
      fetchSchools();
    } catch (error) {
      console.error("Error deleting school:", error);
      toast.error("Failed to delete school");
    }
  };

  // Check if user is authorized to manage schools
  if (user?.role !== "super_admin") {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">Only Super Admins can manage schools.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">School Management</h1>
          <p className="text-gray-500">Add, edit and manage schools on the platform</p>
        </div>
        <Button onClick={() => navigate("/schools/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add School
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search schools..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredSchools.length === 0 ? (
            <div className="p-8 text-center">
              <School className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No schools found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || filterStatus
                  ? "Try adjusting your filters"
                  : "Add your first school to get started"}
              </p>
              <Button className="mt-4" onClick={() => navigate("/schools/create")}>
                <Plus className="mr-2 h-4 w-4" /> Add School
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.map((school) => (
                <Card key={school.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="rounded-full bg-brand-purple/10 p-2">
                        <School className="h-5 w-5 text-brand-purple" />
                      </div>
                      <Badge 
                        className={
                          school.subscriptionStatus === "active" ? "bg-green-500" : 
                          school.subscriptionStatus === "trial" ? "bg-yellow-500" : 
                          "bg-red-500"
                        }
                      >
                        {school.subscriptionStatus.charAt(0).toUpperCase() + school.subscriptionStatus.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold">{school.name}</h3>
                    <p className="text-sm text-gray-500">{school.address}</p>
                    
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Subscription Plan</span>
                        <span className="font-medium">{school.subscriptionPlan.name}</span>
                      </div>
                      {school.subscriptionStatus === "trial" && school.trialEndsAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Trial Ends</span>
                          <span className="font-medium">{format(new Date(school.trialEndsAt), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-2 text-sm">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {school.studentsCount} Students
                          </span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="mr-1 h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {school.teachersCount} Teachers
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" onClick={() => navigate(`/schools/edit/${school.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the school and all associated data including teachers, students, and content. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSchool(school.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Schools;
