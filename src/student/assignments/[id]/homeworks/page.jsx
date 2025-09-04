import { useParams } from 'react-router-dom';
import StudentHeader from '../../../../../components/StudentHeader';
import HomeworkListClient from './HomeworkListClient';
import { getHomework, getHomeworkTasks } from '../../../../homeworkApi';
import { useEffect } from 'react';

export default function AssignmentHomeworksPage() {
  const { id } = useParams();
  const token = localStorage.getItem('token')

    const [assignment, setAssignment] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    async function fetchData() {
      try {
        const assignmentData = await getHomework(id, token);
        const tasksData = await getHomeworkTasks(id, token);
        
        setAssignment(assignmentData)
        setHomeworks(Array.isArray(tasksData) ? tasksData : tasksData.results || [])
      } catch (error) {
         console.error('Error fetching assignment or tasks:', error);
      } finally{
        setLoading(false)
      }
    }
    fetchData()
  }, [id, token])

    if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!assignment) return <div className="p-6 text-center">Assignment not found.</div>;



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
