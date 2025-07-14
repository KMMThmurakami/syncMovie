import React from "react";
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
  MediaFullscreenButton,
} from "media-chrome/react";

interface YouTubePlayerProps {
  id: string;
  playing: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ id, playing }) => {
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
        // onReady={onReady}
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
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
};

export default YouTubePlayer;
