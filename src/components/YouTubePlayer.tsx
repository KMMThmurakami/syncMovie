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
  onPlayerReady: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  id,
  playing,
  onPlayerReady,
}) => {
  // 準備ができたかどうかを管理する内部state
  const [isReady, setIsReady] = useState(false);

  // onPlayingイベントハンドラ
  const handleOnPlaying = () => {
    // まだ準備完了通知を送っていない場合のみ実行
    if (!isReady) {
      console.log(`Player ${id} is ready.`);
      onPlayerReady(); // 親コンポーネントに通知
      setIsReady(true); // 通知済みフラグを立てる
    }
  };

  return (
    <MediaController>
      <ReactPlayer
        slot="media"
        src={`https://www.youtube.com/watch?v=${id}`}
        onPlaying={handleOnPlaying}
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
