import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lessonsMock, getLastLesson } from "../../lessonApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ListChecks, PlayCircle, Clock } from "lucide-react";
import StudentHeader from '../../../components/StudentHeader';


function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="p-2 rounded-md bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LessonsList() {
  const navigate = useNavigate();
  const total = lessonsMock.length;
  const lastLesson = useMemo(() => getLastLesson(lessonsMock), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">  
      <StudentHeader />
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">My Lessons</h1>
        <p className="text-muted-foreground">Review lessons and jump back into learning.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={BookOpen} label="Total Lessons" value={total} />
        <StatCard icon={PlayCircle} label="Title of Last Lesson" value={lastLesson?.title || "—"} />
      </section>

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
              {lessonsMock.map((lesson) => (
                <TableRow key={lesson.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate(`/student/lessons/${lesson.id}`)}>
                  <TableCell>
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      <span>{lesson.duration} min</span>
                      <span>•</span>
                      <span>Updated {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                      <ListChecks className="mr-1" size={16} /> {lesson.tasksCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/student/lessons/${lesson.id}`); }}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}