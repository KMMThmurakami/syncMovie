import React from "react";
import styles from "../App.module.css";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoMoveSharp } from "react-icons/io5";
import { RiBringToFront } from "react-icons/ri";

interface VideoSubMenuProps {
  index: number;
  subMenuVisible: boolean;
  onRemoveVideo: (index: number) => void;
  handleResizeVideo: (index: number, width: string, height: string) => void;
  onClickToggleFront: () => void;
}

const VideoSubMenu: React.FC<VideoSubMenuProps> = ({
  index,
  subMenuVisible,
  onRemoveVideo,
  handleResizeVideo,
  onClickToggleFront,
}) => {
  return (
    <div
      className={
        subMenuVisible
          ? styles.videoSubMenu
          : `${styles.videoSubMenu} ${styles.invisible}`
      }
    >
      {/* 移動ボタン */}
      <div className={styles.tooltipContainer}>
        <div
          className={`drag-handle ${styles.videoSubMenuButton} ${styles.videoSubMenuButtonMove}`}
        >
          <IoMoveSharp />
        </div>
        <span className={styles.tooltipText}>移動</span>
      </div>

      {/* 前面へボタン */}
      <div className={styles.tooltipContainer} onClick={onClickToggleFront}>
        <div className={styles.videoSubMenuButton}>
          <RiBringToFront />
        </div>
        <span className={styles.tooltipText}>前面へ</span>
      </div>

      {/* 削除ボタン */}
      <div className={styles.tooltipContainer}>
        <div
          className={styles.videoSubMenuButton}
          onClick={() => {
            onRemoveVideo(index);
            handleResizeVideo(index, "560px", "315px");
          }}
        >
          <RiDeleteBin2Fill />
        </div>
        <span className={styles.tooltipText}>削除</span>
      </div>
    </div>
  );
};

export default React.memo(VideoSubMenu);
