import React from "react";
import InputYouTube from "./InputYouTube";
import InputFile from "./InputFile";
import styles from "../App.module.css"; // Appコンポーネントのスタイルを共有

// Propsの型定義
interface VideoInputPlaceholderProps {
  index: number;
  inputValue: string;
  onInputChange: (index: number, value: string) => void;
  onAddYouTube: (index: number, url: string) => void;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
}

const VideoInputPlaceholder: React.FC<VideoInputPlaceholderProps> = ({
  index,
  inputValue,
  onInputChange,
  onAddYouTube,
  onFileChange,
}) => {
  return (
    <div>
      {/* 最初のビデオ入力欄にのみYouTubeのURL入力オプションを表示 */}
      {index === 0 && (
        <>
          <InputYouTube
            index={index}
            inputValue={inputValue}
            handleInputChange={onInputChange}
            handleAddVideo={onAddYouTube}
          />
          <p className={styles.note}>OR</p>
        </>
      )}
      <InputFile index={index} handleFileChange={onFileChange} />
    </div>
  );
};

export default VideoInputPlaceholder;
