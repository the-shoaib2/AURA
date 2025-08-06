'use client';

import { useState, useEffect } from 'react';

interface EditorEmbedProps {
  className?: string;
}

export default function EditorEmbed({ className = '' }: EditorEmbedProps) {
  const [editorUrl, setEditorUrl] = useState<string>('http://localhost:3000');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if editor is available
    const checkEditor = async () => {
      try {
        const response = await fetch(`${editorUrl}/health`, { 
          method: 'GET',
          mode: 'no-cors' // Since it's a different origin
        });
        setIsEditorReady(true);
        setError(null);
      } catch (err) {
        setError('Editor not available');
        setIsEditorReady(false);
      }
    };

    checkEditor();
  }, [editorUrl]);

  return (
    <div className={`w-full h-full ${className}`}>
      {error ? (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Editor not available</div>
            <div className="text-sm text-gray-600 mb-4">
              Make sure the editor-ui is running on port 3000
            </div>
            <button 
              onClick={() => window.open(editorUrl, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Editor in New Tab
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={editorUrl}
          className="w-full h-full border-0 rounded-lg"
          title="AURA Workflow Editor"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      )}
    </div>
  );
} 