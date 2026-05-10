import React, { useEffect, useRef } from "react";

const CameraScanner = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

    } catch (err) {
      alert("Camera not accessible");
      console.log(err);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const capture = () => {

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {

      // ⭐ send image back
      window.opener.postMessage({
        type: "FOOD_IMAGE",
        file: blob
      }, "*");

      // ⭐ stop camera
      video.srcObject.getTracks().forEach(track => track.stop());

      // ⭐ close tab
      window.close();

    }, "image/jpeg");
  };

  return (
    <div style={{
      background: "#000",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "90%",
          maxWidth: "700px",
          borderRadius: "20px"
        }}
      />

      <button
        onClick={capture}
        style={{
          marginTop: "25px",
          padding: "16px 50px",
          fontSize: "20px",
          borderRadius: "50px",
          border: "none",
          background: "linear-gradient(90deg,#00c853,#ff6b00)",
          color: "white",
          cursor: "pointer"
        }}
      >
        Capture Food 📸
      </button>

      <canvas ref={canvasRef} hidden />

    </div>
  );
};

export default CameraScanner;