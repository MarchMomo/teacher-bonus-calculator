# 教师奖金计算器💻

这是一个用于计算和分配教师奖金的在线工具。该工具可以根据教师的班均贡献度自动计算奖金档位和具体金额。

## 功能特点

- 支持批量导入教师数据
- 自动计算奖金档位
- 支持自定义计算参数
- 数据导出功能
- 实时计算和预览

## 使用说明✍

### 1. 导入教师数据

点击"批量导入"按钮，将Excel数据复制粘贴到文本框中。数据格式要求：
- 每行一条数据
- 列之间用Tab键分隔
- 必须包含：教师姓名、科目、班均贡献度
- 班均贡献度必须为非负数

示例数据：
```
张三    数学    14.5
李四    语文    18.0
王五    英语    22.5
```

### 2. 设置计算参数

在"计算参数"区域设置以下参数：
- X值：用于计算档位下限的基准值
- 总奖金：奖金总额
- 最高值：最高档位的奖金金额
- 最低值：最低档位的奖金金额
- 测算区间奖金差额：相邻档位之间的奖金差额

### 3. 查看计算结果

设置完参数后，系统会自动计算并显示：
- 每个教师的奖金档位
- 具体奖金金额
- 计算过程中的提示信息

### 4. 导出结果

点击"导出结果"按钮，可以将计算结果导出为Excel文件。

## 注意事项💡

1. 班均贡献度必须为非负数
2. 总奖金必须大于0
3. 最高值必须大于最低值
4. 如果计算结果超出总奖金，系统会提示调整参数

## 技术支持

如有问题或建议，请联系 869863858。

## 隐私说明

本工具在本地运行，所有数据都保存在您的浏览器中，不会上传到服务器。
