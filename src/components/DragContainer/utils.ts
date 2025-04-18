import { queryLocal, updateLocal } from "@/utils/storage";
import type { Size } from "./DragHandler";

export const querySize = (storage: string) => {
  const storageKey = `drag_${storage}`;
  const storageVal = queryLocal<Size>(storageKey);
  return storageVal;
};

export const updateSize = (storage: string, size: Size) => {
  const storageKey = `drag_${storage}`;
  updateLocal<Size>(storageKey, size);
};
