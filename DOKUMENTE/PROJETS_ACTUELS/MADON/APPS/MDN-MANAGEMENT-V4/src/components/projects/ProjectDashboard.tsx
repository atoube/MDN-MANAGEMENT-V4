import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Project } from './types';
import ProjectOverview from './sections/ProjectOverview';
import ProjectTasks from './sections/ProjectTasks';
import ProjectResources from './sections/ProjectResources';
import ProjectBudget from './sections/ProjectBudget';
import ProjectDocuments from './sections/ProjectDocuments';
import ProjectRisks from './sections/ProjectRisks';
import ProjectReports from './sections/ProjectReports';

interface ProjectDashboardProps {
  project: Project;
}

export default function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            project.status === 'completed' ? 'bg-green-100 text-green-800' :
            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            project.priority === 'high' ? 'bg-red-100 text-red-800' :
            project.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {project.priority}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-7 gap-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="risks">Risques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="tasks">
          <ProjectTasks project={project} />
        </TabsContent>

        <TabsContent value="resources">
          <ProjectResources project={project} />
        </TabsContent>

        <TabsContent value="budget">
          <ProjectBudget project={project} />
        </TabsContent>

        <TabsContent value="documents">
          <ProjectDocuments project={project} />
        </TabsContent>

        <TabsContent value="risks">
          <ProjectRisks project={project} />
        </TabsContent>

        <TabsContent value="reports">
          <ProjectReports project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 