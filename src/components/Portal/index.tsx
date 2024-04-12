import React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  className?: string;
  selector?: string;
  clear?: boolean;
  children?: React.ReactNode;
};

/**
 * 创建 Portal
 */
export const Portal = (props: PortalProps) => {
  const { className, selector, clear, children } = props;

  const [container, setContainer] = useState<Element>();

  useEffect(() => {
    let target = document.body;

    if (selector) {
      const dom = document.querySelector(selector);
      target = (dom as HTMLElement) || target;
    }

    const children: any[] = [];
    if (clear) {
      while (target.firstChild) {
        children.push(target.firstChild);
        target.removeChild(target.firstChild);
      }
    }

    const container = document.createElement("div");
    if (className) {
      container.classList.add(className);
    }

    setContainer(container);

    target.appendChild(container);

    return () => {
      /* Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node. */
      // target.removeChild(container);
      container.parentNode?.removeChild(container);

      if (clear && !target.firstChild) {
        children.forEach((child) => {
          target.appendChild(child);
        });
      }
    };
  }, [className, selector, clear]);

  return container ? createPortal(children, container) : null;
};

export default Portal;
