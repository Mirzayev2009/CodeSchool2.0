


export default function HomeworkChart() {
  const completionRate = 82;
  const totalAssignments = 28;
  const completedAssignments = 23;
  const pendingAssignments = 5;

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Homework Rate</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
          <p className="text-xs text-gray-500">Completion Rate</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{completedAssignments}</p>
              <p className="text-xs text-gray-600">of {totalAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{completedAssignments}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{pendingAssignments}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Average Score</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">87%</span>
        </div>
      </div>
    </div>
  );
}
