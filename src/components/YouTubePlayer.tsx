import { forwardRef } from "react";
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
  src: string;
  playing: boolean;
  width: string;
  height: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const YouTubePlayer = forwardRef<ReactPlayer, YouTubePlayerProps>(
  ({ src, playing, width, height }, ref) => {
    return (
      <MediaController>
        <ReactPlayer
          ref={ref} // 受け取ったrefをReactPlayerに渡す
          slot="media"
          src={src}
          width={width}
          height={height}
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
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
