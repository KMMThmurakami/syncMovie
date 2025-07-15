import React, { useState } from "react";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from "media-chrome/react";

interface YouTubePlayerProps {
  id: string;
  playing: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ id, playing }) => {
  const [firstPlaying, setFirstPlaying] = useState(false);

  const onPlaying = async () => {
    if (!firstPlaying) {
      console.log("onPlaying");
      setFirstPlaying(true);
    }
  };

  return (
    <MediaController
      style={{
        width: "100%",
        aspectRatio: "16/9",
      }}
    >
      <ReactPlayer
        slot="media"
        src={`https://www.youtube.com/watch?v=${id}`}
        onPlaying={onPlaying}
        width="560px"
        height="315px"
        playing={playing}
        controls={false}
        muted={true}
      />
      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton seekOffset={10} />
        <MediaSeekForwardButton seekOffset={10} />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaPlaybackRateButton />
      </MediaControlBar>
    </MediaController>
  );
};

export default YouTubePlayer;
