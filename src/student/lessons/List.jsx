import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLessons, getMyLessons } from "../../lessonApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ListChecks, PlayCircle, Clock, AlertCircle } from "lucide-react";
import StudentHeader from '../../../components/StudentHeader';
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

  useEffect(() => {
    if (!token) return; // no token yet, skip

    const loadLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const lessonsData = await getMyLessons(token); // 🔑 pass token
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError("Failed to load lessons");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [token]);



  const stats = useMemo(() => {
    const total = lessons.length;
    const lastLesson = lessons.length > 0 ? 
      lessons.reduce((latest, lesson) => 
        new Date(lesson.updatedAt) > new Date(latest.updatedAt) ? lesson : latest
      ) : null;
    
    return { total, lastLesson };
  }, [lessons]);

  const handleRetry = () => {
    loadLessons();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">  
      <StudentHeader />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">My Lessons</h1>
          <p className="text-muted-foreground">Review lessons and jump back into learning.</p>
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

        {error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>All Lessons</CardTitle>
            <CardDescription>Click a lesson to view details and start learning.</CardDescription>
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
                  // Show loading rows
                  Array.from({ length: 3 }).map((_, index) => (
                    <LoadingRow key={index} />
                  ))
                ) : lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <BookOpen className="mx-auto mb-2" size={48} />
                        <p>No lessons available</p>
                        <p className="text-sm">Check back later for new content</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow 
                      key={lesson.id} 
                      className="cursor-pointer hover:bg-muted/40" 
                      onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock size={14} />
                          <span>{lesson.duration || '—'} min</span>
                          <span>•</span>
                          <span>
                            Updated {lesson.updatedAt ? 
                              new Date(lesson.updatedAt).toLocaleDateString() : 
                              'Recently'
                            }
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
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                          <ListChecks className="mr-1" size={16} /> 
                          {lesson.tasksCount || lesson.tasks_count || 0}
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