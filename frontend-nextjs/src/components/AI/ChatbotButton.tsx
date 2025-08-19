'use client';

import React, { useState } from 'react';
import Chatbot from './Chatbot';

interface ChatbotButtonProps {
  user?: {
    name: string;
    email: string;
    role: 'free' | 'premium';
  };
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ user }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        title="Open AI Assistant"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></div>
        
        {/* AI Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">AI</span>
        </div>
      </button>

      {/* Chatbot Modal */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        user={user}
      />
    </>
  );
};

export default ChatbotButton;
