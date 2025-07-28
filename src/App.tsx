import { useState, useRef, createRef } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import RemoveVideo from "./components/RemoveVideo";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMoveSharp } from "react-icons/io5";
import { RiBringToFront } from "react-icons/ri";
import { Resizable } from "re-resizable";
import Draggable, { type DraggableData } from "react-draggable";
import ReactPlayer from "react-player";

function App() {
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);
  // 入力中のURLを管理するstate
  const [inputValues, setInputValues] = useState<string[]>(["", ""]);
  // 表示する動画のリストを管理するstate
  const [videoUrls, setVideoUrls] = useState<string[]>(["", ""]);
  // 動画ウィンドウサイズ
  const [windowSize, setWindowSize] = useState([
    { width: "560px", height: "315px" },
    { width: "560px", height: "315px" },
  ]);
  // ドラッグ関連
  const [position, setPosition] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  // シーク関連
  const [seek, setSeek] = useState(0);
  // 最前面に表示
  const [front, setFront] = useState<boolean[]>([true, false]);

  // シーク関連のRef
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // ドラッグ関連のRef
  const nodeRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  );

  // ----------------------------------------------------------
  // 再生状態の切り替え
  const handlePlayAll = () => setPlaying(true);
  const handlePauseAll = () => setPlaying(false);

  // 対応する入力欄の値を更新する関数
  const handleInputChange = (index: number, value: string) => {
    setInputValues((currentValues) =>
      currentValues.map((val, i) => (i === index ? value : val))
    );
  };

  // 読み込み動画リスト更新
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const isValid = ReactPlayer.canPlay(src);

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

  // ファイルが選択されたときに呼ばれる関数
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      // もし同じスロットに既にローカル動画があれば、古いURLを解放する
      const oldUrl = videoUrls[index];
      if (oldUrl && !oldUrl.includes("youtube.com")) {
        URL.revokeObjectURL(oldUrl);
      }
      // 新しいURLを生成してstateにセット
      const src = URL.createObjectURL(file);
      updateVideoUrl(index, src);
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
    setPosition((currentValues) =>
      currentValues.map((val, i) =>
        i === indexToRemove ? { x: 0, y: 0 } : val
      )
    );
    playerRefs.current.splice(indexToRemove, 1);
    delete nodeRefs.current[indexToRemove];
  };

  // 動画リサイズ
  const handleResizeVideo = (index: number, width: string, height: string) => {
    setWindowSize((currentValues) =>
      currentValues.map((val, i) => (i === index ? { width, height } : val))
    );
  };

  // 動画リサイズ終了
  const handleResizeStop = (index: number, pos: DOMRect) => {
    // 表示位置を調整
    const newPosition = position[index];
    if (pos.left < 0) newPosition.x = newPosition.x + pos.left * -1;
    if (pos.top < 0) newPosition.y = newPosition.y + pos.top * -1;
    setPosition((currentValues) =>
      currentValues.map((val, i) => (i === index ? newPosition : val))
    );
  };

  // シーク操作
  const handleJumpSeek = () => {
    const seekTimeFraction = seek;
    playerRefs.current.forEach((player) => {
      // playerが存在し、動画の長さ(duration)が取得できている場合のみ実行
      if (player && player.duration) {
        player.currentTime = seekTimeFraction;
      }
    });
  };

  // ドラッグ位置更新
  const handleDragStop = (index: number, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition((currentValues) =>
      currentValues.map((val, i) => (i === index ? newPosition : val))
    );
  };

  // 最前面に表示
  const toggleFrontClass = (index: number) => {
    setFront((currentValues) =>
      currentValues.map((_, i) => (i === index ? true : false))
    );
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
                  {/* YouTube動画の複数同時再生は規約違反になるため1つしか選択させない */}
                  {index === 0 && (
                    <>
                      <div className={styles.inputContainer}>
                        <input
                          name="videoSrc"
                          className={styles.urlTextInput}
                          type="text"
                          placeholder="YouTube動画のURLを貼り付け"
                          value={inputValues[index]}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleAddVideo(index, inputValues[index])
                          }
                        />
                        <button
                          onClick={() =>
                            handleAddVideo(index, inputValues[index])
                          }
                        >
                          追加
                        </button>
                      </div>
                      <p className={styles.note}>OR</p>
                    </>
                  )}
                  <div className={styles.fileInputContainer}>
                    <input
                      type="file"
                      id={`custom-file-input-${index}`}
                      onChange={(event) => handleFileChange(event, index)}
                    />
                    <label
                      className={styles.fileInputLabel}
                      htmlFor={`custom-file-input-${index}`}
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
                  position={position[index]}
                  onStop={(_e, data) => handleDragStop(index, data)}
                >
                  <div
                    ref={nodeRef}
                    className={
                      front[index]
                        ? `${styles.playerItem} ${styles.front}`
                        : `${styles.playerItem}`
                    }
                  >
                    <div className={styles.movieSubMenu}>
                      <div className={`drag-handle ${styles.videoMenuButton}`}>
                        <IoMoveSharp />
                      </div>
                      <div
                        className={styles.videoMenuButton}
                        onClick={() => {
                          toggleFrontClass(index);
                        }}
                      >
                        <RiBringToFront />
                      </div>
                      <RemoveVideo
                        index={index}
                        onRemoveVideo={handleRemoveVideo}
                        handleResizeVideo={handleResizeVideo}
                      />
                    </div>
                    <Resizable
                      defaultSize={{
                        width: 560,
                        height: 315,
                      }}
                      maxWidth={screen.width}
                      maxHeight={screen.height}
                      onResize={(_e, _d, el) => {
                        handleResizeVideo(
                          index,
                          el.style.width,
                          el.style.height
                        );
                      }}
                      onResizeStop={(_e, _d, el) => {
                        const pos = el.getBoundingClientRect();
                        handleResizeStop(index, pos);
                      }}
                    >
                      <YouTubePlayer
                        src={url}
                        playing={playing}
                        width={windowSize[index].width}
                        height={windowSize[index].height}
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
