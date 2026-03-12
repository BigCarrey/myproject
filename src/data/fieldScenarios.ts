import type { Scenario } from '../types';

export const fieldScenarios: Scenario[] = [
  // ==================== 功能① 个性内容定制 ====================
  {
    id: 'field-content-creation',
    name: '个性内容定制',
    icon: '✍️',
    description: '朋友圈内容',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-moments-post',
            content: '已为您定制个性化朋友圈内容',
            speechText: '小李您好，我已结合您爱运动的人设和近期体育新闻，为您定制了一条个性化朋友圈内容。',
            data: {
              author: '小李',
              avatar: '🏃',
              postContent: '周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。最近看到 #国内马拉松赛事安全保障升级# 的新闻，更觉得"保障"不分场景 —— 运动需要护具和医疗支持，生活需要保险和规划兜底。如果你也热爱运动，或想给家人配置全面保障，随时找我聊聊呀～',
              images: ['半马成绩图', '赛事安全保障新闻截图'],
              imageUrls: [
                'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
              ],
              highlights: [
                '融合个人运动IP，塑造真实可信的人设',
                '结合热点新闻自然切入保险话题',
                '软性引导而非硬广，容易引起互动',
              ],
            },
          },
        ],
        quickReplies: [
          { label: '确认并授权发布', value: 'confirm-post' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **朋友圈发布成功，10:32**\n\n系统已自动完成以下操作：\n• 朋友圈内容已发布\n• 附图已自动排版优化\n• 已设置可见范围：全部好友\n\n📊 **预期效果：**\n• 预计覆盖好友 800+\n• 目标互动率 5%-8%\n• 潜在咨询转化 2-3人\n\n系统将持续监测互动数据，有新评论或私信会第一时间提醒您。',
            speechText: '朋友圈已于10点32分发布成功，系统将持续监测互动数据。',
            wechatEvents: [
              { type: 'switch-view', data: 'moments' },
              {
                type: 'add-moment',
                data: {
                  author: '小李',
                  avatar: '🏃',
                  content: '周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。最近看到 #国内马拉松赛事安全保障升级# 的新闻，更觉得"保障"不分场景 —— 运动需要护具和医疗支持，生活需要保险和规划兜底。如果你也热爱运动，或想给家人配置全面保障，随时找我聊聊呀～',
                  images: ['半马成绩图', '赛事安全保障新闻截图'],
                  imageUrls: [
                    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
                  ],
                  time: '刚刚',
                  likes: ['王哥', '张姐', '李总'],
                  comments: [
                    { author: '王哥', content: '厉害啊兄弟！半马什么成绩？' },
                  ],
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能② 问题智能回复 ====================
  {
    id: 'field-smart-reply',
    name: '问题智能回复',
    icon: '💬',
    description: '智能回复',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-ai-analysis',
            content: '收到王哥微信私信，AI已完成智能分析',
            speechText: '收到王哥关于三高能否买保险的咨询，AI分析建议先安抚再引导预约。',
            data: {
              incomingMessage: '嗨小李，看你跑步这么拼！我最近体检查出三高，我这种情况还能买保险吗？',
              sender: '王哥',
              time: '约20分钟前',
              analysis: [
                { label: '问题类型', value: '健康告知咨询' },
                { label: '客户情绪', value: '轻微焦虑，担心被拒保', color: '#F59E0B' },
                { label: '意向阶段', value: '初步萌发期' },
                { label: '应对建议', value: '先安抚再引导预约，不宜直接推产品' },
              ],
            },
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
              {
                type: 'set-chat-messages',
                data: [
                  { sender: 'wangge', content: '嗨小李，看你跑步这么拼！我最近体检查出三高，我这种情况还能买保险吗？', timestamp: '10:52' },
                ],
              },
              {
                type: 'show-screenshot-helper',
                data: {
                  screenshot: '王哥的微信消息截图',
                  analysis: '识别到健康告知咨询，情绪轻微焦虑，建议先安抚再引导',
                  generatedReply: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊',
                  visible: true,
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '查看推荐回复', value: 'view-reply' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-reply-preview',
            content: 'AI已生成推荐回复',
            speechText: '已生成针对王哥三高咨询的推荐回复，语气温和，先安抚再引导预约。',
            data: {
              recipient: '王哥',
              replyText: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～',
              tips: [
                '用轻松语气消除焦虑感',
                '强调"很多客户类似"减少孤立感',
                '引导线下预约，建立信任',
              ],
            },
          },
        ],
        quickReplies: [
          { label: '一键发送', value: 'send-reply' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 回复已发送给王哥\n\n📩 **王哥回复：**\n"行，但我最近不在深圳，你先发我个方案看看吧"\n\n💡 **AI建议：**\n王哥表现出明确的购买意向，但暂时不方便面谈。建议：\n1. 先通过朋友圈分析了解王哥的兴趣和需求\n2. 进行个性化需求解析\n3. 生成针对性方案远程发送\n\n这样既不会让王哥觉得被催促，又能保持沟通的温度。',
            speechText: '王哥回复愿意先看方案。AI建议先分析王哥的兴趣和需求，再生成针对性方案。',
            wechatEvents: [
              { type: 'hide-screenshot-helper', data: null },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～', timestamp: '10:53' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '行，但我最近不在深圳，你先发我个方案看看吧', timestamp: '10:55' },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能③+④ 好友兴趣洞察 + 个性需求解析 ====================
  {
    id: 'field-interest-insight',
    name: '好友兴趣洞察',
    icon: '🔍',
    description: '需求解析',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-customer-profile',
            content: 'AI已扫描王哥朋友圈，输出客户画像',
            speechText: '已完成王哥朋友圈分析。王哥约42到48岁，企业中高层，爱好高尔夫和养生，孩子约10岁，注重品质消费。',
            data: {
              customerName: '王哥',
              avatar: '👤',
              profileItems: [
                { icon: '🎂', dimension: '年龄', value: '约42-48岁' },
                { icon: '💼', dimension: '职业', value: '企业中高层' },
                { icon: '⛳', dimension: '爱好', value: '高尔夫、养生' },
                { icon: '👦', dimension: '家庭', value: '孩子约10岁' },
                { icon: '📰', dimension: '近期关注', value: '多次转发健康管理类文章' },
                { icon: '💎', dimension: '消费偏好', value: '注重品质，对价格不敏感' },
              ],
            },
            wechatEvents: [
              { type: 'switch-view', data: 'moments' },
              {
                type: 'set-moments',
                data: [
                  {
                    author: '王哥',
                    avatar: '👤',
                    content: '周末带儿子去体验了高尔夫，小家伙挥杆有模有样的 ⛳',
                    images: ['高尔夫球场'],
                    imageUrls: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop'],
                    time: '2天前',
                    likes: ['张总', '小李', '陈姐'],
                  },
                  {
                    author: '王哥',
                    avatar: '👤',
                    content: '转发：《40+男性必看的10项健康指标》\n人到中年，健康才是最大的财富。',
                    time: '4天前',
                    likes: ['李总', '赵经理'],
                  },
                  {
                    author: '王哥',
                    avatar: '👤',
                    content: '养生之道在于坚持。最近开始每天泡枸杞菊花茶，感觉精神好多了 🍵',
                    time: '1周前',
                    likes: ['小李', '王太太'],
                    comments: [{ author: '王太太', content: '终于开始注意身体了👏' }],
                  },
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '查看需求解析', value: 'view-needs' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-needs-analysis',
            content: 'AI输出王哥需求深度解析',
            speechText: '王哥的核心需求是健康风险对冲和家庭收入保全，次要需求是子女教育和财富传承。紧迫程度四颗星，三高状态下投保窗口期有限。',
            data: {
              customerName: '王哥',
              coreNeeds: [
                { label: '健康风险对冲', detail: '三高状态下，医疗和重疾保障是第一需求' },
                { label: '家庭收入保全', detail: '作为家庭经济主力，需要高额寿险兜底' },
              ],
              secondaryNeeds: [
                { label: '子女教育', detail: '孩子约10岁，教育金规划黄金窗口' },
                { label: '财富传承', detail: '企业主身份，资产保全和传承需提前布局' },
              ],
              urgency: 4,
              urgencyNote: '三高状态下投保窗口期有限，部分险种可能因健康状况恶化而无法投保或加费严重。现在是配置保障的关键时机。',
            },
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑤ 精准话术推荐 ====================
  {
    id: 'field-sales-script',
    name: '精准话术推荐',
    icon: '🎯',
    description: '话术推荐',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '💡 **AI提示：**\n\n要为王哥精准匹配方案，还需了解他家庭现有保障情况。我来帮你设计询问话术？',
            speechText: '要为王哥精准匹配方案，还需了解他的现有保障情况，我来帮你设计询问话术。',
          },
        ],
        quickReplies: [
          { label: '好的', value: 'generate-script' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-sales-script',
            content: 'AI生成询问话术',
            speechText: '询问话术已生成，自然切入了解王哥的现有保障情况。',
            data: {
              scriptText: '王哥，我这边已经根据你的情况初步做了个方向，但想给你一个真正合适的方案，还需要了解你家里目前的保障配置——比如你和家人有没有在其他地方买过重疾险或寿险？公司团险大概覆盖哪些？大概几分钟，你回复我几个关键信息就够了。',
              designPoints: [
                '先给对方信心（已初步分析）',
                '说明询问目的（为了更精准）',
                '降低对方负担（几分钟就够）',
                '具体引导方向（重疾、寿险、团险）',
              ],
            },
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
            ],
          },
        ],
        quickReplies: [
          { label: '一键发送', value: 'send-script' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 话术已发送给王哥\n\n📩 **王哥回复：**\n"公司团险买了意外险和医疗险，重疾险之前买过一份，好像是20万保额，其他的没有了。"\n\n📊 **AI整理王哥现有保障：**\n• ✅ 意外险（公司团险）\n• ✅ 医疗险（公司团险）\n• ⚠️ 重疾险 20万保额\n• ❌ 寿险 无\n• ❌ 年金险 无\n• ❌ 养老规划 无\n\n已获取关键信息，可以进行保障缺口诊断了。',
            speechText: '王哥回复了现有保障情况：公司团险覆盖意外和医疗，重疾险20万保额，寿险和年金为空白。',
            wechatEvents: [
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥，我这边已经根据你的情况初步做了个方向，但想给你一个真正合适的方案，还需要了解你家里目前的保障配置——比如你和家人有没有在其他地方买过重疾险或寿险？公司团险大概覆盖哪些？大概几分钟，你回复我几个关键信息就够了。', timestamp: '11:05' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '公司团险买了意外险和医疗险，重疾险之前买过一份，好像是20万保额，其他的没有了。', timestamp: '11:08' },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑥ 保障缺口诊断 ====================
  {
    id: 'field-coverage-gap',
    name: '保障缺口诊断',
    icon: '🛡️',
    description: '缺口诊断',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-gap-diagnosis',
            content: '王哥保障缺口诊断报告',
            speechText: '王哥的保障缺口诊断完成。团险依赖性强，重疾险严重不足，寿险几乎空白，养老规划未启动。',
            data: {
              customerName: '王哥',
              coverageItems: [
                { name: '意外险', status: 'covered', current: '公司团险覆盖', note: '团险与工作绑定，一旦离职或公司变动，保障同步清零' },
                { name: '医疗险', status: 'covered', current: '公司团险覆盖', note: '不可单独续保，依赖性极强' },
                { name: '重疾险', status: 'warning', current: '20万保额', required: '100万+', gap: '80万+', note: '以王哥收入水平和家庭负担，至少需100万以上' },
                { name: '寿险', status: 'danger', current: '无', required: '200万+', note: '孩子尚小、家庭责任重，一旦出险家庭面临巨大压力' },
                { name: '养老规划', status: 'danger', current: '无', note: '完全未启动' },
              ],
              riskWarnings: [
                '团险保障与工作绑定，离职即失效',
                '重疾险缺口高达80万以上',
                '寿险几乎空白，家庭存在重大风险敞口',
              ],
            },
          },
        ],
        quickReplies: [
          { label: '查看总结建议', value: 'view-summary' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '📋 **AI诊断总结：**\n\n"王哥目前的保障结构依赖性太强——意外和医疗全靠公司，自己名下几乎什么都没有。三高状态下核保窗口随时可能收紧，**现在是配置重疾和寿险的最后时机**。"\n\n🎯 **优先级排序：**\n1. 🔴 **重疾险扩充** — 从20万提升至100万+（最紧急）\n2. 🔴 **寿险配置** — 覆盖家庭3-5年支出（紧急）\n3. 🟡 **个人医疗险** — 摆脱团险依赖（重要）\n4. 🟢 **年金/养老** — 长期财富规划（可选）',
            speechText: '总结来看，王哥现在最紧急的是扩充重疾险和配置寿险，三高状态下核保窗口随时可能收紧。',
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑦ 产品精准匹配 ====================
  {
    id: 'field-product-matching',
    name: '产品精准匹配',
    icon: '📦',
    description: '产品匹配',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-product-plans',
            content: 'AI根据王哥画像输出两套方案',
            speechText: 'AI输出两套方案：均衡版是重疾加医疗加寿险三险联动，标注为主推方案；尊享版在此基础上增加年金险。',
            data: {
              customerName: '王哥',
              plans: [
                {
                  name: '均衡版',
                  badge: 'AI主推',
                  highlight: '三险联动，系统保障',
                  items: [
                    { product: '重疾险', detail: '保额100万，覆盖120种重疾+60种轻症' },
                    { product: '医疗险', detail: '百万医疗，不限社保用药' },
                    { product: '寿险', detail: '保额200万，定期至65岁' },
                  ],
                },
                {
                  name: '尊享版',
                  badge: null,
                  highlight: '保障与财富传承双轮驱动',
                  items: [
                    { product: '均衡版全部保障', detail: '重疾+医疗+寿险' },
                    { product: '年金险', detail: '年缴2.6万，60岁起年领8万' },
                  ],
                },
              ],
              aiNote: '建议优先呈现均衡版。王哥决策型人格，给两个选项比给一个更容易成交。',
            },
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑧ 收益分析测算 ====================
  {
    id: 'field-commission-calc',
    name: '收益分析测算',
    icon: '💰',
    description: '收益测算',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-commission',
            content: '代理人收益测算',
            speechText: '均衡版首年佣金约1.12万元，续期三年合计1.8万。尊享版首年约2万，续期合计3.1万，是均衡版的1.7倍。',
            data: {
              plans: [
                {
                  name: '均衡版方案',
                  rows: [
                    { label: '王哥年缴保费', value: '约3.2万元' },
                    { label: '首年佣金比例', value: '约35%' },
                    { label: '首年预计到手', value: '约1.12万元', highlight: true },
                    { label: '续期3年合计佣金', value: '约1.8万元', highlight: true },
                  ],
                },
                {
                  name: '尊享版方案',
                  rows: [
                    { label: '王哥年缴保费', value: '约5.8万元' },
                    { label: '首年佣金比例', value: '约35%' },
                    { label: '首年预计到手', value: '约2万元', highlight: true },
                    { label: '续期3年合计佣金', value: '约3.1万元', highlight: true },
                  ],
                },
              ],
              comparisonNote: '尊享版佣金约为均衡版的1.7倍，且年金险属于长期续期产品，后续收益更稳定。',
            },
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑩ 圈客：盘点客户与经营计划 ====================
  {
    id: 'field-customer-planning',
    name: '圈客经营计划',
    icon: '🗂️',
    description: '盘点客户',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '👋 王芳老师，**司庆季**开始了！AI助手结合当下司庆季营销节点，已为您智能盘点重点客户，共推荐 **20位** 重点客户，其中银行存款到期客户5位、旺财余额大于5万的客户3位、资产规模大于600W的客户10位。\n\n是否要为您添加至**4月经营计划**中？',
            speechText: '王芳老师，司庆季开始了！为您推荐20位重点客户，其中中高温客户8位，转化率接近10%，建议尽快邀约拜访。另有冷却客户5位，长期未联系易导致关系疏远，提醒加强线上互动频次。是否添加至4月经营计划？',
          },
          {
            type: 'field-customer-temperature',
            content: '',
            data: {
              total: 20,
              hotCount: 8,
              coldCount: 5,
              conversionRate: '~10%',
            },
          },
          {
            type: 'field-customer-plan',
            content: '',
            data: {
              title: '司庆季 · 4月重点经营客户',
              totalCount: 20,
              conversionRate: '~10%',
              estimatedConversion: '2人',
              segments: [
                {
                  type: '银行存款到期客户', count: 5, icon: '🏦', color: '#F59E0B', bg: '#FFFBEB',
                  customers: [
                    { name: '陈先生', detail: '存款300万 · 本月到期' },
                    { name: '刘女士', detail: '存款150万 · 本月到期' },
                    { name: '张先生', detail: '存款200万 · 下月到期' },
                    { name: '王总', detail: '存款500万 · 本月到期' },
                    { name: '赵女士', detail: '存款80万 · 本月到期' },
                  ],
                },
                {
                  type: '旺财余额 > 5万', count: 3, icon: '💰', color: '#10B981', bg: '#ECFDF5',
                  customers: [
                    { name: '李先生', detail: '旺财余额 12万' },
                    { name: '孙女士', detail: '旺财余额 8万' },
                    { name: '周先生', detail: '旺财余额 6万' },
                  ],
                },
                {
                  type: '资产规模 > 600W', count: 10, icon: '👑', color: '#7C3AED', bg: '#F5F3FF',
                  customers: [
                    { name: '马总', detail: '资产约1200万' },
                    { name: '林女士', detail: '资产约720万' },
                    { name: '黄先生', detail: '资产约680万' },
                    { name: '吴女士', detail: '资产约900万' },
                    { name: '郑总', detail: '资产约1500万' },
                    { name: '冯先生', detail: '资产约650万' },
                    { name: '沈女士', detail: '资产约780万' },
                    { name: '韩先生', detail: '资产约620万' },
                    { name: '唐总', detail: '资产约2000万' },
                    { name: '李明', detail: '资产约640万' },
                  ],
                },
                {
                  type: '冷却客户', count: 5, icon: '❄️', color: '#94A3B8', bg: '#F8FAFC',
                  customers: [
                    { name: '高先生', detail: '资产约680万 · 8个月未联系' },
                    { name: '柳女士', detail: '旺财15万 · 6个月未联系' },
                    { name: '余先生', detail: '资产约520万 · 5个月未联系' },
                    { name: '白女士', detail: '存款100万 · 7个月未联系' },
                    { name: '许先生', detail: '资产约450万 · 4个月未联系' },
                  ],
                },
              ],
              aiNote: '以上客户均在近30天内有明确的资产管理需求信号，司庆季是切入的最佳时机。冷却客户建议优先通过朋友圈、问候消息加强互动频次。',
            },
          },
        ],
        quickReplies: [
          { label: '除了李明之外都添加，并加入3年前购买财富产品的客户', value: 'add-custom-plan' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-customer-plan',
            content: '',
            data: {
              title: '司庆季 · 4月重点经营客户（已更新）',
              totalCount: 20,
              isUpdated: true,
              updatedTotal: 27,
              conversionRate: '~10%',
              estimatedConversion: '2-3人',
              segments: [
                {
                  type: '银行存款到期客户',
                  count: 4,
                  icon: '🏦',
                  color: '#F59E0B',
                  bg: '#FFFBEB',
                  customers: [
                    { name: '陈先生', detail: '存款300万 · 本月到期' },
                    { name: '刘女士', detail: '存款150万 · 本月到期' },
                    { name: '张先生', detail: '存款200万 · 下月到期' },
                    { name: '王总', detail: '存款500万 · 本月到期' },
                  ],
                },
                {
                  type: '旺财余额 > 5万',
                  count: 3,
                  icon: '💰',
                  color: '#10B981',
                  bg: '#ECFDF5',
                  customers: [
                    { name: '李先生', detail: '旺财余额 12万' },
                    { name: '孙女士', detail: '旺财余额 8万' },
                    { name: '周先生', detail: '旺财余额 6万' },
                  ],
                },
                {
                  type: '资产规模 > 600W',
                  count: 12,
                  icon: '👑',
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                  customers: [
                    { name: '马总', detail: '资产约1200万' },
                    { name: '林女士', detail: '资产约720万' },
                    { name: '黄先生', detail: '资产约680万' },
                    { name: '吴女士', detail: '资产约900万' },
                    { name: '郑总', detail: '资产约1500万' },
                    { name: '冯先生', detail: '资产约650万' },
                    { name: '沈女士', detail: '资产约780万' },
                    { name: '韩先生', detail: '资产约620万' },
                    { name: '唐总', detail: '资产约2000万' },
                    { name: '赵女士', detail: '资产约680万' },
                    { name: '钱总', detail: '资产约1100万' },
                    { name: '孟先生', detail: '资产约640万' },
                  ],
                },
                {
                  type: '3年前财富产品客户',
                  count: 8,
                  icon: '📈',
                  color: '#3B82F6',
                  bg: '#EFF6FF',
                  isNew: true,
                  customers: [
                    { name: '苏先生', detail: '3年前购买·盛世传承' },
                    { name: '谢女士', detail: '3年前购买·金瑞理财' },
                    { name: '钱先生', detail: '3年前购买·智汇宝' },
                    { name: '田总', detail: '3年前购买·盛世传承' },
                    { name: '潘女士', detail: '3年前购买·金瑞理财' },
                    { name: '蒋先生', detail: '3年前购买·稳盈增利' },
                    { name: '何女士', detail: '3年前购买·智汇宝' },
                    { name: '贾先生', detail: '3年前购买·盛世传承' },
                  ],
                },
              ],
              aiNote: '4月经营计划已生成，已匹配专属沟通话术和司庆季触客内容，建议优先联系陈先生。',
            },
          },
          {
            type: 'field-monthly-plan',
            content: '',
            speechText: '4月经营计划已生成，27位重点客户，优先拜访陈先生。AI已为每位客户匹配专属沟通话术和司庆季触客内容。',
            data: {
              totalCount: 27,
              estimatedConversion: '2-3人',
              estimatedIncome: '约5万元',
              topContacts: [
                { rank: 1, name: '陈先生', detail: '存款300万 · 本月到期 · 主动咨询意向强' },
                { rank: 2, name: '王总', detail: '存款500万 · 本月到期' },
                { rank: 3, name: '唐总', detail: '资产2000万 · 高净值重点' },
              ],
              aiNote: 'AI已为27位客户分别匹配专属沟通话术与司庆季触客内容，可一键发送至微信',
            },
          },
        ],
        quickReplies: [
          { label: '查看匹配沟通话术与触客内容', value: 'view-outreach-scripts' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-outreach-scripts',
            content: '',
            speechText: '已生成陈先生专属话术和通用触客模板，建议优先联系陈先生，可一键发送至微信。',
            data: {
              totalCount: 27,
              priorityContact: {
                name: '陈先生',
                script: '陈先生，司庆季开始了！想起您之前提过在考虑资产配置的问题，正好我们近期有几款特别适合您情况的产品，有时间聊聊吗？',
                reason: '存款300万本月到期 · 主动咨询意向强',
              },
              generalTemplate: '王老师，平安司庆季特别推出了几款专属产品，结合您目前的资产情况，我觉得很适合您，方便的话给您详细介绍一下？',
              templateCount: 26,
            },
          },
        ],
        quickReplies: [
          { label: '一键发送至微信', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑪ 触客：微信互动+邀请函+档案 ====================
  {
    id: 'field-customer-engagement',
    name: '触客互动全流程',
    icon: '📲',
    description: '触客互动',
    steps: [
      // Step 1: 切换到微信，智能键盘展示推荐话术，代理人一键发送
      // 注：add-chat 消息已在旁白阶段由 advanceToNextStep 预填充，此处仅刷新键盘
      {
        aiMessages: [
          {
            type: 'text',
            content: '📩 **微信智能键盘已就绪！**\n\nAI已根据对话内容生成回复话术，点击「发送话术」发给陈先生。',
            speechText: '智能键盘已为您生成回复话术，请切换到微信，点击一键发送。',
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
              {
                type: 'show-smart-keyboard',
                data: {
                  analysis: 'AI根据对话内容实时分析，为您生成符合自身风格的回复话术',
                  recommendedScript: '陈先生，您说得很对！最近市场波动比较大，很多客户都在重新审视资产配置。我根据您的情况梳理了几个方向，您看方便的话我来详细给您介绍一下？',
                },
              },
              { type: 'show-float-btn', data: null },
            ],
          },
        ],
        quickReplies: [],
      },
      // Step 2: 代理人发送话术后，陈先生回复"可以"，键盘切换为触客素材
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **陈先生回复了：「可以，感兴趣，您介绍一下！」**\n\nAI已为您匹配对应触客素材，可一键发送。',
            speechText: '陈先生表示感兴趣！AI已为您匹配对应触客素材，可一键转发给陈先生。',
            wechatEvents: [
              {
                type: 'add-chat',
                data: { sender: 'chensheng', senderName: '陈先生', content: '可以，感兴趣，您介绍一下！', timestamp: '10:22' },
              },
              {
                type: 'show-smart-keyboard',
                data: {
                  analysis: '根据近期热点话题，AI为您定制以下触客内容，可一键转发',
                  recommendedScript: '陈先生，我给您整理了几份资产配置的参考资料，包括市场分析、方案指南、客户案例等，抽空看看，有问题随时聊！',
                  contentItems: [
                    {
                      icon: '📊',
                      title: '市场动态周报',
                      tag: '文章',
                      desc: '近期A股波动分析与资产配置建议',
                    },
                    {
                      icon: '💰',
                      title: '资产配置指南',
                      tag: 'PDF',
                      desc: '震荡市下高净值客户保全策略',
                    },
                    {
                      icon: '📈',
                      title: '同类客户案例',
                      tag: '案例',
                      desc: '企业主多元化配置，年化稳健收益',
                    },
                    {
                      icon: '🏆',
                      title: '理财收益对比',
                      tag: '报告',
                      desc: '保险年金vs其他资产5年收益对比',
                    },
                  ],
                },
              },
            ],
          },
        ],
        quickReplies: [],
      },
      // Step 3: 话术已发送，回到万能营销，建议邀约活动
      {
        aiMessages: [
          {
            type: 'field-ai-analysis',
            content: '陈先生互动分析完成，AI建议邀请参加财富管理讲座',
            speechText: '话术已成功发送！基于陈先生的兴趣偏好，AI助手建议邀请他参加本月的财富管理讲座，这是促成转化的最佳时机。',
            wechatEvents: [
              { type: 'switch-to-assistant', data: null },
              { type: 'hide-float-btn', data: null },
            ],
            data: {
              incomingMessage: '好的，正好最近也在想这些，你什么时候方便详细聊聊？',
              sender: '陈先生',
              time: '刚刚',
              analysis: [
                { label: '客户状态', value: '意向明确，主动推进' },
                { label: '互动质量', value: '高意向，回复积极', color: '#10B981' },
                { label: '推进建议', value: '邀请参加财富管理讲座，加速转化' },
                { label: '最佳时机', value: '司庆季节点，把握窗口期' },
              ],
            },
          },
        ],
        quickReplies: [
          { label: '制作专属活动邀请函', value: 'make-invitation' },
        ],
      },
      // Step 3: 生成邀请函
      {
        aiMessages: [
          {
            type: 'field-invitation',
            content: 'AI已为陈先生生成专属活动邀请函与邀约文案',
            speechText: '已结合陈先生的兴趣偏好，生成财富管理讲座的专属邀请函和邀约文案，可一键发送至微信。',
            wechatEvents: [],
            data: {
              recipientName: '陈先生',
              eventName: '财富管理讲座活动',
              eventTheme: '「资产配置·养老规划」专题论坛',
              eventDate: '4月15日（周六）14:00',
              eventLocation: '深圳平安金融中心18楼 精英厅',
              personalNote: '结合您近期对资产配置的关注，特别邀请您参与本次专题讲座，届时将有资深专家为您解答养老规划缺口问题。',
              inviteCopy: '陈先生，本周六下午我们有个专题讲座，专门讲「资产保值增值+居家养老规划」，嘉宾都是顶尖专家。我给您留了一个名额，您来不来？',
              senderName: '王芳',
            },
          },
        ],
        quickReplies: [
          { label: '一键发送至微信', value: 'send-invitation-wechat' },
        ],
      },
      // Step 4: 发送邀请函到微信，客户同意，智能键盘再次出现
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **邀请函与邀约话术已发送至微信！**\n\n📩 陈先生刚刚回复了，请点击「一键截屏」获取跟进话术。',
            speechText: '邀请函已成功发送，陈先生已回复同意参加，智能键盘已准备好跟进话术建议。',
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
              {
                type: 'add-chat',
                data: {
                  sender: 'xiaoli',
                  content: '陈先生，本周六下午我们有个专题讲座，专门讲「资产保值增值+居家养老规划」，嘉宾都是顶尖专家。我给您留了一个名额，您来不来？',
                  timestamp: '10:22',
                },
              },
              {
                type: 'add-chat',
                data: {
                  sender: 'xiaoli',
                  content: '[活动邀请] 财富管理讲座 · 4月15日（周六）14:00 · 平安金融中心18楼',
                  contentType: 'file',
                  timestamp: '10:22',
                },
              },
              {
                type: 'add-chat',
                data: {
                  sender: 'chensheng',
                  senderName: '陈先生',
                  content: '好啊，周六下午我有空，到时候见！',
                  timestamp: '10:25',
                },
              },
              {
                type: 'show-smart-keyboard',
                data: {
                  analysis: '客户同意参加活动，情绪积极，适合确认细节并表达期待',
                  recommendedScript: '太棒了！我到时候提前给您发位置，到了直接找我。讲座结束后咱们单独聊聊您的具体情况，我已经结合您的需求准备了一些方案思路。',
                },
              },
            ],
          },
        ],
        quickReplies: [],
      },
      // Step 5: 活动后，回到万能营销，语音更新档案
      {
        aiMessages: [
          {
            type: 'text',
            content: '🎉 **活动顺利举办！**\n\n陈先生全程参与，对居家养老方向非常感兴趣。\n\n🎤 **请用语音输入**告诉我活动中收集到的信息，我来帮您快速更新客户档案。',
            speechText: '活动顺利举办！请点击下方按钮，用语音告诉我陈先生在活动中分享的信息，我来帮您更新客户档案。',
            wechatEvents: [
              { type: 'switch-to-assistant', data: null },
              { type: 'hide-float-btn', data: null },
            ],
          },
        ],
        quickReplies: [
          {
            label: '🎤 陈先生反馈：45岁，企业中层，有老有小，近年一直在想怎么把存款用起来，对居家养老服务很感兴趣',
            value: 'voice-input-archive',
          },
        ],
      },
      // Step 6: 生成客户档案，确认
      {
        aiMessages: [
          {
            type: 'field-customer-archive',
            content: 'AI已整理生成陈先生客户档案',
            speechText: '陈先生客户档案已生成。45岁企业中层，关注资产配置与居家养老，下一步建议尽快约定需求分析面谈，准备定制方案。',
            wechatEvents: [],
            data: {
              customerName: '陈先生',
              age: '45岁',
              job: '企业中层管理',
              family: '家有老小（父母+子女约10岁）',
              source: '财富管理讲座活动',
              activityFeedback: '近年一直在想怎么把存款用起来，对居家养老服务非常感兴趣，觉得这个方向很符合自己的需求。',
              interests: ['资产配置', '养老规划', '居家养老服务', '财富传承'],
              keyInsights: [
                '有明确的财富增值需求，存款闲置是核心痛点',
                '对居家养老服务有浓厚兴趣，符合主推产品方向',
                '家庭责任重，需要全面保障规划',
                '决策型人格，主动咨询意味着意向成熟',
              ],
              nextActions: ['尽快约定需求分析面谈', '准备平安盛盈·居家养老定制方案', '发送同类客户案例参考资料'],
              archiveTime: '活动后语音更新',
            },
          },
        ],
        quickReplies: [
          { label: '确认更新，继续', value: 'back-to-menu' },
        ],
      },
    ],
  },

  // ==================== 功能⑫ 访/邀+转：陈先生专属保险方案 ====================
  {
    id: 'field-chen-solution',
    name: '产品方案定制',
    icon: '🏆',
    description: '司庆方案',
    steps: [
      {
        aiMessages: [
          {
            type: 'text',
            content: '💬 **【人】** 帮我给客户陈先生定制一份保险方案。\n\n🤖 **AI分析中...**\n已调取陈先生客户档案，正在进行深度需求分析...',
            speechText: '收到指令，正在为陈先生进行需求分析和保险方案定制。',
            wechatEvents: [
              { type: 'switch-to-assistant', data: null },
            ],
          },
          {
            type: 'field-insurance-solution',
            content: '',
            data: {
              customerName: '陈先生',
              age: 45,
              customerGroup: '社会中坚客群',
              riskWarnings: ['资产配置失衡', '养老储备不足'],
              gaps: [
                { type: '财富缺口', amount: '160万', icon: '💼', color: '#F59E0B' },
                { type: '养老缺口', amount: '180万', icon: '🏠', color: '#7C3AED' },
              ],
              productName: '平安盛盈·居家养老',
              subProduct: '金尊分红 · 司庆版',
              annualPremium: '20万',
              paymentYears: '6年',
              benefits: [
                { icon: '📈', text: '现金持续增值' },
                { icon: '💰', text: '享受分红收益' },
                { icon: '🏡', text: '居家养老服务' },
              ],
              agentIncome: '16,880元',
              highlight: '促成以上方案后，您可获得收入 16,880元。司庆季专属分红，配置时机正当其时。',
            },
          },
        ],
        quickReplies: [
          { label: '查看销售话术', value: 'view-sales-logic' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'field-sales-logic',
            content: 'AI生成陈先生专属销售逻辑话术',
            speechText: '已生成针对陈先生的销售逻辑话术，分四步推进，从需求共鸣到促成成交。',
            data: {
              productName: '平安盛盈·居家养老',
              steps: [
                {
                  step: 1,
                  title: '需求共鸣',
                  script: '陈先生，您45岁正是家庭责任最重的阶段，上有父母、下有子女，自己还是家庭的顶梁柱。这个阶段资产保值增值和养老规划是最关键的两件事，您认同吗？',
                  tip: '先建立共识，让客户点头认可',
                },
                {
                  step: 2,
                  title: '缺口呈现',
                  script: '根据我对您情况的分析，目前有两个重要缺口：财富缺口约160万，养老缺口约180万。这两个缺口如果现在不做规划，会随时间越来越难以填补。',
                  tip: '用数字说话，增强客户紧迫感',
                },
                {
                  step: 3,
                  title: '方案呈现',
                  script: '这款平安盛盈·居家养老，年交20万、交6年，可以同时解决这两个缺口：现金持续增值，享受分红收益，还配套专业的居家养老服务，一举三得。',
                  tip: '方案讲解要简洁，突出三大核心价值',
                },
                {
                  step: 4,
                  title: '促成成交',
                  script: '司庆季现在是特殊节点，这款产品的分红收益在这个时间点配置是最划算的。您看，我帮您把受益人和缴费方式先确认一下？',
                  tip: '顺势推进，借助节点节奏促成决策',
                },
              ],
              keyPoints: [
                '司庆季时间节点赋予稀缺感，促成时机不可错过',
                '居家养老服务是差异化卖点，重点强调',
                '从财富缺口+养老缺口双维度引发客户共鸣',
              ],
            },
          },
        ],
        quickReplies: [
          { label: '发送方案给陈先生', value: 'send-solution' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **方案已发送给陈先生**\n\n📩 **陈先生回复：**\n"王芳，你这个方案思路很清晰，我再考虑一下，下周给你答复。"\n\n🎯 **总结：**\n在万能营销助手的帮助下，从**司庆季客群盘点** → **触客微信互动** → **活动邀约** → **需求分析** → **方案定制**，客户经营和促成转化效率**明显提升**！\n\n💰 **本次潜在收入：16,880元**',
            speechText: '方案已发送，陈先生表示下周给答复。在万能营销的帮助下，客户经营效率明显提升，本次潜在收入16880元。',
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '陈先生，根据您的情况我为您定制了这份方案，请查收👇', timestamp: '14:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 陈先生专属保险方案_平安盛盈.pdf', contentType: 'file', timestamp: '14:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'chensheng', senderName: '陈先生', content: '王芳，你这个方案思路很清晰，我再考虑一下，下周给你答复。', timestamp: '14:45' },
              },
              { type: 'switch-to-assistant', data: null },
              {
                type: 'show-followup-reminder',
                data: {
                  title: 'AI自动跟进提醒已设置',
                  schedule: [
                    { date: '📅 3天后（周四）', action: '主动询问陈先生的考虑进展' },
                    { date: '📅 5天后（周六）', action: '若未回复，发送居家养老服务案例' },
                    { date: '📅 7天后（下周一）', action: '提议约定线下需求分析面谈' },
                  ],
                  summary: '方案定制完成，陈先生已进入决策阶段。保持适度跟进，预计下周可推进至签约环节。',
                },
              },
            ],
          },
        ],
        quickReplies: [
        ],
      },
    ],
  },

  // ==================== 功能⑨ 讲解素材生成 ====================
  {
    id: 'field-presentation-gen',
    name: '讲解素材生成',
    icon: '📑',
    description: '素材与跟进',
    steps: [
      {
        aiMessages: [
          {
            type: 'field-materials',
            content: 'AI已自动生成四份讲解材料',
            speechText: 'AI已生成四份材料：一页纸方案总览、三高核保说明、理赔流程动图和同类客户案例。',
            data: {
              summary: '以下材料已根据王哥画像和方案自动生成，可一键发送',
              materials: [
                {
                  icon: '📄',
                  title: '一页纸方案总览',
                  description: '配图简洁无术语，适合王哥发给家人共同决策',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
                  detailContent: '📌 王哥专属保障方案总览\n\n👤 客户：王哥 | 年龄：约45岁 | 家庭支柱\n\n━━━━━━━━━━━━━━━━━━━━━\n🔷 方案一：均衡版（AI主推）\n━━━━━━━━━━━━━━━━━━━━━\n• 重疾险：保额100万，覆盖120种重疾+60种轻症\n• 医疗险：百万医疗，不限社保用药\n• 寿险：保额200万，定期至65岁\n💰 年缴保费：约3.2万元\n\n━━━━━━━━━━━━━━━━━━━━━\n🔷 方案二：尊享版\n━━━━━━━━━━━━━━━━━━━━━\n• 以上全部保障\n• 年金险：年缴2.6万，60岁起年领8万\n💰 年缴保费：约5.8万元\n\n✅ 建议：优先选择均衡版，覆盖核心风险缺口',
                },
                {
                  icon: '🏥',
                  title: '三高客户核保说明',
                  description: '逐条说明哪些情况可承保、需补充哪些体检材料',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop',
                  detailContent: '🏥 三高客户核保指南\n\n一、高血压\n✅ 1级高血压（140-159/90-99）：标准体承保\n⚠️ 2级高血压（160-179/100-109）：加费承保\n❌ 3级高血压（≥180/≥110）：延期或拒保\n\n二、高血糖\n✅ 空腹血糖 < 7.0 且糖化 < 7%：标准体承保\n⚠️ 确诊糖尿病但控制良好：加费25%-50%\n❌ 有并发症：延期或拒保\n\n三、高血脂\n✅ 轻度升高无用药：标准体承保\n⚠️ 中度升高需用药：加费承保\n\n📋 王哥需补充材料：\n1. 近6个月内血压监测记录\n2. 最新血液检查报告（血糖、血脂、糖化血红蛋白）\n3. 心电图检查报告\n4. 目前用药清单',
                },
                {
                  icon: '🎬',
                  title: '理赔流程动图',
                  description: '30秒看懂从报案到到账全流程',
                  fileType: 'GIF',
                  imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848e968838?w=400&h=200&fit=crop',
                  detailContent: '🎬 理赔全流程（5步到账）\n\n┌─────────────────────────┐\n│  1️⃣ 报案（当天）              │\n│  拨打客服热线 / APP一键报案     │\n│        ↓                      │\n│  2️⃣ 提交材料（1-3天）          │\n│  诊断证明+身份证+银行卡         │\n│        ↓                      │\n│  3️⃣ 审核（3-5个工作日）        │\n│  保险公司核实材料               │\n│        ↓                      │\n│  4️⃣ 核赔确认（1-2天）          │\n│  确认赔付金额并通知             │\n│        ↓                      │\n│  5️⃣ 打款到账（1-3天）          │\n│  赔付款直接转入指定银行账户      │\n└─────────────────────────┘\n\n⏱️ 全流程最快 5 个工作日到账\n📱 全程可通过APP查询进度',
                },
                {
                  icon: '📋',
                  title: '同类客户脱敏案例',
                  description: '"一位45岁企业主，同样三高，去年确诊心梗，当月理赔到账68万。"',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
                  detailContent: '📋 真实案例（已脱敏处理）\n\n👤 客户背景：\n• 张先生，45岁，某制造企业负责人\n• 身体状况：高血压2级、高血脂\n• 2023年投保：重疾险80万 + 百万医疗\n\n⚡ 出险经过：\n• 2024年3月，突发急性心肌梗塞\n• 紧急送医，行心脏支架手术（2枚）\n• ICU住院5天，普通病房12天\n\n💰 理赔结果：\n• 重疾险一次性赔付：80万元\n• 医疗险报销住院费用：28.6万元\n• 合计获赔：108.6万元\n• 从报案到重疾险到账：仅8个工作日\n\n💬 张先生感言：\n"当时觉得买保险就是个心理安慰，没想到真用上了。幸亏当时代理人坚持建议我趁身体还行赶紧配置。"\n\n📌 与王哥情况对比：\n王哥目前三高状况与张先生投保时相似，现在正是配置保障的窗口期。',
                },
              ],
            },
          },
        ],
        quickReplies: [
          { label: '一键全部发送给王哥', value: 'send-all-materials' },
        ],
      },
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 四份材料已全部发送给王哥\n\n📩 **王哥回复（几分钟后）：**\n"你这个做得很细，我发给我老婆看看，这周给你答复。"\n\n🎯 **本次服务总结：**\n从朋友圈获客到方案发送全流程完成，王哥已进入决策阶段。保持适度跟进，预计本周内可推进到签约环节。',
            speechText: '材料已发送，王哥表示发给老婆看看，这周给答复。已设置3天后回访提醒，王哥已进入决策阶段。',
            wechatEvents: [
              { type: 'switch-view', data: 'chat' },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥，这是我根据你的情况整理的方案和资料，你看看👇', timestamp: '11:20' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 一页纸方案总览.pdf', contentType: 'file', timestamp: '11:20' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 三高客户核保说明.pdf', contentType: 'file', timestamp: '11:20' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 理赔流程动图.gif', contentType: 'file', timestamp: '11:21' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 同类客户脱敏案例.pdf', contentType: 'file', timestamp: '11:21' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '你这个做得很细，我发给我老婆看看，这周给你答复。', timestamp: '11:28' },
              },
              {
                type: 'show-followup-reminder',
                data: {
                  title: 'AI自动跟进提醒已设置',
                  schedule: [
                    { date: '📅 3天后（周四）', action: '主动询问王哥和家人的意见' },
                    { date: '📅 5天后（周六）', action: '若未回复，发送补充资料' },
                    { date: '📅 7天后（下周一）', action: '提议线上或线下面谈' },
                  ],
                  summary: '从朋友圈获客到方案发送全流程完成，王哥已进入决策阶段。保持适度跟进，预计本周内可推进到签约环节。',
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '继续', value: 'back-to-menu' },
        ],
      },
    ],
  },
];
