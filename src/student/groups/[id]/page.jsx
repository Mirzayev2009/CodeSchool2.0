import { useParams } from 'react-router-dom';
import StudentGroupDetails from './StudentGroupDetails';

export default function StudentGroupPage() {
  const { groupId } = useParams();

  return <StudentGroupDetails groupId={groupId} />;
}
