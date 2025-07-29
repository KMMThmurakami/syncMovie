import styles from "../App.module.css";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoMoveSharp } from "react-icons/io5";
import { RiBringToFront } from "react-icons/ri";

interface VideoSubMenuProps {
  index: number;
  toggleFrontClass: (index: number) => void;
  onRemoveVideo: (index: number) => void;
  handleResizeVideo: (index: number, width: string, height: string) => void;
}

const VideoSubMenu: React.FC<VideoSubMenuProps> = ({
  index,
  toggleFrontClass,
  onRemoveVideo,
  handleResizeVideo,
}) => {
  return (
    <div className={styles.videoSubMenu}>
      {/* 移動ボタン */}
      <div
        className={`drag-handle ${styles.videoSubMenuButton} ${styles.videoSubMenuButtonMove}`}
      >
        <IoMoveSharp />
      </div>

      {/* 前面へボタン */}
      <div
        className={styles.videoSubMenuButton}
        onClick={() => {
          toggleFrontClass(index);
        }}
      >
        <RiBringToFront />
      </div>

      {/* 削除ボタン */}
      <div
        className={styles.videoSubMenuButton}
        onClick={() => {
          onRemoveVideo(index);
          handleResizeVideo(index, "560px", "315px");
        }}
      >
        <RiDeleteBin2Fill />
      </div>
    </div>
  );
};

export default VideoSubMenu;
