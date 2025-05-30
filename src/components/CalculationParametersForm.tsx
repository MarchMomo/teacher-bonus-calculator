import React from 'react';
import { Form, InputNumber, Card } from 'antd';
import { CalculationParameters } from '../types';

interface CalculationParametersFormProps {
  parameters: CalculationParameters;
  onChange: (parameters: CalculationParameters) => void;
}

const CalculationParametersForm: React.FC<CalculationParametersFormProps> = ({
  parameters,
  onChange,
}) => {
  return (
    <Card title="计算参数" style={{ marginBottom: 16 }}>
      <Form layout="vertical">
        <Form.Item label="X值">
          <InputNumber
            value={parameters.xValue}
            onChange={(value) => onChange({ ...parameters, xValue: value || 0.5 })}
            min={0}
            step={0.5}
            defaultValue={0.5}
          />
        </Form.Item>
        <Form.Item label="奖金总额">
          <InputNumber
            value={parameters.totalPrize}
            onChange={(value) => onChange({ ...parameters, totalPrize: value || 0 })}
            min={0}
          />
        </Form.Item>
        <Form.Item label="最高值">
          <InputNumber
            value={parameters.highestValue}
            onChange={(value) => onChange({ ...parameters, highestValue: value || 0 })}
            min={0}
          />
        </Form.Item>
        <Form.Item label="最低值">
          <InputNumber
            value={parameters.lowestValue}
            onChange={(value) => onChange({ ...parameters, lowestValue: value || 0 })}
            min={0}
          />
        </Form.Item>
        <Form.Item label="教师总人数">
          <InputNumber
            value={parameters.teacherCount}
            onChange={(value) => onChange({ ...parameters, teacherCount: value || 0 })}
            min={0}
          />
        </Form.Item>
        <Form.Item
          label={
            <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
              测算区间奖金差额
            </span>
          }
        >
          <InputNumber
            value={parameters.prizeDifference}
            onChange={(value) => onChange({ ...parameters, prizeDifference: value || 0 })}
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CalculationParametersForm; 