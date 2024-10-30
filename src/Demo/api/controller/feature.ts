import { PagingRequest } from "@/utils/types";
import http from "../index";

/** 分页查询测试需求 */
export const queryPageTestFeature = (
  params: PagingRequest & {
    keyword?: string;
    workspaceId: string;
    projectId: string;
  },
) =>
  http.post("/feature/searchTestFeature", params, {
    baseURL: "/quality",
  });
