import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '../ui/Card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '../ui/Table';
import { useDepartments } from '@/hooks/useDepartments';

export function DepartmentList() {
  const { data: departments, isLoading, error } = useDepartments();

  if (isLoading) {
    return <div>Chargement des départements...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des départements</div>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Dernière mise à jour</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>
                {format(new Date(department.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                {format(new Date(department.updatedAt), 'dd MMMM yyyy', { locale: fr })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 