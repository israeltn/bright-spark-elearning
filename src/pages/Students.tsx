
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
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Search, Trash, User, UserPlus, BarChart } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Students = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, schools, fetchUsers } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchUsers("student");
  }, []);

  // Filter students based on user role and search term
  const filteredStudents = users.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For school admin, only show students from their school
    if (user?.role === "school_admin") {
      return student.role === "student" && student.schoolId === user.schoolId && matchesSearch;
    }
    
    // For teacher, only show students from their school
    if (user?.role === "teacher") {
      return student.role === "student" && student.schoolId === user.schoolId && matchesSearch;
    }
    
    // For super admin, show all students
    return student.role === "student" && matchesSearch;
  });

  const handleDeleteStudent = async (studentId: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Student deleted successfully");
      // Refresh the student list
      fetchUsers("student");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  // Check if user is authorized to view students
  const canViewStudents = ["super_admin", "school_admin", "teacher"].includes(user?.role || "");
  const canManageStudents = ["super_admin", "school_admin"].includes(user?.role || "");
  
  if (!canViewStudents) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">You don't have permission to view students.</p>
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
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-gray-500">
            {user?.role === "teacher" 
              ? "View your students' progress and performance" 
              : "Manage students and monitor their progress"}
          </p>
        </div>
        {canManageStudents && (
          <Button onClick={() => navigate("/students/create")}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No students found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : canManageStudents
                  ? "Add your first student to get started"
                  : "There are no students assigned to you yet"}
              </p>
              {canManageStudents && (
                <Button className="mt-4" onClick={() => navigate("/students/create")}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  {user?.role === "super_admin" && <TableHead>School</TableHead>}
                  <TableHead>Progress</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const school = schools.find(s => s.id === student.schoolId);
                  // Mock data for progress and badges
                  const progress = Math.floor(Math.random() * 40) + 60; // Random progress between 60-100%
                  const badgeCount = Math.floor(Math.random() * 5); // Random badge count 0-4
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      {user?.role === "super_admin" && (
                        <TableCell>{school?.name || "Unassigned"}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div 
                              className="h-2 rounded-full bg-brand-purple" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {badgeCount > 0 ? (
                          <Badge className="bg-brand-purple">{badgeCount} badges</Badge>
                        ) : (
                          <span className="text-sm text-gray-500">No badges yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/students/${student.id}`)}>
                              <BarChart className="mr-2 h-4 w-4" /> View Progress
                            </DropdownMenuItem>
                            {canManageStudents && (
                              <>
                                <DropdownMenuItem onClick={() => navigate(`/students/edit/${student.id}`)}>
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
                                        This will delete the student account and all associated progress data. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
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

export default Students;
