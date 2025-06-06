import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center px-4 sm:px-0"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        className="w-full max-w-md bg-[#00000080] backdrop-blur-sm shadow-2xl shadow-black rounded-xl flex flex-col items-center justify-center gap-5 px-6 py-10"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-[24px] font-bold mb-[25px] text-center tracking-wide">
          Register to{' '}
          <span className="text-blue-400 font-extrabold">
            Virtual Assistant
          </span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[60px] outline-none border border-white bg-transparent text-white placeholder-gray-400 px-5 rounded-full text-[17px] focus:ring-2 focus:ring-blue-500 transition"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border border-white bg-transparent text-white placeholder-gray-400 px-5 rounded-full text-[17px] focus:ring-2 focus:ring-blue-500 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[60px] border border-white bg-transparent text-white rounded-full relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent rounded-full outline-none placeholder-gray-400 px-5 text-[17px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <IoEye
              className="absolute right-5 text-white w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute right-5 text-white w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err.length > 0 && (
          <p className="text-red-500 text-[15px] font-medium -mt-2">{`*${err}`}</p>
        )}

        <button
          className="w-full h-[55px] mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full text-[18px] transition duration-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-white text-[15px] mt-5">
          Already have an account?{' '}
          <span
            className="text-blue-400 underline hover:text-blue-500 font-semibold cursor-pointer transition"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
