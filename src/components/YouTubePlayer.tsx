import { useState, forwardRef } from "react";
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
  onPlayerReady: () => void;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const YouTubePlayer = forwardRef<ReactPlayer, YouTubePlayerProps>(
  ({ id, playing, onPlayerReady }, ref) => {
    const [isReady, setIsReady] = useState(false);

    const handleOnPlaying = () => {
      if (!isReady) {
        console.log(`Player ${id} is ready.`);
        onPlayerReady();
        setIsReady(true);
      }
    };

    return (
      <MediaController>
        <ReactPlayer
          ref={ref} // 受け取ったrefをReactPlayerに渡す
          slot="media"
          src={`https://www.youtube.com/watch?v=${id}`}
          onReady={handleOnPlaying}
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
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
