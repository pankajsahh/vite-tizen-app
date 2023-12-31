import { useState, useEffect } from "react";
import LoginGif from "../../assets/signfeed_logo.gif";
import { MediaDatatype } from "../RegionToMedia";

function AdsPlayer({ MediaData }: { MediaData: MediaDatatype[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(MediaData, " this is media data");
  useEffect(() => {
    let timeout: number | undefined;
    if (MediaData[currentIndex]) {
      if (MediaData[currentIndex].type === "Image") {
        timeout = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % MediaData.length);
        }, 5000); // Display image for 10 seconds
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, MediaData, MediaData[currentIndex]]);

  return (
    <div className="adContainer">
      {MediaData.length ? (
        <>
          {MediaData[currentIndex] &&
            MediaData[currentIndex].type === "webpage" && (
              <iframe
                style={{ background: "white" }}
                height="100%"
                width="100%"
                src={decodeURIComponent(MediaData[currentIndex].data)}
                title="webPage"
              ></iframe>
            )}
          {MediaData[currentIndex] &&
            MediaData[currentIndex].type === "Image" && (
              <img
                src={"data:image/png;base64," + MediaData[currentIndex].data}
                alt={`Image ${MediaData[currentIndex].id}`}
                className="PlayerImage"
              />
            )}

          {MediaData[currentIndex] &&
            MediaData[currentIndex].type === "video" && (
              <video
                onEnded={() => {
                  if (MediaData.length > 1)
                    setCurrentIndex(
                      (prevIndex) => (prevIndex + 1) % MediaData.length
                    );
                }}
                id="videoElement"
                className="videoPlayer"
                autoPlay
                muted
                loop={MediaData.length <= 1}
              >
                <source
                  src={"data:video/mp4;base64," + MediaData[currentIndex].data}
                  type="video/mp4"
                />
              </video>
            )}
        </>
      ) : (
        <div className="LoadingScreen">
          <img src={LoginGif} alt="Logo" className="logo" />
        </div>
      )}
    </div>
  );
}

export default AdsPlayer;
