import React from "react";
import styles from "./YouTubePlayer.module.css";
import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  videoIds: string[];
  onRemoveVideo: (id: string) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoIds,
  onRemoveVideo,
}) => {
  // videoIdsが空の配列、または存在しない場合は何も表示しない
  if (!videoIds || videoIds.length === 0) {
    return null;
  }

  return (
    // videoIds配列をmapでループ処理し、IDごとにiframeを生成する
    <ul className={styles.playerContainer}>
      {videoIds.map((id, index) => (
        <li className={styles.playerItem}>
          {index % 2 === 0 && (
            <div
              className={styles.playerRemoveButton}
              onClick={() => onRemoveVideo(id)}
            >
              ✕
            </div>
          )}
          <ReactPlayer
            key={id}
            // refに、配列の各要素をセットするための関数を渡します
            // ref={(el) => {
            //   if (el) playerRefs.current[index] = el;
            // }}
            src={`http://www.youtube.com/watch?v=${id}`}
            // ... 他のオプション
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
