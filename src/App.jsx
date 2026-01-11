import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Home, Search, Bell, User, Send, ChevronLeft, MoreVertical, MapPin, Filter, ArrowRight, Bluetooth } from 'lucide-react';

// Fix for default Leaflet icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- MOCK DATA ---
const HISTORY_DATA = [
  { id: 1, name: "Papa", date: "Jan 01, 2026", message: "this is an example of chat", avatar: "👨‍🦳" },
  { id: 2, name: "Brother", date: "Dec 25, 2025", message: "Merry Christmas!", avatar: "👦" },
  { id: 3, name: "Mom", date: "Dec 19, 2025", message: "Dinner is ready", avatar: "👩" },
];

// --- MAP SEARCH HELPER ---
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// --- MAIN COMPONENTS ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // home, map, history, profile
  const [activeChat, setActiveChat] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.4081, 120.9484]); 
  const [searchQuery, setSearchQuery] = useState("");

  // --- NEW: BLUETOOTH STATE ---
  const [deviceName, setDeviceName] = useState("Disconnected");

  // --- NEW: BLUETOOTH CONNECT FUNCTION ---
  const connectGlove = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'] 
      });
      setDeviceName(device.name || "Unknown Glove");
      await device.gatt.connect();
      alert("Glove Connected!");
    } catch (error) {
      console.error("Bluetooth Error:", error);
      alert("Connection failed. Make sure Bluetooth is on.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.toLowerCase().includes("manila")) setMapCenter([14.5995, 120.9842]);
    else if(searchQuery.toLowerCase().includes("cebu")) setMapCenter([10.3157, 123.8854]);
    else alert("Type 'Manila' or 'Cebu' to see the map move (Simulation)");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-white px-6 py-10 justify-between max-w-md mx-auto">
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-4">SilentVoice</h1>
          <p className="text-gray-500 mb-10">Sign in to connect with your loved ones</p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeChat) return <ChatScreen chat={activeChat} onBack={() => setActiveChat(null)} />;

    switch (activeTab) {
      case 'home':
        return (
          <div className="p-6 pt-12">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            
            {/* BLUETOOTH CONNECTION CARD */}
            <div className="bg-black text-white p-6 rounded-3xl mb-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Device Status</p>
                  <h2 className="text-xl font-bold">{deviceName}</h2>
                </div>
                <div className={`p-2 rounded-full ${deviceName === "Disconnected" ? "bg-red-500" : "bg-green-500"}`}>
                  <Bluetooth size={20} />
                </div>
              </div>
              <button 
                onClick={connectGlove}
                className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                {deviceName === "Disconnected" ? "Connect Glove" : "Reconnect Device"}
              </button>
            </div>

            <div className="bg-gray-100 p-6 rounded-3xl mb-4">
              <p className="text-gray-600 italic">"Communication is the key to every heart."</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-blue-50 p-4 rounded-2xl h-32 flex flex-col justify-end font-bold">New Messages</div>
               <div className="bg-purple-50 p-4 rounded-2xl h-32 flex flex-col justify-end font-bold">FSL Translation</div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-full relative">
            <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2">
              <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg flex items-center p-2 px-4 border">
                <Search size={20} className="text-gray-400" />
                <input 
                   className="flex-1 ml-2 outline-none py-2" 
                   placeholder="Search location (e.g. Manila)" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <ChangeView center={mapCenter} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapCenter}>
                <Popup>You are here</Popup>
              </Marker>
            </MapContainer>
          </div>
        );
      case 'history':
        return (
          <div className="p-6 pt-12 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">History</h1>
            <div className="space-y-6">
              {HISTORY_DATA.map((chat) => (
                <div key={chat.id} onClick={() => setActiveChat(chat)} className="flex gap-4 items-center cursor-pointer active:opacity-50">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">{chat.avatar}</div>
                  <div className="flex-1 border-b pb-4">
                    <div className="flex justify-between"><span className="font-bold">{chat.name}</span><span className="text-xs text-gray-400">{chat.date}</span></div>
                    <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 pt-12 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl shadow-inner">👤</div>
            <h2 className="text-2xl font-bold">User Name</h2>
            <p className="text-gray-500 mb-8">Premium Member</p>
            <div className="w-full space-y-3">
               <div className="p-4 bg-gray-50 rounded-2xl flex justify-between font-medium">Account Settings <ChevronLeft className="rotate-180"/></div>
               <div className="p-4 bg-gray-50 rounded-2xl flex justify-between font-medium">Privacy Policy <ChevronLeft className="rotate-180"/></div>
               <button onClick={() => setIsLoggedIn(false)} className="w-full p-4 bg-red-50 text-red-600 rounded-2xl font-bold mt-10">Logout</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
      
      <div className="h-20 border-t flex justify-around items-center bg-white px-4 z-[2000]">
        <NavButton active={activeTab === 'home'} icon={<Home />} onClick={() => {setActiveTab('home'); setActiveChat(null)}} />
        <NavButton active={activeTab === 'map'} icon={<Search />} onClick={() => {setActiveTab('map'); setActiveChat(null)}} />
        <NavButton active={activeTab === 'history'} icon={<Bell />} onClick={() => {setActiveTab('history'); setActiveChat(null)}} />
        <NavButton active={activeTab === 'profile'} icon={<User />} onClick={() => {setActiveTab('profile'); setActiveChat(null)}} />
      </div>
    </div>
  );
};

const NavButton = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? 'bg-black text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
    {React.cloneElement(icon, { size: 24 })}
  </button>
);

const ChatScreen = ({ chat, onBack }) => {
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([{ text: chat.message, type: 'received' }]);

  const send = () => {
    if (!msg.trim()) return;
    setList([...list, { text: msg, type: 'sent' }]);
    setMsg("");
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b flex items-center gap-4">
        <button onClick={onBack}><ChevronLeft /></button>
        <span className="font-bold text-lg">{chat.name}</span>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {list.map((m, i) => (
          <div key={i} className={`flex ${m.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] ${m.type === 'sent' ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-black rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input 
          value={msg} 
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 bg-gray-100 rounded-full px-4 outline-none" 
          placeholder="Message..." 
        />
        <button onClick={send} className="p-3 bg-black text-white rounded-full"><Send size={20}/></button>
      </div>
    </div>
  );
};

export default App;