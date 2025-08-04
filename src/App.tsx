import { useCallback, useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import PlayerButton from "./components/PlayerButton";
import SeekButton from "./components/SeekButton";
import VideoPlayerItem from "./components/VideoPlayerItem";
import { useVideos } from "./hooks/useVideos";
import { usePlayerControls } from "./hooks/usePlayerControls";
import VideoInputPlaceholder from "./components/VideoInputPlaceholder"; // 分割したコンポーネント
import SubMenuVisibleButton from "./components/SubMenuVisibleButton";

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
    volumes,
    handleVolumeChange,
    setSeek,
    handlePlayAll,
    handlePauseAll,
    subMenuVisible,
    handleJumpSeek,
    handleToggleSubMenu,
    getPlayerRef,
    clearPlayerRef,
  } = usePlayerControls(videos.length);

  const [frontVideoIndex, setFrontVideoIndex] = useState<number | null>(null);

  // 前後切り替え
  const handleToggleFront = useCallback(
    (clickedIndex: number) => {
      // クリックされた動画が既に最前面なら、もう一方を最前面にする
      if (frontVideoIndex === clickedIndex) {
        const otherIndex = videos.findIndex(
          (src, i) => src && i !== clickedIndex
        );
        setFrontVideoIndex(otherIndex);
      } else {
        // 最前面でなければ、クリックされた動画を最前面にする
        setFrontVideoIndex(clickedIndex);
      }
    },
    [frontVideoIndex, videos]
  );

  // ドラッグ時は最前面
  const handleBringToFrontOnDrag = useCallback((index: number) => {
    setFrontVideoIndex(index);
  }, []);

  const onRemove = useCallback(
    (index: number) => {
      handleRemoveVideo(index);
      clearPlayerRef(index); // プレイヤーの参照もクリア
    },
    [clearPlayerRef, handleRemoveVideo]
  );

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
        <SubMenuVisibleButton
          subMenuVisible={subMenuVisible}
          handleToggleSubMenu={handleToggleSubMenu}
        />
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
                subMenuVisible={subMenuVisible}
                onRemove={onRemove}
                onBringToFrontOnDrag={handleBringToFrontOnDrag}
                onToggleFront={handleToggleFront}
                playerRef={getPlayerRef(index)}
                volume={volumes[index] ?? 0.0}
                onVolumeChange={handleVolumeChange}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
