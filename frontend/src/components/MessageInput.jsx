import { Image, Send, X } from 'lucide-react'
import React from 'react'
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';

const MessageInput = () => {


  const [text, setText] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState('');
  const fileInputRef = React.useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !imagePreview) return;

    try {
      await sendMessage({
        text: text?.trim(),
        image: imagePreview,
      });

      setText('');
      if (fileInputRef?.current) fileInputRef.current.value = '';
      setImagePreview('');
    }
    catch (error) {
      console.error("failed to send message" + error.message);
      toast.error(error.message);
    }
  };

  return (
    // todo: implement the message input component put in bottom of the chat container or preview of selected image
    <div className='p-4 border-t border-base-300 w-full'>
      {imagePreview && (
        <div className='relative w-20 h-20'>
          <img src={imagePreview} alt="preview" className='w-full h-full object-cover rounded-lg' />
          <button onClick={removeImage} className='absolute top-0 right-0 p-1 bg-base-300 text-base-content rounded-full'>
            <X className=' size-3' />
          </button>
        </div>
      )}
      <form className='flex items-center gap-2' onSubmit={handleSendMessage}>
        <div className='flex-1 flex  gap-2'>
          <input
            type="text"
            placeholder='Type a message...'
            className='w-full p-2 border border-base-300 rounded-lg sm:input-md'
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <input type="file" className='hidden' accept='image/*' id='image' ref={fileInputRef} onChange={handleImageChange} />
          <button className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-500"}`} onClick={() => imagePreview ? null : fileInputRef.current?.click()}>
            <Image />
          </button>
          <button className='btn btn-circle hover:btn-circle-hover' type='submit'>
            <Send />
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageInput
