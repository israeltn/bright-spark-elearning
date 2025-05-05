
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash, BookOpen, Video, CheckSquare, FileText } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const ContentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { learningContent, subjects, users } = useData();
  
  const [content, setContent] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const foundContent = learningContent.find((c) => c.id === id);
      if (foundContent) {
        setContent(foundContent);
        setSubject(subjects.find((s) => s.id === foundContent.subjectId));
        setCreator(users.find((u) => u.id === foundContent.createdBy));
      } else {
        toast.error("Content not found");
        navigate("/content");
      }
    }
  }, [id, learningContent, subjects, users]);

  const handleDelete = async () => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Content deleted successfully");
      navigate("/content");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  const getContentTypeIcon = () => {
    if (!content) return null;
    
    switch (content.contentType) {
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

  if (!content) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-12 w-48 rounded-md bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const canEditContent = user?.role === "super_admin" || 
                         user?.role === "school_admin" || 
                         (user?.role === "teacher" && user.id === content.createdBy);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/content")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center">
                    {getContentTypeIcon()}
                    <span className="ml-2 rounded-md px-2 py-0.5 text-xs font-medium" style={{
                      backgroundColor: `${subject?.color}20`,
                      color: subject?.color
                    }}>
                      {subject?.name || "Unknown Subject"}
                    </span>
                    <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium">
                      {content.keyStage}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{content.title}</CardTitle>
                </div>
                {canEditContent && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/content/edit/${content.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the content and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="mt-1 text-gray-600">{content.description}</p>
                    </div>
                    
                    {content.contentUrl && (
                      <div>
                        <h3 className="font-medium">Resource Link</h3>
                        <a href={content.contentUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-brand-purple hover:underline">
                          {content.contentUrl}
                        </a>
                      </div>
                    )}
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium">Created By</h3>
                        <p className="mt-1 text-gray-600">{creator ? creator.name : "Unknown"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Created Date</h3>
                        <p className="mt-1 text-gray-600">
                          {content.createdAt ? format(new Date(content.createdAt), "PPP") : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  {content.contentType === "video" && content.contentUrl ? (
                    <div className="aspect-video overflow-hidden rounded-lg bg-black">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-white">Video preview would be here in a real app</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-6 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium">Preview Not Available</h3>
                      <p className="mt-1 text-gray-500">
                        Preview is not available for this content type or no content URL provided.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">In Assignments</h3>
                <p className="text-2xl font-bold">3</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Student Views</h3>
                <p className="text-2xl font-bold">25</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                <p className="text-2xl font-bold">86%</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-2xl font-bold">78%</p>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentDetails;
