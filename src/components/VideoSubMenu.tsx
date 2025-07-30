import React from "react";
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
      <div className={styles.tooltipContainer}>
        <div
          className={`drag-handle ${styles.videoSubMenuButton} ${styles.videoSubMenuButtonMove}`}
        >
          <IoMoveSharp />
        </div>
        <span className={styles.tooltipText}>移動</span>
      </div>

      {/* 前面へボタン */}
      <div className={styles.tooltipContainer}>
        <div
          className={styles.videoSubMenuButton}
          onClick={() => toggleFrontClass(index)}
        >
          <RiBringToFront />
        </div>
        <span className={styles.tooltipText}>最前面へ</span>
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
