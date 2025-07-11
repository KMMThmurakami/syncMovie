import React from "react";
import styles from "./YouTubePlayer.module.css";

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
    <div className={styles.playerContainer}>
      {videoIds.map((id) => (
        <div key={id} className={styles.playerItem}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${id}`}
            title={`YouTube video player ${id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div
            className={styles.playerRemoveButton}
            onClick={() => onRemoveVideo(id)}
          >
            ✕
          </div>
        </div>
      ))}
    </div>
  );
};

export default YouTubePlayer;
