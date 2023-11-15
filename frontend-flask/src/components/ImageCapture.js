import React, { useRef, useState } from "react";
import axios from "axios";
import "./ImageUploader.css";
import { AiFillCamera } from 'react-icons/ai';

export const ImageCapture = () => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [result, setResult] = useState("");
  const [data, setData] = useState({});

  // Function to start capturing
  const startCapture = async () => {
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setIsCapturing(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to stop capturing
  const stopCapture = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    setIsCapturing(false);
    setStream(null);
  };

  // Function to take a snapshot
  // const takeSnapshot = () => {
  //   const canvas = document.createElement('canvas');
  //   const video = videoRef.current;
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   const ctx = canvas.getContext('2d');
  //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //   const imageUrl = canvas.toDataURL('image/png');
  //   setCapturedImage(imageUrl);
  //   stopCapture()
  // };

  const takeSnapshotAndUpload = async () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);

    const formData = new FormData();
    formData.append("image", imageUrl);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload-image", {
        method: "POST",
        body: formData,
      });
    
      if (response.ok) {
        // Image uploaded successfully
        alert("Image uploaded")
      } else {
        // Handle error
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    stopCapture();
  };

  return (
    <div className="capture">
      <button
        className="scanBtn"
        onClick={isCapturing ? stopCapture : startCapture}
      >< AiFillCamera className="logo"/>
        {isCapturing ? "Stop Capture" : "Start Scanning"}
      </button>
      {isCapturing && (
        <button onClick={takeSnapshotAndUpload} disabled={!isCapturing}>
          Take Picture
        </button>
      )}
      {result && <div>{result}</div>}
      {capturedImage && (
        <div className="captured">
          {/* <button onClick={takeSnapshotAndUpload}>Send Image to Backend</button> */}
          <h2>Captured Image</h2>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          display: isCapturing ? "flex" : "none",
          flexDirection: "column",
        }}
      />

      {/* {data ? (

        <div className='result'>
          <h2>RESULT</h2>
          <div>Disease: <span>{data?.label}</span></div>
          <div>Probability: {data?.probability}</div>
        </div>
      ) : null} */}

      {capturedImage ? (
        <div className="result">
          <h2>RESULT</h2>
          <div>
            Disease: <span>{data?.label}</span>
          </div>
          <div>Probability: {data?.probability}</div>
        </div>
      ) : null}
    </div>
  );
};
