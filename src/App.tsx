import { useState, useRef, createRef } from "react";
import "./App.css";
import styles from "./App.module.css";
import YouTubePlayer from "./components/YouTubePlayer";
import VideoSubMenu from "./components/VideoSubMenu";
import PlayerButton from "./components/PlayerButton";
import SeekButton from "./components/SeekButton";
import InputYouTube from "./components/InputYouTube";
import InputFile from "./components/InputFile";
import { Resizable } from "re-resizable";
import Draggable, { type DraggableData } from "react-draggable";
import ReactPlayer from "react-player";

export interface VideoState {
  width: string;
  height: string;
  x: number;
  y: number;
  src: string;
  front: boolean;
}

const initialVideos: VideoState[] = [
  { width: "560px", height: "315px", x: 0, y: 0, src: "", front: false },
  { width: "560px", height: "315px", x: 0, y: 0, src: "", front: false },
];

function App() {
  // 全ての動画の再生状態を管理するstate
  const [playing, setPlaying] = useState(false);
  // 入力中のURLを管理するstate
  const [inputValues, setInputValues] = useState<string[]>(["", ""]);
  // 動画パラメータ
  const [videoParam, setVideoParam] = useState<VideoState[]>(initialVideos);

  // シーク関連
  const [seek, setSeek] = useState(0);
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
    setVideoParam((currentValues) =>
      currentValues.map((val, i) =>
        i === index
          ? {
              width: val.width,
              height: val.height,
              x: val.x,
              y: val.y,
              src: newUrl,
              front: val.front,
            }
          : val
      )
    );
  };

  // 動画を追加する関数
  const handleAddVideo = (index: number, url: string) => {
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
      const oldUrl = videoParam[index].src;
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
    if (!videoParam[indexToRemove].src.includes("www.youtube.com")) {
      URL.revokeObjectURL(videoParam[indexToRemove].src);
    }
    setVideoParam((currentValues) =>
      currentValues.map((val, i) =>
        i === indexToRemove
          ? {
              width: "560px",
              height: "315px",
              x: 0,
              y: 0,
              src: "",
              front: false,
            }
          : val
      )
    );
    playerRefs.current.splice(indexToRemove, 1);
    delete nodeRefs.current[indexToRemove];
  };

  // 動画リサイズ
  const handleResizeVideo = (index: number, width: string, height: string) => {
    setVideoParam((currentValues) =>
      currentValues.map((val, i) =>
        i === index
          ? {
              width,
              height,
              x: val.x,
              y: val.y,
              src: val.src,
              front: val.front,
            }
          : val
      )
    );
  };

  // 動画リサイズ終了
  const handleResizeStop = (index: number, pos: DOMRect) => {
    // 表示位置を調整
    const newPosition = videoParam[index];
    if (pos.left < 0) newPosition.x = newPosition.x + pos.left * -1;
    if (pos.top < 0) newPosition.y = newPosition.y + pos.top * -1;
    setVideoParam((currentValues) =>
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
    setVideoParam((currentValues) =>
      currentValues.map((val, i) =>
        i === index
          ? {
              width: val.width,
              height: val.height,
              x: data.x,
              y: data.y,
              src: val.src,
              front: val.front,
            }
          : val
      )
    );
  };

  // 最前面に表示
  const toggleFrontClass = (index: number) => {
    setVideoParam((currentValues) =>
      currentValues.map((val, i) =>
        i === index
          ? {
              width: val.width,
              height: val.height,
              x: val.x,
              y: val.y,
              src: val.src,
              front: true,
            }
          : {
              width: val.width,
              height: val.height,
              x: val.x,
              y: val.y,
              src: val.src,
              front: false,
            }
      )
    );
  };

  return (
    <div className="App">
      <h1>Video Sync Viewer</h1>
      <div className={`${styles.inputContainer}`}>
        <PlayerButton
          playing={playing}
          handlePauseAll={handlePauseAll}
          handlePlayAll={handlePlayAll}
        />
        <SeekButton setSeek={setSeek} handleJumpSeek={handleJumpSeek} />
      </div>

      <ul className={styles.playerContainer}>
        {videoParam.map((video, index) => {
          if (!nodeRefs.current[index]) {
            nodeRefs.current[index] =
              createRef() as React.RefObject<HTMLDivElement>;
          }
          const nodeRef = nodeRefs.current[index];

          return (
            <li
              key={`video_${index}`}
              className={
                video.src === "" || video.src === null
                  ? styles.playerNoLoad
                  : styles.playerItemWrap
              }
            >
              {video.src === "" || video.src === null ? (
                <div>
                  {/* YouTube動画の複数同時再生は規約違反になるため1つしか選択させない */}
                  {index === 0 && (
                    <>
                      <InputYouTube
                        index={index}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        handleAddVideo={handleAddVideo}
                      />
                      <p className={styles.note}>OR</p>
                    </>
                  )}
                  <InputFile
                    index={index}
                    handleFileChange={handleFileChange}
                  />
                </div>
              ) : (
                <Draggable
                  nodeRef={nodeRef}
                  handle=".drag-handle"
                  bounds="body"
                  position={videoParam[index]}
                  onStop={(_e, data) => handleDragStop(index, data)}
                >
                  <div
                    ref={nodeRef}
                    className={
                      videoParam[index].front
                        ? `${styles.playerItem} ${styles.front}`
                        : `${styles.playerItem}`
                    }
                  >
                    <VideoSubMenu
                      index={index}
                      toggleFrontClass={toggleFrontClass}
                      onRemoveVideo={handleRemoveVideo}
                      handleResizeVideo={handleResizeVideo}
                    />
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
                        src={video.src}
                        playing={playing}
                        width={videoParam[index].width}
                        height={videoParam[index].height}
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
