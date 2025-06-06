import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center p-5 sm:p-10 relative">
      <MdKeyboardBackspace
        className="absolute top-7 left-7 text-white cursor-pointer w-6 h-6 sm:w-7 sm:h-7"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white mb-10 text-2xl sm:text-3xl text-center font-semibold">
        Enter Your{' '}
        <span className="text-blue-400 font-extrabold">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="e.g. Shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg sm:text-xl"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-8 text-black font-semibold cursor-pointer bg-white rounded-full text-lg sm:text-xl transition duration-200 hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  )
}

export default Customize2
