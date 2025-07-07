export interface Thing {
  id: string;
  name: string;
  expireAt: string;
  isRecurring: boolean;
  recurringInterval?: number;
  notifyBeforeExpiry: number;
  quantity: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  consumptionRecords?: ConsumptionRecord[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface ConsumptionRecord {
  id: string;
  thingId: string;
  quantity: number;
  timestamp: string;
}

export interface CreateThingDto {
  name: string;
  expireAt: string;
  isRecurring?: boolean;
  recurringInterval?: number;
  notifyBeforeExpiry: number;
  quantity?: number;
  tags?: string[];
}

export interface UpdateThingDto extends Partial<CreateThingDto> {}
