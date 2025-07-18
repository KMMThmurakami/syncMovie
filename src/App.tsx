import { useState, useRef } from "react";
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
  const [videoIds, setVideoIds] = useState<string[]>(["", ""]);
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);

  // 再生状態をtrueにする関数
  const handlePlayAll = () => setPlaying(true);
  // 再生状態をfalseにする関数
  const handlePauseAll = () => setPlaying(false);

  // シーク関連
  const [seek, setSeek] = useState(0);
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   const inputTarget = event.target as HTMLInputElement;
  //   const seekTimeFraction = Number(inputTarget.value);
  //   console.log(seekTimeFraction);

  //   playerRefs.current.forEach((player) => {
  //     // playerが存在し、動画の長さ(duration)が取得できている場合のみ実行
  //     if (player && player.duration) {
  //       player.currentTime = seekTimeFraction * player.duration;
  //     }
  //   });
  // };

  const handleJumpSeek = () => {
    const seekTimeFraction = seek;

    playerRefs.current.forEach((player) => {
      // playerが存在し、動画の長さ(duration)が取得できている場合のみ実行
      if (player && player.duration) {
        player.currentTime = seekTimeFraction;
      }
    });
  };

  const updateVideoId = (index: number, newId: string) => {
    setVideoIds((currentIds) =>
      currentIds.map((id, i) => (i === index ? newId : id))
    );
  };

  // 動画を追加する関数
  const handleAddVideo = async (index: number) => {
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
          updateVideoId(index, id);
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
    setVideoIds((currentIds) =>
      currentIds.map((id, i) => (i === indexToRemove ? "" : id))
    );
    playerRefs.current.splice(indexToRemove, 1);
  };

  return (
    <div className="App">
      <h1>YouTube Sync Viewer</h1>
      <div className={`${styles.inputContainer}`}>
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
        <input
          name="seek"
          type="number"
          min={0}
          max={9999}
          onChange={(e) => setSeek(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && handleJumpSeek()}
          className={styles.numberInput}
          placeholder="秒数を入力..."
        />
        <button onClick={handleJumpSeek} className={styles.jumpButton}>
          秒にジャンプ
        </button>
      </div>

      <ul className={styles.playerContainer}>
        {videoIds[0] === "" || videoIds[0] === null ? (
          <li className={styles.playerNoLoad}>
            <div className={styles.inputContainer}>
              <input
                name="videoSrc"
                className={styles.urlTextInput}
                type="text"
                placeholder="YouTube動画のURLを貼り付け"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVideo(0)}
              />
              <button
                onClick={() => handleAddVideo(0)}
                className={styles.addButton}
              >
                追加
              </button>
            </div>
          </li>
        ) : (
          <li key={`${videoIds[0]}_0`} className={styles.playerItem}>
            <RemoveVideo index={0} onRemoveVideo={handleRemoveVideo} />
            <YouTubePlayer
              id={`${videoIds[0]}`}
              playing={playing}
              ref={(el) => (playerRefs.current[0] = el)}
            />
          </li>
        )}
        {videoIds[1] === "" ? (
          <li className={styles.playerNoLoad}>
            <div className={styles.inputContainer}>
              <input
                name="videoSrc"
                className={styles.urlTextInput}
                type="text"
                placeholder="YouTube動画のURLを貼り付け"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVideo(1)}
              />
              <button
                onClick={() => handleAddVideo(1)}
                className={styles.addButton}
              >
                追加
              </button>
            </div>
          </li>
        ) : (
          <li key={`${videoIds[1]}_1`} className={styles.playerItem}>
            <RemoveVideo index={1} onRemoveVideo={handleRemoveVideo} />
            <YouTubePlayer
              id={`${videoIds[1]}`}
              playing={playing}
              ref={(el) => (playerRefs.current[1] = el)}
            />
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
