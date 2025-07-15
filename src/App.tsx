import { useState, useEffect } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import { isValidYouTubeId } from "./utils/youtube";
import RemoveVideo from "./components/RemoveVideo";
import { FaPlay, FaPause, FaPowerOff } from "react-icons/fa";

function App() {
  // 入力中のURLを管理するstate
  const [currentUrl, setCurrentUrl] = useState("");
  // 表示する動画IDの「リスト」を管理するstate
  const [videoIds, setVideoIds] = useState<string[]>([]);
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);
  // スタンバイ状態を管理するstate
  const [standby, setStandby] = useState(false);
  // 再生準備が完了した動画の数をカウントするstate
  const [readyCount, setReadyCount] = useState(0);

  // 再生状態をtrueにする関数
  const handlePlayAll = () => setPlaying(true);
  // 再生状態をfalseにする関数
  const handlePauseAll = () => setPlaying(false);

  // 子コンポーネントから呼ばれるコールバック関数
  const handlePlayerReady = () => {
    // カウントを1増やす
    setReadyCount((count) => count + 1);
  };

  // readyCountを監視するuseEffect
  useEffect(() => {
    // 動画が存在し、かつ準備完了カウントが動画の総数に達したら実行
    if (videoIds.length > 0 && readyCount === videoIds.length) {
      console.log("All players are ready. Pausing now.");
      handlePauseAll();
      setReadyCount(0); // カウンターをリセット
      setStandby(true);
    }
  }, [readyCount, videoIds.length]);

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
          setStandby(false);
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

  // IDを指定して動画を削除する関数
  const handleRemoveVideo = (idToRemove: string) => {
    const newVideoIds = videoIds.filter((id) => id !== idToRemove);
    setVideoIds(newVideoIds);
  };

  return (
    <div className="App">
      <h1>YouTube Sync Viewer</h1>
      {!standby && (
        <button className={styles.playAllButton} onClick={handlePlayAll}>
          <FaPowerOff />
          再生準備 / STANDBY
        </button>
      )}
      {standby && playing && (
        <button className={styles.playAllButton} onClick={handlePauseAll}>
          <FaPause />
          すべて停止 / ALL PAUSE
        </button>
      )}
      {standby && !playing && (
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

      {/* videoIds配列をmapでループ処理し、IDごとにiframeを生成する */}
      <ul className={styles.playerContainer}>
        {videoIds.map((id, index) => (
          <li key={`${id}_${index}`} className={styles.playerItem}>
            <RemoveVideo id={id} onRemoveVideo={handleRemoveVideo} />
            <YouTubePlayer
              id={id}
              playing={playing}
              onPlayerReady={handlePlayerReady}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
