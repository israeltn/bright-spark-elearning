
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, CheckCircle, Clock, Plus, Search, User, Users } from "lucide-react";
import { format } from "date-fns";

const Assignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchAssignments, fetchSubjects, assignments, subjects, users } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchSubjects();
    if (user) {
      fetchAssignments(user.id);
    }
  }, [user]);

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";
  const isParent = user?.role === "parent";
  const isAdmin = user?.role === "school_admin" || user?.role === "super_admin";

  const getDueStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (due < today) {
      return "overdue";
    } else if (due.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000) {
      return "soon";
    } else {
      return "upcoming";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Overdue</span>;
      case "soon":
        return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Due Soon</span>;
      case "upcoming":
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Upcoming</span>;
      default:
        return null;
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject ? assignment.subjectId === filterSubject : true;
    const matchesStatus = filterStatus ? getDueStatus(assignment.dueDate) === filterStatus : true;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-gray-500">
            {isTeacher 
              ? "Create and manage assignments for your students" 
              : isStudent
              ? "View and complete your assignments"
              : isParent
              ? "View your child's assignments"
              : "Manage all assignments"}
          </p>
        </div>
        {isTeacher && (
          <Button onClick={() => navigate("/assignments/create")}>
            <Plus className="mr-2 h-4 w-4" /> Create Assignment
          </Button>
        )}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assignments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="soon">Due Soon</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No assignments found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || filterSubject || filterStatus
              ? "Try adjusting your filters"
              : isTeacher
              ? "Create your first assignment!"
              : "There are no assignments available yet."}
          </p>
          {isTeacher && (
            <Button className="mt-4" onClick={() => navigate("/assignments/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create New Assignment
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => {
            const subject = subjects.find((s) => s.id === assignment.subjectId);
            const teacher = users.find((u) => u.id === assignment.teacherId);
            const dueStatus = getDueStatus(assignment.dueDate);
            
            return (
              <Card key={assignment.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="rounded-md px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: `${subject?.color}20`,
                        color: subject?.color,
                      }}
                    >
                      {subject?.name || "Unknown Subject"}
                    </div>
                    {getStatusBadge(dueStatus)}
                  </div>
                  <CardTitle className="mt-2 line-clamp-1">{assignment.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {assignment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Due: {format(new Date(assignment.dueDate), "PP")}</span>
                    </div>
                    
                    {isTeacher || isAdmin ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{assignment.studentIds.length} Students</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" />
                        <span>By: {teacher?.name || "Unknown"}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  {isStudent && (
                    <div className="flex items-center text-sm">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-green-700">Not Started</span>
                    </div>
                  )}
                  {isTeacher && (
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-blue-500" />
                      <span>Created: {format(new Date(assignment.createdAt), "PP")}</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => isTeacher ? navigate(`/assignments/edit/${assignment.id}`) : null}
                  >
                    {isTeacher ? "Edit" : "View Details"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;
