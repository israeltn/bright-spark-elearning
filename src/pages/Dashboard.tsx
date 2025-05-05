import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import StatCard from "@/components/dashboard/StatCard";
import StudentList from "@/components/dashboard/StudentList";
import SubjectCard from "@/components/dashboard/SubjectCard";
import UpcomingAssignments from "@/components/dashboard/UpcomingAssignments";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  School,
  BookOpen,
  Award,
  BarChart,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    schools,
    subjects,
    assignments,
    users,
    fetchUsers,
    fetchSubjects,
    fetchAssignments,
  } = useData();

  useEffect(() => {
    if (user) {
      fetchSubjects();
      
      if (user.role === "teacher" || user.role === "school_admin" || user.role === "super_admin") {
        fetchUsers("student");
      }
      
      if (user.role === "student" || user.role === "teacher") {
        fetchAssignments(user.id);
      }
    }
  }, [user]);

  // Get students filtered by school if applicable
  const getStudents = () => {
    if (user?.role === "super_admin") {
      return users.filter((u) => u.role === "student").slice(0, 5);
    } else if (user?.schoolId) {
      return users
        .filter((u) => u.role === "student" && u.schoolId === user.schoolId)
        .slice(0, 5);
    }
    return [];
  };

  // Render dashboard based on user role
  const renderSuperAdminDashboard = () => (
    <>
      <h1 className="mb-6 text-2xl font-bold">Super Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Schools"
          value={schools.length}
          icon={<School className="h-6 w-6" />}
          trend="up"
          change={12}
        />
        <StatCard
          title="Active Students"
          value={users.filter((u) => u.role === "student").length}
          icon={<Users className="h-6 w-6" />}
          trend="up"
          change={8}
        />
        <StatCard
          title="Courses Available"
          value={subjects.length * 5} // Mock data - multiple courses per subject
          icon={<BookOpen className="h-6 w-6" />}
          trend="up"
          change={5}
        />
        <StatCard
          title="Total Revenue"
          value="£24,500"
          icon={<BarChart className="h-6 w-6" />}
          trend="up"
          change={15}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="dashboard-section col-span-2">
          <h3 className="mb-4 text-lg font-medium">School Distribution</h3>
          <div className="space-y-4">
            {schools.map((school) => (
              <div
                key={school.id}
                className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-brand-purple/10 p-2">
                      <School className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">{school.name}</h4>
                      <p className="text-sm text-gray-500">{school.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        school.subscriptionStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : school.subscriptionStatus === "trial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {school.subscriptionStatus.charAt(0).toUpperCase() +
                        school.subscriptionStatus.slice(1)}
                    </span>
                    <p className="mt-1 text-sm">{school.subscriptionPlan.name}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-8">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {school.studentsCount} Students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="mr-1 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {school.teachersCount} Teachers
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <StudentList students={getStudents()} />
      </div>
    </>
  );

  const renderSchoolAdminDashboard = () => (
    <>
      <h1 className="mb-6 text-2xl font-bold">School Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={users.filter((u) => u.role === "teacher" && u.schoolId === user?.schoolId).length}
          icon={<GraduationCap className="h-6 w-6" />}
          trend="up"
          change={2}
        />
        <StatCard
          title="Total Students"
          value={users.filter((u) => u.role === "student" && u.schoolId === user?.schoolId).length}
          icon={<Users className="h-6 w-6" />}
          trend="up"
          change={5}
        />
        <StatCard
          title="Subjects Available"
          value={subjects.length}
          icon={<BookOpen className="h-6 w-6" />}
          trend="neutral"
          change={0}
        />
        <StatCard
          title="Average Progress"
          value="78%"
          icon={<BarChart className="h-6 w-6" />}
          trend="up"
          change={3}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="dashboard-section col-span-2">
          <h3 className="mb-4 text-lg font-medium">Subscription Info</h3>
          <div className="rounded-lg border p-6">
            {user?.schoolId && schools.find((s) => s.id === user.schoolId) ? (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">
                      {schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.name}
                    </h4>
                    <p className="text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          schools.find((s) => s.id === user?.schoolId)?.subscriptionStatus ===
                          "active"
                            ? "text-green-600"
                            : schools.find((s) => s.id === user?.schoolId)?.subscriptionStatus ===
                              "trial"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {schools.find((s) => s.id === user?.schoolId)?.subscriptionStatus.charAt(0).toUpperCase() +
                          schools.find((s) => s.id === user?.schoolId)?.subscriptionStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      £{schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.price}
                      <span className="text-sm text-gray-500">/month</span>
                    </p>
                    <Button variant="outline" className="mt-2">
                      Manage Subscription
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Students</span>
                      <span className="text-sm font-medium">
                        {schools.find((s) => s.id === user?.schoolId)?.studentsCount} /{" "}
                        {schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.maxStudents}
                      </span>
                    </div>
                    <Progress
                      value={
                        (schools.find((s) => s.id === user?.schoolId)?.studentsCount /
                          schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.maxStudents) *
                        100
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Teachers</span>
                      <span className="text-sm font-medium">
                        {schools.find((s) => s.id === user?.schoolId)?.teachersCount} /{" "}
                        {schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.maxTeachers}
                      </span>
                    </div>
                    <Progress
                      value={
                        (schools.find((s) => s.id === user?.schoolId)?.teachersCount /
                          schools.find((s) => s.id === user?.schoolId)?.subscriptionPlan.maxTeachers) *
                        100
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="mb-2 font-medium">Features Included:</h5>
                  <ul className="space-y-1">
                    {schools
                      .find((s) => s.id === user?.schoolId)
                      ?.subscriptionPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="mr-2 text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No subscription information available
              </p>
            )}
          </div>
        </div>

        <StudentList students={getStudents()} />
      </div>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <h1 className="mb-6 text-2xl font-bold">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="My Students"
          value={getStudents().length}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Active Assignments"
          value={assignments.length}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Content Created"
          value="12"
          icon={<BarChart className="h-6 w-6" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <UpcomingAssignments assignments={assignments} />
        </div>
        <StudentList students={getStudents()} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Available Subjects</h3>
          <Button variant="outline">Manage Content</Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <h1 className="mb-6 text-2xl font-bold">Student Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Subjects Enrolled"
          value={subjects.length}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Assignments Due"
          value={assignments.length}
          icon={<Calendar className="h-6 w-6" />}
        />
        <StatCard
          title="Badges Earned"
          value="2"
          icon={<Award className="h-6 w-6" />}
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">My Learning Path</h3>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingAssignments assignments={assignments} />

        <div className="dashboard-section">
          <h3 className="mb-4 text-lg font-medium">My Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-brand-purple/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 h-20 w-20 rounded-full bg-brand-purple/10 p-5">
                  <Award className="h-10 w-10 text-brand-purple" />
                </div>
                <h4 className="font-medium">Math Star</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Awarded for excellence in mathematics
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-brand-blue/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 h-20 w-20 rounded-full bg-brand-blue/10 p-5">
                  <BookOpen className="h-10 w-10 text-brand-blue" />
                </div>
                <h4 className="font-medium">Reading Champion</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Awarded for completing 10 reading assignments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );

  const renderParentDashboard = () => (
    <>
      <h1 className="mb-6 text-2xl font-bold">Parent Dashboard</h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=4"
              alt="Child Avatar"
            />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">Student Jones</h2>
            <p className="text-gray-500">Year 4 (KS2)</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge className="bg-brand-purple">Math Star</Badge>
              <Badge className="bg-brand-blue">Reading Champion</Badge>
            </div>
          </div>
          <div className="ml-auto hidden sm:block">
            <Button>View Progress Report</Button>
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          <Button className="w-full">View Progress Report</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Overall Progress"
          value="78%"
          icon={<BarChart className="h-6 w-6" />}
          trend="up"
          change={5}
        />
        <StatCard
          title="Assignments Due"
          value={assignments.length}
          icon={<Calendar className="h-6 w-6" />}
          trend="neutral"
          change={0}
        />
        <StatCard
          title="Achievements"
          value="2"
          icon={<Award className="h-6 w-6" />}
          trend="up"
          change={100}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingAssignments assignments={assignments} />

        <div className="dashboard-section">
          <h3 className="mb-4 text-lg font-medium">Subject Progress</h3>
          <div className="space-y-4">
            {subjects.map((subject) => (
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
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.floor(Math.random() * 40) + 60}%
                  </span>
                </div>
                <Progress
                  value={Math.floor(Math.random() * 40) + 60}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Render dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "super_admin":
        return renderSuperAdminDashboard();
      case "school_admin":
        return renderSchoolAdminDashboard();
      case "teacher":
        return renderTeacherDashboard();
      case "student":
        return renderStudentDashboard();
      case "parent":
        return renderParentDashboard();
      default:
        return <p>Unknown user role</p>;
    }
  };

  return <div className="animate-fade-in">{renderDashboard()}</div>;
};

export default Dashboard;
