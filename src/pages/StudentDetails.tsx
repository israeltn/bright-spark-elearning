
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Award, BarChart, BookOpen, Calendar, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

const StudentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { 
    users, 
    subjects, 
    learningContent, 
    assignments, 
    badges, 
    userBadges,
    studentProgress,
    fetchUsers,
    fetchSubjects, 
    fetchUserBadges, 
    fetchAssignments,
    fetchStudentProgress
  } = useData();
  
  const [student, setStudent] = useState<any>(null);
  const [studentSubjects, setStudentSubjects] = useState<any[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<any[]>([]);
  const [studentBadges, setStudentBadges] = useState<any[]>([]);
  
  useEffect(() => {
    if (id) {
      // Fetch student data
      fetchUsers("student");
      fetchSubjects();
      fetchUserBadges(id);
      fetchAssignments(id);
      fetchStudentProgress(id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // Find the student
      const foundStudent = users.find(u => u.id === id && u.role === "student");
      if (foundStudent) {
        setStudent(foundStudent);
      }
      
      // Process student badges
      const badgeData = userBadges.map(ub => {
        const badgeInfo = badges.find(b => b.id === ub.badgeId);
        return {
          ...ub,
          name: badgeInfo?.name || "Unknown Badge",
          description: badgeInfo?.description || "",
          imageUrl: badgeInfo?.imageUrl || ""
        };
      });
      setStudentBadges(badgeData);
      
      // Process assignments
      setStudentAssignments(assignments);
      
      // Process subjects and progress
      const progressBySubject: Record<string, { completed: number, total: number }> = {};
      
      // Initialize progress tracking for each subject
      subjects.forEach(subject => {
        progressBySubject[subject.id] = { completed: 0, total: 0 };
      });
      
      // Count content items by subject
      learningContent.forEach(content => {
        if (progressBySubject[content.subjectId]) {
          progressBySubject[content.subjectId].total += 1;
          
          // Check if student has completed this content
          const progress = studentProgress.find(p => p.contentId === content.id);
          if (progress && progress.progress === 100) {
            progressBySubject[content.subjectId].completed += 1;
          }
        }
      });
      
      // Calculate progress percentage for each subject
      const subjectsWithProgress = subjects.map(subject => {
        const progress = progressBySubject[subject.id];
        const progressPercentage = progress.total > 0 
          ? Math.round((progress.completed / progress.total) * 100) 
          : 0;
        
        return {
          ...subject,
          progress: progressPercentage,
          completed: progress.completed,
          total: progress.total
        };
      });
      
      setStudentSubjects(subjectsWithProgress);
    }
  }, [id, users, badges, userBadges, subjects, learningContent, studentProgress]);

  // Check if user is authorized to view student details
  const canViewStudentDetails = ["super_admin", "school_admin", "teacher", "parent"].includes(user?.role || "");
  
  if (!canViewStudentDetails) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">You don't have permission to view student details.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-12 w-48 rounded-md bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const overallProgress = studentSubjects.length > 0
    ? Math.round(studentSubjects.reduce((sum, subject) => sum + subject.progress, 0) / studentSubjects.length)
    : 0;

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-gray-500">{student.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              {studentBadges.slice(0, 3).map((badge, index) => (
                <Badge key={index} className="bg-brand-purple">{badge.name}</Badge>
              ))}
              {studentBadges.length > 3 && (
                <Badge className="bg-gray-500">+{studentBadges.length - 3} more</Badge>
              )}
            </div>
          </div>
          <div className="ml-auto hidden sm:block">
            <Button>Print Progress Report</Button>
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          <Button className="w-full">Print Progress Report</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
            <CardDescription>Across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <BarChart className="h-10 w-10 text-brand-purple" />
              <div className="text-right">
                <p className="text-5xl font-bold text-brand-purple">{overallProgress}%</p>
                <p className="text-sm text-gray-500">
                  {overallProgress < 30 ? "Just Starting" : 
                   overallProgress < 60 ? "Making Progress" : 
                   overallProgress < 80 ? "Doing Well" : "Excellent!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignments</CardTitle>
            <CardDescription>Pending and completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <Calendar className="h-10 w-10 text-brand-blue" />
              <div className="text-right">
                <p className="text-5xl font-bold text-brand-blue">{studentAssignments.length}</p>
                <p className="text-sm text-gray-500">
                  {studentAssignments.filter(a => new Date(a.dueDate) < new Date()).length} past due
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>Badges earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <Award className="h-10 w-10 text-yellow-500" />
              <div className="text-right">
                <p className="text-5xl font-bold text-yellow-500">{studentBadges.length}</p>
                <p className="text-sm text-gray-500">
                  {badges.length - studentBadges.length} available to earn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="subjects">
          <TabsList className="mb-4">
            <TabsTrigger value="subjects">Subjects Progress</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentSubjects.map((subject) => (
                    <div key={subject.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="mr-3 rounded-full p-2"
                            style={{ backgroundColor: `${subject.color}20` }}
                          >
                            <BookOpen
                              className="h-5 w-5"
                              style={{ color: subject.color }}
                            />
                          </div>
                          <div>
                            <span className="font-medium">{subject.name}</span>
                            <p className="text-xs text-gray-500">
                              {subject.completed} of {subject.total} activities completed
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{subject.progress}%</span>
                      </div>
                      <Progress
                        value={subject.progress}
                        className="mt-2"
                      />
                    </div>
                  ))}
                  
                  {studentSubjects.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium">No subjects data available</h3>
                      <p className="mt-1 text-gray-500">
                        This student hasn't started any subjects yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Recent and upcoming assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {studentAssignments.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium">No assignments yet</h3>
                    <p className="mt-1 text-gray-500">
                      This student doesn't have any assignments yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentAssignments.map((assignment) => {
                      const subject = subjects.find(s => s.id === assignment.subjectId);
                      const dueDate = new Date(assignment.dueDate);
                      const isOverdue = dueDate < new Date();
                      
                      return (
                        <div key={assignment.id} className="rounded-lg border p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center">
                                <Badge
                                  className={
                                    isOverdue ? "bg-red-500" : "bg-green-500"
                                  }
                                >
                                  {isOverdue ? "Overdue" : "Active"}
                                </Badge>
                                <span 
                                  className="ml-2 rounded-md px-2 py-0.5 text-xs font-medium" 
                                  style={{
                                    backgroundColor: `${subject?.color}20`,
                                    color: subject?.color
                                  }}
                                >
                                  {subject?.name || "Unknown Subject"}
                                </span>
                              </div>
                              <h3 className="mt-1 font-medium">{assignment.title}</h3>
                              <p className="text-sm text-gray-500">{assignment.description}</p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end">
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                <span>Due: {format(dueDate, "PPP")}</span>
                              </div>
                              <Button size="sm" variant="outline" className="mt-2">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Achievements</CardTitle>
                <CardDescription>Recognition for accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                {studentBadges.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Award className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium">No badges earned yet</h3>
                    <p className="mt-1 text-gray-500">
                      This student hasn't earned any badges yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {studentBadges.map((badge) => (
                      <Card key={badge.id} className="overflow-hidden">
                        <div className="p-6 text-center">
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-purple/10">
                            <Award className="h-10 w-10 text-brand-purple" />
                          </div>
                          <h3 className="font-bold">{badge.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{badge.description}</p>
                          <p className="mt-2 text-xs text-gray-400">
                            Awarded on {format(new Date(badge.awardedAt), "PP")}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDetails;
