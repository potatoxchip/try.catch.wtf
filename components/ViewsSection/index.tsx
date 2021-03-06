import React, { useRef, useEffect } from "react";
import { animate } from "framer-motion";

import EyeIcon from "@components/icons/EyeIcon";

import style from "./ViewsSection.module.css";

const ViewsSection = ({ from, to }: { from: number; to: number }) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (nodeRef.current === null) {
      return () => {};
    }

    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 0.4,
      onUpdate(value) {
        node.textContent = `${value.toFixed(0)} Views`;
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return (
    <div className={style.container}>
      <EyeIcon />
      <p ref={nodeRef} />
    </div>
  );
};

export default ViewsSection;
