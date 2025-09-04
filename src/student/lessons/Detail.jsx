import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessonsMock } from "../../lessonApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ListChecks, Info } from "lucide-react";

function VideoPlayer({ url }) {
  if (!url) return null;
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("/embed/");
  if (isYouTube) {
    // Normalize for embed if needed
    const embedUrl = url.includes("/embed/") ? url : url.replace("watch?v=", "embed/");
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

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = useMemo(() => lessonsMock.find((l) => l.id === id), [id]);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>The lesson you are looking for does not exist.</CardDescription>
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{lesson.duration} min</Badge>
          <Badge variant="secondary">{lesson.tasksCount} tasks</Badge>
        </div>
      </div>

      <VideoPlayer url={lesson.videoUrl} />

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Lesson Presentation</CardTitle>
          <CardDescription>A quick guided overview to reinforce key ideas.</CardDescription>
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
                <p>Watch the video, skim the objectives, and explore resources. Then proceed to tasks.</p>
              </div>
            </TabsContent>
            <TabsContent value="objectives">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {lesson.objectives?.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="resources" className="space-y-2">
              {lesson.resources?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lesson.resources.map((r, idx) => (
                    <li key={idx}>
                      <a className="text-primary underline" href={r.href} target="_blank" rel="noreferrer">{r.label}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No resources for this lesson.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/student/assignments">
            <ListChecks className="mr-2" size={18} /> Go to Tasks
          </Link>
        </Button>
      </div>
    </div>
  );
}