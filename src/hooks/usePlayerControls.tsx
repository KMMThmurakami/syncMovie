// hooks/usePlayerControls.ts
import { useState, useRef, useCallback, useEffect } from "react";

export const usePlayerControls = (videoCount: number) => {
  const [playing, setPlaying] = useState(false);
  const [subMenuVisible, setSubMenuVisible] = useState(true);
  const [seek, setSeek] = useState(0);
  const [volumes, setVolumes] = useState<number[]>([]);
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setVolumes((currentVolumes) => {
      const newVolumes = Array(videoCount).fill(0.0); // デフォルト音量
      // 既存の音量設定を維持
      const len = Math.min(currentVolumes.length, videoCount);
      for (let i = 0; i < len; i++) {
        newVolumes[i] = currentVolumes[i];
      }
      return newVolumes;
    });
  }, [videoCount]);

  // ビデオ数に応じてリファレンス配列の長さを調整
  if (playerRefs.current.length !== videoCount) {
    playerRefs.current = Array(videoCount).fill(null);
  }

  const handlePlayAll = useCallback(() => setPlaying(true), []);
  const handlePauseAll = useCallback(() => setPlaying(false), []);

  const handleJumpSeek = useCallback(() => {
    playerRefs.current.forEach((player) => {
      if (player?.duration) {
        player.currentTime = seek;
      }
    });
  }, [seek]);

  const handleVolumeChange = useCallback((index: number, volume: number) => {
    setVolumes((currentVolumes) => {
      const newVolumes = [...currentVolumes];
      newVolumes[index] = volume;
      return newVolumes;
    });
  }, []);

  const handleToggleSubMenu = useCallback(() => {
    setSubMenuVisible((prev) => !prev);
  }, []);

  const getPlayerRef = useCallback(
    (index: number) => (el: HTMLVideoElement | null) => {
      if (playerRefs.current) {
        playerRefs.current[index] = el;
      }
    },
    []
  );

  const clearPlayerRef = useCallback((index: number) => {
    if (playerRefs.current) {
      playerRefs.current[index] = null;
    }
  }, []);

  return {
    playing,
    volumes,
    handleVolumeChange,
    setSeek,
    handlePlayAll,
    handlePauseAll,
    handleJumpSeek,
    subMenuVisible,
    handleToggleSubMenu,
    getPlayerRef,
    clearPlayerRef,
  };
};
