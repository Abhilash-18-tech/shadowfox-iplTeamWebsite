import React from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { askWebsiteAgent } from '../../services/chatAgent';
import './ChatWidget.css';

const initialMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi, I am your RCB website assistant. Ask me about squad, schedule, standings, stats, or news.',
  citations: [],
};

function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState([initialMessage]);
  const [bottomOffset, setBottomOffset] = React.useState(18);
  const viewportRef = React.useRef(null);

  React.useEffect(() => {
    const updateOffset = () => {
      const footer = document.querySelector('.footer');
      const baseOffset = 18;

      if (!footer) {
        setBottomOffset(baseOffset);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - footerRect.top;
      const liftedOffset = overlap > 0 ? overlap + 16 : baseOffset;
      setBottomOffset(Math.max(baseOffset, liftedOffset));
    };

    updateOffset();
    window.addEventListener('scroll', updateOffset, { passive: true });
    window.addEventListener('resize', updateOffset);
    return () => {
      window.removeEventListener('scroll', updateOffset);
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmed,
      citations: [],
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askWebsiteAgent({
        message: trimmed,
        history: nextMessages.map((msg) => ({ role: msg.role, text: msg.text })),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: response.answer,
          citations: response.citations || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          text: 'I hit a temporary issue while answering. Please try again in a moment.',
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget" style={{ bottom: `${bottomOffset}px` }}>
      {isOpen && (
        <section className="chat-widget__panel glass-panel" aria-label="Website assistant panel">
          <header className="chat-widget__header">
            <div className="chat-widget__title-wrap">
              <Bot size={16} />
              <h3>PlayBold Assistant</h3>
            </div>
            <button
              type="button"
              className="chat-widget__icon-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={16} />
            </button>
          </header>

          <div className="chat-widget__messages" ref={viewportRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-widget__bubble chat-widget__bubble--${message.role}`}
              >
                <p>{message.text}</p>
                {message.citations?.length > 0 && (
                  <div className="chat-widget__citations">
                    {message.citations.slice(0, 3).map((source, index) => (
                      <a key={`${message.id}-${index}`} href={source.route}>
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="chat-widget__typing">Assistant is thinking...</div>}
          </div>

          <form className="chat-widget__form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about players, match, standings..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              aria-label="Ask website assistant"
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-widget__launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}

export default ChatWidget;
