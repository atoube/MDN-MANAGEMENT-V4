import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './Button';
import { Upload, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxSize?: number;
  accept?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  accept = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange([...files, ...acceptedFiles]);
  }, [files, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? (
            'Déposez les fichiers ici...'
          ) : (
            <>
              Glissez-déposez des fichiers ici, ou{' '}
              <span className="text-primary font-medium">cliquez pour sélectionner</span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Taille maximale : {formatFileSize(maxSize)}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 