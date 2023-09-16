import React, { useEffect, useState, useRef } from 'react';
import { PathAdmin, PathWords } from '@/api/words';
import axios from 'axios';
import {
  Card,
  Grid,
  Form,
  Input,
  Typography,
  Button,
  Divider,
  Table,
  Checkbox,
  Message,
} from '@arco-design/web-react';
import { StatusOK } from '@/api/const';

const Row = Grid.Row;
const Col = Grid.Col;
const Item = Form.Item;
const TextArea = Input.TextArea;

const numPropertyCN = 1 << 0;
const numPropertyUN = 1 << 1;
const numPropertyVT = 1 << 2;
const numPropertyVI = 1 << 3;
const numPropertyADJ = 1 << 4;
const numPropertyADV = 1 << 5;
const numPropertyPRON = 1 << 6;
const numPropertyPREP = 1 << 7;
const numPropertyCONJ = 1 << 8;
const numPropertyNUM = 1 << 9;
const numPropertyART = 1 << 10;
const numPropertyINT = 1 << 11;

const strPropertyCN = 'cn';
const strPropertyUN = 'un';
const strPropertyVT = 'vt';
const strPropertyVI = 'vi';
const strPropertyADJ = 'adj';
const strPropertyADV = 'adv';
const strPropertyPRON = 'pron';
const strPropertyPREP = 'prep';
const strPropertyCONJ = 'conj';
const strPropertyNUM = 'num';
const strPropertyART = 'art';
const strPropertyINT = 'int';

