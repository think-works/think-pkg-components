export type EventHandler = (...args: any) => any;

/**
 * 事件集合
 */
const events: Record<string, EventHandler[]> = {};

/*
 * 注册事件
 * 向名为 name 的处理器数组中追加处理器 handler
 */
export const on = (name: string, handler: EventHandler) => {
  let list = events[name];

  if (handler) {
    list = (list || []).concat(handler);
  }

  events[name] = list;
};

/*
 * 注册一次性事件
 * 向名为 name 的处理器数组中追加处理器 handler
 */
export const once = (name: string, handler: EventHandler) => {
  const _handler = (...arg: any) => {
    if (typeof handler === "function") {
      handler(...arg);
    }
    off(name, _handler);
  };

  on(name, _handler);
};

/*
 * 反注册事件
 * 从名为 name 的处理器数组中移除处理器 handler
 * 忽略 handler 将移出该数组中所有处理器
 */
export const off = (name: string, handler?: EventHandler) => {
  let list = events[name];

  if (handler) {
    list = (list || []).filter((x) => x !== handler);
  } else {
    list = [];
  }

  events[name] = list;
};

/*
 * 触发事件
 * 触发名为 name 的处理器数组中的所有处理器。
 */
export const emit = (name: string, ...arg: any) => {
  const list = events[name];

  return (list || []).map(async (handler) => {
    if (typeof handler === "function") {
      await handler(...arg);
    }
  });
};

/*
 * 检查注册事件数量
 * 从名为 name 的处理器数组中检查处理器 handler
 * 忽略 handler 将检查该数组中所有处理器
 */
export const count = (name: string, handler?: EventHandler) => {
  const list = events[name];

  if (handler) {
    return (list || []).filter((x) => x === handler).length;
  } else {
    return list ? list.length : 0;
  }
};

/*
 * 检查注册事件存在
 * 从名为 name 的处理器数组中检查处理器 handler
 * 忽略 handler 将检查该数组中所有处理器
 */
export const exist = (name: string, handler?: EventHandler) => {
  const list = events[name];

  if (handler) {
    return (list || []).some((x) => x === handler);
  } else {
    return !!list?.length;
  }
};
