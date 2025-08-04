import React from "react";
import { forwardRef } from "react";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaFullscreenButton,
} from "media-chrome/react";

interface VideoPlayerProps {
  src: string;
  playing: boolean;
  width: string;
  height: string;
  volume: number;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>(
  ({ src, playing, width, height, volume }, ref) => {
    return (
      <MediaController>
        <ReactPlayer
          slot="media"
          style={{ backgroundColor: "#eeeeee" }}
          ref={ref}
          src={src}
          width={width}
          height={height}
          playing={playing}
          controls={false}
          volume={volume}
        />
        <MediaControlBar>
          <MediaPlayButton />
          <MediaSeekBackwardButton seekOffset={10} />
          <MediaSeekForwardButton seekOffset={10} />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaPlaybackRateButton />
          <MediaFullscreenButton />
        </MediaControlBar>
      </MediaController>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default React.memo(VideoPlayer);
