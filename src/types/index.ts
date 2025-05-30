export interface Teacher {
  id: string;
  name: string;
  subject: string;
  contribution: number;
  slot?: string;
  finalPrize?: number;
}

export interface CalculationParameters {
  xValue: number;
  totalPrize: number;
  highestValue: number;
  lowestValue: number;
  teacherCount: number;
  prizeDifference: number;
}

export interface Slot {
  name: string;
  upper: number;
  lower: number;
  prize: number;
  count: number;
} 