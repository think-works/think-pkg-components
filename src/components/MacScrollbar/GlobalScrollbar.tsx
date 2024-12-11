import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useEventListener, useInitial } from "./hooks";
import { TrackGap } from "./types";
import type { GlobalScrollbarBase } from "./types";
import useScrollbar from "./useScrollbar";

export interface GlobalScrollbarProps extends GlobalScrollbarBase {
  /**
   * Gap at the cross end of the scroll bar.
   * @defaultValue 16
   */
  trackGap?:
    | number
    | TrackGap
    | ((showBarX: boolean, showBarY: boolean) => TrackGap);
}

function GlobalScrollbarInject({
  skin = "light",
  ...props
}: GlobalScrollbarProps) {
  const wrapper = useInitial(() => document.createElement("div"));

  useEffect(() => {
    wrapper.classList.add("ms-track-global", "ms-theme");
    wrapper.classList.remove("ms-theme");
    const wrapperCls = "ms-container";
    const docClassList = document.documentElement.classList;

    docClassList.add(wrapperCls);
    document.body.append(wrapper);

    return () => {
      docClassList.remove(wrapperCls);
      document.body.removeChild(wrapper);
    };
  }, [wrapper, skin]);

  const [horizontalBar, verticalBar, updateLayerNow, updateLayerThrottle] =
    useScrollbar(window, props);

  useEventListener("scroll", () => {
    if (!(horizontalBar || verticalBar)) {
      updateLayerNow();
      return;
    }
    updateLayerThrottle();
  });

  return createPortal(
    <>
      {horizontalBar}
      {verticalBar}
    </>,
    wrapper,
  );
}

export function GlobalScrollbar(props: GlobalScrollbarProps) {
  return <GlobalScrollbarInject {...props} />;
}
