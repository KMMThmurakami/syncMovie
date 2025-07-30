import React from "react";
import styles from "../App.module.css";
import { FaPlay, FaPause } from "react-icons/fa";

interface PlayerButtonProps {
  playing: boolean;
  handlePauseAll: () => void;
  handlePlayAll: () => void;
}

const PlayerButton: React.FC<PlayerButtonProps> = ({
  playing,
  handlePauseAll,
  handlePlayAll,
}) => {
  return (
    <>
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
    </>
  );
};

export default React.memo(PlayerButton);
