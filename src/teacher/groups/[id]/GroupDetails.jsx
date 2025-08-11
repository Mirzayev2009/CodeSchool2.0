import { Link } from 'react-router-dom'
import TeacherSidebar from '../../../../components/TeacherSidebar';
import GroupInfo from './GroupInfo';
import LessonCalendar from './LessonCalendar';
import StudentsInfo from './StudentsInfo';


export default function GroupDetails({ groupId }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <TeacherSidebar />
        
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-6">
              <Link to="/teacher/groups" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Back to Groups
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <GroupInfo groupId={groupId} />
              </div>
              
              <div className="lg:col-span-2 space-y-8">
                <LessonCalendar groupId={groupId} />
                <StudentsInfo groupId={groupId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
