/**
 * 场景中使用的产品方案数据，与 ProductPlansCard 展示格式一致
 * 产品名与 products.ts 保持一致，确保拟真
 */
export interface ScenarioProductPlan {
  tag: string;
  tagColor: string;
  name: string;
  subName?: string;
  metrics: Array<{ label: string; value: string }>;
  service?: string;
  highlights?: string[];
  recommended?: boolean;
  closeProbability?: number;
  riskHint?: string;
}

/** 李平安拜访前推荐方案（平安添盈·臻享家医 + 平安御享金瑞） */
export const preVisitLiPinganPlans: ScenarioProductPlan[] = [
  {
    tag: '保财富',
    tagColor: 'bg-amber-500',
    name: '平安添盈·臻享家医',
    subName: '终身寿险',
    metrics: [
      { label: '保额', value: '80万' },
      { label: '交费期', value: '3年' },
      { label: '首年保费', value: '10万' },
      { label: '总保费', value: '30万' },
    ],
    service: '臻享家医服务',
    highlights: ['预估客户60岁时财富保障可达80万', '享臻享家医服务，守护家人健康'],
    recommended: true,
    closeProbability: 85,
    riskHint: '若客户对流动性敏感，建议优先讲解万能账户灵活性',
  },
  {
    tag: '保养老',
    tagColor: 'bg-blue-500',
    name: '平安御享金瑞',
    subName: '年金险',
    metrics: [
      { label: '保额', value: '180万' },
      { label: '交费期', value: '5年' },
      { label: '首年保费', value: '5万' },
      { label: '总保费', value: '25万' },
    ],
    service: '居家养老服务',
    highlights: ['60岁起每月领取养老金', '搭配万能账户灵活增值'],
    recommended: false,
    closeProbability: 72,
    riskHint: '客户对长期锁定有顾虑，需强调灵活支取',
  },
];
