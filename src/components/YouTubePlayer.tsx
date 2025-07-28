import { forwardRef } from "react";
import ReactPlayer from "react-player";

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
      <ReactPlayer
        style={{ backgroundColor: "#eeeeee" }}
        ref={ref} // 受け取ったrefをReactPlayerに渡す
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

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
