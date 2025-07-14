import styles from "./RemoveVideo.module.css";

interface RemoveVideoProps {
  id: string;
  onRemoveVideo: (id: string) => void;
}

const RemoveVideo: React.FC<RemoveVideoProps> = ({ id, onRemoveVideo }) => {
  return (
    <div
      className={styles.playerRemoveButton}
      onClick={() => onRemoveVideo(id)}
    >
      ✕
    </div>
  );
};

export default RemoveVideo;
