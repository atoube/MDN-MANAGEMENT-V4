import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePerformanceEvaluations, PerformanceEvaluation } from '../../hooks/usePerformanceEvaluations';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Textarea } from '../ui/Textarea';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../hooks/useAuth';

interface FormData {
  employee_id: string;
  evaluator_id: string;
  evaluation_date: string;
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills: number;
  communication_skills: number;
  teamwork: number;
  leadership: number;
  comments: string;
  goals_for_next_period: string;
}

export function PerformanceEvaluations() {
  const { user } = useAuth();
  const { employees, isLoadingEmployees } = useEmployees();
  const { 
    evaluations, 
    isLoadingEvaluations, 
    createEvaluation, 
    updateEvaluation, 
    deleteEvaluation,
    isCreating,
    isUpdating,
    evaluationStats
  } = usePerformanceEvaluations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PerformanceEvaluation | null>(null);
  const [formData, setFormData] = useState<FormData>({
    employee_id: '',
    evaluator_id: user?.id || '',
    evaluation_date: format(new Date(), 'yyyy-MM-dd'),
    period_start: '',
    period_end: '',
    overall_rating: 3,
    technical_skills: 3,
    communication_skills: 3,
    teamwork: 3,
    leadership: 3,
    comments: '',
    goals_for_next_period: ''
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSliderChange = useCallback((name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEvaluation) {
      updateEvaluation({
        id: selectedEvaluation.id,
        ...formData
      });
    } else {
      createEvaluation(formData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  }, [selectedEvaluation, formData, updateEvaluation, createEvaluation]);

  const handleEdit = useCallback((evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation);
    setFormData({
      employee_id: evaluation.employee_id,
      evaluator_id: evaluation.evaluator_id,
      evaluation_date: evaluation.evaluation_date,
      period_start: evaluation.period_start,
      period_end: evaluation.period_end,
      overall_rating: evaluation.overall_rating,
      technical_skills: evaluation.technical_skills,
      communication_skills: evaluation.communication_skills,
      teamwork: evaluation.teamwork,
      leadership: evaluation.leadership || 3,
      comments: evaluation.comments || '',
      goals_for_next_period: evaluation.goals_for_next_period || ''
    });
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      deleteEvaluation(id);
    }
  }, [deleteEvaluation]);

  const resetForm = useCallback(() => {
    setSelectedEvaluation(null);
    setFormData({
      employee_id: '',
      evaluator_id: user?.id || '',
      evaluation_date: format(new Date(), 'yyyy-MM-dd'),
      period_start: '',
      period_end: '',
      overall_rating: 3,
      technical_skills: 3,
      communication_skills: 3,
      teamwork: 3,
      leadership: 3,
      comments: '',
      goals_for_next_period: ''
    });
  }, [user?.id]);

  const getRatingColor = useCallback((rating: number): string => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  }, []);

  const getRatingLabel = useCallback((rating: number): string => {
    switch (rating) {
      case 1: return 'Insuffisant';
      case 2: return 'À améliorer';
      case 3: return 'Satisfaisant';
      case 4: return 'Bon';
      case 5: return 'Excellent';
      default: return 'Non évalué';
    }
  }, []);

  if (isLoadingEvaluations || isLoadingEmployees) {
    return <div className="flex justify-center items-center h-64">Chargement des évaluations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Évaluations de performance</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Nouvelle évaluation</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEvaluation ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}</DialogTitle>
              <DialogDescription>
                {selectedEvaluation 
                  ? 'Modifiez les détails de l\'évaluation de performance.' 
                  : 'Créez une nouvelle évaluation de performance pour un employé.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">Employé</Label>
                    <Select 
                      value={formData.employee_id} 
                      onValueChange={(value) => handleSelectChange('employee_id', value)}
                      disabled={!!selectedEvaluation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un employé" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees?.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluation_date">Date d'évaluation</Label>
                    <Input
                      id="evaluation_date"
                      name="evaluation_date"
                      type="date"
                      value={formData.evaluation_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period_start">Début de la période</Label>
                    <Input
                      id="period_start"
                      name="period_start"
                      type="date"
                      value={formData.period_start}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period_end">Fin de la période</Label>
                    <Input
                      id="period_end"
                      name="period_end"
                      type="date"
                      value={formData.period_end}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Évaluation globale</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.overall_rating]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSliderChange('overall_rating', value)}
                      className="flex-1"
                    />
                    <span className={`font-bold ${getRatingColor(formData.overall_rating)}`}>
                      {formData.overall_rating} - {getRatingLabel(formData.overall_rating)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Compétences techniques</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.technical_skills]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSliderChange('technical_skills', value)}
                      className="flex-1"
                    />
                    <span className={`font-bold ${getRatingColor(formData.technical_skills)}`}>
                      {formData.technical_skills} - {getRatingLabel(formData.technical_skills)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Compétences en communication</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.communication_skills]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSliderChange('communication_skills', value)}
                      className="flex-1"
                    />
                    <span className={`font-bold ${getRatingColor(formData.communication_skills)}`}>
                      {formData.communication_skills} - {getRatingLabel(formData.communication_skills)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Travail d'équipe</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.teamwork]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSliderChange('teamwork', value)}
                      className="flex-1"
                    />
                    <span className={`font-bold ${getRatingColor(formData.teamwork)}`}>
                      {formData.teamwork} - {getRatingLabel(formData.teamwork)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Leadership</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[formData.leadership]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleSliderChange('leadership', value)}
                      className="flex-1"
                    />
                    <span className={`font-bold ${getRatingColor(formData.leadership)}`}>
                      {formData.leadership} - {getRatingLabel(formData.leadership)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comments">Commentaires</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals_for_next_period">Objectifs pour la prochaine période</Label>
                  <Textarea
                    id="goals_for_next_period"
                    name="goals_for_next_period"
                    value={formData.goals_for_next_period}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {selectedEvaluation ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les évaluations</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {evaluations && evaluations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <CardHeader>
                    <CardTitle>
                      {evaluation.employee?.first_name} {evaluation.employee?.last_name}
                    </CardTitle>
                    <CardDescription>
                      {evaluation.employee?.department} - {evaluation.employee?.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date d'évaluation:</span>
                        <span className="font-medium">
                          {format(new Date(evaluation.evaluation_date), 'dd MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Période:</span>
                        <span className="font-medium">
                          {format(new Date(evaluation.period_start), 'dd/MM/yyyy')} - {format(new Date(evaluation.period_end), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Évaluation globale:</span>
                        <span className={`font-bold ${getRatingColor(evaluation.overall_rating)}`}>
                          {evaluation.overall_rating} - {getRatingLabel(evaluation.overall_rating)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Compétences techniques:</span>
                        <span className={`font-bold ${getRatingColor(evaluation.technical_skills)}`}>
                          {evaluation.technical_skills} - {getRatingLabel(evaluation.technical_skills)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Communication:</span>
                        <span className={`font-bold ${getRatingColor(evaluation.communication_skills)}`}>
                          {evaluation.communication_skills} - {getRatingLabel(evaluation.communication_skills)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Travail d'équipe:</span>
                        <span className={`font-bold ${getRatingColor(evaluation.teamwork)}`}>
                          {evaluation.teamwork} - {getRatingLabel(evaluation.teamwork)}
                        </span>
                      </div>
                      {evaluation.leadership && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Leadership:</span>
                          <span className={`font-bold ${getRatingColor(evaluation.leadership)}`}>
                            {evaluation.leadership} - {getRatingLabel(evaluation.leadership)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(evaluation)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(evaluation.id)}>
                      Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune évaluation de performance trouvée.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des évaluations</CardTitle>
              <CardDescription>
                Vue d'ensemble des évaluations de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Évaluation globale</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.averageOverallRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      sur 5
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Compétences techniques</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.averageTechnicalSkills.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      sur 5
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Communication</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.averageCommunicationSkills.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      sur 5
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Travail d'équipe</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.averageTeamwork.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      sur 5
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Leadership</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.averageLeadership.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      sur 5
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Total des évaluations</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">
                      {evaluationStats.totalEvaluations}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      évaluations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 