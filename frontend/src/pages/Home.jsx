import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const [showHistory, setShowHistory] = useState(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  // Add entry to userData.history
  const addToHistory = (entry) => {
    setUserData(prev => {
      if (!prev) return prev
      const newHistory = prev.history ? [...prev.history, entry] : [entry]
      return { ...prev, history: newHistory }
    })
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
    synth.cancel();
    synth.speak(utterence);
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");

        // Update history here
        addToHistory(`You: ${transcript}`);
        addToHistory(`${userData.assistantName}: ${data.response}`);
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';

    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-4 overflow-hidden relative'>
    
  {/* Hamburger Icon for Mobile */}
  {!ham && (
  <CgMenuRight
    className='lg:hidden text-white absolute top-5 right-5 w-8 h-8 cursor-pointer z-50 hover:scale-105 transition-transform duration-200'
    onClick={() => setHam(true)}
  />
)}


  {/* Slide-in Mobile Menu */}
 <div className={`absolute lg:hidden top-0 w-full h-full bg-black/40 backdrop-blur-md p-6 flex flex-col gap-6 items-start transition-transform duration-300 ease-in-out z-50 ${ham ? "translate-x-0" : "translate-x-full"}`}>

    <RxCross1
      className='text-white absolute top-5 right-5 w-8 h-8 cursor-pointer hover:rotate-90 transition-transform duration-300'
      onClick={() => setHam(false)}
    />

    <button className='ui-button'>Log Out</button>
    <button className='ui-button' onClick={() => navigate("/customize")}>Customize your Assistant</button>

    <div className='w-full h-px bg-gray-500 my-4'></div>

    <h1 className='text-white font-semibold text-lg'>History</h1>
    <div className='w-full h-[300px] overflow-y-auto pr-2 custom-scroll'>
      {userData.history?.map((his, index) => (
        <div key={index} className='text-gray-300 text-sm truncate hover:text-white transition-colors duration-200' title={his}>
          {his}
        </div>
      ))}
    </div>
  </div>

  {/* Desktop Buttons */}
  <div className="hidden lg:flex flex-col gap-4 absolute top-[60px] right-5 z-30">
    <button className='ui-button' onClick={handleLogOut}>Log Out</button>
    <button className='ui-button' onClick={() => navigate("/customize")}>Customize your Assistant</button>
    <button className='ui-button' onClick={() => setShowHistory(!showHistory)}>
      {showHistory ? "Hide History" : "Show History"}
    </button>
  </div>

  {/* Desktop History Sidebar */}
<div
  className='hidden lg:flex fixed top-0 right-0 h-screen w-[320px] bg-black/80 backdrop-blur-md p-6 flex-col shadow-xl rounded-l-3xl z-20 transition-all duration-300 ease-in-out'
  style={{
    right: showHistory ? '260px' : '-350px',
    opacity: showHistory ? 1 : 0,
    pointerEvents: showHistory ? 'auto' : 'none',
  }}
>
  <h2 className='text-white font-bold text-xl mb-2'>History</h2>

  <div className='flex-1 overflow-y-auto custom-scroll pr-1'>
    {userData.history && userData.history.length > 0 ? (
      userData.history.map((his, index) => (
        <div
          key={index}
          className='text-gray-300 text-sm truncate hover:text-white transition-colors duration-200'
          title={his}
        >
          {his}
        </div>
      ))
    ) : (
      <p className='text-gray-500'>No history available</p>
    )}
  </div>
</div>




  {/* Assistant Image */}
  <div className='w-[300px] h-[400px] relative rounded-3xl overflow-hidden shadow-2xl group'>
    <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-white/10 via-transparent to-white/10 blur-2xl opacity-30 z-0 group-hover:opacity-50 transition-opacity duration-300"></div>
    <img src={userData?.assistantImage} alt="assistant" className='w-full h-full object-cover relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]' />
  </div>

  {/* Assistant Name */}
  <h1 className='text-white text-lg font-semibold mt-2 tracking-wide'>I'm {userData?.assistantName}</h1>

  {/* Avatar Switch */}
  {!aiText && <img src={userImg} alt="user" className='w-[180px] mt-2 rounded-full shadow-lg' />}
  {aiText && <img src={aiImg} alt="ai" className='w-[180px] mt-2 rounded-full shadow-lg' />}

  {/* Output Text */}
  <h1 className='text-white text-lg font-medium px-4 text-center max-w-[80%] leading-relaxed'>
    {userText || aiText || null}
  </h1>
</div>


  )
}

export default Home
