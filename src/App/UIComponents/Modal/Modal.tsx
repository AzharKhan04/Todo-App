import React from "react";
import "../../../Style/Modal.css";

interface ModalProps {
  children?: any;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className="ui-modal">
      <div className="content">{props.children}</div>
    </div>
  );
};

export default React.memo(Modal);
