// src/student/assignments/HomeworkDetailClient.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

// keep your existing API helpers (you said backend helpers already work)
import { executeCode, testCode } from "../../../../../editorApi";
import { createSubmission } from "../../../../../submissionApi";

// CodeMirror imports
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

export default function HomeworkDetailClient({
  assignmentId,
  homeworkId,
  homework,
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Tasks & navigation
  const [currentTask, setCurrentTask] = useState(1);
  const tasks = homework?.tasks ?? [];
  const totalTasks = homework?.totalTasks ?? tasks.length ?? 1;
  const currentTaskData = tasks[currentTask - 1] || {};

  // language detection (allow tasks/homework to override)
  const language = currentTaskData?.language ?? homework?.language ?? "python";

  // file extension map so backend can use filename
  const extMap = {
    python: "py",
    javascript: "js",
    typescript: "ts",
    java: "java",
    c: "c",
    cpp: "cpp",
  };
  const filename = `solution.${extMap[language] ?? "txt"}`;

  // Editor state
  const [code, setCode] = useState(
    currentTaskData?.starterCode ??
      homework?.starterCode ??
      "# Write your solution here"
  );
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Editor ref for attaching key listeners and focusing
  const editorViewRef = useRef(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Dark mode listener (same as before)
  useEffect(() => {
    const apply = () =>
      setIsDarkMode(localStorage.getItem("darkMode") === "true");
    apply();
    window.addEventListener("storage", apply);
    return () => window.removeEventListener("storage", apply);
  }, []);

  // When homework changes, reset to first task
  useEffect(() => {
    setCurrentTask(1);
  }, [homework?.id]);

  // Load starter or saved draft when currentTask or homework changes
  useEffect(() => {
    const starter =
      tasks[currentTask - 1]?.starterCode ??
      homework?.starterCode ??
      (language === "python"
        ? "# Write your solution here"
        : "// Write your solution here");
    const storageKey = `hw_${homeworkId}_task_${currentTask}`;
    const saved = localStorage.getItem(storageKey);
    setCode(saved ?? starter);
    setOutput("");
    setIsCompleted(false);
    setTestResults(null);
  }, [
    currentTask,
    homework?.id /* eslint-disable-line react-hooks/exhaustive-deps */,
  ]);

  // Debounced autosave (simple implementation)
  const saveTimeout = useRef(null);
  useEffect(() => {
    // Save after 700ms of inactivity
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        const storageKey = `hw_${homeworkId}_task_${currentTask}`;
        localStorage.setItem(storageKey, code);
      } catch (e) {
        // ignore storage errors
      }
    }, 700);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [code, homeworkId, currentTask]);

  // Keyboard shortcut (Ctrl/Cmd + Enter) wired when editor is created
  const onCreateEditor = (editor) => {
    // editor is the CodeMirror view instance wrapper created by the library
    // get contentDOM for key events
    const dom = editor?.contentDOM;
    if (!dom) return;

    const handler = (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
        ev.preventDefault();
        runCode();
      }
    };
    dom.addEventListener("keydown", handler);

    // Save ref so we can focus or cleanup if needed
    editorViewRef.current = { editor, handler, dom };
  };

  // Cleanup key listener if unmounting or editor replaced
  useEffect(() => {
    return () => {
      const ref = editorViewRef.current;
      if (ref?.dom && ref?.handler) {
        ref.dom.removeEventListener("keydown", ref.handler);
      }
    };
  }, []);

  // Helper: build token+payload consistently
  const buildExecutionPayload = () => {
    return {
      code,
      language,
      input: "", // modify if you add an input field
      token: getToken(),
      filename,
    };
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    try {
      const payload = buildExecutionPayload();
      const result = await executeCode(payload);

      // prefer stdout / output, fallback to returned object
      const stdout = result.stdout ?? result.output ?? "";
      const stderr = result.stderr ?? result.error ?? "";
      if (stderr) {
        setOutput(`Error: ${stderr}`);
      } else if (stdout) {
        setOutput(stdout);
      } else {
        setOutput("Code executed successfully");
      }
    } catch (err) {
      setOutput(`Error: ${err?.message ?? String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testCurrentTask = async () => {
    if (!currentTaskData.id) {
      setOutput("Error: No task ID available for testing");
      return;
    }

    setIsTesting(true);
    setOutput("");
    setTestResults(null);

    try {
      const payload = {
        code,
        language,
        task_id: currentTaskData.id,
        token: getToken(),
        filename,
      };
      const result = await testCode(payload);

      setTestResults(result);

      if (result.passed) {
        setIsCompleted(true);
        setShowSuccess(true);
        setOutput("✅ All tests passed! Task completed successfully.");
        setTimeout(() => setShowSuccess(false), 2500);
      } else {
        setIsCompleted(false);
        const failedTests = result.test_results?.filter((t) => !t.passed) || [];
        const errorMessage =
          failedTests.length > 0
            ? `❌ ${failedTests.length} test(s) failed:\n${failedTests
                .map(
                  (test) =>
                    `• ${test.name}: ${
                      test.error ?? test.expected_output ?? "failed"
                    }`
                )
                .join("\n")}`
            : "❌ Some tests failed";
        setOutput(errorMessage);
      }
    } catch (err) {
      setOutput(`Testing Error: ${err?.message ?? String(err)}`);
      setIsCompleted(false);
    } finally {
      setIsTesting(false);
    }
  };

  const submitHomework = async () => {
    setIsSubmitting(true);
    try {
      const token = getToken();

      const submissionData = {
        homework_id: homeworkId,
        task_id: currentTaskData.id,
        code: code,
        language,
        filename,
        status: isCompleted ? "completed" : "in_progress",
      };

      await createSubmission(submissionData, token);

      setOutput("✅ Homework submitted successfully!");
      console.log("Homework submitted:", {
        assignmentId,
        homeworkId,
        currentTask,
        code,
      });
    } catch (err) {
      setOutput(`Submission Error: ${err?.message ?? String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation helpers
  const goToNextTask = () => {
    if (currentTask < totalTasks) setCurrentTask((p) => p + 1);
  };
  const goToPrevTask = () => {
    if (currentTask > 1) setCurrentTask((p) => p - 1);
  };

  // Explanation formatting (unchanged)
  const formatExplanation = (text = "") => {
    return String(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(
        /```python\n([\s\S]*?)\n```/g,
        '<pre class="bg-gray-100 p-3 rounded-lg mt-2 mb-2 text-sm overflow-x-auto"><code>$1</code></pre>'
      );
  };

  // CodeMirror extensions (language-aware)
  const cmExtensions = useMemo(() => {
    const langExt = language === "python" ? python() : javascript();
    return [
      langExt,
      EditorView.lineWrapping,
      indentWithTab,
      // add other useful extensions here
    ];
  }, [language]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/student/assignments/${assignmentId}/homeworks`}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i className="ri-arrow-left-line w-4 h-4"></i>
                <span>Back to Homeworks</span>
              </Link>

              <div
                className={`h-6 w-px ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-300"
                }`}
              />

              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {homework.title}
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Task {currentTask} of {totalTasks}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevTask}
                disabled={currentTask === 1}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  currentTask === 1
                    ? "opacity-50 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              <span
                className={`px-3 py-1.5 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {currentTask} / {totalTasks}
              </span>
              <button
                onClick={goToNextTask}
                disabled={currentTask === totalTasks || !isCompleted}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  !isCompleted || currentTask === totalTasks
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <i className="ri-check-line w-5 h-5"></i>
            <span>Task completed successfully!</span>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left - Explanation */}
        <div
          className={`w-1/2 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border-r ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } overflow-y-auto`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {currentTaskData.title ?? `Task ${currentTask}`}
              </h2>
              {isCompleted && (
                <div className="flex items-center space-x-1 text-green-600">
                  <i className="ri-check-circle-fill w-5 h-5"></i>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            <div
              className={`prose max-w-none ${
                isDarkMode ? "prose-invert" : ""
              } text-sm leading-relaxed`}
              dangerouslySetInnerHTML={{
                __html: formatExplanation(
                  currentTaskData.explanation ||
                    currentTaskData.description ||
                    ""
                ),
              }}
            />

            {/* Test Results Display */}
            {testResults && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Test Results
                </h3>
                <div className="space-y-2">
                  {testResults.test_results?.map((test, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 text-sm ${
                        test.passed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <i
                        className={`w-4 h-4 ${
                          test.passed
                            ? "ri-check-circle-fill"
                            : "ri-close-circle-fill"
                        }`}
                      ></i>
                      <span>{test.name || `Test ${index + 1}`}</span>
                      {!test.passed && test.error && (
                        <span className="text-xs text-gray-500">
                          {" "}
                          - {test.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Progress
                </span>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {Math.round((currentTask / totalTasks) * 100)}%
                </span>
              </div>
              <div
                className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}
              >
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTask / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right - Editor */}
        <div
          className={`w-1/2 flex flex-col ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-b px-4 py-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-code-line w-5 h-5 text-blue-600"></i>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Code Editor
                </span>
                <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700">
                  {language.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isRunning
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isRunning ? "Running..." : "Run Code"}
                </button>

                <button
                  onClick={testCurrentTask}
                  disabled={isTesting || !currentTaskData.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isTesting || !currentTaskData.id
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isTesting ? "Testing..." : "Test Code"}
                </button>

                {currentTask === totalTasks && (
                  <button
                    onClick={submitHomework}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit All"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <CodeMirror
              value={code}
              height="36rem"
              // Minimal extensions: only the language extension
              extensions={[language === "python" ? python() : javascript()]}
              // Let CodeMirror do default setup
              basicSetup={true}
              onChange={(value) => setCode(value)}
              onCreateEditor={(editor) => onCreateEditor(editor)}
              className="rounded-lg border"
            />

            <div className="mt-2 text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 rounded bg-gray-100">Ctrl</kbd>/
              <kbd className="px-1 py-0.5 rounded bg-gray-100">⌘</kbd> +{" "}
              <kbd className="px-1 py-0.5 rounded bg-gray-100">Enter</kbd> to
              run
            </div>
          </div>

          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-t`}
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <i className="ri-terminal-line w-4 h-4 text-gray-500"></i>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Console Output
                </span>
              </div>
            </div>

            <div className="p-4 h-32 overflow-y-auto">
              {output ? (
                <div
                  className={`text-sm font-mono whitespace-pre-wrap ${
                    output.includes("Error")
                      ? "text-red-600"
                      : output.includes("✅")
                      ? "text-green-600"
                      : output.includes("❌")
                      ? "text-red-600"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {output}
                </div>
              ) : (
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Click "Run Code" to execute or "Test Code" to run tests...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
