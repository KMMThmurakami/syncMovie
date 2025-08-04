import { useState, useCallback } from "react";
import ReactPlayer from "react-player";

const INITIAL_VIDEO_COUNT = 2;

export const useVideos = () => {
  const [videos, setVideos] = useState<string[]>(
    Array(INITIAL_VIDEO_COUNT).fill("")
  );
  const [inputValues, setInputValues] = useState<string[]>(
    Array(INITIAL_VIDEO_COUNT).fill("")
  );

  const updateVideoSrc = useCallback((index: number, src: string) => {
    setVideos((currentVideos) => {
      const oldSrc = currentVideos[index];
      // If the old source was a blob URL, revoke it to prevent memory leaks.
      if (oldSrc && oldSrc.startsWith("blob:")) {
        URL.revokeObjectURL(oldSrc);
      }

      // Create a new array with the updated source.
      const newVideos = [...currentVideos];
      newVideos[index] = src;
      return newVideos;
    });

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

  return {
    videos,
    inputValues,
    handleAddYouTube,
    handleFileChange,
    handleRemoveVideo,
    handleInputChange,
  };
};
