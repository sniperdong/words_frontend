import { PathDB } from '@/api/words';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  Collapse,
  Message,
  Grid,
  Button,
  Input,
  Card,
} from '@arco-design/web-react';
import { StatusOK } from '@/api/const';

const Row = Grid.Row;
const Col = Grid.Col;
const TextArea = Input.TextArea;

function AdminDB() {
  const [tables, setTables] = useState<string[]>([]);
  const [tablesDDL, setTablesDDL] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [exeSql, setExeSql] = useState('');

  useEffect(() => {
    getAlltables();
  }, []);

  function getAlltables() {
    axios.get(PathDB).then((res) => {
      setTables(res.data.Data);
      const ddls = new Map<string, string>();
      res?.data?.Data?.map((v) => {
        ddls.set(v, '');
      });
      setTablesDDL(ddls);
    });
  }
  function getCreateTable(tableName: string) {
    axios
      .post(PathDB, { sql: 'show create table ' + tableName })
      .then((res) => {
        console.log(res?.data);
      });
  }
  function exe() {
    axios.post(PathDB, { sql: exeSql }).then((res) => {
      if (res?.data?.Status === StatusOK) {
        getAlltables();
        setExeSql('');
        Message.success('执行成功');
      } else {
        if (res?.data?.Msg) {
          Message.error(res?.data?.Msg);
        } else {
          Message.error('执行失败');
        }
      }
    });
  }
  return (
    <div>
      <Card>
        <Row gutter={24} align="end">
          <Col span={20}>
            <TextArea
              onChange={(v) => setExeSql(v)}
              autoSize={{ minRows: 5 }}
              value={exeSql}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" disabled={exeSql?.length == 0} onClick={exe}>
              执行
            </Button>
          </Col>
        </Row>
      </Card>
      <Collapse
        onChange={(tableName) => {
          if (
            !tablesDDL.has(tableName) ||
            tablesDDL.get(tableName).length === 0
          ) {
            getCreateTable(tableName);
          }
        }}
      >
        {tables?.map((table, idx) => {
          return (
            <Collapse.Item header={table} name={table} key={idx}>
              {tablesDDL.has(table) ? tablesDDL.get(table) : ''}
            </Collapse.Item>
          );
        })}
      </Collapse>
    </div>
  );
}

export default AdminDB;
