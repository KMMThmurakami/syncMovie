import React from "react";
import styles from "./YouTubePlayer.module.css";
import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  videoIds: string[];
  onRemoveVideo: (id: string) => void;
  playing: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoIds,
  onRemoveVideo,
  playing,
}) => {
  // videoIdsが空の配列、または存在しない場合は何も表示しない
  if (!videoIds || videoIds.length === 0) {
    return null;
  }

  // const onReady = () => {
  //   console.log("onReady");
  // };

  return (
    // videoIds配列をmapでループ処理し、IDごとにiframeを生成する
    <ul className={styles.playerContainer}>
      {videoIds.map((id, index) => (
        <li key={id} className={styles.playerItem}>
          {index % 2 === 0 && (
            <div
              className={styles.playerRemoveButton}
              onClick={() => onRemoveVideo(id)}
            >
              ✕
            </div>
          )}
          <ReactPlayer
            src={`https://www.youtube.com/watch?v=${id}`}
            // onReady={onReady}
            width="560px"
            height="315px"
            playing={playing}
            controls={true}
            muted={true}
          />
          {index % 2 !== 0 && (
            <div
              className={styles.playerRemoveButton}
              onClick={() => onRemoveVideo(id)}
            >
              ✕
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default YouTubePlayer;
