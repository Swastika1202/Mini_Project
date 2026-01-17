import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquareText, Loader2, Upload } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    setIsLoading(true);

    const userMessage = {
      id: messages.length + 1,
      text: selectedFile
        ? `[File: ${selectedFile.name}] ${inputMessage}`
        : inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append("prompt", inputMessage);
      formData.append("userName", "Current User");
      formData.append("language", "en");

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("/api/chatbot", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chatbot response");
      }

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry, I could not get a response from the bot. Please try again.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setInputMessage("");
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Card className="w-full max-w-lg h-[600px] flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center">
        <Avatar className="flex items-center justify-center">
          <AvatarFallback>
            <MessageSquareText className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <CardTitle>FinanceFlow Chatbot</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask your financial questions.
          </p>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-50 block text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <CardFooter className="flex flex-col p-4 border-t">
        {selectedFile && (
          <div className="w-full text-sm text-muted-foreground mb-2">
            Selected file: {selectedFile.name}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-red-500"
              onClick={() => setSelectedFile(null)}
            >
              ✕
            </Button>
          </div>
        )}

        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />

          <label htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Upload className="h-4 w-4" />
            </Button>
          </label>

          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
