// src/student/assignments/AssignmentHomeworksPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import StudentHeader from "../../../../../components/StudentHeader";
import HomeworkListClient from "./HomeworkListClient";
import { getLesson, getLessonHomework } from "../../../../homeworkApi";

export default function AssignmentHomeworksPage() {
  const { id } = useParams(); // this is the lesson id in your flow (lesson -> homework)
  const token = localStorage.getItem("token"); // fallback to localStorage (you can replace with useUser().token)

  const [assignment, setAssignment] = useState(null); // here "assignment" is actually the lesson meta
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeHomework = (h) => {
    if (!h) return null;
    return {
      id: h.id ?? h.pk ?? null,
      title: h.title ?? h.name ?? "Untitled",
      description: h.description ?? h.desc ?? "",
      status: h.status ?? "pending",
      difficulty: h.difficulty ?? h.level ?? "",
      type: h.type ?? h.task_type ?? "theory",
      points: h.points ?? h.score ?? 0,
      // keep raw if needed:
      __raw: h,
    };
  };

  const load = useCallback(
    async (signal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // fetch lesson meta + the lesson's homeworks (lesson -> homework relationship)
        const [lessonData, lessonHomeworks] = await Promise.all([
          getLesson(id, token, { signal }),
          getLessonHomework(id, token, { signal }),
        ]);

        // lessonHomeworks may be array or object { results: [...] }
        let hwArr = [];
        if (Array.isArray(lessonHomeworks)) hwArr = lessonHomeworks;
        else if (Array.isArray(lessonHomeworks?.results))
          hwArr = lessonHomeworks.results;
        else if (lessonHomeworks && typeof lessonHomeworks === "object") {
          // fallback: find first array value
          const firstArray = Object.values(lessonHomeworks).find((v) =>
            Array.isArray(v)
          );
          hwArr = firstArray ?? [];
        }

        setAssignment({
          id: lessonData.id ?? lessonData.pk,
          title: lessonData.title ?? lessonData.name,
          subject: lessonData.topic ?? lessonData.subject ?? "",
          teacher: lessonData.teacher_names ?? lessonData.teacher ?? "",
          description: lessonData.description ?? "",
          dueDate: lessonData.due_date ?? lessonData.due ?? "",
          __raw: lessonData,
        });

        setHomeworks(hwArr.map(normalizeHomework));
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching assignment/homeworks:", err);
        setError(err.message || "Failed to load");
        setAssignment(null);
        setHomeworks([]);
      } finally {
        setLoading(false);
      }
    },
    [id, token]
  );

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!assignment)
    return <div className="p-6 text-center">Assignment not found.</div>;

  return (
    <div>
      <StudentHeader />
      <HomeworkListClient
        assignment={assignment}
        homeworks={homeworks}
        assignmentId={id}
      />
    </div>
  );
}
