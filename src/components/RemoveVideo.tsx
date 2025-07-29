import styles from "../App.module.css";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface RemoveVideoProps {
  index: number;
  onRemoveVideo: (index: number) => void;
  handleResizeVideo: (index: number, width: string, height: string) => void;
}

const RemoveVideo: React.FC<RemoveVideoProps> = ({
  index,
  onRemoveVideo,
  handleResizeVideo,
}) => {
  return (
    <div
      className={styles.playerRemoveButton}
      onClick={() => {
        onRemoveVideo(index);
        handleResizeVideo(index, "560px", "315px");
      }}
    >
      <RiDeleteBin2Fill />
    </div>
  );
};

export default RemoveVideo;
