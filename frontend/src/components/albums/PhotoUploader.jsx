import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadPhoto } from '../../api/albums';

export default function PhotoUploader({ albumId, pageNumber, position, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadPhoto(albumId, file, pageNumber, position);
      onUploaded(res.data);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`upload-${pageNumber}-${position}`}
      />
      <label
        htmlFor={`upload-${pageNumber}-${position}`}
        className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition ${
          uploading
            ? 'border-indigo-300 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        {uploading ? (
          <span className="text-sm text-indigo-500">Uploading...</span>
        ) : (
          <>
            <span className="text-2xl mb-1">+</span>
            <span className="text-xs text-gray-400">Upload Photo</span>
          </>
        )}
      </label>
    </div>
  );
}
