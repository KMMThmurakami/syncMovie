// hooks/usePlayerControls.ts
import { useState, useRef, useCallback } from "react";

export const usePlayerControls = (videoCount: number) => {
  const [playing, setPlaying] = useState(false);
  const [subMenuVisible, setSubMenuVisible] = useState(true);
  const [seek, setSeek] = useState(0);
  const playerRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
