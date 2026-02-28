import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  // ── 场景一：每月初 · 盘点客户 ──────────────────────────
  {
    id: 'monthly-review',
    name: '每月初，盘点客户',
    icon: '📋',
    description: '每月初',
    steps: [
      // Step 0: AI 盘点播报
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '小张，新的一月开始了。已完成客户盘点并推荐本月经营名单：\n\n• **低温客户**：加强联系，避免流失、逐步升温\n• **中高温客户**：加强拜访促成，推动升温转化\n\n📌 本月提醒：李平安（生日 9/12）、王建国（生日 3/8）需安排问候；刘大明、张伟有生存金待领取。',
            speechText:
              '小张，已完成本月客户盘点。低温客户加强联系，中高温客户加强拜访促成。本月有生日和生存金提醒，请留意。',
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
            delay: 250,
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
            delay: 250,
          },
          {
            type: 'customer-list',
            content: '',
            data: {
              totalCount: 6,
              customers: [
                {
                  name: '李平安',
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
                  action: '转发保障科普资讯',
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
              summary: '已为您圈选出6位重点经营客户，建议优先推进高温高价值与中温高价值客群。',
            },
            delay: 250,
          },
        ],
        quickReplies: [
          { label: '好的，我约了下周一下午两点面访李平安', value: 'confirm-schedule' },
        ],
      },
      // Step 1: AI 确认拜访计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '好的，已添加拜访计划。',
            speechText: '好的，已为您添加李平安的拜访计划。',
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
            delay: 250,
          },
        ],
        quickReplies: [
          { label: '好的，收到', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ── 场景二：每周初 · 经营计划 ──────────────────────────
  {
    id: 'weekly-plan',
    name: '每周初，经营计划',
    icon: '📅',
    description: '每周初',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '小张，本周经营计划已整理好：\n\n• **低温客户**：每日问候维护关系\n• **中高温客户**：邀约参加公司活动，持续升温\n• **高温客户**：安排面访促成签约\n\n行事历已推送，请查收。',
            speechText:
              '小张，本周经营计划已整理好。低温客户日常问候，中高温客户邀约活动，高温客户面访促成。行事历已推送。',
          },
          {
            type: 'schedule-card',
            content: '',
            data: {
              title: '本周行事历',
              days: [
                {
                  day: '周一',
                  items: [{ time: '14:00', task: '面访李平安 - 养老规划方案', type: 'visit' }],
                },
                {
                  day: '周二',
                  items: [{ time: '10:00', task: '电话问候刘大明（低温维护）', type: 'visit' }],
                },
                {
                  day: '周三',
                  items: [{ time: '15:00', task: '邀约张伟参加公司活动（中温升温）', type: 'visit' }],
                },
                {
                  day: '周四',
                  items: [{ time: '14:00', task: '面访王建国 - 教育金方案', type: 'visit' }],
                },
                {
                  day: '周五',
                  items: [{ time: '10:00', task: '电话跟进陈晓雯（中温升温）', type: 'visit' }],
                },
                {
                  day: '周六',
                  items: [{ time: '14:00', task: '面访李美琳 - 重疾保障方案', type: 'visit' }],
                },
              ],
            },
            delay: 250,
          },
        ],
        quickReplies: [
          { label: '好的，收到', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ── 场景三：每天 · 当日经营提醒 ──────────────────────────
  {
    id: 'daily-engagement',
    name: '每天，当日经营',
    icon: '📲',
    description: '每天',
    steps: [
      // Step 0: AI 推送今日客户
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '小张早上好！今日建议经营 5 位客户：\n\n🔥 **高温客户**（重点跟进）：李平安、王建国\n🌡️ **中温客户**（持续升温）：张伟、陈晓雯\n❄️ **低温客户**（维护关系）：刘大明\n\n可一键问候或转发资讯。',
            speechText:
              '小张早上好，今日建议经营5位客户，可一键问候或转发资讯。',
          },
          {
            type: 'customer-list',
            content: '',
            data: {
              totalCount: 5,
              customers: [
                {
                  name: '李平安',
                  temperature: '高温',
                  value: '高价值',
                  action: '面访 - 跟进养老规划方案',
                  actionIcon: '🤝',
                  tags: ['高净值', '保养老'],
                  lastContact: '3天前',
                },
                {
                  name: '王建国',
                  temperature: '高温',
                  value: '高价值',
                  action: '电话跟进教育金意向',
                  actionIcon: '📱',
                  tags: ['加保意向', '子女教育'],
                  lastContact: '5天前',
                },
                {
                  name: '张伟',
                  temperature: '中温',
                  value: '高价值',
                  action: '转发保障科普资讯',
                  actionIcon: '📩',
                  tags: ['首次接触', '高收入'],
                  lastContact: '1周前',
                },
                {
                  name: '陈晓雯',
                  temperature: '中温',
                  value: '中价值',
                  action: '推送养老年金产品资料',
                  actionIcon: '📩',
                  tags: ['理财需求', '养老规划'],
                  lastContact: '1周前',
                },
                {
                  name: '刘大明',
                  temperature: '低温',
                  value: '高价值',
                  action: '一键发送节日问候',
                  actionIcon: '📱',
                  tags: ['老客户', '传承需求'],
                  lastContact: '3周前',
                },
              ],
              summary: '建议优先跟进高温客户，低温客户可一键发送问候维护关系。',
            },
            delay: 250,
          },
        ],
        quickReplies: [
          { label: '帮我给低温客户发个问候吧', value: 'send-greeting' },
        ],
      },
      // Step 1: AI 确认发送
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 已为刘大明发送问候消息，后续可继续触客其他客户。',
            speechText: '好的，已为刘大明发送问候消息。',
          },
        ],
        quickReplies: [
          { label: '好的，收到', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ── 场景四：每周末 · 周工作总结 ──────────────────────────
  {
    id: 'weekly-summary',
    name: '每周末，周工作总结',
    icon: '📊',
    description: '每周末',
    steps: [
      // Step 0: AI 播报周报
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '小张，本周工作总结已生成：\n\n⚠️ **需加强经营客户**：张伟（中温，2 周未联系）、陈晓雯（中温，邀约未跟进）\n\n建议将以上客户加入下周重点计划。',
            speechText:
              '小张，本周工作总结已生成，标出薄弱环节和需加强经营的客户，建议加入下周计划。',
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
            delay: 200,
          },
          {
            type: 'ability-analysis',
            content: '',
            data: {
              memberName: '小张（本周表现）',
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
            delay: 200,
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
            delay: 200,
          },
        ],
        quickReplies: [
          { label: '帮我把这些客户加入下周计划', value: 'add-to-plan' },
        ],
      },
      // Step 1: AI 确认加入计划
      {
        aiMessages: [
          {
            type: 'text',
            content: '已将张伟、陈晓雯加入下周重点拜访计划，会按时提醒您。加油！💪',
            speechText: '小张，相关客户已加入下周计划，会按时提醒您。加油！',
          },
          {
            type: 'schedule-card',
            content: '',
            data: {
              title: '下周重点拜访计划',
              days: [
                {
                  day: '下周一',
                  items: [{ time: '15:00', task: '面访张伟 - 保障方案讲解', type: 'visit' }],
                },
                {
                  day: '下周三',
                  items: [{ time: '14:00', task: '面访陈晓雯 - 养老年金方案', type: 'visit' }],
                },
              ],
            },
            delay: 200,
          },
        ],
        quickReplies: [
          { label: '好的，收到', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ── 场景五：每月末 · 月度复盘 ──────────────────────────
  {
    id: 'monthly-retrospective',
    name: '每月末，月度复盘',
    icon: '📈',
    description: '每月末',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content:
              '小张，本月工作复盘报告出炉！\n\n🎉 本月累计 FYC **20,000元**，超额完成目标！\n\n📈 亮点：成功签约 3 位高净值客户，面访转化率从 20% 提升至 40%\n⚠️ 需提升：异议处理、促成动作、客户升温节奏',
            speechText:
              '小张，本月复盘已生成，超额完成本月目标！需提升的技能已标出。',
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
            delay: 200,
          },
          {
            type: 'ability-analysis',
            content: '',
            data: {
              memberName: '小张（本月综合评估）',
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
            delay: 200,
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
              ],
              tip: '系统将根据您本月实际客户沟通记录，生成针对性演练场景，帮助快速突破短板',
            },
            delay: 200,
          },
        ],
        quickReplies: [
          { label: '好的，收到', value: 'back-to-menu' },
        ],
      },
    ],
  },
];
