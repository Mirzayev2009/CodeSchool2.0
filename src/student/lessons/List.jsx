import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLessons, getMyLessons } from "../../lessonApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ListChecks,
  PlayCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import StudentHeader from "../../../components/StudentHeader";
import { useUser } from "../../UserContext";

function StatCard({ icon: Icon, label, value, isLoading }) {
  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="p-2 rounded-md bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
            ) : (
              value
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-12 ml-auto"></div>
        </div>
      </TableCell>
      <TableCell className="text-right pr-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="border border-red-200 bg-red-50">
      <CardContent className="flex items-center gap-4 p-6">
        <AlertCircle className="text-red-600" size={24} />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">Error Loading Lessons</h3>
          <p className="text-red-600 text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function LessonsList() {
  const navigate = useNavigate();
  const { token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalizer: map many possible backend shapes to a stable frontend shape
  const normalizeLesson = (l) => {
    const updatedAt =
      l.updatedAt ?? l.updated_at ?? l.modified ?? l.updated ?? null;
    const createdAt = l.createdAt ?? l.created_at ?? l.created ?? null;
    const tasksCount =
      l.tasksCount ?? l.tasks_count ?? l.homework_count ?? l.homeworkCount ?? 0;
    const duration = l.duration ?? l.duration_minutes ?? l.length ?? null;

    return {
      id: l.id ?? l.pk ?? l.lesson_id ?? null,
      title: l.title ?? l.name ?? "Untitled",
      description: l.description ?? l.desc ?? "",
      teacher_names: l.teacher_names ?? l.teacherNames ?? l.teachers ?? "",
      tasksCount,
      createdAt,
      updatedAt,
      duration,
      topic: l.topic ?? l.subject ?? null,
      // keep original raw payload if you ever need it:
      __raw: l,
    };
  };

  // reusable loader (outside useEffect so handleRetry can call it)
  const loadLessons = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const lessonsData = await getMyLessons(token);
      // helpful debug in console — inspect the exact shape
      console.debug("raw lessons response:", lessonsData);

      // detect array or common wrappers
      let arr = [];
      if (Array.isArray(lessonsData)) {
        arr = lessonsData;
      } else if (Array.isArray(lessonsData?.results)) {
        arr = lessonsData.results;
      } else if (Array.isArray(lessonsData?.lessons)) {
        arr = lessonsData.lessons;
      } else if (Array.isArray(lessonsData?.data)) {
        arr = lessonsData.data;
      } else if (Array.isArray(lessonsData?.payload)) {
        arr = lessonsData.payload;
      } else {
        // maybe the server returns a single object with lessons inside your top-level app context:
        // fallback: if object contains any numeric indexed keys — convert to values
        if (lessonsData && typeof lessonsData === "object") {
          // search for the first array value in the object
          const firstArrayValue = Object.values(lessonsData).find((v) =>
            Array.isArray(v)
          );
          if (firstArrayValue) arr = firstArrayValue;
        }
      }

      const normalized = arr.map(normalizeLesson);
      console.debug("normalized lessons:", normalized);
      setLessons(normalized);
    } catch (err) {
      console.error("Error loading lessons:", err);
      setError(err.message || "Failed to load lessons");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // load when token becomes available
  useEffect(() => {
    if (!token) return;
    loadLessons();
  }, [token, loadLessons]);

  const handleRetry = () => {
    loadLessons();
  };

  const stats = useMemo(() => {
    const total = lessons.length;
    let lastLesson = null;
    if (lessons.length > 0) {
      lastLesson = lessons.reduce((best, cur) => {
        const bestTime = Date.parse(best.updatedAt ?? best.createdAt ?? 0) || 0;
        const curTime = Date.parse(cur.updatedAt ?? cur.createdAt ?? 0) || 0;
        return curTime > bestTime ? cur : best;
      }, lessons[0]);
    }
    return { total, lastLesson };
  }, [lessons]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentHeader />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">My Lessons</h1>
          <p className="text-muted-foreground">
            Review lessons and jump back into learning.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Lessons"
            value={stats.total}
            isLoading={loading}
          />
          <StatCard
            icon={PlayCircle}
            label="Title of Last Lesson"
            value={stats.lastLesson?.title || "—"}
            isLoading={loading}
          />
        </section>

        {error && <ErrorState message={error} onRetry={handleRetry} />}

        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>All Lessons</CardTitle>
            <CardDescription>
              Click a lesson to view details and start learning.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Lesson</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <LoadingRow key={index} />
                  ))
                ) : lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <BookOpen className="mx-auto mb-2" size={48} />
                        <p>No lessons available</p>
                        <p className="text-sm">
                          Check back later for new content
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow
                      key={lesson.id ?? lesson.title}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock size={14} />
                          <span>{lesson.duration ?? "—"} min</span>
                          <span>•</span>
                          <span>
                            Updated{" "}
                            {lesson.updatedAt
                              ? new Date(lesson.updatedAt).toLocaleDateString()
                              : lesson.createdAt
                              ? new Date(lesson.createdAt).toLocaleDateString()
                              : "Recently"}
                          </span>
                          {lesson.topic && (
                            <>
                              <span>•</span>
                              <span>{lesson.topic}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          <ListChecks className="mr-1" size={16} />
                          {lesson.tasksCount ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/lessons/${lesson.id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
