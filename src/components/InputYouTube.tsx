import styles from "../App.module.css";

interface InputYouTubeProps {
  index: number;
  inputValues: string[];
  handleInputChange: (index: number, value: string) => void;
  handleAddVideo: (index: number, url: string) => void;
}

const InputYouTube: React.FC<InputYouTubeProps> = ({
  index,
  inputValues,
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
        value={inputValues[index]}
        onChange={(e) => handleInputChange(index, e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && handleAddVideo(index, inputValues[index])
        }
      />
      <button onClick={() => handleAddVideo(index, inputValues[index])}>
        追加
      </button>
    </div>
  );
};

export default InputYouTube;
