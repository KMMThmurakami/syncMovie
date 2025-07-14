import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import { isValidYouTubeId } from "./utils/youtube";

function App() {
  // ① 入力中のURLを管理するstate
  const [currentUrl, setCurrentUrl] = useState("");
  // ② 表示する動画IDの「リスト」を管理するstate
  const [videoIds, setVideoIds] = useState<string[]>([]);

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

  // IDを指定して動画を削除する関数
  const handleRemoveVideo = (idToRemove: string) => {
    const newVideoIds = videoIds.filter((id) => id !== idToRemove);
    setVideoIds(newVideoIds);
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

      <YouTubePlayer videoIds={videoIds} onRemoveVideo={handleRemoveVideo} />
    </div>
  );
}

export default App;
