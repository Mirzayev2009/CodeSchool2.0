import React from 'react';
import TeacherGroupDetails from './TeacherGroupDetails';
import { useParams } from 'react-router-dom';

export default function TeacherGroupPage() {
  const { id } = useParams();

  return <TeacherGroupDetails groupId={id} />;
}
