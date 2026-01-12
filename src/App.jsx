import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Home, Search, Bell, User, Send, ChevronLeft, Bluetooth, Volume2, Globe } from 'lucide-react';

// --- LEAFLET SETUP ---
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- FSL SENSOR DICTIONARY ---
const FSL_DICTIONARY = {
  "1,1,1,1,1,0": "KAMUSTA",   
  "0,0,0,0,0,1": "SALAMAT",   
  "1,0,0,0,0,0": "TULONG",    
  "1,1,0,0,0,0": "MAHAL KITA",
};

const HISTORY_DATA = [
  { id: 1, name: "Papa", date: "Jan 01, 2026", message: "this is an example of chat", avatar: "👨‍🦳" },
  { id: 2, name: "Brother", date: "Dec 25, 2025", message: "Merry Christmas!", avatar: "👦" },
  { id: 3, name: "Mom", date: "Dec 19, 2025", message: "Dinner is ready", avatar: "👩" },
];

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeChat, setActiveChat] = useState(null);
  const [showTranslator, setShowTranslator] = useState(false);
  const [mapCenter, setMapCenter] = useState([14.4081, 120.9484]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceName, setDeviceName] = useState("Disconnected");
  const [translatedText, setTranslatedText] = useState("READY...");

  // --- FUNCTIONS ---
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    window.speechSynthesis.speak(utterance);
  };

  const handleIncomingData = (rawData) => {
    const cleanData = rawData.trim();
    const word = FSL_DICTIONARY[cleanData] || "ANALYZING...";
    setTranslatedText(word);
    if (FSL_DICTIONARY[cleanData]) speak(word);
  };

  const connectGlove = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });
      setDeviceName(device.name || "FSL Glove");
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (e) => {
        const val = new TextDecoder().decode(e.target.value);
        handleIncomingData(val);
      });
      alert("Glove Linked!");
    } catch (err) { alert("Bluetooth Error"); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.toLowerCase().includes("manila")) setMapCenter([14.5995, 120.9842]);
    else if(searchQuery.toLowerCase().includes("cebu")) setMapCenter([10.3157, 123.8854]);
  };

  // --- LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-white px-6 py-10 justify-between max-w-md mx-auto">
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-4">SilentVoice</h1>
          <p className="text-gray-500 mb-10">Sign in to connect with your loved ones</p>
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg">Continue</button>
        </div>
      </div>
    );
  }

  // --- MAIN CONTENT LOGIC ---
  const renderContent = () => {
    if (activeChat) return <ChatScreen chat={activeChat} onBack={() => setActiveChat(null)} />;
    
    if (showTranslator) {
      return (
        <div className="p-6 pt-12 flex flex-col h-full bg-purple-50">
          <button onClick={() => setShowTranslator(false)} className="mb-6 flex items-center gap-2 font-bold text-purple-700"><ChevronLeft /> Back</button>
          <div className="flex-1 bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center text-center">
            <Globe className="text-purple-200 mb-4" size={60} />
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Live Translation</p>
            <h2 className="text-5xl font-black text-purple-600 mb-10">{translatedText}</h2>
            <button onClick={() => speak(translatedText)} className="p-6 bg-purple-600 text-white rounded-full shadow-lg"><Volume2 size={32} /></button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="p-6 pt-12">
            <h1 className="text-3xl font-bold mb-6 tracking-tight text-gray-900">Welcome Back</h1>
            <div className="bg-black text-white p-6 rounded-[2rem] mb-6 shadow-xl relative overflow-hidden">
              <p className="text-gray-400 text-sm mb-1">Glove Link</p>
              <h2 className="text-2xl font-bold mb-4">{deviceName}</h2>
              <button onClick={connectGlove} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm relative z-10">Connect Glove</button>
              <Bluetooth className="absolute -right-4 -bottom-4 opacity-10" size={120} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div onClick={() => setActiveTab('history')} className="bg-blue-50 p-5 rounded-[2rem] h-36 flex flex-col justify-between font-bold text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                 <Bell size={24} /><span>Messages</span>
               </div>
               <button onClick={() => setShowTranslator(true)} className="bg-purple-600 p-5 rounded-[2rem] h-36 flex flex-col justify-between items-start font-bold text-white shadow-lg shadow-purple-100">
                 <Globe size={24} /><span>FSL Translate</span>
               </button>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-full relative">
            <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2">
              <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg flex items-center p-2 px-4 border">
                <Search size={20} className="text-gray-400" />
                <input className="flex-1 ml-2 outline-none py-2" placeholder="Search Manila or Cebu" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>
            </div>
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <ChangeView center={mapCenter} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapCenter}><Popup>You are here</Popup></Marker>
            </MapContainer>
          </div>
        );
      case 'history':
        return (
          <div className="p-6 pt-12 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">History</h1>
            <div className="space-y-6">
              {HISTORY_DATA.map((chat) => (
                <div key={chat.id} onClick={() => setActiveChat(chat)} className="flex gap-4 items-center cursor-pointer p-2 hover:bg-gray-50 rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl shadow-sm">{chat.avatar}</div>
                  <div className="flex-1 border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-800">{chat.name}</span><span className="text-xs text-gray-400">{chat.date}</span></div>
                    <p className="text-sm text-gray-500 truncate mt-1">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 pt-12 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-4xl shadow-inner border-4 border-white">👤</div>
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <div className="w-full mt-10 space-y-3">
               <div className="p-4 bg-gray-50 rounded-2xl flex justify-between font-medium text-gray-600">Account Settings <ChevronLeft className="rotate-180 opacity-30"/></div>
               <button onClick={() => setIsLoggedIn(false)} className="w-full p-4 bg-red-50 text-red-600 rounded-2xl font-bold mt-6 shadow-sm">Logout</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative">
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
      {!showTranslator && (
        <div className="h-20 border-t flex justify-around items-center bg-white px-4 z-[2000]">
          <NavButton active={activeTab === 'home'} icon={<Home />} onClick={() => {setActiveTab('home'); setActiveChat(null)}} />
          <NavButton active={activeTab === 'map'} icon={<Search />} onClick={() => {setActiveTab('map'); setActiveChat(null)}} />
          <NavButton active={activeTab === 'history'} icon={<Bell />} onClick={() => {setActiveTab('history'); setActiveChat(null)}} />
          <NavButton active={activeTab === 'profile'} icon={<User />} onClick={() => {setActiveTab('profile'); setActiveChat(null)}} />
        </div>
      )}
    </div>
  );
};

const NavButton = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
    {React.cloneElement(icon, { size: 24 })}
  </button>
);

const ChatScreen = ({ chat, onBack }) => (
  <div className="flex flex-col h-full bg-white">
    <div className="p-4 border-b flex items-center gap-4"><button onClick={onBack} className="p-2 bg-gray-50 rounded-full"><ChevronLeft /></button><span className="font-bold">{chat.name}</span></div>
    <div className="flex-1 p-6 flex items-center justify-center italic text-gray-300 text-center">Connected to secure chat. <br/> Your glove will translate signs into messages.</div>
    <div className="p-4 border-t flex gap-2"><input className="flex-1 bg-gray-100 rounded-full px-4" placeholder="Type or use glove..." /><button className="p-3 bg-black text-white rounded-full"><Send size={20}/></button></div>
  </div>
);

export default App;