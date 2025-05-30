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

// 添加一个空导出以确保文件被视为模块
export {}; 