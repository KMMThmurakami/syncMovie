import { useState, useRef, createRef } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import { isValidYouTubeUrl } from "./utils/youtube";
import RemoveVideo from "./components/RemoveVideo";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMoveSharp } from "react-icons/io5";
import { Resizable } from "re-resizable";
import Draggable from "react-draggable";

function App() {
  // 入力中のURLを管理するstate
  const [inputValues, setInputValues] = useState<string[]>(["", ""]);
  // 表示する動画の「リスト」を管理するstate
  const [videoUrls, setVideoUrls] = useState<string[]>(["", ""]);
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);

  // 再生状態をtrueにする関数
  const handlePlayAll = () => setPlaying(true);
  // 再生状態をfalseにする関数
  const handlePauseAll = () => setPlaying(false);

  // 動画ウィンドウサイズ
  const [flexWidth, setFlexWidth] = useState<string[]>(["560px", "560px"]);
  const [flexHeight, setFlexHeight] = useState<string[]>(["315px", "315px"]);

  // シーク関連
  const [seek, setSeek] = useState(0);
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ドラッグ関連
  const nodeRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  );

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

  const updateVideoUrl = (index: number, newUrl: string) => {
    setVideoUrls((currentIds) =>
      currentIds.map((url, i) => (i === index ? newUrl : url))
    );
  };

  // 動画を追加する関数
  const handleAddVideo = async (index: number, url: string) => {
    // URLが空なら何もしない
    if (!url) return;

    try {
      const urlObject = new URL(url);
      const src = urlObject.href;
      const hostname = urlObject.hostname;

      if (hostname === "www.youtube.com") {
        const isValid = await isValidYouTubeUrl(urlObject);

        if (isValid) {
          updateVideoUrl(index, src);
          setInputValues((currentValues) =>
            currentValues.map((val, i) => (i === index ? "" : val))
          );
        } else {
          alert("存在しない、または非公開のYouTube動画IDです。");
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
    if (!videoUrls[indexToRemove].includes("www.youtube.com")) {
      URL.revokeObjectURL(videoUrls[indexToRemove]);
    }
    setVideoUrls((currentIds) =>
      currentIds.map((url, i) => (i === indexToRemove ? "" : url))
    );
    playerRefs.current.splice(indexToRemove, 1);
    delete nodeRefs.current[indexToRemove];
  };

  // 対応する入力欄の値を更新する関数
  const handleInputChange = (index: number, value: string) => {
    setInputValues((currentValues) =>
      currentValues.map((val, i) => (i === index ? value : val))
    );
  };

  // 動画リサイズ
  const handleResizeVideo = (index: number, width: string, height: string) => {
    setFlexWidth((currentValues) =>
      currentValues.map((val, i) => (i === index ? width : val))
    );
    setFlexHeight((currentValues) =>
      currentValues.map((val, i) => (i === index ? height : val))
    );
  };

  // ファイルが選択されたときに呼ばれる関数
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      // 既存のURLがあれば解放する
      videoUrls.map((url) => {
        if (url && !url.includes("www.youtube.com")) {
          URL.revokeObjectURL(url);
        }
      });
      // 新しいURLを生成してstateにセット
      const src = URL.createObjectURL(file);
      updateVideoUrl(index, src);
    }
  };

  return (
    <div className="App">
      <h1>Video Sync Viewer</h1>
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
          defaultValue={0}
          placeholder="秒数を入力..."
        />
        <button onClick={handleJumpSeek}>秒にジャンプ</button>
      </div>

      <ul className={styles.playerContainer}>
        {videoUrls.map((url, index) => {
          if (!nodeRefs.current[index]) {
            nodeRefs.current[index] =
              createRef() as React.RefObject<HTMLDivElement>;
          }
          const nodeRef = nodeRefs.current[index];

          return (
            <li
              key={`video_${index}`}
              className={
                url === "" || url === null
                  ? styles.playerNoLoad
                  : styles.playerItemWrap
              }
            >
              {url === "" || url === null ? (
                <div className={styles.inputContainerMovie}>
                  <div className={styles.inputContainer}>
                    <input
                      name="videoSrc"
                      className={styles.urlTextInput}
                      type="text"
                      placeholder="YouTube動画のURLを貼り付け"
                      value={inputValues[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleAddVideo(index, inputValues[index])
                      }
                    />
                    <button
                      onClick={() => handleAddVideo(index, inputValues[index])}
                    >
                      追加
                    </button>
                  </div>
                  {/* <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleFileChange(event, index)}
                  /> */}
                  <div className={styles.fileInputContainer}>
                    <input
                      type="file"
                      id="custom-file-input"
                      onChange={(event) => handleFileChange(event, index)}
                    />
                    <label
                      className={styles.fileInputLabel}
                      htmlFor="custom-file-input"
                    >
                      端末からファイルを選ぶ
                    </label>
                  </div>
                </div>
              ) : (
                <Draggable
                  nodeRef={nodeRef}
                  handle=".drag-handle"
                  bounds="body"
                >
                  <div ref={nodeRef} className={styles.playerItem}>
                    <div className={styles.movieSubMenu}>
                      <div className={`drag-handle ${styles.moveButton}`}>
                        <IoMoveSharp />
                      </div>
                      <RemoveVideo
                        index={index}
                        onRemoveVideo={handleRemoveVideo}
                      />
                    </div>
                    <Resizable
                      defaultSize={{
                        width: 560,
                        height: 315,
                      }}
                      onResize={(_e, _d, el) => {
                        handleResizeVideo(
                          index,
                          el.style.width,
                          el.style.height
                        );
                      }}
                    >
                      <YouTubePlayer
                        src={url}
                        playing={playing}
                        width={flexWidth[index]}
                        height={flexHeight[index]}
                        ref={(el) => (playerRefs.current[index] = el)}
                      />
                    </Resizable>
                  </div>
                </Draggable>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
