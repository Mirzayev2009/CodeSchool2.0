// src/student/lessons/Detail.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, ListChecks, Info, AlertCircle } from "lucide-react";
import { useUser } from "../../UserContext"; // IMPORTANT: use same token source

function VideoPlayer({ url }) {
  if (!url) return null;
  // make sure we have a string
  const s = String(url || "");
  const isYouTube =
    s.includes("youtube.com") ||
    s.includes("youtu.be") ||
    s.includes("/embed/");
  if (isYouTube) {
    let embedUrl = s;
    // watch?v=.. -> embed/..
    if (s.includes("watch?v=")) {
      embedUrl = s.replace("watch?v=", "embed/");
    } else if (s.includes("youtu.be/")) {
      const videoId = s.split("youtu.be/")[1].split(/[?&]/)[0];
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
      <video src={s} controls className="w-full h-full rounded-md" />
    </AspectRatio>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="animate-pulse bg-gray-200 h-8 w-2/3 rounded" />
      <div className="animate-pulse bg-gray-200 h-64 rounded" />
    </div>
  );
}

function ErrorState({ message, onRetry, onBack, unauthorized }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2" size={16} /> Back
      </Button>

      <Card
        className={
          unauthorized
            ? "border border-yellow-200 bg-yellow-50"
            : "border border-red-200 bg-red-50"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            {unauthorized ? "Unauthorized" : "Error Loading Lesson"}
          </CardTitle>
          <CardDescription className="text-red-600">{message}</CardDescription>
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
          {unauthorized && (
            <Button asChild variant="ghost">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useUser(); // use the same token source as the rest of app
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  // normalizer (snake_case -> camelCase)
  const normalizeLesson = (l) => {
    if (!l) return null;
    return {
      id: l.id ?? l.pk ?? null,
      title: l.title ?? l.name ?? "Untitled",
      description: l.description ?? l.desc ?? "",
      duration: l.duration ?? l.duration_minutes ?? l.length ?? null,
      tasksCount: l.tasksCount ?? l.tasks_count ?? l.homework_count ?? 0,
      videoUrl: l.videoUrl ?? l.video_url ?? l.video ?? null,
      content: l.content ?? l.overview ?? l.description ?? "",
      objectives: l.objectives ?? l.learning_objectives ?? [],
      resources: l.resources ?? l.additional_resources ?? [],
      topic: l.topic ?? l.subject ?? null,
      createdAt: l.createdAt ?? l.created_at ?? null,
      updatedAt: l.updatedAt ?? l.updated_at ?? null,
      __raw: l,
    };
  };

  const loadLesson = useCallback(
    async (signal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setUnauthorized(false);

      try {
        console.debug("[LessonDetail] fetching lesson", { id, token });
        const data = await getLesson(id, token, { signal });
        console.debug("[LessonDetail] raw lesson:", data);
        setLesson(normalizeLesson(data));
      } catch (err) {
        if (err.name === "AbortError") {
          // fetch aborted, ignore
          return;
        }
        console.error("Error loading lesson:", err);
        // if our request wrapper provided status
        const status = err.status ?? err?.body?.status ?? null;
        if (
          status === 401 ||
          status === 403 ||
          /unauthorized/i.test(String(err.message))
        ) {
          setUnauthorized(true);
          setError(
            "You are not authorized to view this lesson. Please sign in or check permissions."
          );
        } else {
          const msg = err.message ?? JSON.stringify(err);
          setError(msg);
        }
        setLesson(null);
      } finally {
        setLoading(false);
      }
    },
    [id, token]
  );

  useEffect(() => {
    const ac = new AbortController();
    if (!id) {
      setLoading(false);
      return;
    }
    loadLesson(ac.signal);
    return () => ac.abort();
  }, [id, loadLesson]);

  const handleRetry = () => {
    const ac = new AbortController();
    loadLesson(ac.signal);
  };

  const handleBack = () => navigate(-1);

  if (loading) return <LoadingSkeleton />;

  if (error && !lesson) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRetry}
        onBack={handleBack}
        unauthorized={unauthorized}
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
          <Link to={`/student/assignments/${lesson.id}/homeworks`}>
            <ListChecks className="mr-2" size={18} /> Go to Tasks
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground">
          {lesson.description || "No description available for this lesson."}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{lesson.duration ?? "—"} min</Badge>
          <Badge variant="secondary">{lesson.tasksCount ?? 0} tasks</Badge>
          {lesson.topic && <Badge variant="outline">{lesson.topic}</Badge>}
        </div>
      </div>

      {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

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
                  {lesson.content ||
                    "Watch the video, review the objectives, and explore resources. Then proceed to tasks."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="objectives">
              {lesson.objectives?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.objectives.map((objective, idx) => (
                    <li key={idx}>
                      {typeof objective === "string"
                        ? objective
                        : objective.text || objective.description}
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
                        {resource.label ||
                          resource.title ||
                          resource.name ||
                          `Resource ${idx + 1}`}
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
