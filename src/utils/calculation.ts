import { Teacher, CalculationParameters } from '../types';

interface Slot {
  name: string;
  lower: number; // 档位下限
  upper: number; // 档位上限
  prize: number; // 档位奖金
  // 添加一个 numericValue，方便计算奖金时使用 (1代表一档，2代表二档)
  numericValue: number; 
}

// 定义一个小的浮点数容差，用于比较
const EPSILON = 1e-9;

export const calculateSlots = (teachers: Teacher[], parameters: CalculationParameters) => {
  const messages: string[] = [];
  const { xValue, totalPrize, highestValue, lowestValue, prizeDifference } = parameters;

  // 验证参数
  if (totalPrize <= 0) {
    messages.push('总奖金必须大于0');
    return { messages, slots: [], calculatedTeachers: [] };
  }

  if (highestValue <= lowestValue) {
    messages.push('最高值必须大于最低值');
    return { messages, slots: [], calculatedTeachers: [] };
  }

  if (teachers.length === 0) {
    messages.push('没有教师数据');
    return { messages, slots: [], calculatedTeachers: [] };
  }

  // 1. 数据预处理: 计算派生数据并按班均贡献度降序排序
  const sortedTeachers = teachers.map(teacher => ({
    ...teacher,
    contributionMinusX: teacher.contribution - xValue,
  })).sort((a, b) => b.contribution - a.contribution); // 按贡献度降序排序

  // 2. 档位定义
  const rawSlots: Omit<Slot, 'prize'>[] = []; // 临时存储，不包含奖金
  
  // 一档
  if (sortedTeachers.length > 0) {
    const firstTeacher = sortedTeachers[0];
    const firstSlotUpper = firstTeacher.contribution;
    // 根据用户描述，一档下限是所有教师中班均贡献度减X值最大值 (这里取排序后第一个教师的 contributionMinusX 作为示例，因为示例数据是这样对应的)
    // 如果实际数据中班均贡献度最大值的教师，其 contributionMinusX 不是所有教师中最大的，这里的逻辑需要调整。
    // 暂且按照示例数据来：一档下限 = 贡献度最大教师的 contributionMinusX
    const firstSlotLower = firstTeacher.contributionMinusX;

    // 过滤掉上限为0或小于0的档位
    if (firstSlotUpper > 0) {
        rawSlots.push({
          name: '一档',
          numericValue: 1,
          lower: firstSlotLower,
          upper: firstSlotUpper,
        });
    }

    // 其他档位 (最多二十档)
    // 上限 = 小于上一档下限的最大班均贡献度值；下限 = 该上限对应的班均贡献度减X值。
    // 从排序后的教师列表的第二个教师开始遍历，尝试找到后续档位
    // 这里的逻辑需要确保找到的是"小于上一档下限的最大班均贡献度值"
    // 并且每个档位仅由一个"临界"教师来定义，避免重复或遗漏
    
    let previousSlotLowerBound = rawSlots.length > 0 ? rawSlots[rawSlots.length - 1].lower : Infinity; // 初始化上一档的下限

    // 从已排序的教师列表的第二个教师开始查找
    for (let i = 1; i < sortedTeachers.length && rawSlots.length < 20; i++) {
        const currentTeacher = sortedTeachers[i];

        // 查找其班均贡献度严格小于上一档下限的教师
        // 并且其 contributionMinusX 应该作为新的档位下限
        if (currentTeacher.contribution < previousSlotLowerBound - EPSILON) {
            const currentSlotUpper = currentTeacher.contribution;
            const currentSlotLower = currentTeacher.contributionMinusX;

            // 过滤掉上限为0或小于0的档位
            if (currentSlotUpper <= 0) {
                break; // 上限非正，停止生成后续档位
            }

            // 检查当前档位上限是否与已生成的其他档位上限重复（考虑浮点数容差）
            const isUpperExist = rawSlots.some(slot => Math.abs(slot.upper - currentSlotUpper) < EPSILON);
            
            // 如果上限不重复，并且上限有效，则添加新的档位
            if (!isUpperExist) {
                 rawSlots.push({
                    name: `${rawSlots.length + 1}档`,
                    numericValue: rawSlots.length + 1,
                    lower: currentSlotLower,
                    upper: currentSlotUpper,
                });
                previousSlotLowerBound = currentSlotLower; // 更新上一档的下限
            }
        }
         // 如果当前教师的贡献度不小于上一档下限，则继续查找下一个教师
         // 因为"小于上一档下限的最大班均贡献度值"可能在更靠后的教师中
    }
  }

   // 重新计算每个档位的奖金 (根据用户描述的公式) 并应用强制最低值
   const finalSlotsWithPrize: Slot[] = rawSlots.map((slot) => {
     // 档位数值从1开始
     // 公式：最高值 - (档位数值 - 1) * 测算区间奖金差额
     let calculatedPrize = highestValue - (slot.numericValue - 1) * prizeDifference;
     
     // 强制最低值处理
     if (calculatedPrize < lowestValue - EPSILON) { // 使用EPSILON进行比较
       messages.push(`已触发强制最低值：档位 ${slot.name} 奖金额(${calculatedPrize.toFixed(2)})低于最低值(${lowestValue.toFixed(2)})，已设为最低值`);
       calculatedPrize = lowestValue;
     }
     
     return { ...slot, prize: calculatedPrize };
   });

  // 3. 分配档位并计算最终奖金
  const calculatedTeachers = teachers.map(teacher => {
    let matchedSlot: Slot | undefined;
    
    // 找到教师对应的档位
    // 规则: 档位上限 >= 数值 > 档位下限
    // 遍历 finalSlotsWithPrize 来匹配
    for (const slot of finalSlotsWithPrize) { // 使用 finalSlotsWithPrize 进行匹配
      // 使用容差处理浮点数精度问题
      if (teacher.contribution <= slot.upper + EPSILON && teacher.contribution > slot.lower - EPSILON) {
          matchedSlot = slot;
          break; // 找到匹配的档位后立即跳出
      }
    }

    // 如果没有找到匹配的档位
    if (!matchedSlot) {
       messages.push(`${teacher.name}的班均贡献度(${teacher.contribution.toFixed(2)})未匹配到任何档位`);
       return {
         ...teacher,
         slot: '-',
         finalPrize: 0,
       };
    }
    
    return {
      ...teacher,
      slot: matchedSlot.name,
      finalPrize: matchedSlot.prize,
    };
  });

  // 4. 总奖金校验
   let totalCalculatedPrize = calculatedTeachers.reduce((sum, teacher) => sum + (teacher.finalPrize || 0), 0);
   // 检查计算出的总奖金是否大于设定的总奖金，允许小的浮点数容差
   if (totalCalculatedPrize > totalPrize + EPSILON) {
       messages.push(`奖金总额超出(${totalCalculatedPrize.toFixed(2)} > ${totalPrize.toFixed(2)})，请调大**测算区间奖金差额**！`);
   }

  return { messages, slots: finalSlotsWithPrize, calculatedTeachers };
};

export const exportToExcel = (teachers: Teacher[]) => {
  const data = teachers.map(t => ({
    '教师姓名': t.name,
    '科目': t.subject,
    '班均贡献度': t.contribution.toFixed(2), // 修正：应为班均贡献度
    '档位': t.slot || '-',
    '最终奖金': t.finalPrize?.toFixed(2) || '-',
  }));
  
  return data;
};