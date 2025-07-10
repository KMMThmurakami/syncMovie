import React from "react";
import styles from "./YouTubePlayer.module.css";

interface YouTubePlayerProps {
  videoIds: string[];
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoIds }) => {
  // videoIdsが空の配列、または存在しない場合は何も表示しない
  if (!videoIds || videoIds.length === 0) {
    return null;
  }

  return (
    // videoIds配列をmapでループ処理し、IDごとにiframeを生成する
    <div className={styles.playerContainer}>
      {videoIds.map((id) => (
        // Reactでリスト表示する際は、一意な 'key' を指定することが重要
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
        </div>
      ))}
    </div>
  );
};

export default YouTubePlayer;
