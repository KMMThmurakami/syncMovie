import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";

function App() {
  // ① 入力中のURLを管理するstate
  const [currentUrl, setCurrentUrl] = useState("");
  // ② 表示する動画IDの「リスト」を管理するstate
  const [videoIds, setVideoIds] = useState<string[]>([]);

  // 動画を追加する関数
  const handleAddVideo = () => {
    // URLが空なら何もしない
    if (!currentUrl) return;

    try {
      const urlObject = new URL(currentUrl);
      const id = urlObject.searchParams.get("v");

      // IDが取得でき、かつまだリストにない場合のみ追加
      if (id && !videoIds.includes(id)) {
        setVideoIds([...videoIds, id]);
        setCurrentUrl(""); // 追加に成功したら入力欄をクリア
      } else {
        alert("有効なYouTubeのURLではないか、既に追加されています。");
      }
    } catch (error) {
      console.error(error);
      alert("URLの形式が正しくありません。");
    }
  };

  return (
    <div className="App">
      <h1>YouTube Viewer</h1>
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

      <YouTubePlayer videoIds={videoIds} />
    </div>
  );
}

export default App;
