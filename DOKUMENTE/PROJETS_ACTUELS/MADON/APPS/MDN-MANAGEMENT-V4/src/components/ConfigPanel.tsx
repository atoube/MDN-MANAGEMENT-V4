import React from 'react';
import { Button } from './ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/Sheet';
import { Settings } from 'lucide-react';

const ConfigPanel: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Configuration</SheetTitle>
            <SheetDescription>
              Personnalisez les paramètres de votre application
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            {/* Contenu de configuration */}
            <div className="space-y-2">
              <h3 className="font-medium">Thème</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre thème préféré
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configurez vos préférences de notification
              </p>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setOpen(false)}>
              Enregistrer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ConfigPanel; 