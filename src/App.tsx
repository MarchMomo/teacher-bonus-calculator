import React, { useState } from 'react';
import { Layout, Typography, Button } from 'antd';
import TeacherDataTable from './components/TeacherDataTable';
import CalculationParametersForm from './components/CalculationParametersForm';
import ResultsDisplay from './components/ResultsDisplay';
import { Teacher, CalculationParameters } from './types';
import { calculateSlots } from './utils/calculation';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [parameters, setParameters] = useState<CalculationParameters>({
    xValue: 2,
    totalPrize: 100000,
    highestValue: 5000,
    lowestValue: 4000,
    teacherCount: 0,
    prizeDifference: 100,
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [calculatedTeachers, setCalculatedTeachers] = useState<Teacher[]>([]);

  const handleCalculate = () => {
    if (teachers.length === 0) {
      setMessages(['请先添加教师数据']);
      setCalculatedTeachers([]);
      return;
    }

    const { messages: newMessages, calculatedTeachers: newCalculatedTeachers } = calculateSlots(teachers, parameters);
    setMessages(newMessages);
    setCalculatedTeachers(newCalculatedTeachers || []);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Title level={2} style={{ margin: '16px 0' }}>
          教师奖金分配系统
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <TeacherDataTable teachers={teachers} onTeachersChange={setTeachers} />
          <CalculationParametersForm
            parameters={parameters}
            onChange={setParameters}
          />
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button type="primary" size="large" onClick={handleCalculate}>
              开始计算
            </Button>
          </div>
          <ResultsDisplay teachers={calculatedTeachers} messages={messages} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
