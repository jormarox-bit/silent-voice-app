import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Bell, User, Mic, Send, ChevronLeft, MoreVertical, MapPin, Filter, ArrowRight } from 'lucide-react';

// --- MOCK DATA ---
const HISTORY_DATA = [
  { id: 1, name: "Papa", date: "Jan 01, 2025", message: "this is an example of chat", avatar: "👨‍🦳" },
  { id: 2, name: "Brother", date: "Dec 25, 2024", message: "Merry Christmas!", avatar: "👦" },
  { id: 3, name: "Mom", date: "Dec 19, 2024", message: "Dinner is ready", avatar: "👩" },
];

const MAP_MARKERS = [
  { id: 1, price: "$123", top: "40%", left: "50%", active: true },
  { id: 2, price: "$234", top: "30%", left: "20%", active: false },
  { id: 3, price: "$199", top: "25%", left: "60%", active: false },
];

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "w-full py-4 rounded-xl font-semibold transition-all duration-200";
  const styles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
    google: "bg-white border border-gray-200 text-gray-700 flex items-center justify-center gap-2",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-black transition-colors"
  />
);

// --- SCREENS ---

// 1. LOGIN SCREEN (Matches Screenshot 20)
const LoginScreen = ({ onLogin }) => {
  return (
    <div className="flex flex-col h-screen bg-white px-6 py-10 justify-between">
      <div>
        <div className="flex justify-between items-center mb-12">
          <span className="font-bold">9:41</span>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-black rounded-full opacity-20"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-12 mt-10">SilentVoice</h1>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-500">Enter your email to sign up for this app</p>
        </div>

        <Input placeholder="user@gmail.com" />
        <Button onClick={onLogin} className="mt-4">Continue</Button>
        
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <span className="relative px-4 bg-white text-gray-400 text-sm">or</span>
        </div>

        <div className="space-y-3">
          <Button variant="google">Continue with Google</Button>
          <Button variant="google">Continue with Apple</Button>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

// 2. CHAT SCREEN (Matches Screenshot 20/21)
const ChatScreen = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "This is the main chat template", sender: "user", time: "9:41 AM" },
    { id: 2, text: "EXAMPLE CONVERSATION WITH YOUR RELATIVES", sender: "user", time: "9:41 AM" },
    { id: 3, text: "Example reply of your relative", sender: "other", time: "9:42 AM" },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "This is an automated reply mock.",
        sender: "other",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2"><ChevronLeft /></button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">👨‍🦳</div>
          <span className="font-bold">Papa</span>
        </div>
        <button className="p-2"><MoreVertical size={20} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        <div className="text-center text-xs text-gray-400 my-4">Nov 30, 2023, 9:41 AM</div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-black text-white rounded-tr-none' 
                : 'bg-gray-200 text-black rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="p-2 bg-black rounded-full text-white">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. MAP SCREEN (Matches Screenshot 22)
const MapScreen = () => {
  return (
    <div className="relative h-full bg-gray-100 overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-blue-50 grid grid-cols-6 grid-rows-6 opacity-50">
        {/* Creating a grid pattern to simulate a map */}
        {[...Array(36)].map((_, i) => (
            <div key={i} className="border border-white/50"></div>
        ))}
      </div>
      
      {/* Search Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 pt-12 bg-gradient-to-b from-white/80 to-transparent">
        <div className="bg-white rounded-full shadow-lg flex items-center p-3 mb-4">
          <Search className="text-black ml-2" size={20} />
          <input 
            className="flex-1 ml-3 outline-none" 
            placeholder="User's Location" 
            defaultValue="Sta. Elena"
          />
          <div className="bg-gray-100 p-1 rounded-full"><MapPin size={16}/></div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="bg-white px-4 py-1 rounded-full text-sm font-medium shadow-sm border flex items-center gap-1">
             Filter <Filter size={12}/>
          </button>
          <button className="bg-white px-4 py-1 rounded-full text-sm font-medium shadow-sm border">Sort</button>
          <span className="flex-1 text-right text-sm text-gray-500 pt-2">99 results</span>
        </div>
      </div>

      {/* Map Markers */}
      {MAP_MARKERS.map((marker) => (
        <div 
          key={marker.id}
          className={`absolute px-3 py-1 rounded-full text-xs font-bold shadow-md transform -translate-x-1/2 cursor-pointer
            ${marker.active ? 'bg-black text-white z-20 scale-110' : 'bg-white text-black z-10'}`}
          style={{ top: marker.top, left: marker.left }}
        >
          {marker.price}
        </div>
      ))}

      {/* Bottom Card */}
      <div className="absolute bottom-20 left-4 right-4 bg-white rounded-3xl p-4 shadow-2xl">
        <div className="h-32 bg-gray-200 rounded-xl mb-3 relative overflow-hidden">
            <img src="/api/placeholder/400/200" alt="Location" className="w-full h-full object-cover grayscale opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">Location Image Placeholder</div>
        </div>
        <div className="flex justify-between items-end">
            <div>
                <h3 className="font-bold text-lg">Location name</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>⭐ 4.8 (500 reviews)</span>
                    <span className="mx-2">•</span>
                    <span>1.2 miles</span>
                </div>
                <div className="text-xl font-bold mt-2">$123 <span className="text-sm font-normal text-gray-400">/ night</span></div>
            </div>
            <button className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold">Select</button>
        </div>
      </div>
    </div>
  );
};

// 4. HISTORY SCREEN (Matches Screenshot 21)
const HistoryScreen = ({ onChatSelect }) => {
  return (
    <div className="flex flex-col h-full bg-white pt-12 px-4">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      
      <div className="flex gap-3 mb-8">
        {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => (
          <button key={month} className={`px-6 py-2 rounded-full text-sm font-medium ${i===0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
            {month}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {HISTORY_DATA.map((chat) => (
          <div key={chat.id} onClick={onChatSelect} className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl relative">
              {chat.avatar}
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{chat.name}</span>
                <span className="text-xs text-gray-400">{chat.date}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">{chat.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. PROFILE SCREEN (Requested addition)
const ProfileScreen = () => {
  return (
    <div className="flex flex-col h-full bg-white pt-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <MoreVertical className="text-gray-400" />
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-4xl">👨‍✈️</div>
        <h2 className="text-xl font-bold">User Name</h2>
        <p className="text-gray-400">user@example.com</p>
      </div>

      <div className="space-y-2">
        {['Account Settings', 'Privacy & Security', 'Notifications', 'Help & Support'].map((item) => (
          <div key={item} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-gray-50 cursor-pointer">
            <span className="font-medium">{item}</span>
            <ChevronLeft className="rotate-180 text-gray-400" size={20} />
          </div>
        ))}
        <div className="p-4 bg-red-50 rounded-2xl flex justify-center items-center mt-8 cursor-pointer text-red-500 font-bold">
            Log Out
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP SHELL ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeChat, setActiveChat] = useState(null);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (activeChat) {
    return <ChatScreen onBack={() => setActiveChat(null)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HistoryScreen onChatSelect={() => setActiveChat(1)} />;
      case 'search': return <MapScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HistoryScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative font-sans text-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Floating Action Button (Bell) */}
      <div className="absolute bottom-24 right-6">
        <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 border-t border-gray-100 flex justify-around items-center bg-white px-2">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-black text-white' : 'text-gray-400'}`}>
          <Home size={24} />
        </button>
        <button onClick={() => setActiveTab('search')} className={`p-3 rounded-xl transition-colors ${activeTab === 'search' ? 'bg-black text-white' : 'text-gray-400'}`}>
          <Search size={24} />
        </button>
        <button className="p-3 rounded-xl text-gray-400">
          <Bell size={24} />
        </button>
         <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-400'}`}>
          <User size={24} />
        </button>
      </div>
    </div>
  );
}