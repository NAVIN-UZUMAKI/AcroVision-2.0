import { useState, useRef, useEffect } from 'react';
import { useFarm } from '../../hooks/useFarm';
import { aiService } from '../../services/aiService';
import { Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Should I water North Block tomorrow?',
  'Is today a good day to spray pesticides?',
  'What is the crop health status of my fields?',
  'Check soil nitrogen and pH balance',
];

export default function ChatAssistant() {
  const { activeFarm, fields } = useFarm();
  const [messages, setMessages] = useState(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${activeFarm?.farmerName || 'Farmer'}! I am AcroVision, your digital farming assistant.`,
      why: `I am currently monitoring ${activeFarm?.name || 'your farm'} (${fields.length} active plots).`,
      action: 'Ask me anything about irrigation scheduling, spray timing, disease scans, or field conditions.',
      confidence: 100,
      isInsufficientData: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const msgCountRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isThinking) return;

    msgCountRef.current += 1;
    const userMsg = {
      id: `usr-${msgCountRef.current}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await aiService.askAcroVision(text, { activeFarm, fields });
      setMessages((prev) => [...prev, response]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className="acro-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '620px',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Assistant Header */}
      <div
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          backgroundColor: 'var(--forest-900)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--forest-700)',
              color: 'var(--forest-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
              AcroVision Farm Intelligence Assistant
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--forest-200)' }}>
              Deterministic Rule & Context Engine • Zero hallucination
            </p>
          </div>
        </div>

        <span
          className="badge"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <Sparkles size={12} aria-hidden="true" />
          <span>Active Context</span>
        </span>
      </div>

      {/* Messages Thread */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          backgroundColor: 'var(--bg-base)',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-100)',
                    color: 'var(--forest-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={16} />
                </div>
              )}

              <div
                style={{
                  backgroundColor: isUser ? 'var(--forest-800)' : 'var(--surface-elevated)',
                  color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                {/* Main Text */}
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, fontWeight: isUser ? 500 : 600 }}>
                  {msg.text}
                </p>

                {/* Structured Why & Action breakdown if present */}
                {msg.why && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 10px',
                      backgroundColor: isUser ? 'rgba(0,0,0,0.1)' : 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      color: isUser ? '#E2E8F0' : 'var(--text-secondary)',
                    }}
                  >
                    💡 {msg.why}
                  </div>
                )}

                {msg.action && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '8px 10px',
                      backgroundColor: 'var(--forest-50)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      color: 'var(--forest-900)',
                      fontWeight: 600,
                    }}
                  >
                    👉 {msg.action}
                  </div>
                )}

                {/* Metadata & Confidence */}
                {!isUser && (
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.725rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {msg.confidence !== null ? (
                      <span style={{ color: 'var(--forest-700)', fontWeight: 700 }}>
                        ✓ {msg.confidence}% confidence
                      </span>
                    ) : (
                      <span style={{ color: 'var(--status-watch-text)', fontWeight: 600 }}>
                        ⚠️ Insufficient data
                      </span>
                    )}

                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              {isUser && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-900)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <RefreshCw size={15} className="spin" />
            <span>Analyzing field telemetry and agricultural rules...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div
        style={{
          padding: '8px var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSendMessage(prompt)}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--surface-elevated)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Ask AcroVision a question about your farm (e.g. When to water?)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isThinking}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isThinking || !inputValue.trim()}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
