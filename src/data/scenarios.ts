import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  // Module 1: 每月初，提醒代理人盘点客户
  {
    id: 'monthly-review',
    name: '每月初，提醒代理人盘点客户',
    icon: '📋',
    description: '每月初',
    steps: [
      // Step 0: 提醒盘点客户
      {
        aiMessages: [
          {
            type: 'text',
            content: '新的一个月开始啦，记得完成客户盘点哦。这是为您推荐的精选客户名单。',
            speechText: '张经理，新的一个月开始啦，记得完成客户盘点哦。',
          },
          {
            type: 'customer-card',
            content: '',
            data: { customerId: 'c2' },
            delay: 400,
          },
          {
            type: 'customer-card',
            content: '',
            data: { customerId: 'c3' },
            delay: 300,
          },
          {
            type: 'customer-card',
            content: '',
            data: { customerId: 'c4' },
            delay: 300,
          },
        ],
        quickReplies: [
          { label: '确认盘点结果', value: 'review-all' },
          { label: '查看经营客户列表', value: 'view-list' },
        ],
      },
      // Step 1: 完成盘点 + 生成经营计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '已为您完成本月全部客户的盘点。根据盘点的客户，为您生成当月经营计划，请查收。',
            speechText: '盘点完成了，经营计划也生成好了，请过目。',
          },
          {
            type: 'monthly-plan',
            content: '',
            data: {
              plans: [
                { label: '触客计划', icon: '📱', target: 50, completed: 0, unit: '次', color: '#667eea' },
                { label: '面访计划', icon: '🤝', target: 15, completed: 0, unit: '次', color: '#764ba2' },
                { label: '邀约计划', icon: '📩', target: 8, completed: 0, unit: '次', color: '#6366f1' },
              ],
              upgradeTarget: '5位中温客户提升至高温',
            },
            delay: 500,
          },
          {
            type: 'customer-grid',
            content: '',
            data: {
              grid: [
                [
                  { label: '高温高价值', count: 3 },
                  { label: '高温中价值', count: 2 },
                  { label: '高温低价值', count: 1 },
                ],
                [
                  { label: '中温高价值', count: 5 },
                  { label: '中温中价值', count: 4 },
                  { label: '中温低价值', count: 2 },
                ],
                [
                  { label: '低温高价值', count: 8 },
                  { label: '低温中价值', count: 6 },
                  { label: '低温低价值', count: 3 },
                ],
              ],
              tip: '建议优先经营中温高价值客户，提升成交概率',
            },
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '确认经营计划', value: 'view-customers' },
        ],
      },
      // Step 2: 查看经营客户列表
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '已为您整理好本月客户经营清单，并根据每位客户的特点推荐了经营动作，您可以一键转发经营素材和参考话术，高效完成客户经营。',
            speechText: '清单整理好了，每位客户都有推荐动作，您可以直接操作。',
          },
          {
            type: 'customer-list',
            content: '',
            data: {
              totalCount: 34,
              customers: [
                {
                  name: '赵高',
                  temperature: '高温',
                  value: '高价值',
                  action: '面访沟通养老规划方案',
                  actionIcon: '🤝',
                  tags: ['高净值', '保养老'],
                  lastContact: '本月',
                },
                {
                  name: '王建国',
                  temperature: '高温',
                  value: '高价值',
                  action: '面访讲解子女教育金',
                  actionIcon: '🤝',
                  tags: ['加保意向', '子女教育'],
                  lastContact: '本月',
                },
                {
                  name: '李美琳',
                  temperature: '高温',
                  value: '中价值',
                  action: '电话沟通重疾保障方案',
                  actionIcon: '📱',
                  tags: ['保障意识强', '重疾缺口'],
                  lastContact: '本月',
                },
                {
                  name: '张伟',
                  temperature: '中温',
                  value: '高价值',
                  action: '发送保障科普素材',
                  actionIcon: '📩',
                  tags: ['首次接触', '高收入'],
                  lastContact: '本月',
                },
                {
                  name: '陈晓雯',
                  temperature: '中温',
                  value: '中价值',
                  action: '推送养老年金产品资料',
                  actionIcon: '📩',
                  tags: ['理财需求', '养老规划'],
                  lastContact: '本月',
                },
                {
                  name: '刘大明',
                  temperature: '低温',
                  value: '高价值',
                  action: '节日问候维护关系',
                  actionIcon: '📱',
                  tags: ['老客户', '传承需求'],
                  lastContact: '本月',
                },
              ],
              summary: '建议优先跟进高温高价值客户赵高、王建国，本月面访目标15次，当前已完成0次',
            },
            delay: 500,
          },
        ],
        quickReplies: [],
      },
      // Step 3: 添加计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '已帮您添加下周一14点拜访李平安的计划',
            speechText: '好的，已添加拜访计划。',
          },
          {
            type: 'schedule-card',
            content: '',
            data: {
              title: '李平安经营计划',
              days: [
                {
                  day: '下周一',
                  items: [{ time: '14:00', task: '面访李平安 - 沟通养老规划方案', type: 'visit' }],
                },
              ],
            },
            delay: 400,
          },
        ],
        quickReplies: [],
      },
    ],
  },

  // Module 2: 每周初，提醒本周经营计划
  {
    id: 'weekly-plan',
    name: '每周初，提醒本周经营计划',
    icon: '📅',
    description: '每周初',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '本周共有7个经营计划需要完成，请查收。后续我会持续提醒您，帮您按时推进。同时，为您推送本周行事历。',
            speechText: '张经理，本周有7个计划，行事历已推送给您。',
          },
          {
            type: 'schedule-card',
            content: '',
            data: {
              title: '本周行事历',
              days: [
                {
                  day: '周一',
                  items: [{ time: '14:00', task: '拜访李平安', type: 'visit' }],
                },
                {
                  day: '周二',
                  items: [{ time: '15:00', task: '拜访张伟', type: 'visit' }],
                },
                {
                  day: '周三',
                  items: [{ time: '15:00', task: '拜访王萍', type: 'visit' }],
                },
                {
                  day: '周四',
                  items: [{ time: '16:00', task: '拜访赵高', type: 'visit' }],
                },
                {
                  day: '周五',
                  items: [{ time: '17:00', task: '拜访崔丽', type: 'visit' }],
                },
                {
                  day: '周六',
                  items: [
                    { time: '14:00', task: '拜访李霞', type: 'visit' },
                    { time: '16:00', task: '拜访王明', type: 'visit' },
                  ],
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '确认，收到', value: 'back-to-menu' },
          { label: '微调计划', value: 'adjust-plan' },
        ],
      },
    ],
  },

  // Module 3: 某天，客户拜访前
  {
    id: 'pre-visit',
    name: '某天，客户拜访前',
    icon: '💼',
    description: '拜访前',
    steps: [
      // Step 0: 提醒拜访
      {
        aiMessages: [
          {
            type: 'text',
            content: '今日14点要去拜访客户李平安。',
            speechText: '今天下午两点要拜访李平安，需要帮您准备方案吗？',
          },
          {
            type: 'text',
            content: '提前分析客户需求、准备产品方案，有助于提高促成概率。需要帮您定制一份产品方案吗？',
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '确认，帮我定制方案', value: 'analyze' },
          { label: '稍后再说', value: 'back-to-menu' },
        ],
      },
      // Step 1: 自动化分析流程（需求分析 → 保障检视 → 方案推荐，自动折叠）
      {
        aiMessages: [
          // 需求分析（逐项展示 → 自动折叠）
          {
            type: 'collapsible-step',
            content: '',
            speechText: '正在分析李平安的客户画像。45岁，社会中坚客群，重点需求：保财富、保养老。',
            data: {
              title: '需求分析',
              stepIcon: '🔍',
              autoCollapse: true,
              collapseDelay: 3000,
              itemRevealDelay: 1500,
              firstItemDelay: 800,
              summary: '李平安，45岁，社会中坚客群 | 重点需求：保财富、保养老',
              items: [
                {
                  type: 'customer-card',
                  data: { customerId: 'c1', detailed: true },
                },
                {
                  type: 'customer-profile-grid',
                  data: {
                    customerName: '李平安',
                    highlightRow: 3,
                    highlightCol: 2,
                    segment: '社会中坚客群',
                    painPoints: ['子女优质教育费用高', '父母健康养老焦虑'],
                    description: '处于社会中坚客群，子女教育占家庭收入35%',
                  },
                },
                {
                  type: 'text',
                  content:
                    '📊 李平安，45岁，属于社会中坚客群，面临资产贬值、养老储备不足的风险，重点需求是保财富、保养老',
                },
              ],
            },
            delay: 7500,
          },

          // 保障检视（逐项展示 → 自动折叠）
          {
            type: 'collapsible-step',
            content: '',
            speechText: '接下来进行保障检视，结合李平安在平安内外部的保单情况，分析保障缺口。',
            data: {
              title: '保障检视',
              stepIcon: '📊',
              autoCollapse: true,
              collapseDelay: 3000,
              itemRevealDelay: 1500,
              firstItemDelay: 800,
              summary: '财富缺口80万，养老缺口180万（含中银保信同业数据）',
              items: [
                {
                  type: 'coverage-analysis',
                  data: { customerName: '李平安' },
                },
                {
                  type: 'text',
                  content:
                    '📈 结合客户内外部保险数据分析，李平安存在财富缺口80万，养老缺口180万',
                },
              ],
            },
            delay: 6000,
          },

          // 方案推荐（保持展开）
          {
            type: 'product-plans',
            content: '',
            speechText: '根据需求分析和保障缺口，已为李平安智能匹配产品方案，您可以查看详情。',
            data: {
              needsSummary:
                '根据客户需求及保险缺口，智能匹配以下产品方案：',
            },
            delay: 500,
          },
          {
            type: 'visit-strategy',
            content: '',
            data: {
              customerName: '李平安',
              successProbability: 82,
              riskPoints: ['客户对流动性敏感，需重点讲解万能账户灵活性'],
              sections: [
                {
                  title: '历史案例参考',
                  icon: '📖',
                  items: [
                    '张先生，46岁企业高管，同属社会中坚客群，保障缺口与李平安相似，最终选择"年金险+增额终身寿"组合方案，年缴保费4万元，兼顾教育金储备与养老规划',
                    '赵女士，43岁，也面临财富缺口和养老缺口双重需求，通过分阶段投保策略，首年年缴2.5万元，次年追加至4万元，客户接受度更高',
                  ],
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '查看方案详情', value: 'sales-benefit' },
          { label: '查看销售攻略', value: 'sales-strategy' },
        ],
        quickReplyDelay: 2500,
      },
      // Step 2: 测算销售利益
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '促成以上方案后，您可获得收入7500元（含首佣FYC6000元，销售津贴1500元）还差4500C即可满足晋级P4的累计FYC标准，还差4000C可达标金钻，加油！',
            speechText: '促成后收入7500元，离晋级和达标都不远了，加油！',
          },
        ],
        quickReplies: [
          { label: '查看销售攻略', value: 'sales-strategy' },
          { label: '准备出发拜访', value: 'back-to-menu' },
        ],
      },
      // Step 3: 匹配销售攻略
      {
        aiMessages: [
          {
            type: 'text',
            content: '为了帮您促成销售，已根据客户画像为您生成适合李平安的个性化经营建议，助您高效沟通、顺利出单。',
            speechText: '销售攻略已生成，祝您拜访顺利！',
          },
          {
            type: 'visit-strategy',
            content: '',
            data: {
              customerName: '李平安',
              successProbability: 82,
              riskPoints: ['客户对流动性敏感，需重点讲解万能账户', '上次沟通已建立信任，本次可适当推进促成'],
              sections: [
                {
                  title: '沟通技巧建议',
                  icon: '💬',
                  items: [
                    '以教育金规划为切入点，结合客户子女年龄引发共鸣',
                    '运用数据对比法，展示保障缺口的紧迫性',
                    '适时提出方案，把握客户决策窗口期',
                  ],
                },
                {
                  title: '异议处理要点',
                  icon: '⚠️',
                  items: [
                    '若客户担心资金流动性，强调万能账户灵活支取功能',
                    '若客户犹豫不决，引导关注教育金时间窗口的紧迫性',
                  ],
                },
                {
                  title: '历史案例参考',
                  icon: '📖',
                  items: [
                    '陈先生，42岁企业高管，同属社会中坚客群，通过"教育金+养老规划"组合方案切入，最终促成年缴保费3万元',
                    '刘女士，48岁，与李平安需求相似，初次面谈时同样对流动性有顾虑，经万能账户灵活性讲解后第二次面谈成功签约',
                  ],
                },
                {
                  title: '注意事项',
                  icon: '📌',
                  items: [
                    '客户对资金灵活性较敏感，避免过度强调长期锁定',
                    '上次沟通已建立初步信任，本次可适当推进促成动作',
                  ],
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '好的，准备出发', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // Module 4: 某天，客户拜访后
  {
    id: 'post-visit',
    name: '某天，客户拜访后',
    icon: '📝',
    description: '拜访后',
    steps: [
      // Step 0: 开始记录
      {
        aiMessages: [
          {
            type: 'text',
            content: '下午好！看到您刚完成对客户李平安的拜访，沟通情况如何？告诉我，我可以帮您记录',
            speechText: '下午好！拜访结束了，可以告诉我具体的拜访情况吗？我来帮您记录',
          },
        ],
        quickReplies: [{ label: '确认，开始记录', value: 'start-record' }],
      },
      // Step 1: 模拟语音记录 + 生成总结
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '🎙️ 已识别您的语音记录：\n\n「刚刚拜访完客户李平安，聊得还挺顺利。一开始我们先寒暄了一下，客户说最近在考虑孩子的教育金问题，但又担心年金险太死板，钱放进去就拿不出来，不太灵活。我跟他说年金可以搭配万能账户，灵活性会好一些，他也点了几下头，但还是有点犹豫。后来我进一步介绍了【平安添盈·臻享家医】方案，并结合客户孩子的成长路径做了演示，客户最终决定投保。」\n\n「聊的过程中还了解到，客户目前在香蜜湖有一套房，名下有两辆车，一辆宝马，一辆特斯拉，家庭经济状况比较稳健，年收入120万左右。客户本人是公司合伙人，生日是9月12号，太太主要负责家庭理财和孩子教育支出。」',
            speechText: '语音已识别。',
          },
          {
            type: 'text',
            content: '已为您记录拜访内容，正在为您生成拜访总结。',
            delay: 800,
          },
          {
            type: 'visit-summary',
            content: '',
            data: {
              customerName: '李平安',
              date: '2025年2月14日',
              duration: '45分钟',
              location: '深圳福田区香蜜湖',
              attendees: '李平安（客户）',
              keyPoints: [
                '客户关注子女教育金储备，同时对养老规划有一定兴趣',
                '介绍【平安添盈·臻享家医】方案，结合孩子成长路径做演示',
                '客户最终决定投保，成功促成',
                '年收入约120万，名下房产（香蜜湖）、两辆车（宝马、特斯拉）',
                '客户为公司合伙人，太太主理家庭理财，生日9月12日',
              ],
              nextActions: [
                '跟进保单进度，确保顺利承保',
                '9月12日生日节点开展客户关怀',
                '后续探索养老规划加保机会',
              ],
              sentiment: '积极正面',
              closeProbability: 90,
            },
            speechText: '好的。',
            delay: 500,
          },
          {
            type: 'text',
            content: '李平安成功投保，您本月又离目标近了一步！本次拜访信息及客户情况已整理完毕，请确认是否正确？',
            speechText: '李平安成功投保，恭喜！拜访信息已整理完毕，请确认。',
            delay: 800,
          },
        ],
        quickReplies: [
          { label: '确认', value: 'confirm-update' },
        ],
      },
      // Step 2: 确认更新 + 推荐附近客户
      {
        aiMessages: [
          {
            type: 'text',
            content: '已同步更新本次拜访信息及客户情况到李平安的客户档案',
            speechText: '好的，已完成李平安客户档案更新。另外这附近还有两位客户，建议您可以顺路拜访。',
          },
          {
            type: 'text',
            content: '您当前在福田区香蜜湖街道，附近还有两位客户，建议您安排拜访',
            delay: 500,
          },
          {
            type: 'nearby-customers',
            content: '',
            data: {
              customers: [
                {
                  name: '李四',
                  distance: '500m',
                  address: '同小区',
                  tag: '中温客户·关注子女教育金',
                  lastContact: '2周前',
                  note: '中温客户，关注子女教育金',
                },
                {
                  name: '王五',
                  distance: '1.2km',
                  address: '同商圈',
                  tag: '高意向客户',
                  lastContact: '1周前',
                  note: '高意向客户，已预约下次面谈',
                },
              ],
            },
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '拜访王五', value: 'visit-wangwu' },
        ],
      },
      // Step 3: 准备拜访王五
      {
        aiMessages: [
          {
            type: 'text',
            content: '好的，我先帮你分析王五的客户画像和沟通重点，方便您高效推进拜访。',
            speechText: '好的',
          },
          {
            type: 'customer-card',
            content: '',
            data: { customerId: 'c7', detailed: true },
            delay: 800,
          },
          {
            type: 'visit-strategy',
            content: '',
            data: {
              customerName: '王五',
              successProbability: 78,
              riskPoints: ['客户已有医疗险，切勿重复推荐同类产品'],
              sections: [
                {
                  title: '客户核心需求',
                  icon: '🎯',
                  items: [
                    '子女教育金储备（长子12岁，3年后面临高中及留学规划）',
                    '家庭财富稳健增值，抵御通胀风险',
                  ],
                },
                {
                  title: '切入话题建议',
                  icon: '💬',
                  items: [
                    '从孩子教育规划入手，了解留学意向和费用预期',
                    '结合企业经营现金流，探讨资产配置方案',
                  ],
                },
                {
                  title: '推荐产品方向',
                  icon: '📦',
                  items: [
                    '教育年金险：锁定未来教育费用',
                    '增额终身寿：兼顾财富增值与灵活支取',
                  ],
                },
                {
                  title: '历史案例参考',
                  icon: '📖',
                  items: [
                    '周先生，40岁企业主，长子10岁，通过教育年金+增额终身寿组合方案，年缴保费5万元，成功锁定子女留学费用并兼顾家庭财富增值',
                    '吴女士，38岁，同样关注子女教育规划，首次面谈从孩子兴趣班支出切入，第二次面谈促成教育年金险签约，年缴2.5万元',
                  ],
                },
                {
                  title: '注意事项',
                  icon: '⚠️',
                  items: [
                    '客户已有医疗险，切勿重复推荐同类产品',
                    '上次面谈已建立信任，本次可适当推进促成动作',
                  ],
                },
              ],
            },
            speechText: '王五的客户画像和沟通策略已准备好，建议从孩子教育规划切入。',
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '帮我定制产品方案', value: 'back-to-menu' },
          { label: '准备出发拜访', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // Module 5: 某天晚上：辅导下属
  {
    id: 'team-coaching',
    name: '某天晚上：辅导下属',
    icon: '👥',
    description: '晚上',
    steps: [
      // Step 0: 全组分析
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '当前团队整体经营计划完成率50%，其中面访完成率30%，低于预期。有两位组员的面访偏少，建议重点关注。本月团队累计承保FYC2.1万，营业部排第4名。其中，已连钻2个月的李明本月尚未达钻，是否需要为您分析他的具体情况，看看问题出在哪里？',
            speechText: '张经理，团队完成率50%，李明本月还没达钻，需要看看情况吗？',
          },
          {
            type: 'team-dashboard',
            content: '',
            data: { members: 'all' },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '需要，分析李明情况', value: 'analyze-liming' },
          { label: '查看全组数据', value: 'view-data' },
        ],
      },
      // Step 1: 辅助面谈
      {
        aiMessages: [
          {
            type: 'text',
            content: '李明本月面访完成率低于20%，建议加强面访技巧训练。',
            speechText: '李明面访完成率偏低，面谈方案已为您生成。',
          },
          {
            type: 'member-card',
            content: '',
            data: { memberId: 't1' },
            delay: 400,
          },
          {
            type: 'ability-analysis',
            content: '',
            data: {
              memberName: '李明',
              metrics: [
                { label: '触客完成率', value: '80%', status: 'good' },
                { label: '面访完成率', value: '20%', status: 'danger' },
                { label: '邀约转化率', value: '偏低', status: 'warning' },
              ],
              skills: [
                { label: '需求挖掘', level: 'strong' },
                { label: '方案呈现', level: 'strong' },
                { label: '异议处理', level: 'weak' },
                { label: '促成动作', level: 'weak' },
              ],
            },
            delay: 600,
          },
          {
            type: 'text',
            content:
              '为更好地帮助李明达钻，建议您组织一次面谈，进行针对性辅导。已为您生成面谈方案：',
            delay: 400,
          },
          {
            type: 'coaching-plan',
            content: '',
            data: {
              memberName: '李明',
              target: '达钻',
              targetDetail: '初佣≥3500元 且 寿险长险≥2件',
              suggestion: '建议加强面访技巧训练，重点突破异议处理和促成动作短板',
              trainings: [
                { type: '课程', title: '《如何高效完成客户面访》' },
                { type: '课程', title: '《年金险沟通实战技巧》' },
                { type: '演练', title: '《实战演练：年金险方案客户促成及异议处理》' },
              ],
            },
            delay: 600,
          },
        ],
        quickReplies: [],
      },
    ],
  },

  // Module 6: 每周末，形成周工作总结
  {
    id: 'weekly-summary',
    name: '每周末，形成周工作总结',
    icon: '📊',
    description: '周末',
    steps: [
      // Step 0: 提醒做周工作总结
      {
        aiMessages: [
          {
            type: 'text',
            content: '本周即将结束，已为您生成本周工作总结，请查收。',
            speechText: '张经理，已为您生成本周工作总结。是否让我进一步为您分析薄弱环节？',
          },
          {
            type: 'work-summary',
            content: '',
            data: {
              period: '本周（2025年2月10日 - 2月14日）',
              metrics: {
                contact: { label: '触客次数', actual: 20, target: 30 },
                faceVisit: { label: '面访次数', actual: 6, target: 10 },
                invitation: { label: '邀约转化率', actual: 30, target: 50 },
              },
              highlights: ['本周整体经营节奏稳定，按计划推进客户跟进'],
              improvements: [
                '邀约转化率仅30%，低于团队平均水平（45%）',
                '促成动作和异议处理两个环节相对薄弱',
              ],
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '确认，查看薄弱环节', value: 'weak-areas' }],
      },
      // Step 1: 提示薄弱环节
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '在本周的客户沟通中，您在"促成动作"和"异议处理"两个环节表现相对薄弱。\n\n例如：在与客户赵高的沟通中，客户表达了对资金流动性的担忧，但您未能有效引导客户理解"年金+万能账户"的灵活性，导致客户仍未明确下单。',
            speechText: '本周促成动作和异议处理是短板，以赵高为例：客户担心资金流动性，但未成功引导。为帮助您提升薄弱环节，建议看看我为您推荐的学习内容与实战演练工具',
          },
          {
            type: 'ability-analysis',
            content: '',
            data: {
              memberName: '张经理（本周表现）',
              metrics: [
                { label: '触客完成率', value: '67%', status: 'warning' },
                { label: '面访完成率', value: '60%', status: 'warning' },
                { label: '邀约转化率', value: '30%', status: 'danger' },
              ],
              skills: [
                { label: '需求挖掘', level: 'strong' },
                { label: '方案呈现', level: 'strong' },
                { label: '异议处理', level: 'weak' },
                { label: '促成动作', level: 'weak' },
              ],
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '确认，查看学习建议', value: 'learning' }],
      },
      // Step 2: 推送学习内容
      {
        aiMessages: [
          {
            type: 'text',
            content: '别担心，AI已为您准备好针对性学习计划。以下学习内容与实战演练工具，助您快速突破短板：',
            speechText: '别担心，已为您准备好针对性学习内容，建议本周内完成。另外为快速填补业绩差额，我为你准备了经营攻略',
          },
          {
            type: 'learning-plan',
            content: '',
            data: {
              title: '本周提升学习计划',
              items: [
                { type: '课程', title: '《如何高效完成客户面访》' },
                { type: '课程', title: '《年金险沟通实战技巧》' },
                { type: '演练', title: '《实战演练：年金险方案客户促成及异议处理》' },
              ],
              tip: '点击进入实战演练，系统将根据您本周沟通的客户类型生成个性化实战场景',
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '业绩差额经营攻略', value: 'income' }],
      },
      // Step 3: 个人收入考核津贴提醒 + 推荐客户
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '您本月距离销售津贴提档还差 **2000元 FYC**。\n\n若本月新增FYC 2000元，即可多获得销售津贴 **1100元**。建议销售1件保费2万的「金越年金红26」即可达成。\n\n📊 **达成概率：约 78%**（基于推荐客户意向与历史转化）\n⚠️ **风险提示**：若本周未达钻，将影响连续钻石\n\n以下3位客户意向较高，建议您下周重点拜访：',
            speechText: '已为您筛选3位高潜力客户，达成概率约78%，建议下周重点拜访。',
          },
          {
            type: 'customer-list',
            content: '',
            data: {
              totalCount: 3,
              customers: [
                {
                  name: '张三',
                  temperature: '高温',
                  value: '高价值',
                  action: '推荐金越年金红26 - 教育金方案',
                  actionIcon: '🤝',
                  tags: ['鸡娃精英', '子女教育'],
                  lastContact: '本周',
                },
                {
                  name: '李四',
                  temperature: '中温',
                  value: '高价值',
                  action: '推荐金越年金红26 - 养老储备方案',
                  actionIcon: '🤝',
                  tags: ['焦虑中年', '财务安全'],
                  lastContact: '本周',
                },
                {
                  name: '王五',
                  temperature: '高温',
                  value: '中价值',
                  action: '推荐金越年金红26 - 稳定现金流方案',
                  actionIcon: '🤝',
                  tags: ['养老规划', '稳定现金流'],
                  lastContact: '本周',
                },
              ],
              summary: '是否帮您将这3位客户加入下周的拜访计划？',
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '好的，加入计划', value: 'confirm' }],
      },
      // Step 4: 确认添加计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '已将张三、李四、王五加入您下周的拜访计划，祝拜访顺利！',
            speechText: '下周拜访计划已更新，加油！',
          },
          {
            type: 'schedule-card',
            content: '',
            data: {
              title: '下周拜访计划',
              days: [
                {
                  day: '下周一',
                  items: [{ time: '10:00', task: '拜访张三 - 教育金方案', type: 'visit' }],
                },
                {
                  day: '下周三',
                  items: [{ time: '14:00', task: '拜访李四 - 养老储备方案', type: 'visit' }],
                },
                {
                  day: '下周五',
                  items: [{ time: '15:00', task: '拜访王五 - 稳定现金流方案', type: 'visit' }],
                },
              ],
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '好的，收到', value: 'back-to-menu' }],
      },
    ],
  },

  // Module 7: 每月末，形成月度工作复盘
  {
    id: 'monthly-retrospective',
    name: '每月末，形成月度工作复盘',
    icon: '📈',
    description: '月末',
    steps: [
      // Step 0: 月度复盘提醒 + 月度总结数据
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '本月即将结束，已为您生成月度工作复盘报告，请查收。\n\n本月累计FYC **20000元**，超额完成目标，表现优秀！超过营业部80%的代理人，恭喜！',
            speechText: '张经理，月度复盘报告出炉，本月超额完成目标，超过营业部80%的代理人，恭喜！是否看看您还有哪些技能可以进一步提升？',
          },
          {
            type: 'work-summary',
            content: '',
            data: {
              period: '本月（2025年2月）',
              metrics: {
                contact: { label: '触客次数', actual: 50, target: 40 },
                faceVisit: { label: '面访次数', actual: 25, target: 20 },
                invitation: { label: '邀约次数', actual: 12, target: 10 },
                fyc: { label: '保费收入', actual: 200000, target: 150000 },
              },
              highlights: [
                '成功签约3位高净值客户，客户画像匹配度高',
                '面访转化率从上月20%提升至40%',
                '完成3门推荐课程，参与2次实战演练',
              ],
              improvements: [
                '异议处理：流动性、收益性问题回应不够精准',
                '促成动作偏弱：客户意向明确时未及时推动决策',
                '客户升温节奏把握不足，部分客户跟进间隔较长',
              ],
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '确认，查看需提升技能', value: 'skills' }],
      },
      // Step 1: 识别需提升的技能
      {
        aiMessages: [
          {
            type: 'text',
            content: '根据本月数据分析，您在以下技能方面仍有提升空间：',
            speechText: '根据本月数据，以下技能仍有提升空间。另外，已为您准备好下月计划',
          },
          {
            type: 'ability-analysis',
            content: '',
            data: {
              memberName: '张经理（本月综合评估）',
              metrics: [
                { label: '触客完成率', value: '125%', status: 'good' },
                { label: '面访完成率', value: '125%', status: 'good' },
                { label: '邀约转化率', value: '48%', status: 'warning' },
              ],
              skills: [
                { label: '客户开拓', level: 'strong' },
                { label: '需求挖掘', level: 'strong' },
                { label: '方案呈现', level: 'strong' },
                { label: '异议处理', level: 'weak' },
                { label: '促成动作', level: 'weak' },
                { label: '客户升温', level: 'weak' },
              ],
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '确认，查看下月计划', value: 'next-plan' }],
      },
      // Step 2: 推送下月提升计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '为帮助您在下月进一步提升，已为您生成个性化学习计划：',
            speechText: '下月提升计划已生成，建议重点攻克异议处理和促成动作。',
          },
          {
            type: 'learning-plan',
            content: '',
            data: {
              title: '下月提升学习计划',
              items: [
                { type: '课程', title: '《客户异议处理：流动性与收益性问题应对》' },
                { type: '课程', title: '《高效促成：把握成交信号与推动决策》' },
                { type: '课程', title: '《客户升温节奏管理：从中温到高温的经营策略》' },
                { type: '演练', title: '《实战演练：年金险促成及异议处理全流程》' },
                { type: '工具', title: '《客户升温追踪表：定期跟进提醒工具》' },
              ],
              tip: '系统将根据您本月实际客户沟通记录，生成针对性演练场景，帮助快速突破短板',
            },
            delay: 0,
          },
        ],
        quickReplies: [{ label: '好的，收到', value: 'back-to-menu' }],
      },
    ],
  },

  // Module 8: 拍照识别保单/客户档案
  {
    id: 'image-recognition',
    name: '拍照识别保单/客户档案',
    icon: '📷',
    description: '拍照',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '收到您上传的保单照片，正在智能识别...',
            speechText: '收到保单照片，正在识别。',
          },
          {
            type: 'text',
            content: '已识别李平安的平安福2023保单信息：\n\n• 投保人：李平安\n• 险种：重疾险\n• 保额：30万\n• 年缴保费：12,000元\n• 已自动补充至客户档案',
            speechText: '已识别李平安的平安福2023保单，保额30万，年缴1万2，已自动补充至客户档案。',
            delay: 800,
          },
          {
            type: 'customer-card',
            content: '',
            data: { customerId: 'c1', detailed: true },
            delay: 500,
          },
          {
            type: 'text',
            content: '客户档案已更新，您可以直接在拜访前调用该客户的保障检视与方案推荐。',
            speechText: '档案已更新，拜访时可直接调用。',
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '确认，已更新', value: 'back-to-menu' },
          { label: '为该客户定制方案', value: 'pre-visit-from-image' },
        ],
      },
    ],
  },
];
