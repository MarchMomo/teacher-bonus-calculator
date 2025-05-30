import React from 'react';
import { Card, Table, Typography, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Teacher } from '../types';
import * as XLSX from 'xlsx';

const { Title } = Typography;

interface ResultsDisplayProps {
  teachers: Teacher[];
  messages: string[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ teachers, messages }) => {
  const columns = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '贡献值',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (value: number) => value?.toFixed(2) || '-',
    },
    {
      title: '档位',
      dataIndex: 'slot',
      key: 'slot',
      render: (value: string) => value || '-',
    },
    {
      title: '最终奖金',
      dataIndex: 'finalPrize',
      key: 'finalPrize',
      render: (value: number) => value?.toFixed(2) || '-',
    },
  ];

  const handleExport = () => {
    const data = teachers.map(t => ({
      '教师姓名': t.name,
      '科目': t.subject,
      '贡献值': t.contribution.toFixed(2),
      '档位': t.slot || '-',
      '最终奖金': t.finalPrize?.toFixed(2) || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '奖金分配结果');
    XLSX.writeFile(wb, '奖金分配结果.xlsx');
  };

  return (
    <Card
      title={<Title level={3}>计算结果</Title>}
      extra={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          disabled={teachers.length === 0}
        >
          导出Excel
        </Button>
      }
    >
      {messages.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {messages.map((message, index) => (
            <p key={index} style={{ color: 'red' }}>{message}</p>
          ))}
        </div>
      )}
      <Table
        dataSource={teachers}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

export default ResultsDisplay; 