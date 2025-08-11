

export default function AttendanceChart() {
  const attendanceData = [
    { month: 'Sep', attendance: 95 },
    { month: 'Oct', attendance: 88 },
    { month: 'Nov', attendance: 92 },
    { month: 'Dec', attendance: 85 },
    { month: 'Jan', attendance: 90 }
  ];

  const currentAttendance = 92;
  const maxHeight = 120;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Rate</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{currentAttendance}%</p>
          <p className="text-xs text-gray-500">Current Rate</p>
        </div>
      </div>

      <div className="flex items-end justify-between space-x-4 h-32 mb-4">
        {attendanceData.map((data, index) => {
          const height = (data.attendance / 100) * maxHeight;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${height}px` }}
                title={`${data.attendance}% attendance`}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{data.month}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-green-600">42</p>
          <p className="text-xs text-gray-600">Present</p>
        </div>
        <div>
          <p className="text-lg font-bold text-yellow-600">3</p>
          <p className="text-xs text-gray-600">Late</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-600">2</p>
          <p className="text-xs text-gray-600">Absent</p>
        </div>
      </div>
    </div>
  );
}
