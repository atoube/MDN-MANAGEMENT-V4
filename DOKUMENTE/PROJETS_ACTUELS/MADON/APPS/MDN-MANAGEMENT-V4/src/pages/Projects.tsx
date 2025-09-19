import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectManagement from '@/components/projects/ProjectManagement';

export function Projects() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <ProjectManagement onProjectClick={(projectId) => navigate(`/projects/${projectId}`)} />
    </div>
  );
}