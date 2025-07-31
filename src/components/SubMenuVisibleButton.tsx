import React from "react";

interface SubMenuVisibleButtonProps {
  subMenuVisible: boolean;
  handleToggleSubMenu: () => void;
}

const SeekButton: React.FC<SubMenuVisibleButtonProps> = ({
  subMenuVisible,
  handleToggleSubMenu,
}) => {
  return (
    <>
      <button onClick={handleToggleSubMenu}>
        {subMenuVisible ? "サブメニュー　表示" : "サブメニュー非表示"}
      </button>
    </>
  );
};

export default React.memo(SeekButton);
