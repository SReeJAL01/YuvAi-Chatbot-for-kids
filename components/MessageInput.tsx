import React, { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string, image: string | null) => void;
  disabled: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || (!text.trim() && !image)) return;
    onSendMessage(text.trim(), image);
    setText('');
    setImage(null);
     if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64Image = await fileToBase64(file);
      setImage(base64Image);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {image && (
        <div className="relative inline-block bg-pink-100 p-2 rounded-lg">
          <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
          <button
            type="button"
            onClick={handleImageRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
            aria-label="Remove image"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 p-1 bg-[--card-bg-color] rounded-full shadow-lg border border-[--border-color] focus-within:ring-2 focus-within:ring-[--accent-color-ring] transition">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="file-upload"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-1.5 text-[--accent-color] hover:bg-[--accent-color-disabled] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[--accent-color-ring]"
          aria-label="Attach image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something nice..."
          className="flex-1 bg-transparent focus:outline-none text-[--text-color] placeholder:text-[--text-color-light] text-sm"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || (!text.trim() && !image)}
          className="flex-shrink-0 p-2 bg-[--accent-color] text-white rounded-full hover:bg-[--accent-color-hover] transition-colors disabled:bg-[--accent-color-disabled] disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[--accent-color-ring] focus:ring-offset-2 focus:ring-offset-[--card-bg-color]"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
};