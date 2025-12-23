/* eslint-disable no-console */
import { uuid4 } from "./cryptos";

export type EventPayload = Record<string, any>;

export type EventData = {
  /** 消息来源  */
  from: string;
  /** 消息 ID */
  id: string;
  /** 事件类型 */
  type: string;
  /** 事件负载 */
  payload?: EventPayload;
  /** 需要确认 */
  _ack?: boolean;
};

export type EventHandler = (payload?: EventPayload) => void;

export type MessagesOptions = {
  /** 调试模式 */
  debug?: boolean;
  /** 源窗口 */
  sourceWindow?: Window;
  /** 目标窗口 */
  targetWindow?: Window;
  /** 目标域 */
  targetOrigin?: string;
};

export class Messages {
  private name: string;

  private debug: boolean = false;
  private sourceWindow: Window = window;
  private targetWindow: Window = window;
  private targetOrigin: string = window.location.origin;
  private handlers: Record<string, EventHandler[] | undefined> = {};

  constructor(
    /** 应用名称 */
    name: string,
    options?: MessagesOptions,
  ) {
    this.name = name;

    this.debug = options?.debug ?? this.debug;
    this.sourceWindow = options?.sourceWindow ?? this.sourceWindow;
    this.targetWindow = options?.targetWindow ?? this.targetWindow;
    this.targetOrigin =
      options?.targetOrigin ?? (this.debug ? "*" : this.targetOrigin);

    this.sourceWindow.addEventListener("message", this.handleMessage);
  }

  /** 销毁 */
  public destroy() {
    this.sourceWindow.removeEventListener("message", this.handleMessage);
    this.handlers = {};
  }

  /** 获取消息 ID */
  private getMessageId = () => uuid4();

  /** 获取确认类型 */
  private getAckType = (from: string, id: string) => `ack:${from}:${id}`;

  /** 接收消息 */
  private handleMessage = (event: MessageEvent<EventData>) => {
    const { origin, data } = event;
    const { from, id, type, payload, _ack } = data || {};

    if (this.debug) {
      console.debug(`[${this.name}] receive message`, data, event);
    }

    // 检查来源
    if (this.targetOrigin !== "*" && this.targetOrigin !== origin) {
      return;
    }

    const list = this.handlers[type];
    if (!list?.length) {
      return;
    }

    // 需要确认
    if (_ack) {
      const ackType = this.getAckType(from, id);
      this.sendMessage(ackType, {
        from: this.name,
      });
    }

    list.forEach((handler) => {
      if (typeof handler === "function") {
        handler(payload);
      }
    });
  };

  /** 发送消息 */
  public sendMessage(
    /** 消息类型 */
    type: string,
    /** 消息负载 */
    payload?: EventPayload,
    options?: {
      /** 确认回调 */
      callback?: EventHandler;
      /** 清理负载 */
      clearPayload?: boolean;
    },
  ) {
    const { callback, clearPayload } = options || {};

    // 清理负载
    const cleanPayload =
      clearPayload && payload ? JSON.parse(JSON.stringify(payload)) : payload;

    // 消息数据
    const messageId = this.getMessageId();
    const data: EventData = {
      type,
      payload: cleanPayload,
      from: this.name,
      id: messageId,
    };

    // 需要确认
    if (typeof callback === "function") {
      data._ack = true;

      const ackType = this.getAckType(data.from, data.id);
      this.once(ackType, callback);
    }

    if (this.debug) {
      console.debug(`[${this.name}] send message`, data);
    }

    this.targetWindow.postMessage(data, this.targetOrigin);
  }

  /* 注册事件 */
  public on(type: string, handler: EventHandler) {
    let list = this.handlers[type];

    if (handler) {
      list = (list || []).concat(handler);
    }

    this.handlers[type] = list;
  }

  /* 反注册事件 */
  public off(type: string, handler: EventHandler) {
    let list = this.handlers[type];

    if (handler) {
      list = (list || []).filter((x) => x !== handler);
    }

    this.handlers[type] = list;
  }

  /* 注册一次性事件 */
  public once = (type: string, handler: EventHandler) => {
    const _handler: EventHandler = (...rest) => {
      this.off(type, _handler);
      if (typeof handler === "function") {
        handler(...rest);
      }
    };

    this.on(type, _handler);
  };
}
