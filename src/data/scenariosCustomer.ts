import type { Scenario } from '../types';

/** 个性化经营完整故事线顺序（线性演示用） */
export const CUSTOMER_STORY_FLOW = [
  'persona-setup',
  'moment-custom',
  'smart-reply',
  'insight-demand',
  'script-gap',
  'match-commission',
  'materials-send',
] as const;

export const scenariosCustomer: Scenario[] = [
  {
    id: 'persona-setup',
    name: '人设打造',
    icon: '👤',
    description: '人设',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '小李你好，我是万能营销助手。咱先简单聊几句，帮你把「人设」定下来，后面朋友圈、私信回复都会按你的风格来，更自然。',
            speechText: '小李你好，先定下人设，后面每条内容都按你的风格来。',
          },
          {
            type: 'text',
            content: '好的。我平时爱跑步，周末经常跑半马，上个月刚跑完深圳马拉松。在平安做寿险两年多了，主要跟企业客户打交道。',
            role: 'user',
            delay: 1000,
          },
          {
            type: 'text',
            content: '收到～ 爱跑步、半马、深圳、深马、入行两年、企业客户。还有吗？比如主攻什么人群、想让人感觉你是什么风格？',
            speechText: '收到，主攻什么人群、想突出什么风格？',
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '主要服务企业中层、家庭保障这块，想让人感觉靠谱、不硬推', value: 'persona-detail' },
          { label: '我比较随和，客户有需求我就聊聊，不强推', value: 'persona-detail-alt' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '好，人设已记录。后续朋友圈、私信、话术都会按这个来。',
            speechText: '人设已记录，后续按这个风格来。',
            delay: 500,
          },
          {
            type: 'persona-card',
            content: '',
            data: {
              hobby: '跑步、半马',
              city: '深圳',
              years: '2年+',
              targetGroup: '企业中层、家庭保障',
              style: '靠谱、不硬推',
            },
            delay: 400,
          },
          {
            type: 'text',
            content: '需要微调随时说。接下来可以体验朋友圈个性定制。',
            speechText: '接下来可以发朋友圈了。',
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '好，人设已记录。随和、不强推，客户有需求再聊，这个风格很舒服。',
            speechText: '人设已记录，随和不强推的风格。',
            delay: 500,
          },
          {
            type: 'persona-card',
            content: '',
            data: {
              hobby: '跑步、半马',
              city: '深圳',
              years: '2年+',
              targetGroup: '企业客户',
              style: '随和、不强推',
            },
            delay: 400,
          },
          {
            type: 'text',
            content: '需要微调随时说。接下来可以体验朋友圈个性定制。',
            speechText: '接下来可以发朋友圈了。',
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'moment-custom',
    name: '朋友圈个性定制',
    icon: '📱',
    description: '朋友圈',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '根据您爱运动的人设、近期 #国内马拉松赛事安全保障升级# 热点、深圳城市信息，已为您生成个性化朋友圈内容，请确认：',
            speechText: '已根据您的人设和热点生成朋友圈内容，请确认。',
          },
          {
            type: 'moment-preview',
            content: '',
            data: {
              content:
                '周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。最近看到 #国内马拉松赛事安全保障升级# 的新闻，更觉得"保障"不分场景 —— 运动需要护具和医疗支持，生活需要保险和规划兜底。如果你也热爱运动，或想给家人配置全面保障，随时找我聊聊呀～',
            },
            delay: 500,
          },
          {
            type: 'text',
            content: '✅ 确认并授权后，将自动发布至朋友圈。',
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '确认发布', value: 'confirm-publish' },
          { label: '微调文案', value: 'back-to-menu' },
        ],
      },
      {
        aiMessages: [
          { type: 'text', content: '✅ 朋友圈发布成功，10:32。', speechText: '朋友圈发布成功。' },
          {
            type: 'text',
            content: '两小时后，王哥发来私信。',
            speechText: '两小时后，王哥发来私信。',
            delay: 600,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'smart-reply',
    name: '问题智能回复',
    icon: '💬',
    description: '智能回复',
    steps: [
      {
        aiMessages: [
          { type: 'wechat-preview', content: '', data: { message: '嗨小李，看你跑步这么拼！我最近体检查出三高，我这种情况还能买保险吗？', customerName: '王哥' }, delay: 400 },
          { type: 'text', content: '检测到王哥私信，请使用 AI 帮回。', delay: 400 },
          {
            type: 'ai-analysis',
            content: '',
            data: { customerName: '王哥' },
            delay: 500,
          },
          { type: 'text', content: '已生成推荐回复，请确认：', delay: 400 },
          {
            type: 'reply-preview',
            content: '',
            data: {
              customerName: '王哥',
              reply:
                '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～',
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '确认发送', value: 'confirm-send' },
          { label: '重新生成', value: 'back-to-menu' },
        ],
      },
      {
        aiMessages: [
          { type: 'text', content: '已发送。', speechText: '已发送。' },
          { type: 'wechat-preview', content: '', data: { message: '行，但我最近不在深圳，你先发我个方案看看吧', customerName: '王哥', isReply: true }, delay: 500 },
          {
            type: 'text',
            content: '王哥同意看方案，正在扫描其朋友圈公开动态...',
            speechText: '王哥同意看方案，正在扫描朋友圈。',
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'insight-demand',
    name: '兴趣洞察+需求解析',
    icon: '🔍',
    description: '洞察',
    steps: [
      {
        aiMessages: [
          { type: 'text', content: '正在扫描王哥朋友圈公开动态...', speechText: '正在扫描王哥朋友圈。' },
          {
            type: 'customer-insight',
            content: '',
            data: {
              age: 45,
              job: '企业中高层',
              hobby: '高尔夫',
              family: '孩子 10 岁',
              recent: '体检查出三高',
              preference: '注重保障与性价比',
            },
            delay: 600,
          },
          {
            type: 'demand-analysis',
            content: '',
            data: {
              primary: '重疾保障（三高可投）',
              secondary: ['寿险', '养老规划'],
              urgency: 4,
            },
            delay: 500,
          },
          {
            type: 'text',
            content: '已生成客户画像与需求解析。要为王哥精准匹配方案，还需了解家庭现有保障。',
            speechText: '画像已生成，还需了解家庭保障情况。',
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'script-gap',
    name: '话术与缺口',
    icon: '📋',
    description: '话术缺口',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '要为王哥精准匹配方案，还需了解家庭现有保障。我来帮您设计询问话术？',
            speechText: '需要了解家庭保障情况，我来设计话术。',
          },
        ],
        quickReplies: [{ label: '好的', value: 'show-script' }],
      },
      {
        aiMessages: [
          {
            type: 'script-recommend',
            content: '',
            data: {
              script:
                '王哥，想跟你确认一下家庭保障情况，方便做更精准的方案。您这边公司团险、医疗险都有吗？有没有给自己或家人单独买过重疾、寿险之类的？大概保额多少？这样我就能帮你算算缺口，给出更合适的建议。',
            },
            delay: 400,
          },
        ],
        quickReplies: [{ label: '一键发送', value: 'send-script' }],
      },
      {
        aiMessages: [
          { type: 'wechat-preview', content: '', data: { message: '公司团险买了意外险和医疗险，重疾险之前买过一份，好像是20万保额，其他的没有了。', customerName: '王哥', isReply: true }, delay: 500 },
          {
            type: 'text',
            content: '团险与工作绑定，离职或公司变动后意外和医疗同步清零，不可单独续保。王哥自己名下保障较少。',
            speechText: '团险有绑定风险，王哥自己名下保障较少。',
            delay: 500,
          },
          {
            type: 'gap-diagnosis',
            content: '',
            data: {
              gaps: [
                { label: '团险风险提示', status: '需关注' },
                { label: '重疾缺口', status: '20万偏低' },
                { label: '寿险空白', status: '未配置' },
                { label: '养老未启动', status: '未配置' },
              ],
              summary: '建议优先补齐重疾与寿险，再规划养老。',
            },
            delay: 600,
          },
          {
            type: 'text',
            content: '三高状态下核保窗口随时可能收紧，建议优先配置重疾与寿险。',
            speechText: '建议优先配置重疾与寿险。',
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'match-commission',
    name: '方案与收益',
    icon: '💰',
    description: '方案佣金',
    steps: [
      {
        aiMessages: [
          {
            type: 'product-plans',
            content: '',
            data: {
              needsSummary: '根据王哥画像、缺口和核保条件，智能匹配以下方案：',
              plans: [
                {
                  tag: '均衡版',
                  tagColor: 'bg-amber-500',
                  name: '重疾+医疗+寿险',
                  subName: '三险联动',
                  metrics: [
                    { label: '年缴保费', value: '3.2万' },
                    { label: '首年佣金', value: '约1.12万' },
                  ],
                  recommended: true,
                  closeProbability: 78,
                },
                {
                  tag: '尊享版',
                  tagColor: 'bg-blue-500',
                  name: '均衡版+年金险',
                  subName: '保障+传承',
                  metrics: [
                    { label: '年缴保费', value: '5.8万' },
                    { label: '首年佣金', value: '约2万' },
                  ],
                  recommended: false,
                  closeProbability: 72,
                },
              ],
            },
            delay: 500,
          },
          {
            type: 'text',
            content: '建议优先呈现均衡版。可根据客户预算与需求灵活调整。',
            speechText: '建议优先呈现均衡版。',
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '帮我算佣金', value: 'show-commission' },
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'commission-calc',
            content: '',
            data: {
              plans: [
                { name: '均衡版', firstYear: 3200, renewal3y: 4800 },
                { name: '尊享版', firstYear: 5800, renewal3y: 8700 },
              ],
              tip: '可根据客户预算与需求灵活调整方案。',
            },
            delay: 500,
          },
        ],
        quickReplies: [
          { label: '继续故事', value: 'story-next' },
          { label: '返回菜单', value: 'back-to-menu' },
        ],
      },
    ],
  },
  {
    id: 'materials-send',
    name: '素材生成与发送',
    icon: '📤',
    description: '素材',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '已为王哥自动生成四份讲解素材，请确认后一键发送。',
            speechText: '四份素材已生成，请确认发送。',
          },
          {
            type: 'materials-pack',
            content: '',
            data: {
              customerName: '王哥',
              materials: ['一页纸方案', '核保说明', '理赔动图', '脱敏案例'],
            },
            delay: 500,
          },
        ],
        quickReplies: [{ label: '确认发送', value: 'confirm-materials' }],
      },
      {
        aiMessages: [
          { type: 'text', content: '已发送。', speechText: '已发送。' },
          { type: 'wechat-preview', content: '', data: { message: '你这个做得很细，我发给我老婆看看，这周给你答复。', customerName: '王哥', isReply: true }, delay: 500 },
          { type: 'text', content: '已为您设置3天后回访提醒。', speechText: '已设置回访提醒。', delay: 400 },
        ],
        quickReplies: [{ label: '完成', value: 'customer-story-end' }],
      },
    ],
  },
];
