import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// Import A-Frame library

export default function ARView() {
  const { stallId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Load AR.js script dynamically
    const script = document.createElement("script");
    script.src = "https://rawgit.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Fetch data for images and videos
    axios.get(`/stall/${stallId}`).then(response => {
      setPhotos(response.data.photos || []);
      setVideos(response.data.videos || []);
    });

    // Cleanup AR.js script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [stallId]);

  return (
    <a-scene embedded arjs="sourceType: webcam;">
      {/* Preload assets */}
      <a-assets>
        <img id="background-video" src="ve/src/assets/p_0b6ec3fa-9e92-11ef-821b-1a55da77981c_wm.png" crossOrigin="anonymous" />
        {photos.map((photo, index) => (
          <img id={`photo-${index}`} src={photo} key={index} crossOrigin="anonymous" />
        ))}
        {videos.map((video, index) => (
          <video id={`video-${index}`} src={video} key={index} autoPlay loop crossOrigin="anonymous"></video>
        ))}
      </a-assets>

      {/* Sky and Camera */}
      <a-sky src="#background-video" position="0 400 -2000" rotation="0 195 0"></a-sky>
      <a-camera></a-camera>

      {/* Display images and videos in 3D space */}
      <a-entity>
        {photos.map((photo, index) => (
          <a-image
            key={index}
            src={`#photo-${index}`}
            position={`${-480 + index * 750} 675 -1900`} // Adjust position as per your layout
            rotation="0 10 0"
            scale="650 450 450"
          ></a-image>
        ))}

        {videos.map((video, index) => (
          <a-video
            key={index}
            src={`#video-${index}`}
            position={`${-3000 + index * 1000} 850 -2000`} // Adjust position as per your layout
            rotation="0 50 0"
            scale="450 450 550"
            width="4"
            height="2.25"
            autoplay="true"
            loop="true"
          ></a-video>
        ))}

        {/* Additional decorative image */}
        <a-image
          src="istockphoto-1328985117-1024x1024.jpg"
          position="2350 1020 -1900"
          rotation="0 -60 0"
          scale="1100 850 450"
        ></a-image>
      </a-entity>
    </a-scene>
  );
}