function AdminWords() {
  // const formRef = useRef();
  const [words, setWords] = useState([]);
  const [form] = Form.useForm();
  const [pronounce, setPronounce] = useState<string>('');

  useEffect(() => {
    getWords();
  }, []);

  const getWords = () => {
    axios.get(PathWords).then((res) => {
      if (res?.data?.Status === StatusOK) {
        setWords(res?.data?.Data);
      } else {
        if (res?.data?.Msg) {
          Message.error(res?.data?.Msg);
        } else {
          Message.error('查询失败');
        }
      }
    });
  };

  const enterPronounce = (c: string) => {
    const newPronounce = pronounce + c;
    form.setFieldValue('pronounce', newPronounce);
    setPronounce(newPronounce);
  };

  const resetPronounce = () => {
    form.setFieldValue('pronounce', '');
    setPronounce('');
  };

  const showProperty = (property: number): string => {
    const properties: string[] = [];
    if (property & numPropertyCN) {
      properties.push(strPropertyCN);
    }
    if (property & numPropertyUN) {
      properties.push(strPropertyUN);
    }
    if (property & numPropertyVT) {
      properties.push(strPropertyVT);
    }
    if (property & numPropertyVI) {
      properties.push(strPropertyVI);
    }
    if (property & numPropertyADJ) {
      properties.push(strPropertyADJ);
    }
    if (property & numPropertyADV) {
      properties.push(strPropertyADV);
    }
    if (property & numPropertyPRON) {
      properties.push(strPropertyPRON);
    }
    if (property & numPropertyNUM) {
      properties.push(strPropertyNUM);
    }
    if (property & numPropertyART) {
      properties.push(strPropertyART);
    }
    if (property & numPropertyNUM) {
      properties.push(strPropertyNUM);
    }
    if (property & numPropertyCONJ) {
      properties.push(strPropertyCONJ);
    }
    if (property & numPropertyINT) {
      properties.push(strPropertyINT);
    }

    return properties.join(',');
  };
  const formatProperty = (propertyRaw: string[][]): number => {
    let property = 0;
    propertyRaw?.map((g) => {
      g?.map((v) => {
        switch (v) {
          case strPropertyCN:
            property |= numPropertyCN;
            break;
          case strPropertyUN:
            property |= numPropertyUN;
            break;
          case strPropertyVT:
            property |= numPropertyVT;
            break;
          case strPropertyVI:
            property |= numPropertyVI;
            break;
          case strPropertyADJ:
            property |= numPropertyADJ;
            break;
          case strPropertyADV:
            property |= numPropertyADV;
            break;
          case strPropertyPRON:
            property |= numPropertyPRON;
            break;
          case strPropertyPREP:
            property |= numPropertyPREP;
            break;
          case strPropertyCONJ:
            property |= numPropertyCONJ;
            break;
          case strPropertyART:
            property |= numPropertyART;
            break;
          case strPropertyNUM:
            property |= numPropertyNUM;
            break;
          case strPropertyINT:
            property |= numPropertyINT;
            break;
        }
      });
    });
    return property;
  };
  const confirm = () => {
    form.validate().then((req) => {
      const request = {
        means: req?.means,
        pronounce: req?.pronounce,
        property: formatProperty(req?.property),
        sentences: req?.sentences,
        spell: req?.spell,
        plural: '',
        past_tense: '',
        past_participle: '',
        present_participle: '',
      };
      if (
        req.property?.length > 0 &&
        (req.property[0][0] === strPropertyCN ||
          (req.property[0].length > 1 && req.property[0][1] === strPropertyCN))
      ) {
        request.plural = req.plural ? req.plural : '';
      }
      if (req.property.length > 1 || req.property[1].length > 0) {
        request.past_tense = req.past_tense ? req.past_tense : '';
        request.past_participle = req.past_participle
          ? req.past_participle
          : '';
        request.present_participle = req.present_participle
          ? req.present_participle
          : '';
      }
      axios.post(PathWords, request).then((res) => {
        if (res?.data?.Status === StatusOK) {
          form.resetFields();
          Message.success('添加成功');
          getWords();
        } else {
          if (res?.data?.Msg) {
            Message.error(res?.data?.Msg);
          } else {
            Message.error('添加失败');
          }
        }
      });
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      title: '单词',
      dataIndex: 'Word',
    },
    {
      title: '词义',
      dataIndex: 'Means',
    },
    {
      title: '音标',
      dataIndex: 'Pronounce',
    },
    {
      title: '词性',
      dataIndex: 'Property',
      render: (col, item, index) => {
        return showProperty(col);
      },
    },
    {
      title: '复数',
      dataIndex: 'Plural',
    },
    {
      title: '过去式',
      dataIndex: 'PastTense',
    },
    {
      title: '过去分词',
      dataIndex: 'PastParticiple',
    },
    {
      title: '现在分词',
      dataIndex: 'PresentParticiple',
    },
    {
      title: '例句',
      dataIndex: 'Sentences',
    },
  ];
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
            <Form
              style={{ width: 600 }}
              form={form}
              // initialValues={{ }}
              autoComplete="off"
              // onValuesChange={onValuesChange}
            >
              <Item label="单词" field="spell" rules={[{ required: true }]}>
                <Input
                  style={{ width: 270 }}
                  placeholder="please enter the word"
                />
              </Item>
              <Item
                noStyle
                shouldUpdate={(prev, next) => prev.type !== next.type}
              >
                <Row gutter={24}>
                  <Col span={15}>
                    <Item
                      label="音标"
                      field="pronounce"
                      rules={[{ required: true }]}
                      disabled
                    >
                      <Input
                        style={{ width: 270 }}
                        placeholder="enter pronounce"
                      />
                    </Item>
                  </Col>
                  <Col span={6}>
                    <Item>
                      <Button onClick={resetPronounce}>clear</Button>
                    </Item>
                  </Col>
                </Row>
              </Item>
              <Item label="词义" field="means" rules={[{ required: true }]}>
                <Input
                  style={{ width: 270 }}
                  placeholder="enter means of the word"
                />
              </Item>
              <Item label="词性" rules={[{ required: true }]}>
                <Item label="名词" field="property[0]">
                  <Checkbox.Group
                    options={[
                      { label: '可数名词', value: strPropertyCN },
                      { label: '不可数名词', value: strPropertyUN },
                    ]}
                    style={{ display: 'block' }}
                  />
                </Item>
                <Item label="动词" field="property[1]">
                  <Checkbox.Group
                    options={[
                      { label: '及物动词', value: strPropertyVT },
                      { label: '不及物动词', value: strPropertyVI },
                    ]}
                    style={{ display: 'block' }}
                  />
                </Item>
                <Item label="其它" field="property[2]">
                  <Checkbox.Group
                    options={[
                      { label: '形容词', value: strPropertyADJ },
                      { label: '副词', value: strPropertyADV },
                      { label: '代词', value: strPropertyPRON },
                      { label: '介词', value: strPropertyPREP },
                      { label: '连词', value: strPropertyCONJ },
                      { label: '数词', value: strPropertyNUM },
                      { label: '冠词', value: strPropertyART },
                      { label: '感叹词', value: strPropertyINT },
                    ]}
                    style={{ display: 'block' }}
                  />
                </Item>
              </Item>
              <Form.Item shouldUpdate noStyle>
                {(values) => {
                  return values.property?.length > 0 &&
                    values.property[0]?.length > 0 &&
                    (values.property[0][0] === strPropertyCN ||
                      (values.property[0][1] &&
                        values.property[0][1] === strPropertyCN)) ? (
                    <Form.Item
                      field="plural"
                      label="复数"
                      wrapperCol={{ span: 8 }}
                    >
                      <Input />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>
              <Form.Item shouldUpdate noStyle>
                {(values) => {
                  return values.property?.length > 1 &&
                    values?.property[1]?.length > 0 ? (
                    <div>
                      <Form.Item
                        field="past_tense"
                        label="过去式"
                        wrapperCol={{ span: 8 }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        field="past_participle"
                        label="过去分词"
                        wrapperCol={{ span: 8 }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        field="present_participle"
                        label="现在分词"
                        wrapperCol={{ span: 8 }}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ) : null;
                }}
              </Form.Item>
              <Item label="例句" field="sentences" rules={[{ required: true }]}>
                <TextArea
                  autoSize={{ minRows: 3 }}
                  style={{ minHeight: 64, width: 350 }}
                />
              </Item>
              <Item wrapperCol={{ offset: 5 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 24 }}
                  onClick={confirm}
                >
                  Submit
                </Button>
                <Button
                  style={{ marginRight: 24 }}
                  onClick={() => {
                    form.resetFields();
                    setPronounce('');
                  }}
                >
                  Reset
                </Button>
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
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɑ:')}
                >
                  ɑ:
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɜː')}
                >
                  ɜː
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('i:')}
                >
                  i:
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɔ:')}
                >
                  ɔ:
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('u:')}
                >
                  u:
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>长元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ʌ')}
                >
                  ʌ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ə')}
                >
                  ə
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɪ')}
                >
                  ɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɒ')}
                >
                  ɒ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ʊ')}
                >
                  ʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('e')}
                >
                  e
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('æ')}
                >
                  æ
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>双元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('eɪ')}
                >
                  eɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('aɪ')}
                >
                  aɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɔɪ')}
                >
                  ɔɪ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('aʊ')}
                >
                  aʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('əʊ')}
                >
                  əʊ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ɪə')}
                >
                  ɪə
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('eə')}
                >
                  eə
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ʊə')}
                >
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
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('p')}
                >
                  p
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('b')}
                >
                  b
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('t')}
                >
                  t
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('d')}
                >
                  d
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('k')}
                >
                  k
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('g')}
                >
                  g
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>摩擦音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('f')}
                >
                  f
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('v')}
                >
                  v
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('s')}
                >
                  s
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('z')}
                >
                  z
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('θ')}
                >
                  θ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ð')}
                >
                  ð
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('∫')}
                >
                  ∫
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ʒ')}
                >
                  ʒ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('h')}
                >
                  h
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>塞擦音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('t∫')}
                >
                  t∫
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('dʒ')}
                >
                  dʒ
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('tr')}
                >
                  tr
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('dr')}
                >
                  dr
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ts')}
                >
                  ts
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('dz')}
                >
                  dz
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>鼻音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('m')}
                >
                  m
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('n')}
                >
                  n
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('ŋ')}
                >
                  ŋ
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>舌边音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('r')}
                >
                  r
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('l')}
                >
                  l
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <Typography.Text>半元音</Typography.Text>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('w')}
                >
                  w
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('j')}
                >
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
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce("'")}
                >
                  &lsquo;
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce(',')}
                >
                  ,
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('/')}
                >
                  /
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce('(')}
                >
                  (
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  type="text"
                  size="mini"
                  onClick={(e) => enterPronounce(')')}
                >
                  )
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Table
        data={words}
        columns={columns}
        pagination={{
          total: words?.length ? words.length : 0,
          pageSize: 10,
        }}
      />
    </div>
  );
}

export default AdminWords;
