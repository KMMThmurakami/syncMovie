import React from "react";
import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  id: string;
  playing: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ id, playing }) => {
  const onReady = () => {
    console.log("onReady", id);
  };

  return (
    <ReactPlayer
      src={`https://www.youtube.com/watch?v=${id}`}
      onReady={onReady}
      width="560px"
      height="315px"
      playing={playing}
      controls={true}
      muted={true}
    />
  );
};

export default YouTubePlayer;
