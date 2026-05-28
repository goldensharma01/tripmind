import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropzone = ({ onFileDrop, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0 && onFileDrop) {
        onFileDrop(acceptedFiles[0]);
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full cursor-pointer rounded-2xl border-2 border-dashed text-center transition ${
        isDragReject
          ? 'border-red-300 bg-red-50'
          : isDragActive
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-emerald-500/40 bg-emerald-50/40 hover:border-emerald-500 hover:bg-emerald-50'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''} p-6 sm:p-10`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <svg
          className="h-7 w-7 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-900">
        {isDragActive ? 'Drop your file here' : 'Drag & drop a travel document'}
      </p>
      <p className="mt-1 text-xs text-slate-500">PDF, JPG, or PNG — max 10MB</p>
    </div>
  );
};

export default FileDropzone;
