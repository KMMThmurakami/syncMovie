import { useState, useRef, useCallback } from "react";
import "./App.css";
import styles from "./App.module.css";
import PlayerButton from "./components/PlayerButton";
import SeekButton from "./components/SeekButton";
import InputYouTube from "./components/InputYouTube";
import InputFile from "./components/InputFile";
import VideoPlayerItem from "./components/VideoPlayerItem";
import ReactPlayer from "react-player";

export interface VideoInfo {
  index: number;
  src: string;
}

const initialVideos: VideoInfo[] = Array.from({ length: 2 }, (_, i) => ({
  index: i,
  src: "",
}));

function App() {
  const [playing, setPlaying] = useState(false);
  const [inputValues, setInputValues] = useState<string[]>(["", ""]);
  const [videos, setVideos] = useState<VideoInfo[]>(initialVideos);
  const [frontVideoIndex, setFrontVideoIndex] = useState<number | null>(null);

  const [seek, setSeek] = useState(0);
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ----------------------------------------------------------
  // 全体操作
  const handlePlayAll = useCallback(() => setPlaying(true), []);
  const handlePauseAll = useCallback(() => setPlaying(false), []);

  const handleJumpSeek = useCallback(() => {
    playerRefs.current.forEach((player) => {
      if (player?.duration) {
        player.currentTime = seek;
      }
    });
  }, [seek]);

  // ----------------------------------------------------------
  // 動画の追加・削除
  const updateVideoSrc = useCallback((index: number, src: string) => {
    setVideos((currentVideos) =>
      currentVideos.map((v) => (v.index === index ? { ...v, src } : v))
    );
    // URL入力欄をクリア
    if (src.startsWith("http")) {
      setInputValues((current) =>
        current.map((val, i) => (i === index ? "" : val))
      );
    }
  }, []);

  const handleAddYouTube = useCallback(
    (index: number, url: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (!url || !ReactPlayer.canPlay(url)) {
        alert("無効なYouTube URLです。");
        return;
      }
      updateVideoSrc(index, url);
    },
    [updateVideoSrc]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 既存のBlob URLがあれば破棄
      const oldVideo = videos.find((v) => v.index === index);
      if (oldVideo?.src.startsWith("blob:")) {
        URL.revokeObjectURL(oldVideo.src);
      }

      const fileUrl = URL.createObjectURL(file);
      updateVideoSrc(index, fileUrl);
    },
    [videos, updateVideoSrc]
  );

  const handleRemoveVideo = useCallback(
    (index: number) => {
      updateVideoSrc(index, "");
      const videoToRemove = videos.find((v) => v.index === index);
      if (videoToRemove?.src.startsWith("blob:")) {
        URL.revokeObjectURL(videoToRemove.src);
      }
      playerRefs.current[index] = null;
    },
    [videos, updateVideoSrc]
  );

  const handleInputChange = useCallback((index: number, value: string) => {
    setInputValues((current) =>
      current.map((val, i) => (i === index ? value : val))
    );
  }, []);

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
      </div>

      <ul className={styles.playerContainer}>
        {videos.map((video) => (
          <li
            key={`video_${video.index}`}
            className={!video.src ? styles.playerNoLoad : styles.playerItemWrap}
          >
            {!video.src ? (
              <div>
                {video.index === 0 && (
                  <>
                    <InputYouTube
                      index={video.index}
                      inputValues={inputValues}
                      handleInputChange={handleInputChange}
                      handleAddVideo={handleAddYouTube}
                    />
                    <p className={styles.note}>OR</p>
                  </>
                )}
                <InputFile
                  index={video.index}
                  handleFileChange={handleFileChange}
                />
              </div>
            ) : (
              <VideoPlayerItem
                video={video}
                playing={playing}
                isFront={frontVideoIndex === video.index}
                onRemove={handleRemoveVideo}
                onBringToFront={setFrontVideoIndex}
                playerRef={(el) => (playerRefs.current[video.index] = el)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
