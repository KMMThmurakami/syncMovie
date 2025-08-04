import React, { useState, useRef, useCallback } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { Resizable } from "re-resizable";
import VideoPlayer from "./VideoPlayer";
import VideoSubMenu from "./VideoSubMenu";
import styles from "../App.module.css";
import type { Direction } from "re-resizable/lib/resizer";

interface Props {
  src: string;
  index: number;
  playing: boolean;
  isFront: boolean;
  subMenuVisible: boolean;
  volume: number; // volumeプロパティを追加
  onVolumeChange: (index: number, volume: number) => void;
  onRemove: (index: number) => void;
  onBringToFront: (index: number) => void;
  playerRef: (el: HTMLVideoElement | null) => void;
}

const VideoPlayerItem = ({
  src,
  index,
  playing,
  isFront,
  subMenuVisible,
  volume,
  onVolumeChange,
  onRemove,
  onBringToFront,
  playerRef,
}: Props) => {
  const [size, setSize] = useState({ width: "560px", height: "315px" });
  const [position, setPosition] = useState(initPosition);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastVolume = useRef(volume > 0 ? volume : 0.5);

  function initPosition() {
    let newPositionX = 0;
    if (index % 2 === 0) {
      newPositionX = -610;
    }
    return { x: newPositionX, y: 240 };
  }

  const handleDragStop = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      setPosition({ x: data.x, y: data.y });
      setTimeout(() => {
        isDragging.current = false;
      }, 0);
    },
    []
  );

  const handleResize = useCallback(
    (_e: MouseEvent | TouchEvent, _direction: Direction, el: HTMLElement) => {
      setSize({ width: el.style.width, height: el.style.height });
    },
    []
  );

  const handleResizeStop = useCallback(
    (pos: { x: number; y: number }) => {
      // 表示位置を調整
      const newPosition = { ...position };
      if (pos.x < 50) newPosition.x = newPosition.x + pos.x * -1 + 50;
      if (pos.y < 0) newPosition.y = newPosition.y + pos.y * -1;
      setPosition({ x: newPosition.x, y: newPosition.y });
    },
    [position]
  );

  // ドラッグ開始時に常に最前面に表示するための関数
  const bringToFrontOnDrag = useCallback(() => {
    isDragging.current = true;
    onBringToFront(index);
  }, [onBringToFront, index]);

  // クリック時に最前面の状態をトグル（反転）するための関数
  const handleToggleFront = useCallback(() => {
    onBringToFront(index);
  }, [onBringToFront, index]);

  const handleLocalVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(index, parseFloat(e.target.value));
  };

  if (volume > 0) {
    lastVolume.current = volume;
  }

  const handleMuteToggle = () => {
    const newVolume = volume > 0 ? 0 : lastVolume.current;
    onVolumeChange(index, newVolume);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="body"
      position={position}
      onStop={handleDragStop}
      onStart={bringToFrontOnDrag}
    >
      <div
        ref={nodeRef}
        className={`${styles.playerItem} ${isFront ? styles.front : ""}`}
      >
        <VideoSubMenu
          index={index}
          onRemoveVideo={onRemove}
          handleResizeVideo={(_index, width, height) =>
            setSize({ width, height })
          }
          subMenuVisible={subMenuVisible}
          onClickToggleFront={handleToggleFront}
          volume={volume}
          handleLocalVolumeChange={handleLocalVolumeChange}
          handleMuteToggle={handleMuteToggle}
        />
        <Resizable
          size={{ width: size.width, height: size.height }}
          onResize={handleResize}
          onResizeStop={(_e, _d, el) => {
            const pos = el.getBoundingClientRect();
            handleResizeStop(pos);
          }}
          maxWidth={window.innerWidth}
          maxHeight={window.innerHeight}
        >
          <VideoPlayer
            src={src}
            playing={playing}
            width={size.width}
            height={size.height}
            ref={playerRef}
            volume={volume}
          />
        </Resizable>
      </div>
    </Draggable>
  );
};

export default React.memo(VideoPlayerItem);
