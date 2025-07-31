import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import PlayerButton from "./components/PlayerButton";
import SeekButton from "./components/SeekButton";
import VideoPlayerItem from "./components/VideoPlayerItem";
import { useVideos } from "./hooks/useVideos";
import { usePlayerControls } from "./hooks/usePlayerControls";
import VideoInputPlaceholder from "./components/VideoInputPlaceholder"; // 分割したコンポーネント

function App() {
  // 動画状態管理（src）をまとめたhooks
  const {
    videos,
    inputValues,
    handleAddYouTube,
    handleFileChange,
    handleRemoveVideo,
    handleInputChange,
  } = useVideos();

  // プレイヤー制御（再生、シーク、ref）をまとめたhooks
  const {
    playing,
    setSeek,
    handlePlayAll,
    handlePauseAll,
    handleJumpSeek,
    getPlayerRef,
    clearPlayerRef,
  } = usePlayerControls(videos.length);

  const [frontVideoIndex, setFrontVideoIndex] = useState<number | null>(null);

  const onRemove = (index: number) => {
    handleRemoveVideo(index);
    clearPlayerRef(index); // プレイヤーの参照もクリア
  };

  return (
    <div className="App">
      <h1>Video Sync Viewer</h1>
      <div className={styles.inputContainer}>
        <PlayerButton
          playing={playing}
          handlePauseAll={handlePauseAll}
          handlePlayAll={handlePlayAll}
        />
        <SeekButton setSeek={setSeek} handleJumpSeek={handleJumpSeek} />
      </div>

      <ul className={styles.playerContainer}>
        {videos.map((src: string, index: number) => (
          <li
            key={`video_${index}`}
            className={!src ? styles.playerNoLoad : styles.playerItemWrap}
          >
            {!src ? (
              <VideoInputPlaceholder
                index={index}
                inputValue={inputValues[index]}
                onInputChange={handleInputChange}
                onAddYouTube={handleAddYouTube}
                onFileChange={handleFileChange}
              />
            ) : (
              <VideoPlayerItem
                src={src}
                index={index}
                playing={playing}
                isFront={frontVideoIndex === index}
                onRemove={onRemove}
                onBringToFront={setFrontVideoIndex}
                playerRef={getPlayerRef(index)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
