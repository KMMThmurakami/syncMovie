import React from "react";
import { forwardRef } from "react";
import ReactPlayer from "react-player";

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
      <ReactPlayer
        style={{ backgroundColor: "#eeeeee" }}
        ref={ref}
        src={src}
        width={width}
        height={height}
        playing={playing}
        controls={false}
        volume={volume}
      />
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default React.memo(VideoPlayer);
