"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../UserContext";
import { getLessons, getLessonHomework } from "../../../lessonApi";
import {
  createHomework,
  updateHomework,
  deleteHomework,
} from "../../../homeworkApi";

export default function LessonHomeworkSection() {
  const { token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [lessonHomeworks, setLessonHomeworks] = useState({});
  const [savedLessons, setSavedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedHomeworks, setSelectedHomeworks] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [error, setError] = useState(null);

  // CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setLessons(lessonsData || []);
    } catch (error) {
      console.error("Error loading lessons:", error);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  // Load homeworks for a lesson; only fetch if we haven't loaded that lesson's homeworks yet.
  const loadHomeworks = async (lessonId) => {
    // treat 'undefined' as not-yet-loaded; if it exists (even as empty array) skip
    if (typeof lessonHomeworks[lessonId] !== "undefined") return;

    setLoadingHomeworks(true);
    try {
      const homeworkData = await getLessonHomework(lessonId, token);
      // API might return an object with `.homework` or an array directly
      const homeworks = homeworkData?.homework ?? homeworkData ?? [];
      setLessonHomeworks((prev) => ({
        ...prev,
        [lessonId]: Array.isArray(homeworks) ? homeworks : [],
      }));
    } catch (error) {
      console.error("Error loading homeworks:", error);
      setError("Failed to load homeworks");
      setLessonHomeworks((prev) => ({ ...prev, [lessonId]: [] }));
    } finally {
      setLoadingHomeworks(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    const normalizedLessonId = Number(lessonId);
    setActiveLesson(normalizedLessonId);
    setSelectedHomeworks((prev) => ({ ...prev, [normalizedLessonId]: [] }));
    setError(null);
    loadHomeworks(normalizedLessonId);
  };

  const handleHomeworkClick = (homeworkId) => {
    if (activeLesson === null) return;
    const hwId = Number(homeworkId);
    setSelectedHomeworks((prev) => {
      const currentSelected = prev[activeLesson] || [];
      const isSelected = currentSelected.includes(hwId);

      if (isSelected) {
        return {
          ...prev,
          [activeLesson]: currentSelected.filter((id) => id !== hwId),
        };
      } else {
        return {
          ...prev,
          [activeLesson]: [...currentSelected, hwId],
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

    const homeworkData = {
      title: homeworkForm.title.trim(),
      description: homeworkForm.description.trim(),
      lesson: Number(activeLesson), // 🔑 make sure it’s an integer
    };

    try {
      console.log("📤 Creating homework →", homeworkData);

      const newHomework = await createHomework(homeworkData, token);

      console.log("✅ Homework created (server response):", newHomework);

      if (!newHomework || !newHomework.id) {
        throw new Error("Invalid response from server");
      }

      setLessonHomeworks((prev) => ({
        ...prev,
        [activeLesson]: [...(prev[activeLesson] || []), newHomework],
      }));

      setShowCreateModal(false);
      setHomeworkForm({ title: "", description: "" });
      showNotification("Homework created successfully!");
    } catch (error) {
      console.error(
        "❌ Failed to create homework:",
        error.status,
        error.body || error.message
      );
      showNotification("Failed to create homework", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateHomework = async (e) => {
    e.preventDefault();
    if (!editingHomework) return;

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
      const updateData = {
        title: homeworkForm.title.trim(),
        description: homeworkForm.description.trim(),
      };
      if (homeworkForm.due_date) updateData.due_date = homeworkForm.due_date;

      const updatedHomework = await updateHomework(
        editingHomework.id,
        updateData,
        token
      );
      const homeworkToUpdate = updatedHomework?.data ?? updatedHomework;

      setLessonHomeworks((prev) => {
        const existing = prev[activeLesson] || [];
        return {
          ...prev,
          [activeLesson]: existing.map((hw) =>
            Number(hw.id) === Number(editingHomework.id)
              ? { ...hw, ...homeworkToUpdate }
              : hw
          ),
        };
      });

      setHomeworkForm({ title: "", description: "", due_date: "" });
      setShowEditModal(false);
      setEditingHomework(null);
      showNotification("Homework updated successfully!");
    } catch (error) {
      console.error("Error updating homework:", error);
      let errorMessage = "Failed to update homework";
      if (error?.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error?.message) {
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
      await deleteHomework(homeworkId, token);

      setLessonHomeworks((prev) => {
        const arr = prev[activeLesson] || [];
        return {
          ...prev,
          [activeLesson]: arr.filter(
            (hw) => Number(hw.id) !== Number(homeworkId)
          ),
        };
      });

      setSelectedHomeworks((prev) => ({
        ...prev,
        [activeLesson]: (prev[activeLesson] || []).filter(
          (id) => Number(id) !== Number(homeworkId)
        ),
      }));

      setSavedLessons((prev) =>
        prev.filter((id) => Number(id) !== Number(activeLesson))
      );

      showNotification("Homework deleted successfully!");
    } catch (error) {
      console.error("Error deleting homework:", error);
      let errorMessage = "Failed to delete homework";
      if (error?.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error?.message) {
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
      due_date: homework.due_date
        ? String(homework.due_date).split("T")[0]
        : "",
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
  const activeLessonData = lessons.find(
    (l) => Number(l.id) === Number(activeLesson)
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Assignment Distribution Manager
        </h2>
        <p className="opacity-90">
          Assign lessons and homework to your students
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lessons Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Lessons ({lessons.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {lessons.map((lesson) => {
                const isSaved = savedLessons.includes(Number(lesson.id));
                const isActive = Number(activeLesson) === Number(lesson.id);

                return (
                  <div
                    key={String(lesson.id)}
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
            ) : activeHomeworks.length === 0 ? (
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
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {activeHomeworks.map((homework) => {
                  const isSelected = selectedHomeworkIds.includes(
                    Number(homework.id)
                  );
                  return (
                    <div
                      key={String(homework.id)}
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
                            {new Date(homework.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Save area */}
                {hasSelections() && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 mt-4">
                    <button
                      onClick={handleSave}
                      className="w-full py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      💾 Save Lesson Selection
                    </button>
                  </div>
                )}
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
