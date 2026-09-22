import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  FileText, 
  Scale, 
  ShieldAlert, 
  Bot, 
  User, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { LocationRecord, VerificationResult, AIPrediction, GovernmentRecord } from '../types';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationRecord;
  verification?: VerificationResult;
  prediction?: AIPrediction;
  governmentRecord?: GovernmentRecord;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  location,
  verification,
  prediction,
  governmentRecord
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; timestamp: string }>>([
    {
      sender: 'bot',
      text: `Hello, I am Drishti AI Legal & Geospatial Copilot. I have loaded cadastral context for **${location.locationName} (Survey No. ${location.surveyNumber})**.\n\nStatus: **${verification?.verificationStatus.toUpperCase() || 'MISMATCH'}** (${verification?.violationType.replace(/_/g, ' ') || 'Unauthorized Construction'}).\n\nHow can I assist you with statutory enforcement, legal notice drafting, or satellite evidence analysis?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: prompt,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          locationId: location.id,
          verificationId: verification?.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.response,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Unable to reach Gemini AI service. Fallback advisory: Issue formal 7-day show cause notice under Section 115 of Municipalities Act regarding unauthorized change of land use from agricultural to commercial.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Draft Statutory Show-Cause Notice under Section 115',
    'Calculate NALA Penalty and Compounding Fees',
    'Explain WALTA Act violation & Lake Buffer rules',
    'Summarize satellite optical evidence for Magistrate Court'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>Drishti AI Legal Copilot</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Survey {location.surveyNumber} • {location.district}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line text-xs">{msg.text}</div>
                <div className="text-[9px] text-slate-400 mt-1 text-right font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-indigo-400 text-xs py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Drishti AI is synthesizing legal statutes & spatial evidence...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto text-[11px]">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-750 text-slate-300 whitespace-nowrap border border-slate-700/60 transition hover:text-white"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Drishti AI about land laws, NALA notices, WALTA buffer..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
