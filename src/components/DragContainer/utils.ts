import { keyPrefix } from "@/utils/config";
import { queryStorage, updateStorage } from "@/utils/tools";
import type { Size } from "./DragHandler";

export const querySize = (storage: string) => {
  const storageKey = `${keyPrefix}_drag_${storage}`;
  const storageVal = queryStorage<Size>(storageKey, {
    session: true,
    jsonVal: true,
  });
  return storageVal;
};

export const updateSize = (storage: string, size: Size) => {
  const storageKey = `${keyPrefix}_drag_${storage}`;
  updateStorage<Size>(storageKey, size, { session: true, jsonVal: true });
};
