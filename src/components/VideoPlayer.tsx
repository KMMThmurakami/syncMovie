import React from "react";
import { forwardRef } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  src: string;
  playing: boolean;
  width: string;
  height: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>(
  ({ src, playing, width, height }, ref) => {
    return (
      <ReactPlayer
        style={{ backgroundColor: "#eeeeee" }}
        ref={ref}
        src={src}
        width={width}
        height={height}
        playing={playing}
        controls={true}
        muted={true}
      />
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default React.memo(VideoPlayer);
