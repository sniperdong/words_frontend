import React, { useEffect, useState } from 'react';
import { PathAdmin } from '@/api/words';
import axios from 'axios';
import {
  Card,
  Grid,
  Form,
  Input,
  Typography,
  Button,
  Divider,
  Radio,
  Checkbox,
} from '@arco-design/web-react';

const Row = Grid.Row;
const Col = Grid.Col;
const Item = Form.Item;
const TextArea = Input.TextArea;

function AdminWords() {
  const [admin, setAdmin] = useState<string>('');

  useEffect(() => {
    axios.get(PathAdmin).then((res) => {
      setAdmin(res.data);
    });
  }, []);

  return (
    <div>
      <Row gutter={20}>
        <Col span={16}>
          <Card
            title="新增单词"
            // extra={extra}
            bordered={false}
            style={{ width: '100%' }}
          >
            <Form style={{ width: 600 }} autoComplete="off">
              <Item label="单词" field="spell">
                <Input
                  style={{ width: 270 }}
                  placeholder="please enter the word"
                />
              </Item>
              <Item label="音标" field="pronounce" disabled>
                <Input style={{ width: 270 }} placeholder="select pronounce" />
              </Item>
              <Item label="词性" field="property">
                <Checkbox.Group
                  options={[
                    { label: '可数名词', value: 'n' },
                    { label: '不可数名词', value: 'n' },
                  ]}
                  style={{ display: 'block' }}
                />
                <Checkbox.Group
                  options={[
                    { label: '及物动词', value: 'vt' },
                    { label: '不及物动词', value: 'vi' },
                  ]}
                  style={{ display: 'block' }}
                />
                <Checkbox.Group
                  options={[
                    { label: '形容词', value: 'adj' },
                    { label: '副词', value: 'adv' },
                    { label: '代词', value: 'pron' },
                    { label: '介词', value: 'prep' },
                    { label: '连词', value: 'conj' },
                    { label: '数词', value: 'num' },
                    { label: '冠词', value: 'art' },
                    { label: '感叹词', value: 'int' },
                  ]}
                  style={{ display: 'block' }}
                />
              </Item>
              <Item label="例句" field="sentence">
                <TextArea
                  autoSize={{ minRows: 3 }}
                  style={{ minHeight: 64, width: 350 }}
                />
              </Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="音标"
            // extra={extra}
            bordered={false}
            style={{ width: '100%' }}
          >
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>短元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɑ:
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɜː
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  i:
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɔ:
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  u:
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>长元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ʌ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ə
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɒ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  e
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  æ
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>双元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  eɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  aɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɔɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  aʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  əʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ɪə
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  eə
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ʊə
                </Button>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>爆破音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  p
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  b
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  t
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  d
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  k
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  g
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>摩擦音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  f
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  v
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  s
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  z
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  θ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ð
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ∫
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ʒ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  h
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>塞擦音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  t∫
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  dʒ
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  tr
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  dr
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ts
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  dz
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>鼻音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  m
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  n
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ŋ
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>舌边音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  r
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  l
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>半元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  w
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  j
                </Button>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>元素</Typography.Text>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  &lsquo;
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  ,
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  /
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  (
                </Button>
              </Col>
              <Col span={2}>
                <Button type="text" size="mini">
                  )
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminWords;
