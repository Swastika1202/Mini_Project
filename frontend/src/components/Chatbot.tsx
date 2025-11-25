import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageSquareText, Loader2, Upload } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: messages.length + 1,
      text: selectedFile ? `[File: ${selectedFile.name}] ${inputMessage}` : inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const formData = new FormData();
      formData.append('prompt', inputMessage);
      formData.append('userName', 'Current User'); // Replace with actual user name from auth context
      formData.append('language', 'en'); // Or dynamically set based on user preference
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, I could not get a response from the bot. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setInputMessage('');
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Card className="w-full max-w-lg h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center">
        <Avatar className="flex justify-center items-center">
          <AvatarFallback>
            <MessageSquareText className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1.5 leading-none ml-3">
          <CardTitle>FinanceFlow Chatbot</CardTitle>
          <p className="text-sm text-muted-foreground">Ask your financial questions.</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-50 block text-right mt-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col p-4 border-t">
        {selectedFile && (
          <div className="w-full text-sm text-muted-foreground mb-2">
            Selected file: {selectedFile.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-red-500"
            >
              x
            </Button>
          </div>
        )}
        <div className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Upload className="h-4 w-4" />
            </Button>
          </label>
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
