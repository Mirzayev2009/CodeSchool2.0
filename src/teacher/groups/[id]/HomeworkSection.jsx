"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../UserContext";
import { getLessons, getLessonHomework } from "../../../lessonApi";
import {
  getHomeworkTasks,
  createHomework,
  updateHomework,
  deleteHomework,
} from "../../../homeworkApi";
import { getTasks } from "../../../taskApi";

export default function LessonHomeworkSection() {
  const { token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [lessonHomeworks, setLessonHomeworks] = useState({});
  const [homeworkTasks, setHomeworkTasks] = useState({});
  const [savedLessons, setSavedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedHomeworks, setSelectedHomeworks] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState(null);

  // CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state for forms
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    if (!token) return;
    loadLessons();
  }, [token]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const lessonsData = await getLessons(token);
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error loading lessons:", error);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const loadHomeworks = async (lessonId) => {
    if (lessonHomeworks[lessonId]) return;

    setLoadingHomeworks(true);
    try {
      const homeworkData = await getLessonHomework(lessonId, token);
      const homeworks = homeworkData.homework || homeworkData || [];
      setLessonHomeworks((prev) => ({
        ...prev,
        [lessonId]: homeworks,
      }));
    } catch (error) {
      console.error("Error loading homeworks:", error);
      setError("Failed to load homeworks");
    } finally {
      setLoadingHomeworks(false);
    }
  };

  const loadTasks = async (homeworkId) => {
    if (homeworkTasks[homeworkId]) return;

    setLoadingTasks(true);
    try {
      let tasks = [];

      // First try to get all tasks and filter by homework ID
      try {
        console.log("Fetching tasks for homework ID:", homeworkId);
        const allTasks = await getTasks(token);
        console.log("All tasks received:", allTasks);

        // Debug: Log the structure of the first few tasks to understand the data
        if (allTasks.length > 0) {
          console.log("Sample task structure:", allTasks[0]);
          console.log("Task properties:", Object.keys(allTasks[0]));
        }

        // Try multiple filtering approaches based on the actual data structure
        const targetHomeworkId = parseInt(homeworkId);

        // Method 1: Filter by homework property
        let filteredTasks = allTasks.filter((task) => {
          const taskHomeworkId = parseInt(task.homework);
          return taskHomeworkId === targetHomeworkId;
        });

        // Method 2: If no results, try filtering by homework_id property
        if (filteredTasks.length === 0) {
          filteredTasks = allTasks.filter((task) => {
            const taskHomeworkId = parseInt(task.homework_id);
            return taskHomeworkId === targetHomeworkId;
          });
        }

        // Method 3: If still no results, find the homework name and filter by homework_title
        if (filteredTasks.length === 0) {
          const activeHomeworks = lessonHomeworks[activeLesson] || [];
          const currentHomework = activeHomeworks.find(
            (hw) => hw.id === homeworkId
          );
          if (currentHomework) {
            console.log(
              "Trying to filter by homework title:",
              currentHomework.title
            );
            filteredTasks = allTasks.filter((task) => {
              return task.homework_title === currentHomework.title;
            });
          }
        }

        tasks = filteredTasks;
        console.log(
          "Final filtered tasks for homework",
          homeworkId,
          ":",
          tasks
        );
      } catch (tasksError) {
        console.log("Tasks API failed, trying homework API...", tasksError);

        // Fallback: Try the homework-specific endpoint
        try {
          const homeworkTasksData = await getHomeworkTasks(homeworkId, token);
          console.log("Homework tasks data:", homeworkTasksData);
          tasks = homeworkTasksData.tasks || homeworkTasksData || [];
        } catch (homeworkError) {
          console.error("Both API methods failed:", homeworkError);
          tasks = [];
        }
      }

      console.log("Final tasks for homework", homeworkId, ":", tasks);
      setHomeworkTasks((prev) => ({
        ...prev,
        [homeworkId]: tasks,
      }));
    } catch (error) {
      console.error("Error in loadTasks:", error);
      setHomeworkTasks((prev) => ({
        ...prev,
        [homeworkId]: [],
      }));
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    setActiveLesson(lessonId);
    setSelectedHomeworks((prev) => ({ ...prev, [lessonId]: [] }));
    setSelectedTasks({});
    setError(null);
    loadHomeworks(lessonId);
  };

  const handleHomeworkClick = (homeworkId) => {
    setSelectedHomeworks((prev) => {
      const currentSelected = prev[activeLesson] || [];
      const isSelected = currentSelected.includes(homeworkId);

      if (isSelected) {
        setSelectedTasks((prev) => {
          const newTasks = { ...prev };
          delete newTasks[homeworkId];
          return newTasks;
        });
        return {
          ...prev,
          [activeLesson]: currentSelected.filter((id) => id !== homeworkId),
        };
      } else {
        loadTasks(homeworkId);
        return {
          ...prev,
          [activeLesson]: [...currentSelected, homeworkId],
        };
      }
    });
  };

  const handleTaskClick = (homeworkId, taskId) => {
    setSelectedTasks((prev) => {
      const currentTasks = prev[homeworkId] || [];
      if (currentTasks.includes(taskId)) {
        return {
          ...prev,
          [homeworkId]: currentTasks.filter((id) => id !== taskId),
        };
      } else {
        return {
          ...prev,
          [homeworkId]: [...currentTasks, taskId],
        };
      }
    });
  };

  const handleSave = () => {
    if (!activeLesson) return;

    const selectedHomeworkIds = selectedHomeworks[activeLesson] || [];
    if (selectedHomeworkIds.length === 0) {
      showNotification(
        "Please select at least one homework before saving.",
        "error"
      );
      return;
    }

    if (!savedLessons.includes(activeLesson)) {
      setSavedLessons((prev) => [...prev, activeLesson]);
    }

    showNotification("Lesson saved successfully!", "success");
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    if (!activeLesson) return;

    // Validate form data
    if (!homeworkForm.title.trim()) {
      showNotification("Please enter a homework title", "error");
      return;
    }

    if (!homeworkForm.description.trim()) {
      showNotification("Please enter a homework description", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Creating homework with data:", {
        ...homeworkForm,
        lesson: activeLesson,
      });

      // Prepare the data object
      const homeworkData = {
        title: homeworkForm.title.trim(),
        description: homeworkForm.description.trim(),
        lesson: activeLesson,
      };

      // Only add due_date if it's provided
      if (homeworkForm.due_date) {
        homeworkData.due_date = homeworkForm.due_date;
      }

      const newHomework = await createHomework(homeworkData, token);
      console.log("Created homework response:", newHomework);

      // Update local state - handle different response structures
      const homeworkToAdd = newHomework.data || newHomework;

      setLessonHomeworks((prev) => ({
        ...prev,
        [activeLesson]: [...(prev[activeLesson] || []), homeworkToAdd],
      }));

      // Reset form and close modal
      setHomeworkForm({ title: "", description: "", due_date: "" });
      setShowCreateModal(false);
      showNotification("Homework created successfully!");
    } catch (error) {
      console.error("Error creating homework:", error);

      // More detailed error handling
      let errorMessage = "Failed to create homework";
      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateHomework = async (e) => {
    e.preventDefault();
    if (!editingHomework) return;

    // Validate form data
    if (!homeworkForm.title.trim()) {
      showNotification("Please enter a homework title", "error");
      return;
    }

    if (!homeworkForm.description.trim()) {
      showNotification("Please enter a homework description", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(
        "Updating homework with ID:",
        editingHomework.id,
        "Data:",
        homeworkForm
      );

      // Prepare the data object
      const updateData = {
        title: homeworkForm.title.trim(),
        description: homeworkForm.description.trim(),
      };

      // Only add due_date if it's provided
      if (homeworkForm.due_date) {
        updateData.due_date = homeworkForm.due_date;
      }

      const updatedHomework = await updateHomework(
        editingHomework.id,
        updateData,
        token
      );
      console.log("Updated homework response:", updatedHomework);

      // Handle different response structures
      const homeworkToUpdate = updatedHomework.data || updatedHomework;

      setLessonHomeworks((prev) => ({
        ...prev,
        [activeLesson]: prev[activeLesson].map((hw) =>
          hw.id === editingHomework.id ? { ...hw, ...homeworkToUpdate } : hw
        ),
      }));

      // Reset form and close modal
      setHomeworkForm({ title: "", description: "", due_date: "" });
      setShowEditModal(false);
      setEditingHomework(null);
      showNotification("Homework updated successfully!");
    } catch (error) {
      console.error("Error updating homework:", error);

      // More detailed error handling
      let errorMessage = "Failed to update homework";
      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    if (
      !confirm(
        "Are you sure you want to delete this homework? This action cannot be undone."
      )
    )
      return;

    try {
      console.log("Deleting homework with ID:", homeworkId);

      await deleteHomework(homeworkId, token);
      console.log("Homework deleted successfully");

      // Remove from local state
      setLessonHomeworks((prev) => ({
        ...prev,
        [activeLesson]: prev[activeLesson].filter((hw) => hw.id !== homeworkId),
      }));

      // Also remove from selected homeworks if it was selected
      setSelectedHomeworks((prev) => ({
        ...prev,
        [activeLesson]: (prev[activeLesson] || []).filter(
          (id) => id !== homeworkId
        ),
      }));

      // Remove associated tasks from state
      setHomeworkTasks((prev) => {
        const newTasks = { ...prev };
        delete newTasks[homeworkId];
        return newTasks;
      });

      setSelectedTasks((prev) => {
        const newSelectedTasks = { ...prev };
        delete newSelectedTasks[homeworkId];
        return newSelectedTasks;
      });

      showNotification("Homework deleted successfully!");
    } catch (error) {
      console.error("Error deleting homework:", error);

      // More detailed error handling
      let errorMessage = "Failed to delete homework";
      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    }
  };

  const openEditModal = (homework) => {
    setEditingHomework(homework);
    setHomeworkForm({
      title: homework.title || "",
      description: homework.description || "",
      due_date: homework.due_date ? homework.due_date.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setHomeworkForm({ title: "", description: "", due_date: "" });
    setIsSubmitting(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingHomework(null);
    setHomeworkForm({ title: "", description: "", due_date: "" });
    setIsSubmitting(false);
  };

  const hasSelections = () => {
    const selectedHomeworkIds = selectedHomeworks[activeLesson] || [];
    return selectedHomeworkIds.length > 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error && lessons.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-12 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <button
            onClick={loadLessons}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeHomeworks = lessonHomeworks[activeLesson] || [];
  const selectedHomeworkIds = selectedHomeworks[activeLesson] || [];
  const activeLessonData = lessons.find((l) => l.id === activeLesson);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Assignment Distribution Manager
        </h2>
        <p className="opacity-90">
          Assign lessons, homework, and tasks to your students
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Lessons ({lessons.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {lessons.map((lesson) => {
                const isSaved = savedLessons.includes(lesson.id);
                const isActive = activeLesson === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 hover:shadow-lg transform hover:-translate-y-1
                      ${
                        isSaved
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-green-200 shadow-lg"
                          : isActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-blue-200 shadow-lg"
                          : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className="font-semibold text-sm mb-2">
                      {lesson.title}
                    </div>
                    <div
                      className={`text-xs ${
                        isSaved || isActive ? "opacity-90" : "text-gray-500"
                      }`}
                    >
                      {lesson.description?.slice(0, 60)}...
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        isSaved || isActive ? "opacity-80" : "text-gray-400"
                      }`}
                    >
                      {lesson.homework_count || 0} homework assignments
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Homeworks Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {activeLesson
                  ? `Homework (${activeHomeworks.length})`
                  : "Select a lesson"}
              </h3>
              {activeLesson && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + Add Homework
                </button>
              )}
            </div>

            {!activeLesson ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">
                  Choose a lesson to manage homework
                </p>
              </div>
            ) : loadingHomeworks ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading homework...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {activeHomeworks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-gray-500 mb-4">
                      No homework assignments yet
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Homework
                    </button>
                  </div>
                ) : (
                  activeHomeworks.map((homework) => {
                    const isSelected = selectedHomeworkIds.includes(
                      homework.id
                    );
                    return (
                      <div
                        key={homework.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg
                          ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-blue-200 shadow-lg"
                              : "bg-white border-gray-200 hover:border-blue-300"
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4
                            className="font-semibold text-sm cursor-pointer flex-1"
                            onClick={() => handleHomeworkClick(homework.id)}
                          >
                            {homework.title}
                          </h4>
                          <div className="flex space-x-2 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(homework);
                              }}
                              className={`p-1.5 rounded-md transition-colors ${
                                isSelected
                                  ? "hover:bg-blue-400 text-white"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHomework(homework.id);
                              }}
                              className={`p-1.5 rounded-md transition-colors ${
                                isSelected
                                  ? "hover:bg-red-400 text-white"
                                  : "hover:bg-red-100 text-red-600"
                              }`}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p
                          className={`text-xs mb-3 cursor-pointer ${
                            isSelected ? "opacity-90" : "text-gray-600"
                          }`}
                          onClick={() => handleHomeworkClick(homework.id)}
                        >
                          {homework.description?.slice(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isSelected
                                ? "bg-white bg-opacity-20 text-white"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {homework.task_count || 0} tasks
                          </span>
                          {homework.created_at && (
                            <span
                              className={`text-xs ${
                                isSelected ? "opacity-80" : "text-gray-500"
                              }`}
                            >
                              {new Date(
                                homework.created_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Tasks Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Tasks</h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {selectedHomeworkIds.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-gray-500 text-lg">
                    Select homework to view tasks
                  </p>
                </div>
              ) : (
                selectedHomeworkIds.map((homeworkId) => {
                  const homework = activeHomeworks.find(
                    (hw) => hw.id === homeworkId
                  );
                  const tasks = homeworkTasks[homeworkId] || [];
                  const selectedTaskIds = selectedTasks[homeworkId] || [];

                  return (
                    <div
                      key={homeworkId}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
                        📋 {homework?.title}
                      </h4>

                      {loadingTasks ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm mt-2 text-gray-600">
                            Loading tasks...
                          </p>
                        </div>
                      ) : tasks.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <div className="text-3xl mb-2">📝</div>
                          <p className="text-sm">No tasks available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {tasks.map((task) => {
                            const isTaskSelected = selectedTaskIds.includes(
                              task.id
                            );
                            return (
                              <div
                                key={task.id}
                                onClick={() =>
                                  handleTaskClick(homeworkId, task.id)
                                }
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md
                                  ${
                                    isTaskSelected
                                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500"
                                      : "bg-gray-50 border-gray-200 hover:border-green-300"
                                  }`}
                              >
                                <div className="font-medium text-sm mb-1">
                                  {task.title}
                                </div>
                                <div
                                  className={`text-xs mb-2 ${
                                    isTaskSelected
                                      ? "opacity-90"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {task.description?.slice(0, 80)}...
                                </div>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      isTaskSelected
                                        ? "bg-white bg-opacity-20 text-white"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {task.test_case_count || 0} test cases
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      isTaskSelected
                                        ? "opacity-80"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {task.submission_count || 0} submissions
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {hasSelections() && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4">
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  💾 Save Lesson Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Homework Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Create New Homework
            </h3>
            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={homeworkForm.title}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter homework title"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={homeworkForm.description}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter homework description"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={homeworkForm.due_date}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      due_date: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Homework"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Homework Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Edit Homework
            </h3>
            <form onSubmit={handleUpdateHomework} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={homeworkForm.title}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={homeworkForm.description}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={homeworkForm.due_date}
                  onChange={(e) =>
                    setHomeworkForm((prev) => ({
                      ...prev,
                      due_date: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Homework"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
