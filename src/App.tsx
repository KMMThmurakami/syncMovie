import { useState, useRef, useCallback } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import { isValidYouTubeId } from "./utils/youtube";
import RemoveVideo from "./components/RemoveVideo";
import { FaPlay, FaPause } from "react-icons/fa";

function App() {
  // 入力中のURLを管理するstate
  const [currentUrl, setCurrentUrl] = useState("");
  // 表示する動画IDの「リスト」を管理するstate
  const [videoIds, setVideoIds] = useState<string[]>([]);
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);

  // 再生状態をtrueにする関数
  const handlePlayAll = () => setPlaying(true);
  // 再生状態をfalseにする関数
  const handlePauseAll = () => setPlaying(false);

  // シーク関連
  const [state, setState] = useState<number>(0);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState(() => Number.parseFloat(inputTarget.value));
  };

  const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    if (playerRef.current) {
      playerRef.current.currentTime =
        Number.parseFloat(inputTarget.value) * playerRef.current.duration;
    }
  };

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  // 動画を追加する関数
  const handleAddVideo = async () => {
    // URLが空なら何もしない
    if (!currentUrl) return;

    try {
      const urlObject = new URL(currentUrl);
      const id = urlObject.searchParams.get("v");

      // IDが取得できる場合のみ追加
      if (id) {
        // videoIdをstateにセットする前に、IDが有効かチェック
        const isValid = await isValidYouTubeId(id);

        if (isValid) {
          setVideoIds([...videoIds, id]);
          setCurrentUrl("");
        } else {
          alert("存在しない、または非公開の動画IDです。");
        }
      } else {
        alert("有効なYouTubeのURLではありません。");
      }
    } catch (error) {
      console.error(error);
      alert("URLの形式が正しくありません。");
    }
  };

  // インデックスを指定して動画を削除する関数
  const handleRemoveVideo = (indexToRemove: number) => {
    setVideoIds((newVideoIds) =>
      newVideoIds.filter((_id, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="App">
      <h1>YouTube Sync Viewer</h1>
      {playing && (
        <button className={styles.playAllButton} onClick={handlePauseAll}>
          <FaPause />
          すべて停止 / ALL PAUSE
        </button>
      )}
      {!playing && (
        <button className={styles.playAllButton} onClick={handlePlayAll}>
          <FaPlay />
          すべて再生 / ALL PLAY
        </button>
      )}

      <div className={styles.inputContainer}>
        <input
          className={styles.urlTextInput}
          type="text"
          placeholder="YouTube動画のURLを貼り付け"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
        />
        <button onClick={handleAddVideo} className={styles.addButton}>
          追加
        </button>
      </div>
      <div>
        <div>Seek</div>
        <div>
          <input
            type="range"
            min={0}
            max={0.999999}
            value={state}
            step="any"
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>
      {/* videoIds配列をmapでループ処理し、IDごとにiframeを生成する */}
      <ul className={styles.playerContainer}>
        {videoIds.map((id, index) => (
          <li key={`${id}_${index}`} className={styles.playerItem}>
            <RemoveVideo index={index} onRemoveVideo={handleRemoveVideo} />
            <YouTubePlayer id={id} playing={playing} ref={setPlayerRef} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
