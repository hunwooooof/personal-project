interface PropsType {
  newMessage: string;
  setNewMessage: (newMessage: string) => void;
  handleSendMessage: () => void;
}

function MessageInput({ newMessage, setNewMessage, handleSendMessage }: PropsType) {
  const handleEnterDown = (e: {
    key: string;
    nativeEvent: { isComposing: boolean };
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const pressedKey = e.key.toUpperCase();
    if (pressedKey === 'ENTER') {
      e.preventDefault();
      if (e.nativeEvent.isComposing) {
        e.stopPropagation();
      }
      if (!e.nativeEvent.isComposing && newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <>
      <input
        type='text'
        value={newMessage}
        placeholder='Message...'
        className='w-full pl-5 pr-14 py-1 bg-slate-800 border border-gray-700 rounded-full mt-1'
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleEnterDown}
      />
      {newMessage.trim() && (
        <button className='absolute bottom-5 right-8 text-blue-500 hover:text-white' onClick={handleSendMessage}>
          Send
        </button>
      )}
    </>
  );
}

export default MessageInput;
