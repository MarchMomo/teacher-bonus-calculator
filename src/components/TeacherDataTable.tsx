import React, { useRef, useState } from 'react';
import { Table, Input, Button, Space, message, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Teacher } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TeacherDataTableProps {
  teachers: Teacher[];
  onTeachersChange: (teachers: Teacher[]) => void;
}

const TeacherDataTable: React.FC<TeacherDataTableProps> = ({ teachers, onTeachersChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pasteAreaRef = useRef<HTMLTextAreaElement>(null);
  const [importData, setImportData] = useState('');

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text');
    const rows = pastedData.split('\n').filter(row => row.trim());
    
    const newTeachers = rows.map(row => {
      const [name, subject, contribution] = row.split('\t').map(cell => cell.trim());
      if (!name || !subject || !contribution) return null;
      
      return {
        id: uuidv4(),
        name,
        subject,
        contribution: Number(contribution) || 0,
      };
    }).filter((teacher): teacher is Teacher => teacher !== null);

    if (newTeachers.length > 0) {
      Modal.confirm({
        title: '确认导入数据',
        content: `是否导入 ${newTeachers.length} 条教师数据？`,
        onOk: () => {
          onTeachersChange([...teachers, ...newTeachers]);
          message.success(`成功导入 ${newTeachers.length} 条数据`);
          setIsModalVisible(false);
        },
      });
    }
  };

  const handleImport = () => {
    try {
      // 按行分割
      const lines = importData.trim().split('\n');
      const newTeachers: Teacher[] = [];

      // 验证数据格式
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split('\t');
        if (parts.length < 3) {
          throw new Error(`第 ${i + 1} 行数据格式不正确，请确保包含：教师姓名、科目、班均贡献度`);
        }

        const name = parts[0].trim();
        const subject = parts[1].trim();
        const contribution = parseFloat(parts[2]);

        if (!name) {
          throw new Error(`第 ${i + 1} 行：教师姓名不能为空`);
        }
        if (!subject) {
          throw new Error(`第 ${i + 1} 行：科目不能为空`);
        }
        if (isNaN(contribution)) {
          throw new Error(`第 ${i + 1} 行：班均贡献度必须是数字`);
        }
        if (contribution < 0) {
          throw new Error(`第 ${i + 1} 行：班均贡献度不能为负数`);
        }

        newTeachers.push({
          id: `${name}-${subject}-${i}`, // 生成唯一ID
          name,
          subject,
          contribution,
        });
      }

      if (newTeachers.length === 0) {
        throw new Error('没有有效的教师数据');
      }

      onTeachersChange(newTeachers);
      setIsModalVisible(false);
      setImportData('');
      message.success(`成功导入 ${newTeachers.length} 条教师数据`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '导入失败，请检查数据格式');
    }
  };

  const columns = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Teacher) => (
        <Input
          value={record.name}
          onChange={(e) => {
            const newTeachers = teachers.map(t =>
              t.id === record.id ? { ...t, name: e.target.value } : t
            );
            onTeachersChange(newTeachers);
          }}
        />
      ),
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      render: (_: any, record: Teacher) => (
        <Input
          value={record.subject}
          onChange={(e) => {
            const newTeachers = teachers.map(t =>
              t.id === record.id ? { ...t, subject: e.target.value } : t
            );
            onTeachersChange(newTeachers);
          }}
        />
      ),
    },
    {
      title: '班均贡献度',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Teacher) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const newTeachers = teachers.filter(t => t.id !== record.id);
            onTeachersChange(newTeachers);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            const newTeacher: Teacher = {
              id: uuidv4(),
              name: '',
              subject: '',
              contribution: 0,
            };
            onTeachersChange([...teachers, newTeacher]);
          }}
        >
          添加教师
        </Button>
        <Button
          icon={<UploadOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          批量导入
        </Button>
        <Button onClick={() => onTeachersChange([])}>
          清空数据
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title="批量导入教师数据"
        open={isModalVisible}
        onOk={handleImport}
        onCancel={() => {
          setIsModalVisible(false);
          setImportData('');
        }}
        okText="导入"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <p>请将Excel数据复制粘贴到下方文本框，数据格式要求：</p>
          <ul>
            <li>每行一条数据</li>
            <li>列之间用Tab键分隔</li>
            <li>必须包含：教师姓名、科目、班均贡献度</li>
            <li>班均贡献度必须为非负数</li>
          </ul>
          <p>示例：</p>
          <pre>张三    数学    95.5</pre>
        </div>
        <Input.TextArea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          rows={10}
          placeholder="请粘贴Excel数据..."
        />
      </Modal>
    </div>
  );
};

export default TeacherDataTable; 