import axios from "axios";
import {
  Thing,
  CreateThingDto,
  UpdateThingDto,
  Tag,
  ConsumptionRecord,
} from "../types";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 事物相关 API
export const thingsApi = {
  getAll: (tag?: string) =>
    api.get<Thing[]>("/things", { params: { tag } }).then((res) => res.data),

  getById: (id: string) =>
    api.get<Thing>(`/things/${id}`).then((res) => res.data),

  create: (data: CreateThingDto) =>
    api.post<Thing>("/things", data).then((res) => res.data),

  update: (id: string, data: UpdateThingDto) =>
    api.patch<Thing>(`/things/${id}`, data).then((res) => res.data),

  delete: (id: string) => api.delete(`/things/${id}`).then((res) => res.data),

  getExpiring: () =>
    api.get<Thing[]>("/things/expiring").then((res) => res.data),
};

// 标签相关 API
export const tagsApi = {
  getAll: () => api.get<Tag[]>("/tags").then((res) => res.data),

  getByName: (name: string) =>
    api.get<Tag>(`/tags/${name}`).then((res) => res.data),
};

// 消耗记录相关 API
export const consumptionApi = {
  consume: (thingId: string, quantity: number = 1) =>
    api
      .post<ConsumptionRecord>(`/consumption/${thingId}`, { quantity })
      .then((res) => res.data),

  getHistory: (thingId: string) =>
    api
      .get<ConsumptionRecord[]>(`/consumption/${thingId}/history`)
      .then((res) => res.data),
};
