import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Badge } from '../ui/Badge';
import { X, Save, Edit3, FileText, Maximize2, Minimize2, Trash2, FileDown, Printer } from 'lucide-react';
import { Document } from '../../types/documentation';
import { RichTextEditor } from './RichTextEditor';

interface DocumentEditorProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
  onSave: (document: Document) => void;
  onDelete?: (documentId: string) => void;
}

export function DocumentEditor({ 
  document, 
  open, 
  onClose, 
  onSave, 
  onDelete
}: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isA4Mode, setIsA4Mode] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({});

  React.useEffect(() => {
    if (document) {
      setFormData(document);
    }
  }, [document]);

  const handleSave = () => {
    if (document && formData) {
      const updatedDocument = {
        ...document,
        ...formData,
        updated_at: new Date().toISOString(),
        last_edited_by: document.author_name, // Pour l'exemple, utilise l'auteur
        last_edited_at: new Date().toISOString()
      };
      onSave(updatedDocument);
      setIsEditing(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(document || {});
  };

  const handleDelete = () => {
    if (document && onDelete) {
      onDelete(document.id);
      onClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsA4Mode(false); // Désactiver le mode A4 si on passe en plein écran
  };

  const toggleA4Mode = () => {
    setIsA4Mode(!isA4Mode);
    setIsFullscreen(false); // Désactiver le plein écran si on passe en mode A4
  };

  const exportToPDF = async () => {
    if (!document) return;
    
    try {
      // Import dynamique pour éviter les problèmes de SSR
      const jsPDF = (await import('jspdf')).default;
      
      const doc = new jsPDF();
      let yPosition = 20;
      const margin = 20;
      const pageWidth = 210 - (2 * margin);
      
      // Titre du document
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text(document.title, margin, yPosition);
      yPosition += 15;
      
      // Informations du document
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Auteur: ${document.author_name}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Date: ${new Date(document.updated_at).toLocaleDateString('fr-FR')}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Statut: ${document.status}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Priorité: ${document.priority}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Catégorie: ${document.category}`, margin, yPosition);
      yPosition += 15;
      
      // Séparateur
      doc.line(margin, yPosition, 210 - margin, yPosition);
      yPosition += 10;
      
      // Fonction pour ajouter une nouvelle page si nécessaire
      const addPageIfNeeded = (requiredHeight: number) => {
        if (yPosition + requiredHeight > 280) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };
      
      // Fonction pour traiter le contenu HTML
      const processHTMLContent = (htmlContent: string) => {
        // Créer un élément temporaire pour parser le HTML
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Traiter chaque nœud
        const processNode = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            // Texte simple
            const text = node.textContent?.trim();
            if (text) {
              const lines = doc.splitTextToSize(text, pageWidth);
              addPageIfNeeded(lines.length * 5);
              doc.setFontSize(10);
              doc.text(lines, margin, yPosition);
              yPosition += lines.length * 5;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const tagName = element.tagName.toLowerCase();
            
            switch (tagName) {
                             case 'h1': {
                 addPageIfNeeded(15);
                 doc.setFontSize(16);
                 doc.setFont(undefined, 'bold');
                 doc.text(element.textContent?.trim() || '', margin, yPosition);
                 yPosition += 15;
                 doc.setFont(undefined, 'normal');
                 break;
               }
                 
               case 'h2': {
                 addPageIfNeeded(12);
                 doc.setFontSize(14);
                 doc.setFont(undefined, 'bold');
                 doc.text(element.textContent?.trim() || '', margin, yPosition);
                 yPosition += 12;
                 doc.setFont(undefined, 'normal');
                 break;
               }
                 
               case 'h3': {
                 addPageIfNeeded(10);
                 doc.setFontSize(12);
                 doc.setFont(undefined, 'bold');
                 doc.text(element.textContent?.trim() || '', margin, yPosition);
                 yPosition += 10;
                 doc.setFont(undefined, 'normal');
                 break;
               }
                 
               case 'p': {
                 const paragraphText = element.textContent?.trim();
                 if (paragraphText) {
                   const lines = doc.splitTextToSize(paragraphText, pageWidth);
                   addPageIfNeeded(lines.length * 5);
                   doc.setFontSize(10);
                   doc.text(lines, margin, yPosition);
                   yPosition += lines.length * 5;
                 }
                 yPosition += 3; // Espacement
                 break;
               }
                 
               case 'br':
                 yPosition += 5;
                 break;
                 
               case 'img': {
                 const imgSrc = element.getAttribute('src');
                 const imgAlt = element.getAttribute('alt') || 'Image';
                 
                 if (imgSrc && imgSrc.startsWith('data:image')) {
                   try {
                     // Gérer les images en base64
                     addPageIfNeeded(40);
                     doc.addImage(imgSrc, 'JPEG', margin, yPosition, 40, 30);
                     doc.setFontSize(8);
                     doc.text(imgAlt, margin, yPosition + 35);
                     yPosition += 45;
                   } catch (error) {
                     // Fallback si l'image ne peut pas être chargée
                     doc.setFontSize(8);
                     doc.text(`[Image: ${imgAlt}]`, margin, yPosition);
                     yPosition += 10;
                   }
                 } else {
                   // Image externe ou non supportée
                   doc.setFontSize(8);
                   doc.text(`[Image: ${imgAlt}]`, margin, yPosition);
                   yPosition += 10;
                 }
                 break;
               }
                 
               case 'table': {
                 addPageIfNeeded(50);
                 doc.setFontSize(8);
                 doc.text('[Tableau]', margin, yPosition);
                 yPosition += 10;
                 
                 // Traiter les lignes du tableau
                 const rows = element.querySelectorAll('tr');
                 rows.forEach((row) => {
                   const cells = row.querySelectorAll('td, th');
                   let xPos = margin;
                   
                   cells.forEach((cell) => {
                     const cellText = cell.textContent?.trim() || '';
                     const cellWidth = pageWidth / cells.length;
                     
                     // Dessiner la bordure de la cellule
                     doc.rect(xPos, yPosition, cellWidth, 8);
                     
                     // Ajouter le texte de la cellule
                     const cellLines = doc.splitTextToSize(cellText, cellWidth - 2);
                     doc.text(cellLines, xPos + 1, yPosition + 6);
                     
                     xPos += cellWidth;
                   });
                   
                   yPosition += 10;
                 });
                 yPosition += 5;
                 break;
               }
                 
               case 'ul':
               case 'ol': {
                 const listItems = element.querySelectorAll('li');
                 listItems.forEach((item) => {
                   const itemText = item.textContent?.trim() || '';
                   if (itemText) {
                     const lines = doc.splitTextToSize(`• ${itemText}`, pageWidth - 10);
                     addPageIfNeeded(lines.length * 5);
                     doc.setFontSize(10);
                     doc.text(lines, margin + 10, yPosition);
                     yPosition += lines.length * 5;
                   }
                 });
                 yPosition += 3;
                 break;
               }
                 
               case 'blockquote': {
                 addPageIfNeeded(15);
                 doc.setFontSize(10);
                 doc.setFont(undefined, 'italic');
                 doc.text(`"${element.textContent?.trim() || ''}"`, margin + 10, yPosition);
                 yPosition += 15;
                 doc.setFont(undefined, 'normal');
                 break;
               }
                 
               case 'pre': {
                 addPageIfNeeded(15);
                 doc.setFontSize(9);
                 doc.setFont(undefined, 'monospace');
                 doc.text(element.textContent?.trim() || '', margin, yPosition);
                 yPosition += 15;
                 doc.setFont(undefined, 'normal');
                 break;
               }
                
              default:
                // Traiter récursivement les enfants
                Array.from(element.childNodes).forEach(processNode);
                break;
            }
          }
        };
        
        // Traiter tous les nœuds enfants
        Array.from(tempDiv.childNodes).forEach(processNode);
      };
      
      // Traiter le contenu HTML
      processHTMLContent(document.content);
      
      // Sauvegarder le PDF
      doc.save(`${document.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      
      // Notification de succès
      console.log('Document exporté en PDF avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  };

  if (!document) return null;

  const dialogClasses = isFullscreen 
    ? "max-w-none max-h-none w-screen h-screen m-0 rounded-none" 
    : isA4Mode
    ? "max-w-[210mm] max-h-[297mm] w-[210mm] h-[297mm] m-4 mx-auto overflow-y-auto bg-white shadow-lg"
    : "max-w-4xl max-h-[90vh] overflow-y-auto";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={dialogClasses}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isEditing ? 'Modifier le document' : document.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 mr-2" />
                    ) : (
                      <Maximize2 className="w-4 h-4 mr-2" />
                    )}
                    {isFullscreen ? 'Réduire' : 'Plein écran'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleA4Mode}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    {isA4Mode ? 'Format Normal' : 'Format A4'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPDF}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Maximize2 className="w-4 h-4 mr-2" />
                  )}
                  {isFullscreen ? 'Réduire' : 'Plein écran'}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du document */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Statut</Label>
              <div className="mt-1">
                <Badge variant={document.status === 'published' ? 'default' : 'secondary'}>
                  {document.status === 'published' ? 'Publié' : 
                   document.status === 'draft' ? 'Brouillon' : 'Archivé'}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Priorité</Label>
              <div className="mt-1">
                <Badge variant="outline">
                  {document.priority === 'urgent' ? 'Urgente' :
                   document.priority === 'high' ? 'Haute' :
                   document.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Catégorie</Label>
              <div className="mt-1 text-sm text-gray-600">
                {document.category}
              </div>
            </div>

            <div>
              <Label>Version</Label>
              <div className="mt-1 text-sm text-gray-600">
                v{document.version}
              </div>
            </div>

            <div>
              <Label>Auteur</Label>
              <div className="mt-1 text-sm text-gray-600">
                {document.author_name}
              </div>
            </div>

            <div>
              <Label>Vues</Label>
              <div className="mt-1 text-sm text-gray-600">
                {document.views_count} vue(s)
              </div>
            </div>
          </div>

          {/* Informations de dernière édition */}
          <div className="border-t pt-4">
            <Label>Dernière édition</Label>
            <div className="mt-1 text-sm text-gray-600">
              {document.last_edited_by && document.last_edited_at ? (
                <>
                  Modifié par <strong>{document.last_edited_by}</strong> le{' '}
                  {new Date(document.last_edited_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </>
              ) : (
                <>
                  Modifié par <strong>{document.author_name}</strong> le{' '}
                  {new Date(document.updated_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div>
            <Label>Contenu</Label>
            {isEditing ? (
              <div className="mt-2">
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Contenu du document..."
                />
              </div>
            ) : (
              <div 
                className="mt-2 p-4 border rounded-md bg-gray-50 min-h-[300px] prose max-w-none overflow-auto"
                dangerouslySetInnerHTML={{ __html: document.content }}
              />
            )}
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white z-10">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
