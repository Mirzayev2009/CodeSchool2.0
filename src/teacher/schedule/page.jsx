import { useState, useEffect, useMemo } from "react";
import TeacherSidebar from "../../../components/TeacherSidebar";

const BASE_URL = "https://sanjar1718.pythonanywhere.com";

// Helpers
const shortTime = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};

// Local mock fallback (used when API fails)
const LOCAL_MOCK_SCHEDULE = {
  Monday: [{ group: "JS Basics", start_time: "09:00:00" }],
  Tuesday: [{ group: "React", start_time: "11:30:00" }],
  Wednesday: [],
  Thursday: [],
  Friday: [{ group: "DB Design", start_time: "10:30:00" }],
  Saturday: [],
  Sunday: [],
};

// Format date helper (not needed with week_offset but used for header dates)
const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function SchedulePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // offset integer
  const [isClient, setIsClient] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scheduleFromApi, setScheduleFromApi] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setIsDarkMode(savedTheme === "true");
    const onStorage = () =>
      setIsDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // compute Monday of currentWeek for header/date display
  const weekStartDate = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 Sun ... 6 Sat
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + currentWeek * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, [currentWeek]);

  const weekDates = useMemo(() => {
    if (!isClient) {
      // SSR-safe static fallback
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2024, 11, 23);
        d.setDate(23 + i);
        return d;
      });
    }
    const f = new Date(weekStartDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(f);
      d.setDate(f.getDate() + i);
      return d;
    });
  }, [isClient, weekStartDate]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNamesFull = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const colorMap = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-yellow-500",
  ];

  useEffect(() => {
    if (!isClient) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    setUsedFallback(false);

    // Read token simply from localStorage key 'token'
    let headers = { Accept: "application/json" };
    try {
      const raw = localStorage.getItem("token");
      if (raw && raw.trim()) {
        headers.Authorization = /\s/.test(raw)
          ? raw.trim()
          : `Token ${raw.trim()}`;
      }
    } catch (e) {
      // ignore localStorage read errors
    }

    // IMPORTANT: use week_offset (integer) to avoid server code path with _calculate_week_start bug
    const url = `${BASE_URL}/api/schedule/?week_offset=${currentWeek}&view_type=week`;

    fetch(url, {
      method: "GET",
      headers,
      // If you later need cookie/session auth, change credentials accordingly:
      // credentials: 'include'
    })
      .then(async (res) => {
        const text = await res.text();
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          json = text;
        }
        if (!res.ok) {
          if (res.status === 401)
            throw new Error(
              "401 Unauthorized — set a valid token in localStorage (key: token)."
            );
          if (res.status === 404)
            throw new Error(
              "404 Not Found — schedule endpoint missing on server."
            );
          throw new Error(
            `API error ${res.status}: ${
              typeof json === "string" ? json : JSON.stringify(json)
            }`
          );
        }
        return json;
      })
      .then((data) => {
        if (!mounted) return;
        if (data && data.schedule) {
          setScheduleFromApi(data.schedule);
          setUsedFallback(false);
        } else if (data && typeof data === "object") {
          // try best-effort adaptation
          setScheduleFromApi(data.schedule || data || {});
          setUsedFallback(false);
        } else {
          setScheduleFromApi(LOCAL_MOCK_SCHEDULE);
          setUsedFallback(true);
          setError("Unexpected API response; using local fallback.");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Schedule load error:", err);
        setScheduleFromApi(LOCAL_MOCK_SCHEDULE);
        setUsedFallback(true);
        setLoading(false);
        setError(err.message || "Failed to load schedule");
      });

    return () => {
      mounted = false;
    };
  }, [isClient, currentWeek]);

  const lessonsData = useMemo(() => {
    const data = Array.from({ length: 7 }, () => ({ lessons: [] }));
    if (!scheduleFromApi) return data;
    for (let i = 0; i < 7; i++) {
      const dayName = dayNamesFull[i];
      const entries = scheduleFromApi[dayName] || [];
      data[i].lessons = entries.map((e, idx) => ({
        id: `${dayName}-${idx}-${e.start_time || e.time || idx}`,
        time: shortTime(e.start_time || e.time || ""),
        group: e.group || e.course || e.title || e.name || "Course",
        room: e.room || e.room_name || e.location || "Room",
        students: e.students ?? e.attendees ?? 0,
        color: e.color || colorMap[idx % colorMap.length],
        isLive: Boolean(e.is_live || e.status === "live"),
      }));
    }
    return data;
  }, [scheduleFromApi]);

  const isToday = (date) => {
    if (!isClient) return false;
    return new Date().toDateString() === date.toDateString();
  };

  const getCurrentTime = () => {
    if (!isClient) return "09:30";
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const isLessonLive = (lesson) => {
    if (!isClient) return false;
    if (lesson.isLive) return true;
    if (!lesson.time) return false;
    const [ch, cm] = getCurrentTime().split(":").map(Number);
    const [lh, lm] = lesson.time.split(":").map(Number);
    const curr = new Date(2024, 0, 1, ch, cm);
    const les = new Date(2024, 0, 1, lh, lm);
    return Math.abs(curr - les) < 3600000;
  };

  const changeWeek = (dir) => setCurrentWeek((p) => p + dir);
  const getWeekLabel = () => {
    if (currentWeek === 0) return "This Week";
    if (currentWeek === 1) return "Next Week";
    if (currentWeek === -1) return "Last Week";
    if (currentWeek > 1) return `${currentWeek} Weeks Ahead`;
    return `${Math.abs(currentWeek)} Weeks Ago`;
  };

  const todayIndex = weekDates.findIndex((d) => isToday(d));
  const todayLessons =
    todayIndex !== -1 ? lessonsData[todayIndex]?.lessons || [] : [];
  const liveLessons = todayLessons.filter((l) => isLessonLive(l));

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      suppressHydrationWarning={true}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Weekly Schedule
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {weekDates[0].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {weekDates[6].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => changeWeek(-1)}
                  className="p-2 rounded bg-white border"
                >
                  ‹
                </button>
                <div className="px-4 py-2 rounded bg-white border">
                  {getWeekLabel()}
                </div>
                <button
                  onClick={() => changeWeek(1)}
                  className="p-2 rounded bg-white border"
                >
                  ›
                </button>

                <div className="ml-3">
                  {loading ? (
                    <span className="text-sm text-gray-500">Loading...</span>
                  ) : usedFallback ? (
                    <span className="text-sm text-yellow-600">
                      Using local fallback
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">Loaded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-xl shadow-lg border`}
            >
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {days.map((day, i) => {
                    const date = weekDates[i];
                    const lessons = lessonsData[i]?.lessons || [];
                    const todayFlag = isToday(date);
                    return (
                      <div key={day} className="space-y-3">
                        <div
                          className={`text-center p-3 rounded-lg ${
                            todayFlag
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="font-semibold text-sm">{day}</div>
                          <div className="text-lg font-bold">
                            {date.getDate()}
                          </div>
                          <div className="text-xs opacity-75">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </div>

                        <div className="space-y-2 min-h-[200px]">
                          {loading ? (
                            <div className="text-center py-8 text-gray-400">
                              Loading...
                            </div>
                          ) : lessons.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              Free Day
                            </div>
                          ) : (
                            lessons.map((lesson) => {
                              const live = isLessonLive(lesson);
                              return (
                                <div
                                  key={lesson.id}
                                  className={`p-3 rounded-lg text-white text-sm relative ${
                                    lesson.color || "bg-blue-500"
                                  } ${
                                    live
                                      ? "ring-2 ring-yellow-400 shadow-lg"
                                      : ""
                                  }`}
                                >
                                  {live && (
                                    <div className="absolute top-1 right-1">
                                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                                        LIVE
                                      </span>
                                    </div>
                                  )}
                                  <div className="font-bold text-lg mb-1">
                                    {lesson.time}
                                  </div>
                                  <div className="font-medium mb-1">
                                    {lesson.group}
                                  </div>
                                  <div className="text-xs opacity-90 flex items-center justify-between">
                                    <span>{lesson.room}</span>
                                    <span>{lesson.students}</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Today's summary */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-blue-400" : "text-blue-900"
                    }`}
                  >
                    Today's Status
                  </h3>
                  <p className="text-sm">Current time: {getCurrentTime()}</p>
                </div>

                <div className="text-right">
                  {liveLessons.length > 0 ? (
                    <div className="text-sm text-green-600">
                      <div className="font-medium">Currently Teaching</div>
                      <div>{liveLessons[0].group}</div>
                    </div>
                  ) : todayLessons.length > 0 ? (
                    <div className="text-sm text-yellow-600">
                      <div className="font-medium">
                        {todayLessons.length} lessons today
                      </div>
                      <div>
                        Next:{" "}
                        {todayLessons.find((l) => l.time > getCurrentTime())
                          ?.time || "No more lessons"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Free Day</div>
                      <div>No lessons scheduled</div>
                    </div>
                  )}
                </div>
              </div>
              {error && (
                <div className="mt-3 text-xs text-red-500">{error}</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
