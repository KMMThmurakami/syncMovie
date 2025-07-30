import React from "react";
import styles from "../App.module.css";

interface InputYouTubeProps {
  index: number;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
}

const InputFile: React.FC<InputYouTubeProps> = ({
  index,
  handleFileChange,
}) => {
  return (
    <div className={styles.fileInputContainer}>
      <input
        type="file"
        id={`custom-file-input-${index}`}
        onChange={(event) => handleFileChange(event, index)}
      />
      <label
        className={styles.fileInputLabel}
        htmlFor={`custom-file-input-${index}`}
      >
        端末からファイルを選ぶ
      </label>
    </div>
  );
};

export default React.memo(InputFile);
