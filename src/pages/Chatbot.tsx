import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

interface ApiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
}

// const response = await axios.post<ApiResponse>(/* your request here */);

function Chatbot() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const GEMINI_API_KEY = "AIzaSyA5x67hvFwa6sTfTVttBjsw739mZDGWli4";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "" || isLoading) return;

    try {
      setIsLoading(true);
  
      setResponses((prev) => [
        ...prev,
        { type: "user", message: query, timestamp: new Date() },
      ]);

      
      const response = await axios.post<ApiResponse>(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: query }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const botResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't find an answer.";

      setResponses((prev) => [
        ...prev,
        { type: "bot", message: botResponse, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setResponses((prev) => [
        ...prev,
        {
          type: "bot",
          message: "There was an error fetching the response.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setQuery(""); 
    }
  };

  const clearChat = () => {
    setResponses([]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
    
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              EcoFarm Assistant
            </h1>
            <div className="mt-2 h-1 w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-700 mt-4 font-medium">
            Your sustainable farming and environmental companion
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-xl border border-green-100 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">EcoChat Info</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700">Status: Active & Growing</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Conversations: {responses.length}</p>
                  <button
                    onClick={clearChat}
                    className="btn btn-sm w-full bg-gradient-to-r from-red-500 to-rose-500 border-0 text-white hover:opacity-90 transition-opacity"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-9">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-xl border border-green-100">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold">
                      🌱
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">EcoFarm Guide</h2>
                      <p className="text-sm text-gray-500">Nurturing sustainable solutions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="p-6">
                <div className="space-y-6 h-[60vh] overflow-y-auto px-2 scroll-smooth custom-scrollbar">
                  {responses.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🌿</span>
                      </div>
                      <p className="text-gray-600 font-medium">Welcome to EcoFarm Assistant!</p>
                      <p className="text-gray-400 text-sm mt-2">Ask me anything about sustainable farming, environmental practices, or eco-friendly solutions</p>
                    </div>
                  )}
                  
                  {responses.map((res, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        res.type === "user" ? "justify-end" : "justify-start"
                      } items-end space-x-3 animate-fadeIn`}
                    >
                      {res.type === "bot" && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                          🌱
                        </div>
                      )}
                      
                      <div
                        className={`group relative flex flex-col ${
                          res.type === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`${
                            res.type === "user"
                              ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                              : "bg-white text-gray-800"
                          } p-4 rounded-2xl shadow-md max-w-2xl transition-all duration-200 hover:shadow-lg ${
                            res.type === "user" ? "rounded-br-none" : "rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{res.message}</p>
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(res.timestamp)}
                          </span>
                        </div>
                      </div>

                      {res.type === "user" && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                          👤
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <form
                className="p-6 bg-white/50 rounded-b-3xl border-t border-gray-100"
                onSubmit={handleSearch}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-xl">🌿</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-12 pr-12 bg-white/80 backdrop-blur-sm focus:input-primary transition-all duration-200 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="Ask about sustainable farming, eco-practices, or environmental solutions..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`btn px-8 bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white hover:opacity-90 transition-all duration-200 ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading || query.trim() === ""}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        Growing...
                        <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Plant
                        <span className="ml-2">🌱</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
