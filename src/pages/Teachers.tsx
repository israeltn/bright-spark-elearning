
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, MoreHorizontal, Plus, Search, Trash, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Teachers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, schools, fetchUsers } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers("teacher");
  }, []);

  // Filter teachers based on user role and search term
  const filteredTeachers = users.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For school admin, only show teachers from their school
    if (user?.role === "school_admin") {
      return teacher.role === "teacher" && teacher.schoolId === user.schoolId && matchesSearch;
    }
    
    // For super admin, show all teachers
    return teacher.role === "teacher" && matchesSearch;
  });

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Teacher deleted successfully");
      // Refresh the teacher list
      fetchUsers("teacher");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher");
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-gray-500">
            {user?.role === "school_admin" 
              ? "Manage teachers in your school" 
              : "Manage all teachers across schools"}
          </p>
        </div>
        <Button onClick={() => navigate("/teachers/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teachers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredTeachers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No teachers found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Add your first teacher to get started"}
              </p>
              <Button className="mt-4" onClick={() => navigate("/teachers/create")}>
                <Plus className="mr-2 h-4 w-4" /> Add Teacher
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  {user?.role === "super_admin" && <TableHead>School</TableHead>}
                  <TableHead>Students</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  const school = schools.find(s => s.id === teacher.schoolId);
                  // Count students assigned to this teacher (this would be from a real API)
                  const studentCount = 15; // Mock data
                  // Count content created by this teacher (this would be from a real API)
                  const contentCount = 8; // Mock data
                  
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      {user?.role === "super_admin" && (
                        <TableCell>{school?.name || "Unassigned"}</TableCell>
                      )}
                      <TableCell>{studentCount}</TableCell>
                      <TableCell>{contentCount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/teachers/edit/${teacher.id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete the teacher account and remove their access to the platform. All content created by this teacher will remain accessible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTeacher(teacher.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
