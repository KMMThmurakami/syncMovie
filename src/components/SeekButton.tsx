import styles from "../App.module.css";

interface SeekButtonProps {
  setSeek: React.Dispatch<React.SetStateAction<number>>;
  handleJumpSeek: () => void;
}

const SeekButton: React.FC<SeekButtonProps> = ({ setSeek, handleJumpSeek }) => {
  return (
    <>
      <input
        name="seek"
        type="number"
        min={0}
        max={9999}
        onChange={(e) => setSeek(Number(e.target.value))}
        onKeyDown={(e) => e.key === "Enter" && handleJumpSeek()}
        className={styles.numberInput}
        defaultValue={0}
        placeholder="秒数を入力..."
      />
      <button onClick={handleJumpSeek}>秒にジャンプ</button>
    </>
  );
};

export default SeekButton;
