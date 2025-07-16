import styles from "./RemoveVideo.module.css";

interface RemoveVideoProps {
  index: number;
  onRemoveVideo: (index: number) => void;
}

const RemoveVideo: React.FC<RemoveVideoProps> = ({ index, onRemoveVideo }) => {
  return (
    <div
      className={styles.playerRemoveButton}
      onClick={() => onRemoveVideo(index)}
    >
      ✕
    </div>
  );
};

export default RemoveVideo;
