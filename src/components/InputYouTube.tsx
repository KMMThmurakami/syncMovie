import React from "react";
import styles from "../App.module.css";

interface InputYouTubeProps {
  index: number;
  inputValue: string;
  handleInputChange: (index: number, value: string) => void;
  handleAddVideo: (index: number, url: string) => void;
}

const InputYouTube: React.FC<InputYouTubeProps> = ({
  index,
  inputValue,
  handleInputChange,
  handleAddVideo,
}) => {
  return (
    <div className={styles.inputContainer}>
      <input
        name="videoSrc"
        className={styles.urlTextInput}
        type="text"
        placeholder="YouTube動画のURLを貼り付け"
        value={inputValue}
        onChange={(e) => handleInputChange(index, e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && handleAddVideo(index, inputValue)
        }
      />
      <button onClick={() => handleAddVideo(index, inputValue)}>追加</button>
    </div>
  );
};

export default React.memo(InputYouTube);
