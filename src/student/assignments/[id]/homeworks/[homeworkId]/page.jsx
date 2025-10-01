// src/student/assignments/HomeworkDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import StudentHeader from "../../../../../../components/StudentHeader";
import HomeworkDetailClient from "./HomeworkDetailClient";
import { getHomework, getHomeworkTasks } from "../../../../../homeworkApi";

export default function HomeworkDetailPage() {
  const { id, homeworkId } = useParams(); // id = assignment/lesson id, homeworkId = the specific homework id
  const token = localStorage.getItem("token");

  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);

      try {
        const [hwResult, tasksResult] = await Promise.allSettled([
          getHomework(homeworkId, token, { signal }),
          getHomeworkTasks(homeworkId, token, { signal }),
        ]);

        // If homework fetch was aborted -> ignore (component unmounted / new run)
        if (
          hwResult.status === "rejected" &&
          hwResult.reason?.name === "AbortError"
        ) {
          return;
        }

        // If homework request failed for other reason -> throw to show error
        if (hwResult.status === "rejected") {
          const reason = hwResult.reason;
          const msg =
            reason?.message ||
            `Failed to load homework (${reason?.status || ""})`;
          throw reason instanceof Error ? reason : new Error(msg);
        }

        // Now hwResult is fulfilled
        const hw = hwResult.value;

        // Determine tasks: prefer tasksResult if OK, otherwise fall back to hw.tasks
        let tasks = [];
        if (tasksResult.status === "fulfilled") {
          const t = tasksResult.value;
          if (Array.isArray(t)) tasks = t;
          else if (Array.isArray(t?.results)) tasks = t.results;
        } else if (tasksResult.status === "rejected") {
          // If tasks fetch was aborted, and hw has tasks, continue, otherwise ignore
          if (tasksResult.reason?.name === "AbortError") {
            // abort — simply fall back to hw.tasks
          } else {
            // log non-fatal tasks error and fall back to hw.tasks
            console.warn(
              "Failed to fetch tasks separately, falling back to hw.tasks",
              tasksResult.reason
            );
          }
        }

        if ((!tasks || tasks.length === 0) && Array.isArray(hw.tasks)) {
          tasks = hw.tasks;
        }

        const normalized = {
          ...hw,
          tasks,
          totalTasks: hw.totalTasks ?? tasks.length ?? hw.tasks?.length ?? 0,
        };

        setHomework(normalized);
      } catch (err) {
        // ignore aborts
        if (err?.name === "AbortError") return;

        console.error("Error fetching homework detail:", err);
        setError(err.message || "Failed to fetch homework");
        setHomework(null);
      } finally {
        setLoading(false);
      }
    },
    [homeworkId, token]
  );

  useEffect(() => {
    const ac = new AbortController();
    if (homeworkId) load(ac.signal);
    return () => ac.abort();
  }, [homeworkId, load]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!homework)
    return <div className="p-6 text-center">Homework not found.</div>;

  return (
    <div>
      <StudentHeader />
      <HomeworkDetailClient
        homework={homework}
        assignmentId={id}
        homeworkId={homeworkId}
      />
    </div>
  );
}
