import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {
    userData,
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center p-5 sm:p-10 relative"
    >
      <MdKeyboardBackspace
        className="absolute top-7 left-7 text-white cursor-pointer w-6 h-6 sm:w-7 sm:h-7"
        onClick={() => navigate("/")}
      />
      <h1 className="text-white mb-10 text-2xl sm:text-3xl text-center font-semibold">
        Select your{' '}
        <span className="text-blue-400 font-extrabold">Assistant Image</span>
      </h1>

      <div className="w-full max-w-[900px] flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[70px] h-[140px] sm:w-[150px] sm:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage === "input"
              ? "border-4 border-white shadow-2xl shadow-blue-950"
              : ""
          }`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          )}
          {frontendImage && (
            <img src={frontendImage} alt="Selected" className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          className="min-w-[150px] h-[60px] mt-8 text-black font-semibold bg-white rounded-full text-[18px] cursor-pointer transition duration-200 hover:bg-gray-200"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  )
}

export default Customize
