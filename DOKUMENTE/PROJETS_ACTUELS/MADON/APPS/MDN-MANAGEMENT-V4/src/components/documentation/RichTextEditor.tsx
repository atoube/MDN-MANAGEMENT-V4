import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Table,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser le contenu externe avec l'éditeur
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Fonction pour insérer du HTML à la position du curseur
  const insertHTMLAtCursor = (html: string) => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // Vérifier que la sélection est valide
        if (range && range.commonAncestorContainer && range.commonAncestorContainer.parentNode) {
          const fragment = range.createContextualFragment(html);
          range.deleteContents();
          range.insertNode(fragment);
          
          // Placer le curseur après l'insertion de manière sécurisée
          try {
            if (fragment.lastChild && fragment.lastChild.parentNode) {
              range.setStartAfter(fragment.lastChild);
              range.setEndAfter(fragment.lastChild);
            } else {
              range.collapse(false); // Collapse à la fin
            }
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            console.warn('Erreur lors du positionnement du curseur:', e);
            // Fallback : placer le curseur à la fin
            if (editorRef.current) {
              const newRange = document.createRange();
              newRange.selectNodeContents(editorRef.current);
              newRange.collapse(false);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        } else {
          // Fallback : insérer à la fin
          if (editorRef.current) {
            editorRef.current.innerHTML += html;
          }
        }
      } else {
        // Si pas de sélection, insérer à la fin
        if (editorRef.current) {
          editorRef.current.innerHTML += html;
        }
      }
      
      // Mettre à jour le contenu
      updateContent();
    } catch (error) {
      console.error('Erreur lors de l\'insertion HTML:', error);
      // Fallback : insérer à la fin
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        updateContent();
      }
    }
  };

  // Fonction pour mettre à jour le contenu
  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      // Toujours mettre à jour pour s'assurer que les images sont sauvegardées
      console.log('RichTextEditor - Contenu mis à jour:', content.substring(0, 200) + '...');
      onChange(content);
    }
  };

  // Gestion des commandes de formatage
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  // Gestion de la touche Entrée
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Utiliser execCommand qui est plus stable
      document.execCommand('insertLineBreak', false);
      // Mettre à jour le contenu
      updateContent();
    }
  };

  // Gestion de l'insertion d'image
  const handleImageInsert = () => {
    if (imageFile) {
      // Gestion de l'image locale
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgHTML = `<img src="${e.target?.result}" alt="${imageAlt || 'Image locale'}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
        insertHTMLAtCursor(imgHTML);
        // Fermer automatiquement le dialog et réinitialiser
        setShowImageDialog(false);
        resetImageDialog();
        // Forcer la mise à jour du contenu
        setTimeout(() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 100);
      };
      reader.readAsDataURL(imageFile);
    } else if (imageUrl.trim()) {
      // Gestion de l'URL externe
      const imgHTML = `<img src="${imageUrl}" alt="${imageAlt || 'Image'}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
      insertHTMLAtCursor(imgHTML);
      // Fermer automatiquement le dialog et réinitialiser
      setShowImageDialog(false);
      resetImageDialog();
      // Forcer la mise à jour du contenu
      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 100);
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl(''); // Réinitialiser l'URL si un fichier est sélectionné
    }
  };

  // Gestion de l'insertion de tableau
  const handleTableInsert = () => {
    if (tableRows > 0 && tableCols > 0) {
      try {
        // Créer le HTML du tableau
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
        
        // En-têtes
        tableHTML += '<thead><tr>';
        for (let i = 0; i < tableCols; i++) {
          tableHTML += `<th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">En-tête ${i + 1}</th>`;
        }
        tableHTML += '</tr></thead>';
        
        // Corps du tableau
        tableHTML += '<tbody>';
        for (let i = 0; i < tableRows; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < tableCols; j++) {
            tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">Cellule ${i + 1}-${j + 1}</td>`;
          }
          tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table>';
        
        console.log('Insertion du tableau:', tableHTML);
        
        // Insérer le tableau directement à la fin de l'éditeur
        if (editorRef.current) {
          // Ajouter un saut de ligne avant le tableau si nécessaire
          if (editorRef.current.innerHTML && !editorRef.current.innerHTML.endsWith('<br>')) {
            editorRef.current.innerHTML += '<br>';
          }
          
          // Insérer le tableau
          editorRef.current.innerHTML += tableHTML;
          
          // Mettre à jour le contenu
          updateContent();
          
          // Placer le curseur après le tableau
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          // Focus sur l'éditeur
          editorRef.current.focus();
        }
        
        // Fermer le dialog et réinitialiser
        setShowTableDialog(false);
        setTableRows(3);
        setTableCols(3);
        
        console.log('Tableau inséré avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'insertion du tableau:', error);
        // Fallback : insérer un tableau simple
        if (editorRef.current) {
          editorRef.current.innerHTML += '<table border="1"><tr><td>Tableau</td></tr></table>';
          updateContent();
        }
        setShowTableDialog(false);
      }
    }
  };

  // Gestion de l'insertion de lien
  const handleLinkInsert = () => {
    if (linkUrl.trim() && linkText.trim()) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      insertHTMLAtCursor(linkHTML);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  // Gestion des titres
  const handleHeading = (level: number) => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const heading = document.createElement(`h${level}`);
        heading.textContent = selection.toString() || `Titre ${level}`;
        
        if (selection.toString()) {
          range.deleteContents();
          range.insertNode(heading);
        } else {
          range.insertNode(heading);
          // Placer le curseur dans le titre de manière sécurisée
          try {
            const newRange = document.createRange();
            newRange.setStart(heading, 0);
            newRange.setEnd(heading, 0);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } catch (e) {
            console.warn('Erreur lors du positionnement du curseur dans le titre:', e);
            // Fallback : focus sur l'éditeur
            editorRef.current?.focus();
          }
        }
        updateContent();
      }
    } catch (error) {
      console.error('Erreur lors de la création du titre:', error);
      // Fallback : insérer le titre à la fin
      if (editorRef.current) {
        const heading = document.createElement(`h${level}`);
        heading.textContent = `Titre ${level}`;
        editorRef.current.appendChild(heading);
        updateContent();
      }
    }
  };

  // Réinitialisation du dialog d'image
  const resetImageDialog = () => {
    setImageFile(null);
    setImageUrl('');
    setImageAlt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border rounded-md">
      {/* Barre d'outils */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Formatage de texte */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          title="Gras"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          title="Italique"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          title="Souligné"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Titres */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(1)}
          title="Titre 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(2)}
          title="Titre 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(3)}
          title="Titre 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignement */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          title="Aligner à gauche"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          title="Centrer"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          title="Aligner à droite"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Listes */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insertions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageDialog(true)}
          title="Insérer une image"
        >
          <Image className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTableDialog(true)}
          title="Insérer un tableau"
        >
          <Table className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkDialog(true)}
          title="Insérer un lien"
        >
          <Link className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Autres */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          title="Citation"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<pre>')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        className="p-4 min-h-[300px] focus:outline-none prose max-w-none relative"
        contentEditable
        onInput={updateContent}
        onBlur={updateContent}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        style={{
          minHeight: '300px'
        }}
      />
      {placeholder && !value && (
        <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}

      {/* Dialog d'insertion d'image */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insérer une image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Upload d'image locale */}
            <div>
              <Label>Image locale</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="flex-1"
                />
                {imageFile && (
                  <span className="text-sm text-green-600">
                    ✓ {imageFile.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Formats acceptés : JPG, PNG, GIF, WebP
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">ou</span>
              </div>
            </div>

            {/* URL d'image externe */}
            <div>
              <Label>URL de l'image</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                disabled={!!imageFile}
              />
              <p className="text-xs text-gray-500">
                Entrez l'URL d'une image sur le web
              </p>
            </div>

            <div>
              <Label>Texte alternatif</Label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description de l'image"
              />
              <p className="text-xs text-gray-500">
                Important pour l'accessibilité
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowImageDialog(false);
                resetImageDialog();
              }}>
                Annuler
              </Button>
              <Button 
                onClick={handleImageInsert}
                disabled={!imageFile && !imageUrl.trim()}
              >
                Insérer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'insertion de tableau */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insérer un tableau</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de lignes</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Nombre de colonnes</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTableDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleTableInsert}>
                Insérer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'insertion de lien */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insérer un lien</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL du lien</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemple.com"
              />
            </div>
            <div>
              <Label>Texte du lien</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Texte à afficher"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleLinkInsert}>
                Insérer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
