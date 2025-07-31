import React, { useState, useRef, useCallback } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { Resizable } from "re-resizable";
import YouTubePlayer from "./YouTubePlayer";
import VideoSubMenu from "./VideoSubMenu";
import styles from "../App.module.css";
import type { Direction } from "re-resizable/lib/resizer";

interface Props {
  src: string;
  index: number;
  playing: boolean;
  isFront: boolean;
  subMenuVisible: boolean;
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
  onRemove,
  onBringToFront,
  playerRef,
}: Props) => {
  const [size, setSize] = useState({ width: "560px", height: "315px" });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDragStop = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      setPosition({ x: data.x, y: data.y });
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
      const newPosition = position;
      if (pos.x < 50) newPosition.x = newPosition.x + pos.x * -1 + 50;
      if (pos.y < 0) newPosition.y = newPosition.y + pos.y * -1;
      setPosition({ x: newPosition.x, y: newPosition.y });
    },
    [position]
  );

  const bringToFront = useCallback(() => {
    onBringToFront(index);
  }, [onBringToFront, index]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="body"
      position={position}
      onStop={handleDragStop}
      onStart={bringToFront}
    >
      <div
        ref={nodeRef}
        className={`${styles.playerItem} ${isFront ? styles.front : ""}`}
        onClick={bringToFront}
      >
        <VideoSubMenu
          index={index}
          onRemoveVideo={onRemove}
          handleResizeVideo={(_index, width, height) =>
            setSize({ width, height })
          }
          subMenuVisible={subMenuVisible}
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
          <YouTubePlayer
            src={src}
            playing={playing}
            width={size.width}
            height={size.height}
            ref={playerRef}
          />
        </Resizable>
      </div>
    </Draggable>
  );
};

export default React.memo(VideoPlayerItem);
