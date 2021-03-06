import React, { useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Tabs,
  Checkbox,
  Tooltip,
  Icon,
  Typography,
  Alert,
  Card,
} from 'antd';
import Frown from '@ant-design/icons/Frown';
import Delete from '@ant-design/icons/Delete';
import Stop from '@ant-design/icons/Stop';
import { useInput, useCheckbox, useSelect, useHistory } from '@/utils/useHooks';
import { calculate } from '@/utils/cal';
import styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

const TYPE_LIST = [['steam', '蒸汽'], ['oil', '石油'], ['hydrogen', '氢气']];

export function renderInputRow(title, props) {
  return (
    <tr>
      <th>{title}</th>
      <td>
        <InputNumber {...props} />
      </td>
    </tr>
  );
}

export default function() {
  const researchCount = useSelect(0);
  const warehouseCount = useSelect(0);
  const gasCount = useSelect(0);
  const liquidCount = useSelect(0);
  const creatureCount = useSelect(0);
  const visitorRoomCount = useSelect(0);

  const type = useSelect('steam');
  const oxygen = useSelect('solid');

  const distance = useInput(10000);
  const waste = useCheckbox(false);

  const [result, setResult] = useState(null);

  // 历史记录
  const [historyList, setHistoryList] = useHistory([]);

  const isSteam = type.value === 'steam';

  // 填写数值
  function fillQuery(query) {
    researchCount.setValue(query.research);
    warehouseCount.setValue(query.warehouse);
    gasCount.setValue(query.gas);
    liquidCount.setValue(query.liquid);
    creatureCount.setValue(query.creature);
    visitorRoomCount.setValue(query.visitorRoom);

    type.setValue(query.type);
    oxygen.setValue(query.oxygenType);

    distance.setValue(query.distance);
    waste.setValue(query.waste);
  }

  const onSubmit = ({ isHistory, ...history }) => {
    const query = isHistory
      ? history
      : {
          type: type.value,
          distance: distance.value,
          allowWaste: waste.checked,
          oxygenType: oxygen.value,

          research: researchCount.value,
          warehouse: warehouseCount.value,
          gas: gasCount.value,
          liquid: liquidCount.value,
          creature: creatureCount.value,
          visitorRoom: visitorRoomCount.value,
        };

    const newResult = calculate(query);

    setResult(newResult);

    // 添加历史
    if (!isHistory) {
      setHistoryList([...historyList, query].slice(0, 20));
    }
  };

  return (
    <Card title="火箭计算">
      <div
        onKeyPress={({ which }) => {
          if (which === 13) {
            onSubmit();
          }
        }}
      >
        <Row gutter={16}>
          {/* 第一列 */}
          <Col xs={24} sm={12} md={9}>
            <table className={styles.table}>
              <tbody>
                {/* ===================== 搜刮 ===================== */}
                {/* 研究仓 */}
                {renderInputRow('研究仓数量', researchCount)}

                {/* 货仓 */}
                {renderInputRow('货仓数量', warehouseCount)}

                {/* 气仓 */}
                {renderInputRow('气体仓数量', gasCount)}

                {/* 液体仓 */}
                {renderInputRow('液体仓数量', liquidCount)}

                {/* 生物仓 */}
                {renderInputRow('生物仓数量', creatureCount)}

                {/* 生物仓 */}
                {renderInputRow('观光仓数量', visitorRoomCount)}

                {/* ===================== 引擎 ===================== */}
                <tr className={styles.line}>
                  <td colSpan={2} />
                </tr>

                {/* 引擎类型 */}
                <tr>
                  <th>引擎类型</th>
                  <td>
                    <Select {...type}>
                      {TYPE_LIST.map(([value, name]) => (
                        <Option key={value} value={value}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  </td>
                </tr>

                {/* 氧化剂类型 */}
                {!isSteam && (
                  <tr>
                    <th>氧化剂</th>
                    <td>
                      <Select {...oxygen}>
                        <Option value="solid">氧石</Option>
                        <Option value="liquid">液氧</Option>
                      </Select>
                    </td>
                  </tr>
                )}

                {/* 飞行距离 */}
                <tr>
                  <th>飞行距离</th>
                  <td>
                    <Input className={styles.input} type="number" {...distance} addonAfter="KM" />
                  </td>
                </tr>

                {/* 允许浪费 */}
                <tr>
                  <th />
                  <td>
                    <Tooltip
                      overlayClassName={styles.tooltip}
                      placement="topLeft"
                      title="例如同时存在 “3 个燃料舱，0 个助推器” 和 “3 个燃料舱，1 个助推器” 都可行时，保留这两个结果。"
                    >
                      <Checkbox {...waste}>允许组件浪费</Checkbox>
                    </Tooltip>
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <Button type="primary" icon="laptop" onClick={onSubmit}>
                      计算需求
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>

          {/* 第二列 */}
          <Col xs={24} sm={12} md={historyList.length ? 8 : 15}>
            <div className={styles.result}>
              {result &&
                (result.length ? (
                  <Tabs tabBarGutter={8}>
                    {result.map((solution, index) => (
                      <TabPane tab={`方案 ${index + 1}`} key={index}>
                        <div>
                          {solution.fuelCount ? <p>燃料舱 {solution.fuelCount} 个</p> : ''}
                          {solution.oxygenCount ? <p>氧气舱 {solution.oxygenCount} 个</p> : ''}
                          {solution.booster ? <p>助推器 {solution.booster} 个</p> : ''}
                          <p>燃料 {solution.capacity} 千克</p>

                          <h4>统计：</h4>
                          {solution.dryWeight ? <p>干重量 {solution.dryWeight} 千克</p> : ''}
                          {solution.wetWeight ? <p>湿重量 {solution.wetWeight} 千克</p> : ''}
                          <p>总重量 {solution.weight} 千克</p>
                          <p>理想距离 {solution.mergedDistance} 千米</p>
                          <p>惩罚距离 {solution.punish} 千米</p>
                          <p>实际距离 {solution.finalDistance} 千米</p>
                        </div>
                      </TabPane>
                    ))}
                  </Tabs>
                ) : (
                  <h1>
                    <Frown /> 没有可行的方案
                  </h1>
                ))}
            </div>
          </Col>

          {/* 第三列 */}
          {!!historyList.length && (
            <Col xs={24} sm={24} md={7}>
              <Alert
                type="info"
                message={
                  <div className={styles.history}>
                    <Title level={4}>
                      历史记录
                      <a
                        style={{ float: 'right' }}
                        className={styles.remove}
                        onClick={() => {
                          setHistoryList([]);
                        }}
                      >
                        <Delete />
                      </a>
                    </Title>
                    <ul>
                      {historyList.map((history, index) => {
                        const { distance, type } = history;
                        const typeStr = TYPE_LIST.find(([t]) => t === type)[1];
                        const oxygenStr = oxygen.value === 'solid' ? '氧石' : '液氧';
                        return (
                          <li key={index}>
                            <a
                              className={styles.remove}
                              onClick={() => {
                                setHistoryList(historyList.filter(item => item !== history));
                              }}
                            >
                              <Stop />
                            </a>
                            {' | '}
                            <a
                              onClick={() => {
                                // 填入数据
                                fillQuery(history);
                                onSubmit({ ...history, isHistory: true });
                              }}
                            >
                              [{typeStr} - {oxygenStr}] {distance} KM
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                }
              />
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
}
