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
          { label: '帮我盘点本月客户', value: 'review-all' },
          { label: '查看精选客户名单', value: 'view-list' },
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
          { label: '查看要经营的客户', value: 'view-customers' },
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
          { label: '好的，收到', value: 'back-to-menu' },
          { label: '调整计划', value: 'adjust-plan' },
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
          { label: '好的，帮我给客户李平安定制一份产品方案', value: 'analyze' },
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
        quickReplies: [{ label: '开始智能记录', value: 'start-record' }],
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
            content: '本次拜访信息及客户情况已整理完毕，请确认是否正确？',
            speechText: '本次拜访信息已整理完毕，请确认是否正确？',
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
        quickReplies: [{ label: '查看薄弱环节分析', value: 'weak-areas' }],
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
        quickReplies: [{ label: '查看学习建议', value: 'learning' }],
      },
      // Step 2: 推送学习内容
      {
        aiMessages: [
          {
            type: 'text',
            content: '为帮助您提升薄弱环节，我为您推荐以下学习内容与实战演练工具：',
            speechText: '已为您推荐针对性学习内容，建议本周内完成。另外为快速填补业绩差额，我为你准备了经营攻略',
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
              '您本月距离销售津贴提档还差 **2000元 FYC**。\n\n若本月新增FYC 2000元，即可多获得销售津贴 **1100元**。建议销售1件保费2万的「金越年金红26」即可达成。\n\n以下3位客户意向较高，建议您下周重点拜访：',
            speechText: '已为您筛选3位高潜力客户，建议下周重点拜访。',
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
              '本月即将结束，已为您生成月度工作复盘报告，请查收。\n\n本月累计FYC **20000元**，超额完成目标，表现优秀！整体超过了营业部80%的代理人。',
            speechText: '张经理，月度复盘报告出炉，本月超额完成目标，表现优秀！是否看看您还有哪些技能可以进一步提升？',
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
        quickReplies: [{ label: '查看需提升技能', value: 'skills' }],
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
        quickReplies: [{ label: '查看下月提升计划', value: 'next-plan' }],
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

  // ─────────────────────────────────────────────
  // V2 模块一：目标客群推荐
  // 亮点：整合多元数据、洞察偏好价值
  // ─────────────────────────────────────────────
  {
    id: 'v2-target-customers',
    name: '目标客群推荐',
    icon: '🎯',
    description: '整合多元数据，洞察偏好价值，智能推荐高潜力客群',
    steps: [
      // Step 0: AI 主动推送客群分析
      {
        aiMessages: [
          {
            type: 'text',
            content: '张经理，早上好！AI 已整合您的客户行为数据、资产变动、家庭生命周期及市场利率信号，为您筛选出本月**重点经营客群**，请查收。',
            speechText: '张经理早上好，AI已整合多元数据，为您推荐本月重点目标客群，请查收。',
          },
          {
            type: 'v2-target-segment',
            content: '',
            data: {
              segmentSummary: '基于 5 类数据源交叉分析，识别出 3 位高潜力客户',
              dataSources: ['保单数据', '资产变动', '家庭生命周期', '行为偏好', '市场利率'],
              customers: [
                {
                  name: '王建国',
                  avatar: '王',
                  segment: '高净值 · 子女教育需求旺盛期',
                  valueScore: 88,
                  potentialScore: 92,
                  priority: 'S',
                  tags: ['子女升学节点', '资产新增20万', '高意向'],
                  dataSources: ['子女15岁·升学节点', '近期理财到期'],
                  insight: '长子今年中考，教育金需求窗口期已开启；近期50万理财到期，有配置保险资产意向，建议本月优先拜访。',
                },
                {
                  name: '李美琳',
                  avatar: '李',
                  segment: '医疗行业 · 重疾保障缺口大',
                  valueScore: 82,
                  potentialScore: 85,
                  priority: 'A',
                  tags: ['重疾缺口50万', '职业高风险', '已有医疗险'],
                  dataSources: ['职业风险分析', '现有保障扫描'],
                  insight: '作为医生深知重疾风险，但自身重疾保额仅20万，缺口达50万以上，接受度高，可直接切入重疾险加保方案。',
                },
                {
                  name: '陈晓雯',
                  avatar: '陈',
                  segment: '年轻白领 · 养老规划起步期',
                  valueScore: 71,
                  potentialScore: 79,
                  priority: 'A',
                  tags: ['30岁前养老窗口', '理财偏好稳健', '未婚'],
                  dataSources: ['年龄节点', '理财偏好数据'],
                  insight: '30岁前是养老年金配置黄金期，客户理财风格偏稳健，对长期储蓄型产品接受度高，建议推荐年金+万能组合。',
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '查看王建国详细分析', value: 'v2-segment-detail' },
          { label: '生成本月经营计划', value: 'v2-plan-schedule' },
        ],
      },
      // Step 1: 展示客群分析维度与行动建议
      {
        aiMessages: [
          {
            type: 'text',
            content: '**王建国**综合价值评分最高（S级），以下是 AI 深度洞察：\n\n• **财富偏好**：重视资产安全与传承，厌恶高波动产品\n• **决策风格**：理性，需要数据与对比支撑\n• **触达偏好**：工作日上午10-11点，面访优于微信\n• **家庭关注**：长子教育金 > 自身养老 > 企业财富隔离\n\n建议以**子女教育金缺口可视化**为切入，结合近期理财到期资金承接，推动教育年金成交。',
            speechText: '王建国综合评分最高，客户偏好资产安全，建议以子女教育金缺口切入，推动年金方案成交。',
          },
        ],
        quickReplies: [
          { label: '生成王建国经营计划', value: 'v2-plan-for-customer' },
          { label: '返回客群列表', value: 'back' },
        ],
      },
      // Step 2: 为选定客户生成经营行动
      {
        aiMessages: [
          {
            type: 'text',
            content: '已为**王建国**生成专属经营方案，进入计划排程模块，AI 将自动识别事件契机并编排本月行事历。',
            speechText: '王建国专属方案已生成，即将进入计划排程，为您自动编排本月行事历。',
          },
        ],
        quickReplies: [
          { label: '查看经营计划排程', value: 'v2-view-schedule' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // V2 模块二：经营计划排程
  // 亮点：事件契机识别、自动编排行事历
  // ─────────────────────────────────────────────
  {
    id: 'v2-plan-schedule',
    name: '经营计划排程',
    icon: '📅',
    description: '事件契机识别，自动编排行事历，精准排程拜访计划',
    steps: [
      // Step 0: 识别事件契机
      {
        aiMessages: [
          {
            type: 'text',
            content: '🔍 AI 正在扫描您客户群的**近期事件契机**——生日、保单周年、节假日、子女升学节点……已识别 **6 个高价值触访时机**，正在自动编排本月行事历。',
            speechText: 'AI已扫描识别6个高价值触访时机，正在自动编排本月行事历。',
          },
          {
            type: 'v2-event-calendar',
            content: '',
            data: {
              title: '3月经营行事历',
              triggerCount: 6,
              events: [
                {
                  date: '3/07',
                  weekday: '周六',
                  customer: '王建国',
                  eventType: '生日',
                  eventDesc: '客户太太生日',
                  action: '发送定制生日祝福，顺带提及教育金方案，预约面谈',
                  actionType: 'message',
                  priority: 'high',
                },
                {
                  date: '3/10',
                  weekday: '周二',
                  customer: '李美琳',
                  eventType: '保单周年',
                  eventDesc: '重疾险投保满2年，可回顾保障全貌',
                  action: '上门做保障检视，切入重疾加保建议',
                  actionType: 'visit',
                  priority: 'high',
                },
                {
                  date: '3/12',
                  weekday: '周四',
                  customer: '王建国',
                  eventType: '市场时机',
                  eventDesc: '理财产品到期，50万资金待配置',
                  action: '电话确认到期资金，发送教育年金方案对比',
                  actionType: 'call',
                  priority: 'high',
                },
                {
                  date: '3/15',
                  weekday: '周日',
                  customer: '陈晓雯',
                  eventType: '节假日',
                  eventDesc: '3·15消费者权益日，保险意识强化节点',
                  action: '发送保障意识科普文章，引导重新评估个人保障',
                  actionType: 'message',
                  priority: 'medium',
                },
                {
                  date: '3/18',
                  weekday: '周三',
                  customer: '王建国',
                  eventType: '子女升学',
                  eventDesc: '长子中考倒计时100天',
                  action: '面访：子女教育金需求深度沟通，呈现方案',
                  actionType: 'visit',
                  priority: 'high',
                },
                {
                  date: '3/25',
                  weekday: '周二',
                  customer: '刘大明',
                  eventType: '保单到期',
                  eventDesc: '年金险缴费期满，财富传承需求待激活',
                  action: '上门回访，探讨传承规划与保单贷款需求',
                  actionType: 'visit',
                  priority: 'medium',
                },
              ],
            },
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '确认计划，准备素材', value: 'v2-prepare-materials' },
          { label: '调整3月18日安排', value: 'v2-reschedule' },
        ],
      },
      // Step 1: 确认计划并提示下一步
      {
        aiMessages: [
          {
            type: 'text',
            content: '本月行事历已确认！本周优先事项：\n\n**3月7日（本周六）** 王建国太太生日，建议今晚准备祝福语\n**3月10日（下周二）** 李美琳保单周年，建议提前准备保障检视报告\n\nAI 将在每个事件前 **24小时** 发送提醒，并自动匹配相应素材。接下来，为您查看**触访素材包**？',
            speechText: '行事历已确认，本周优先安排王建国太太生日祝福，下周二李美琳保单周年拜访，AI将提前24小时提醒并匹配素材。',
          },
        ],
        quickReplies: [
          { label: '查看触访素材包', value: 'v2-view-materials' },
          { label: '好的，知道了', value: 'back' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // V2 模块三：触访素材匹配
  // 亮点：一客一策、多元素材
  // ─────────────────────────────────────────────
  {
    id: 'v2-visit-materials',
    name: '触访素材匹配',
    icon: '📂',
    description: '一客一策，多元素材智能匹配，提升触访转化率',
    steps: [
      // Step 0: 素材匹配主界面
      {
        aiMessages: [
          {
            type: 'text',
            content: '距离**王建国**面访还有 **3天**，AI 已根据他的画像——高净值、教育金需求、理性决策、资金即将到期——为他定制了专属素材包，实现**一客一策**。',
            speechText: '距离王建国面访还有3天，AI已根据他的画像，为他定制了专属素材包，实现一客一策。',
          },
          {
            type: 'v2-material-kit',
            content: '',
            data: {
              customerName: '王建国',
              strategyNote: '策略：教育金缺口可视化 → 资金承接 → 年金+万能组合方案',
              materials: [
                {
                  type: 'tool',
                  title: '教育金需求计算器',
                  desc: '根据孩子年龄与目标学校，动态测算未来教育费用缺口，数据直观冲击感强',
                  matchReason: '王建国长子15岁、有名校意向，计算器可实时展示资金缺口，触动其需求',
                  tag: '强推荐',
                },
                {
                  type: 'product',
                  title: '平安教育年金险 · 专属方案对比',
                  desc: '保费20万/年，教育期年领15万，退休后持续领取至85岁，含身故保障',
                  matchReason: '契合客户50万理财到期资金规模，一次性及分期缴费均可，灵活匹配',
                  tag: '主推方案',
                },
                {
                  type: 'article',
                  title: '《高净值家庭如何用保险锁定子女教育确定性》',
                  desc: '用3个真实案例说明市场波动下保险教育金的优势，适合理性型客户',
                  matchReason: '王建国偏理性，需要数据与案例支撑，此文章可在面访前微信发送预热',
                },
                {
                  type: 'case',
                  title: '同类客户成交案例：企业高管·教育金+传承双规划',
                  desc: '43岁企业高管，子女13岁，通过年金+终身寿险完成教育金与财富传承一体化配置',
                  matchReason: '与王建国背景高度相似，引发共鸣，可用"有位客户和您情况很像"切入',
                },
                {
                  type: 'video',
                  title: '产品演示视频：教育年金收益演示（3分钟）',
                  desc: '以时间轴形式动态展示每年领取金额，视觉化效果突出，适合面访现场播放',
                  matchReason: '面访时直接播放，客户感知产品价值更直观，加速决策',
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '查看李美琳的素材包', value: 'v2-material-li' },
          { label: '一键发送预热素材给王建国', value: 'v2-send-material' },
        ],
      },
      // Step 1: 另一位客户的素材包
      {
        aiMessages: [
          {
            type: 'text',
            content: '以下是为**李美琳**（医生·重疾险加保）定制的素材包，策略方向：职业风险感知强化 → 保障缺口量化 → 重疾险加保方案。',
            speechText: '以下是李美琳的专属素材包，策略方向为职业风险感知强化，切入重疾险加保方案。',
          },
          {
            type: 'v2-material-kit',
            content: '',
            data: {
              customerName: '李美琳',
              strategyNote: '策略：职业风险认知 → 现有保障缺口可视化 → 重疾险加保方案呈现',
              materials: [
                {
                  type: 'tool',
                  title: '保障缺口分析报告',
                  desc: '基于现有保单自动生成，清晰标注重疾保障缺口50万，医疗及收入替代缺口',
                  matchReason: '李美琳是医生，对数据高度敏感，缺口报告比口头描述更有说服力',
                  tag: '强推荐',
                },
                {
                  type: 'article',
                  title: '《医护人员高发重疾险种揭秘》',
                  desc: '医疗行业职业暴露风险统计，重点覆盖甲状腺癌、白血病等医护高发病',
                  matchReason: '以专业数据唤起职业风险意识，作为医生更能理解并接受',
                },
                {
                  type: 'product',
                  title: '平安守护百分百·重疾险加保方案',
                  desc: '首年保费约1.8万，保额50万，覆盖120种重疾，含轻症豁免',
                  matchReason: '精准填补50万保障缺口，年保费在医生收入承受范围内',
                  tag: '主推方案',
                },
                {
                  type: 'case',
                  title: '真实理赔案例：30岁护士确诊甲状腺癌理赔60万',
                  desc: '以真实理赔经历说明重疾险对医护人员的实际保障价值',
                  matchReason: '同为医疗行业，理赔案例最具说服力，建议作为最后一张牌',
                },
              ],
            },
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '确认素材，查看今日提醒', value: 'v2-daily-reminder' },
          { label: '一键发送预热文章给李美琳', value: 'v2-send-li' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // V2 模块四：经营动作提醒
  // 亮点：每日主动提醒、一键完成
  // ─────────────────────────────────────────────
  {
    id: 'v2-action-reminder',
    name: '经营动作提醒',
    icon: '🔔',
    description: '每日主动提醒，一键完成，确保每个经营动作不遗漏',
    steps: [
      // Step 0: 今日提醒推送
      {
        aiMessages: [
          {
            type: 'text',
            content: '⏰ **早上8:30** · 张经理，今日有 **5项** 经营动作待完成，AI 已按优先级排好顺序，点击**一键完成**记录动作进度。',
            speechText: '张经理早上好，今日有5项经营动作待完成，AI已按优先级排好顺序，点击一键完成即可记录进度。',
          },
          {
            type: 'v2-daily-action',
            content: '',
            data: {
              dateLabel: '3月10日（周二）· 今日重点：李美琳保单周年拜访日',
              summary: '今日核心目标：完成李美琳重疾险加保面谈，同步跟进王建国预热素材回应。',
              actions: [
                {
                  id: 'a1',
                  time: '09:00',
                  customer: '王建国',
                  action: '发送《高净值家庭教育金配置》文章预热，跟进昨日素材阅读情况',
                  actionType: 'message',
                  urgency: 'normal',
                  hint: '参考话术：王总，昨天发您的文章看了吗，有个数据挺适合您家情况的……',
                },
                {
                  id: 'a2',
                  time: '10:30',
                  customer: '李美琳',
                  action: '上门拜访，完成保障检视，切入重疾险加保方案呈现',
                  actionType: 'visit',
                  urgency: 'high',
                  hint: '带上保障缺口报告及重疾险方案，面访预计1小时',
                },
                {
                  id: 'a3',
                  time: '14:00',
                  customer: '张伟',
                  action: '电话跟进：上次拜访后的产品疑问是否已解决，探测温度',
                  actionType: 'call',
                  urgency: 'normal',
                  hint: '上次提到对保险有疑虑，可以先从理赔服务体验切入',
                },
                {
                  id: 'a4',
                  time: '15:30',
                  customer: '陈晓雯',
                  action: '发送3·15保障知识科普长图文，附个人保障诊断预约入口',
                  actionType: 'send',
                  urgency: 'normal',
                },
                {
                  id: 'a5',
                  time: '17:00',
                  customer: '王建国',
                  action: '确认3月18日面谈时间，提前发送《教育金方案PDF》供预习',
                  actionType: 'message',
                  urgency: 'normal',
                  hint: '建议在下班前发送，客户晚上有时间看',
                },
              ],
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '拜访李美琳结束，记录结果', value: 'v2-post-visit' },
          { label: '查看今日全部动作话术', value: 'v2-scripts' },
        ],
      },
      // Step 1: 拜访后记录与提醒
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 今日完成情况良好！已完成 **3/5** 项动作。\n\n待完成项提醒：\n• **17:00** 王建国 - 确认面谈时间（📱 点击一键发送消息）\n• **拜访复盘** - 李美琳拜访结果请及时录入，AI 将生成复盘分析\n\n是否现在进行**拜访复盘**？',
            speechText: '今日已完成3项动作，还有2项待完成。建议现在进行李美琳的拜访复盘，AI将自动生成分析建议。',
          },
        ],
        quickReplies: [
          { label: '开始拜访复盘分析', value: 'v2-start-review' },
          { label: '稍后再做', value: 'back' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // V2 模块五：拜访复盘分析
  // 亮点：语音记录分析、提供经营建议
  // ─────────────────────────────────────────────
  {
    id: 'v2-visit-review',
    name: '拜访复盘分析',
    icon: '📊',
    description: '语音记录智能分析，提炼关键时刻，提供经营建议',
    steps: [
      // Step 0: 发起语音分析
      {
        aiMessages: [
          {
            type: 'text',
            content: '🎙️ AI 已接收到您与**李美琳**的拜访语音记录（约 52 分钟），正在分析中……\n\n提取关键时刻、情绪波动、异议节点及转化信号，完成后自动生成复盘报告。',
            speechText: 'AI已接收拜访语音记录，正在分析关键时刻、情绪波动和转化信号，请稍候。',
          },
        ],
        quickReplies: [
          { label: '查看复盘报告', value: 'v2-show-review' },
        ],
      },
      // Step 1: 展示复盘报告
      {
        aiMessages: [
          {
            type: 'text',
            content: '📋 **李美琳**拜访复盘报告已生成：',
            speechText: '李美琳拜访复盘报告已生成，请查看关键时刻与经营建议。',
          },
          {
            type: 'v2-voice-review',
            content: '',
            data: {
              customerName: '李美琳',
              duration: '52分钟',
              sentiment: '积极偏正向',
              sentimentScore: 78,
              keyMoments: [
                {
                  time: '08:12',
                  label: '痛点激活',
                  quote: '我们科室上个月有同事确诊甲状腺癌，才30多岁……',
                  type: 'pain-point',
                },
                {
                  time: '22:35',
                  label: '产品兴趣',
                  quote: '这个重疾险50万保额，一年保费1.8万，还挺合理的',
                  type: 'positive',
                },
                {
                  time: '31:18',
                  label: '异议出现',
                  quote: '我还是觉得现在花这个钱……要不先考虑一下？',
                  type: 'objection',
                },
                {
                  time: '44:50',
                  label: '机会信号',
                  quote: '如果先生也一起投保有没有优惠，他保障也不够',
                  type: 'opportunity',
                },
              ],
              advices: [
                {
                  category: '异议应对',
                  icon: '💡',
                  advice: '31分钟出现犹豫是典型的"近期未发生损失则不觉得迫切"心理，建议下次用同事确诊案例强化紧迫感，可搭配理赔时间轴图。',
                },
                {
                  category: '机会把握',
                  icon: '🎯',
                  advice: '客户44分钟主动询问配偶投保，是强成交信号！建议在3天内回访，给出家庭联合投保优惠方案，推动夫妻共同加保。',
                },
                {
                  category: '跟进节奏',
                  icon: '📅',
                  advice: '本次温度偏高（78分），建议3日内跟进，发送配偶保障缺口分析+家庭联合方案，趁热打铁促成。',
                },
              ],
              nextStep: '3天内回访李美琳：呈现家庭联合重疾险方案，配偶同投享受保费折扣，预计签单概率从65%提升至80%。',
            },
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '生成3天后回访提醒', value: 'v2-set-reminder' },
          { label: '查看配偶联合投保方案', value: 'v2-spouse-plan' },
        ],
      },
      // Step 2: 确认回访提醒
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 已为您设置 **3月13日（周五）10:00** 回访李美琳提醒，届时 AI 将自动推送：\n\n• 📋 李美琳+先生家庭联合重疾险方案\n• 💬 回访开场话术建议\n• 📈 此次跟进签单概率评估\n\n同时，本次拜访已同步至**经营档案**，客户互动历程自动更新。',
            speechText: '回访提醒已设置，3月13日AI将自动推送联合方案和话术建议。本次拜访已同步至经营档案。',
          },
        ],
        quickReplies: [
          { label: '查看李美琳经营档案', value: 'v2-archive' },
          { label: '好的，完成', value: 'back' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // V2 模块六：经营档案总结
  // 亮点：全景互动历程、深度了解客户
  // ─────────────────────────────────────────────
  {
    id: 'v2-archive-summary',
    name: '经营档案总结',
    icon: '📁',
    description: '全景互动历程，深度了解客户，持续优化经营策略',
    steps: [
      // Step 0: 打开经营档案
      {
        aiMessages: [
          {
            type: 'text',
            content: '📁 正在打开**李美琳**的经营档案……AI 已整合 2 年来的全部互动记录，生成深度客户画像与经营历程全景视图。',
            speechText: '正在打开李美琳的经营档案，AI已整合两年互动记录，生成深度客户画像与全景互动历程。',
          },
          {
            type: 'v2-customer-archive',
            content: '',
            data: {
              customerName: '李美琳',
              avatar: '李',
              relationYears: 2,
              totalInteractions: 18,
              totalPremium: '1.5万/年',
              lifetimeValue: '预估28万',
              dimensionScores: [
                { label: '信任度', score: 82, icon: '🤝' },
                { label: '保障意识', score: 90, icon: '🛡️' },
                { label: '消费能力', score: 78, icon: '💰' },
                { label: '决策速度', score: 55, icon: '⚡' },
                { label: '转介绍意愿', score: 71, icon: '👥' },
              ],
              deepInsight: '李美琳是典型的"高认知、慢决策"客户——她完全理解风险，但在消费上偏谨慎。经过2年积累，信任基础扎实，本次丈夫联合投保需求是历史以来最强的成交信号，要抓住这个窗口期。',
              timeline: [
                {
                  date: '2024/03',
                  type: 'purchase',
                  title: '首单成交',
                  detail: '平安e生保·百万医疗险，保费1,500元/年，从此建立关系',
                },
                {
                  date: '2024/06',
                  type: 'visit',
                  title: '二次拜访',
                  detail: '保障检视，客户了解了重疾险概念，表示"暂时不急"',
                },
                {
                  date: '2024/09',
                  type: 'event',
                  title: '转介绍机会',
                  detail: '推荐同事陈医生，虽未成单，展现出一定转介绍意愿',
                },
                {
                  date: '2024/11',
                  type: 'call',
                  title: '节日回访',
                  detail: '元旦节关怀电话，聊到科室同事健康问题，情绪波动明显',
                },
                {
                  date: '2025/01',
                  type: 'renewal',
                  title: '续保成功',
                  detail: '医疗险顺利续保，客户主动咨询是否需要升级版本',
                },
                {
                  date: '2025/03',
                  type: 'visit',
                  title: '保单周年拜访',
                  detail: '本次拜访：情绪积极，主动提及丈夫保障需求，成交信号强烈',
                },
              ],
              nextStrategy: '3月13日回访：呈现家庭联合重疾险方案（李美琳+丈夫），利用联合投保折扣推动双单成交。成功后启动家庭保障全检视，探索子女医疗险需求，逐步发展为高价值家庭客户。',
            },
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '查看下阶段经营计划', value: 'v2-next-plan' },
          { label: '一键发起回访提醒', value: 'v2-set-followup' },
        ],
      },
      // Step 1: 下阶段经营策略总结
      {
        aiMessages: [
          {
            type: 'text',
            content: '基于李美琳 **2年经营档案**，AI 为您总结如下经营建议：\n\n**近期（1-2周）**\n• 回访推动丈夫联合重疾险，争取双单\n• 发送家庭保障全景图，触发子女医疗险需求\n\n**中期（1-3月）**\n• 丈夫成单后启动子女医疗险方案\n• 培养转介绍意识，推荐医院同事客群\n\n**长期（6月+）**\n• 家庭年金/教育金规划（客户35岁，子女3岁，10年窗口期）\n• 持续经营至高价值家庭客户（预估终身价值 **50万+**）\n\n✅ 档案已同步最新拜访记录，下次触访时 AI 将自动读取历史洞察。',
            speechText: '李美琳近期策略是推动丈夫联合重疾险双单成交，中期培养转介绍，长期发展为高价值家庭客户，预估终身价值超过50万。',
          },
        ],
        quickReplies: [
          { label: '返回客群推荐', value: 'v2-back-to-targets' },
          { label: '完成，收到', value: 'back' },
        ],
      },
    ],
  },
];
