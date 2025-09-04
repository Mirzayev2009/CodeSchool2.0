
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import StudentHeader from '../../../../../../components/StudentHeader';
import HomeworkDetailClient from './HomeworkDetailClient';
import { getHomework } from '../../../../../homeworkApi';
import { useEffect, useState } from 'react';

export default function HomeworkDetailPage() {
  const { id, homeworkId } = useParams(); // ✅ Get from URL
  // Mock homework data
 const token = localStorage.getItem('token')
 const [homework, setHomework] = useState(null)
 const [loading, setLoading] = useState(true)


 useEffect(()=>{
  async function fetchData() {
    try {
      const res = await getHomework(homeworkId, token)
      setHomework(res)
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
    finally{
      setLoading(false)
    }
  }
  fetchData()
 }, [homeworkId, token])

if (loading) return <div className="p-6 text-center">Loading...</div>;
if (!homework) return <div className="p-6 text-center">Homework not found.</div>;



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
