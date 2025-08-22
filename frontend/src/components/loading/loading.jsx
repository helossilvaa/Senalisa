
import React from "react";
import Lottie from "lottie-react";
import animationData from "../public/animations/loading.json";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
