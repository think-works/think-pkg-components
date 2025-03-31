export type EventHandler = (...args: any) => any;

/** 事件中心 */
export class Events {
  /** 事件集合 */
  private events: Record<string, EventHandler[]> = {};

  /**
   * 注册事件
   * 向名为 name 的处理器数组中追加处理器 handler
   */
  public on = (name: string, handler: EventHandler) => {
    let list = this.events[name];

    if (handler) {
      list = (list || []).concat(handler);
    }

    this.events[name] = list;
  };

  /**
   * 注册一次性事件
   * 向名为 name 的处理器数组中追加处理器 handler
   */
  public once = (name: string, handler: EventHandler) => {
    const _handler = (...arg: any) => {
      if (typeof handler === "function") {
        handler(...arg);
      }
      this.off(name, _handler);
    };

    this.on(name, _handler);
  };

  /**
   * 反注册事件
   * 从名为 name 的处理器数组中移除处理器 handler
   * 忽略 handler 将移出该数组中所有处理器
   */
  public off = (name: string, handler?: EventHandler) => {
    let list = this.events[name];

    if (handler) {
      list = (list || []).filter((x) => x !== handler);
    } else {
      list = [];
    }

    this.events[name] = list;
  };

  /**
   * 触发事件
   * 触发名为 name 的处理器数组中的所有处理器。
   */
  public emit = (name: string, ...arg: any) => {
    const list = this.events[name];

    return (list || []).map(async (handler) => {
      if (typeof handler === "function") {
        await handler(...arg);
      }
    });
  };

  /**
   * 检查注册事件数量
   * 从名为 name 的处理器数组中检查处理器 handler
   * 忽略 handler 将检查该数组中所有处理器
   */
  public count = (name: string, handler?: EventHandler) => {
    const list = this.events[name];

    if (handler) {
      return (list || []).filter((x) => x === handler).length;
    } else {
      return list ? list.length : 0;
    }
  };

  /**
   * 检查注册事件存在
   * 从名为 name 的处理器数组中检查处理器 handler
   * 忽略 handler 将检查该数组中所有处理器
   */
  public exist = (name: string, handler?: EventHandler) => {
    const list = this.events[name];

    if (handler) {
      return (list || []).some((x) => x === handler);
    } else {
      return !!list?.length;
    }
  };
}

export default Events;

/** 全局事件中心 */
export const globalHub = new Events();

/**
 * 注册事件
 * @deprecated 请使用 `events.globalHub.on`
 */
export const on = globalHub.on;

/**
 * 注册一次性事件
 * @deprecated 请使用 `events.globalHub.once`
 */
export const once = globalHub.once;

/**
 * 反注册事件
 * @deprecated 请使用 `events.globalHub.off`
 */
export const off = globalHub.off;

/**
 * 触发事件
 * @deprecated 请使用 `events.globalHub.emit`
 */
export const emit = globalHub.emit;

/**
 * 检查注册事件数量
 * @deprecated 请使用 `events.globalHub.count`
 */
export const count = globalHub.count;

/**
 * 检查注册事件存在
 * @deprecated 请使用 `events.globalHub.exist`
 */
export const exist = globalHub.exist;
