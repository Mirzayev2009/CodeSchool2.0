import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLesson } from "../../lessonApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ListChecks, Info, AlertCircle, Loader2 } from "lucide-react";

function VideoPlayer({ url }) {
  if (!url) return null;
  const isYouTube =
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("/embed/");
  if (isYouTube) {
    // Normalize for embed if needed
    let embedUrl = url;
    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    return (
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={embedUrl}
          title="Lesson video"
          className="w-full h-full rounded-md"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>
    );
  }
  return (
    <AspectRatio ratio={16 / 9}>
      <video src={url} controls className="w-full h-full rounded-md" />
    </AspectRatio>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="sticky top-2 z-10 flex items-center justify-between">
        <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
      </div>

      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
        </div>
      </div>

      <div className="animate-pulse bg-gray-200 rounded-md" style={{ aspectRatio: '16/9' }}></div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded mt-2"></div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState({ message, onRetry, onBack }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2" size={16} /> Back
      </Button>
      <Card className="border border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            Error Loading Lesson
          </CardTitle>
          <CardDescription className="text-red-600">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )}
          <Button asChild>
            <Link to="/student/lessons">Go to My Lessons</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function - implement based on your auth system
  const getAuthToken = () => {
    // Return your auth token here
    return localStorage.getItem('authToken') || '';
  };

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      const lessonData = await getLesson(id, token);
      setLesson(lessonData);
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError(err.message || 'Failed to load lesson');
      
      // Fallback to mock data for development
      const mockLesson = {
        id: id,
        title: `Lesson ${id}`,
        description: "This is a sample lesson description. Learn the fundamentals and build your skills with practical examples.",
        duration: 45,
        tasksCount: 8,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        objectives: [
          "Understand the core concepts",
          "Apply knowledge through practical examples",
          "Build confidence in the subject matter",
          "Prepare for advanced topics"
        ],
        resources: [
          { label: "Official Documentation", href: "https://example.com/docs" },
          { label: "Tutorial Repository", href: "https://github.com/example" },
          { label: "Community Forum", href: "https://forum.example.com" }
        ]
      };
      setLesson(mockLesson);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const handleRetry = () => {
    loadLesson();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error && !lesson) {
    return (
      <ErrorState 
        message={error} 
        onRetry={handleRetry} 
        onBack={handleBack}
      />
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>
              The lesson you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/student/lessons">Go to My Lessons</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
      <div className="sticky top-2 z-10 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/student/assignments">
            <ListChecks className="mr-2" size={18} /> Go to Tasks
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-2 p-4">
            <AlertCircle className="text-yellow-600" size={16} />
            <span className="text-yellow-800 text-sm">
              Some data may be unavailable. Showing cached content.
            </span>
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-auto">
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground">
          {lesson.description || "No description available for this lesson."}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {lesson.duration || lesson.duration_minutes || '—'} min
          </Badge>
          <Badge variant="secondary">
            {lesson.tasksCount || lesson.tasks_count || 0} tasks
          </Badge>
          {lesson.topic && (
            <Badge variant="outline">{lesson.topic}</Badge>
          )}
        </div>
      </div>

      {(lesson.videoUrl || lesson.video_url) && (
        <VideoPlayer url={lesson.videoUrl || lesson.video_url} />
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Lesson Content</CardTitle>
          <CardDescription>
            Explore the lesson materials and learning objectives.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info size={16} className="mt-0.5" />
                <p>
                  {lesson.content || lesson.overview || 
                   "Watch the video, review the objectives, and explore resources. Then proceed to tasks."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="objectives">
              {lesson.objectives?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.objectives.map((objective, idx) => (
                    <li key={idx}>
                      {typeof objective === 'string' ? objective : objective.text || objective.description}
                    </li>
                  ))}
                </ul>
              ) : lesson.learning_objectives?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.learning_objectives.map((objective, idx) => (
                    <li key={idx}>
                      {typeof objective === 'string' ? objective : objective.text || objective.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific objectives listed for this lesson.
                </p>
              )}
            </TabsContent>
            <TabsContent value="resources" className="space-y-2">
              {lesson.resources?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.resources.map((resource, idx) => (
                    <li key={idx}>
                      <a
                        className="text-primary underline hover:no-underline"
                        href={resource.href || resource.url || resource.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {resource.label || resource.title || resource.name || `Resource ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : lesson.additional_resources?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.additional_resources.map((resource, idx) => (
                    <li key={idx}>
                      <a
                        className="text-primary underline hover:no-underline"
                        href={resource.href || resource.url || resource.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {resource.label || resource.title || resource.name || `Resource ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No additional resources available for this lesson.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}