// hooks/useVideos.ts
import { useState, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

const INITIAL_VIDEO_COUNT = 2;

export const useVideos = () => {
  const [videos, setVideos] = useState<string[]>(
    Array(INITIAL_VIDEO_COUNT).fill("")
  );
  const [inputValues, setInputValues] = useState<string[]>(
    Array(INITIAL_VIDEO_COUNT).fill("")
  );

  const updateVideoSrc = useCallback(
    (index: number, src: string) => {
      // 既存のBlob URLがあれば破棄
      const oldSrc = videos[index];
      if (oldSrc.startsWith("blob:")) {
        URL.revokeObjectURL(oldSrc);
      }

      setVideos((current) => current.map((v, i) => (i === index ? src : v)));

      if (src.startsWith("http")) {
        setInputValues((current) =>
          current.map((val, i) => (i === index ? "" : val))
        );
      }
    },
    [videos]
  ); // `videos` への依存は古いblob URLの破棄に必要

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
      const fileUrl = URL.createObjectURL(file);
      updateVideoSrc(index, fileUrl);
    },
    [updateVideoSrc]
  );

  const handleRemoveVideo = useCallback(
    (index: number) => {
      updateVideoSrc(index, "");
    },
    [updateVideoSrc]
  );

  const handleInputChange = useCallback((index: number, value: string) => {
    setInputValues((current) =>
      current.map((val, i) => (i === index ? value : val))
    );
  }, []);

  // コンポーネントのアンマウント時に全てのBlob URLをクリーンアップ
  useEffect(() => {
    return () => {
      videos.forEach((src) => {
        if (src.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      });
    };
  }, [videos]);

  return {
    videos,
    inputValues,
    handleAddYouTube,
    handleFileChange,
    handleRemoveVideo,
    handleInputChange,
  };
};
