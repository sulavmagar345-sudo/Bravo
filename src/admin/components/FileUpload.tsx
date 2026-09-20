import React, { useState, useRef } from 'react';

interface Props {
  accept: string;
  onSelect: (file: File) => void;
  hint?: string;
  maxSizeMB?: number;
}

const FileUpload: React.FC<Props> = ({ accept, onSelect, hint, maxSizeMB = 10 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMB}MB`);
      return;
    }

    onSelect(file);
  };

  return (
    <div>
      <div 
        className={`admin-upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef}
          accept={accept} 
          onChange={e => handleFile(e.target.files?.[0])} 
        />
        <div className="admin-upload-zone__icon">📄</div>
        <div className="admin-upload-zone__text">Click or drag file to upload</div>
        {hint && <div className="admin-upload-zone__hint">{hint}</div>}
      </div>
      {error && <div className="admin-login__error" style={{ marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default FileUpload;
