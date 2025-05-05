
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, FileText, Video, CheckSquare } from "lucide-react";
import { LearningContent, Subject } from "@/types/data";

const Content = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchLearningContent, fetchSubjects, learningContent, subjects } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchLearningContent();
  }, []);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "text":
        return <FileText className="h-5 w-5" />;
      case "quiz":
        return <CheckSquare className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const filteredContent = learningContent.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject ? content.subjectId === filterSubject : true;
    const matchesType = filterType ? content.contentType === filterType : true;
    
    // For teachers, only show their own content
    const isTeacherContent = user?.role === "teacher" ? content.createdBy === user.id : true;
    
    return matchesSearch && matchesSubject && matchesType && isTeacherContent;
  });

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Content</h1>
          <p className="text-gray-500">
            {user?.role === "teacher" ? "Create and manage your learning materials" : "Browse all learning content"}
          </p>
        </div>
        {(user?.role === "teacher" || user?.role === "school_admin" || user?.role === "super_admin") && (
          <Button onClick={() => navigate("/content/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add New Content
          </Button>
        )}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search content..."
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
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredContent.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No content found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || filterSubject || filterType
              ? "Try adjusting your filters"
              : user?.role === "teacher"
              ? "Create your first learning content!"
              : "There's no content available yet."}
          </p>
          {(user?.role === "teacher" || user?.role === "school_admin" || user?.role === "super_admin") && (
            <Button className="mt-4" onClick={() => navigate("/content/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create New Content
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((content) => {
            const subject = subjects.find((s) => s.id === content.subjectId);
            return (
              <Card key={content.id} className="overflow-hidden transition-all hover:shadow-md">
                {content.thumbnailUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={content.thumbnailUrl}
                      alt={content.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
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
                    <div className="flex items-center text-xs text-gray-500">
                      {getContentTypeIcon(content.contentType)}
                      <span className="ml-1 capitalize">{content.contentType}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 line-clamp-1">{content.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {content.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-gray-500">{content.keyStage}</div>
                  <Button variant="outline" onClick={() => navigate(`/content/${content.id}`)}>
                    View Details
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

export default Content;
