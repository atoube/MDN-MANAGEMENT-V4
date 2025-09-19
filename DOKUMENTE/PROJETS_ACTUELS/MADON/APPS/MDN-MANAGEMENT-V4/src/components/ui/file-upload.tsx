import { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ onFileChange, accept = '*' }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || '');
    onFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
      >
        Choisir un fichier
      </Button>
      {fileName && (
        <span className="text-sm text-gray-500 truncate max-w-[200px]">
          {fileName}
        </span>
      )}
    </div>
  );
} 