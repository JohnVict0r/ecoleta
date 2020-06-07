import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface DropZone {
  message: string;
  OnFileUploaded: (file: File) => void;
}

const DropZone: React.FC<DropZone> = ({ message, OnFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!!file) {
        const fileUrl = URL.createObjectURL(file);
        setSelectedFileUrl(fileUrl);
        OnFileUploaded(file);
      }
    },
    [OnFileUploaded]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point thumbnail" />
      ) : isDragActive ? (
        <p>Solte o arquivo aqui ...</p>
      ) : (
        <p>
          <FiUpload />
          {message}
        </p>
      )}
    </div>
  );
};

export default DropZone;
