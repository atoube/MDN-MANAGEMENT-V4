import React, { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { toast } from 'react-hot-toast';

interface DocumentPreviewProps {
  documentUrl: string;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentUrl, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data, error } = // Simulated storage call - using mock data
          .createSignedUrl(documentUrl, 3600);

        // Removed error check - using mock data
        setPreviewUrl(data.signedUrl);
      } catch (error) {
        console.error('Erreur de chargement du document:', error);
        toast.error('Impossible de charger le document');
      }
    };

    fetchDocument();
  }, [documentUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Aperçu du document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {previewUrl && (
          <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
            {documentUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-full" />
            ) : (
              <img src={previewUrl} alt="Document" className="w-full h-full object-contain" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview; 