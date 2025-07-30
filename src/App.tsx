import { useState, useRef, createRef, useCallback } from "react";
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
  index: number;
  width: string;
  height: string;
  x: number;
  y: number;
  src: string;
  front: boolean;
}

const baseVideo = {
  width: "560px",
  height: "315px",
  x: 0,
  y: 0,
  src: "",
  front: false,
};

const initialVideos: VideoState[] = Array.from({ length: 2 }, (_, i) => ({
  index: i,
  ...baseVideo,
}));

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
  const handlePlayAll = useCallback(() => setPlaying(true), []);
  const handlePauseAll = useCallback(() => setPlaying(false), []);

  // シーク操作
  const handleJumpSeek = useCallback(() => {
    playerRefs.current.forEach((player) => {
      // playerが存在し、動画の長さ(duration)が取得できている場合のみ実行
      if (player && player.duration) {
        player.currentTime = seek;
      }
    });
  }, [seek]);

  // 対応する入力欄の値を更新する関数
  const handleInputChange = useCallback((index: number, value: string) => {
    setInputValues((currentValues) =>
      currentValues.map((val, i) => (i === index ? value : val))
    );
  }, []);

  // 動画パラメータ更新
  const updateVideoState = useCallback(
    (index: number, newProps: Partial<VideoState>) => {
      setVideoParam((currentVideos) =>
        currentVideos.map((video) =>
          video.index === index ? { ...video, ...newProps } : video
        )
      );
    },
    []
  );

  // 動画を追加する関数
  const handleAddVideo = useCallback(
    (index: number, url: string) => {
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
            updateVideoState(index, { src });
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
    },
    [updateVideoState]
  );

  // ファイルが選択されたときに呼ばれる関数
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setVideoParam((currentVideos) => {
        const video = currentVideos.find((v) => v.index === index);
        if (video && video.src.startsWith("blob:")) {
          URL.revokeObjectURL(video.src);
        }
        return currentVideos.map((video) =>
          video.index === index
            ? {
                ...video,
                src: URL.createObjectURL(file),
              }
            : video
        );
      });
    },
    []
  );

  // インデックスを指定して動画を削除する関数
  const handleRemoveVideo = useCallback((index: number) => {
    setVideoParam((currentVideos) => {
      const videoToRemove = currentVideos.find((v) => v.index === index);
      if (videoToRemove && videoToRemove.src.startsWith("blob:")) {
        URL.revokeObjectURL(videoToRemove.src);
      }
      return currentVideos.map((video) =>
        video.index === index
          ? {
              ...video,
              ...baseVideo,
            }
          : video
      );
    });
    playerRefs.current.splice(index, 1);
    delete nodeRefs.current[index];
  }, []);

  // 動画リサイズ
  const handleResizeVideo = useCallback(
    (index: number, width: string, height: string) => {
      updateVideoState(index, { width, height });
    },
    [updateVideoState]
  );

  // 動画リサイズ終了
  const handleResizeStop = useCallback((index: number, pos: DOMRect) => {
    setVideoParam((currentVideos) => {
      return currentVideos.map((video) =>
        video.index === index
          ? {
              ...video,
              x: pos.left < 0 ? video.x + pos.left * -1 : video.x,
              y: pos.top < 0 ? video.y + pos.top * -1 : video.y,
            }
          : video
      );
    });
  }, []);

  // ドラッグ位置更新
  const handleDragStop = useCallback(
    (index: number, data: DraggableData) => {
      updateVideoState(index, { x: data.x, y: data.y });
    },
    [updateVideoState]
  );

  // 最前面に表示
  const toggleFrontClass = useCallback((index: number) => {
    setVideoParam((currentValues) =>
      currentValues.map((val, i) => ({
        ...val,
        front: i === index,
      }))
    );
  }, []);

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
