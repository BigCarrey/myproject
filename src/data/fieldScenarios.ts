import type { Scenario } from '../types';

// ==================== 记忆收集阶段 ====================
export const memoryCollectionScenario: Scenario = {
  id: 'field-memory-collection',
  name: '记忆收集',
  icon: '🧠',
  description: '收集代理人记忆',
  steps: [
    // Step 0: AI greeting
    {
      aiMessages: [
        {
          type: 'text',
          content: '小李你好！👋\n\n我是你的AI营销助理，在正式开始之前，我想先了解你。\n\n只有真正理解你，我才能成为一个**懂你的**助手。\n\n接下来我会问你几个问题，你准备好了吗？',
          speechText: '小李你好！我是你的AI营销助理。在正式开始之前，我想先了解你。接下来我会问你几个问题，你准备好了吗？',
        },
      ],
      quickReplies: [
        { label: '准备好了', value: 'ready' },
      ],
      quickReplyDelay: 500,
    },
    // Step 1: Ask about interests
    {
      aiMessages: [
        {
          type: 'text',
          content: '很好！😊\n\n**第一个问题：**\n你平时有什么兴趣爱好？比如运动、读书、旅行……什么都可以聊聊。',
          speechText: '很好！第一个问题，你平时有什么兴趣爱好？',
          wechatEvents: [
            {
              type: 'update-memory',
              data: { understandingLevel: 3 },
            },
          ],
        },
      ],
      quickReplies: [
        { label: '我喜欢跑步和健身，偶尔打打篮球', value: 'interests-sport' },
      ],
      quickReplyDelay: 300,
    },
    // Step 2: Respond + ask social circle
    {
      aiMessages: [
        {
          type: 'text',
          content: '运动达人！跑步和健身都是很棒的爱好，能保持好状态也是做好工作的基础 🏃‍♂️\n\n**第二个问题：**\n你平时的社交圈子是什么样的？朋友多不多？经常一起活动吗？',
          speechText: '运动达人！跑步健身很棒。第二个问题，你平时的社交圈子是什么样的？',
          wechatEvents: [
            {
              type: 'update-memory',
              data: {
                understandingLevel: 5,
                interests: ['跑步', '健身', '篮球'],
                newMemory: {
                  category: 'preference',
                  content: '喜欢跑步和健身，偶尔打篮球，是个运动达人。',
                },
              },
            },
          ],
        },
      ],
      quickReplies: [
        { label: '主要是同事和几个大学同学，圈子不算大', value: 'social-small' },
      ],
      quickReplyDelay: 300,
    },
    // Step 3: Respond + ask goals
    {
      aiMessages: [
        {
          type: 'text',
          content: '了解了，同事和老同学是最真实的关系。有时候圈子不在大，在精 💪\n\n**第三个问题：**\n你做保险代理人的目标是什么？对自己的未来有什么规划？',
          speechText: '了解了。第三个问题，你做代理人的目标是什么？对未来有什么规划？',
          wechatEvents: [
            {
              type: 'update-memory',
              data: {
                understandingLevel: 8,
                socialCircle: '同事和大学同学为主，社交圈不大但关系稳定',
                newMemory: {
                  category: 'habit',
                  content: '社交圈以同事和大学同学为主，偏好深度关系而非广泛社交。',
                },
              },
            },
          ],
        },
      ],
      quickReplies: [
        { label: '希望三年内做到团队主管，年收入突破30万', value: 'goal-leader' },
      ],
      quickReplyDelay: 300,
    },
    // Step 4: Respond + ask challenges
    {
      aiMessages: [
        {
          type: 'text',
          content: '三年团队主管、年入30万，目标清晰又有野心，我喜欢！🎯\n\n**最后一个问题：**\n你目前工作中最大的困难或痛点是什么？哪些事情让你最头疼？',
          speechText: '目标很清晰！最后一个问题，你工作中最大的困难是什么？',
          wechatEvents: [
            {
              type: 'update-memory',
              data: {
                understandingLevel: 11,
                goals: '三年内成为团队主管，年收入突破30万',
                newMemory: {
                  category: 'thought',
                  content: '职业目标明确：三年内做到团队主管，年收入30万+。有进取心和规划意识。',
                },
              },
            },
          ],
        },
      ],
      quickReplies: [
        { label: '获客太难了，不知道怎么自然地和客户聊保险', value: 'challenge-leads' },
      ],
      quickReplyDelay: 300,
    },
    // Step 5: Summary + show ceremony button
    {
      aiMessages: [
        {
          type: 'text',
          content: '我记住了。获客和自然切入是很多代理人的痛点，也正是我最擅长帮你解决的。\n\n✅ **我已经了解了你：**\n• 你爱运动——跑步、健身、篮球\n• 社交圈以同事和老同学为主\n• 目标是三年做到主管、年入30万\n• 最大痛点是获客和话术\n\n我会基于这些认知，为你提供**真正个性化**的营销支持。\n\n准备好了吗？让我们正式开始！',
          speechText: '我记住了。我会基于对你的了解，提供真正个性化的营销支持。准备好了吗？让我们正式开始！',
          wechatEvents: [
            {
              type: 'update-memory',
              data: {
                understandingLevel: 14,
                challenges: '获客难，不擅长自然切入保险话题',
                newMemory: {
                  category: 'recent',
                  content: '目前最大痛点：获客难、不知如何自然切入保险话题。',
                },
              },
            },
          ],
        },
      ],
      quickReplies: [
        { label: '✨ 开启AI营销助理', value: 'start-ceremony', icon: '✨' },
      ],
      quickReplyDelay: 800,
    },
  ],
};

// ==================== 主流程场景 ====================
export const fieldScenarios: Scenario[] = [
  {
    id: 'field-main-flow',
    name: 'AI营销助理',
    icon: '🤖',
    description: '主流程',
    steps: [
      // Step 0: AI intro after ceremony
      {
        aiMessages: [
          {
            type: 'text',
            content: '🤖 **你好小李，我是你的AI营销助理。**\n\n我已经了解了你——爱运动、目标明确、最需要解决获客问题。\n\n**我能帮你做什么？**\n• 📱 **朋友圈营销** — 结合你的人设定制内容\n• 💬 **客户沟通** — 智能回复、话术推荐\n• 📊 **客户分析** — 洞察需求、诊断保障缺口\n• 📋 **方案匹配** — 精准产品推荐、收益测算\n• 📦 **材料生成** — 一键制作专业讲解资料\n\n既然获客是你的痛点，我们先从**朋友圈营销**开始吧。我已经为你定制了一条内容👇',
            speechText: '你好小李，我是你的AI营销助理。我已经了解了你。既然获客是你的痛点，我们先从朋友圈营销开始。',
          },
        ],
        quickReplies: [
          { label: '看看内容', value: 'view-moments-content' },
        ],
        quickReplyDelay: 600,
      },
      // Step 1: Show moments content card
      {
        aiMessages: [
          {
            type: 'field-moments-post',
            content: '已为您定制个性化朋友圈内容',
            speechText: '我结合你爱运动的人设和近期体育新闻，为你定制了一条朋友圈内容。',
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
      // Step 2: Moments published → execution panel shows moments → Wang Ge comments
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **朋友圈发布成功！10:32**\n\n系统已自动完成：\n• 朋友圈内容已发布\n• 附图已自动排版优化\n• 可见范围：全部好友\n\n📊 **预期效果：**\n• 预计覆盖好友 800+\n• 目标互动率 5%-8%\n\n💡 系统将持续监测互动数据...',
            speechText: '朋友圈已于10点32分发布成功，系统将持续监测互动数据。',
            wechatEvents: [
              { type: 'swap-panels', data: null },
              { type: 'switch-app', data: 'wechat-moments' },
              {
                type: 'set-moments',
                data: [
                  {
                    author: '小李',
                    avatar: '🏃',
                    content: '周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。',
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
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '📱 查看微信消息', value: 'view-wechat-msg' },
        ],
        quickReplyDelay: 1200,
      },
      // Step 3: Wang Ge sends private message about insurance → AI analysis → screenshot helper
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
                { label: '应对建议', value: '先安抚再引导约见面，不宜直接推产品' },
              ],
            },
            wechatEvents: [
              { type: 'unswap-panels', data: null },
              { type: 'switch-app', data: 'wechat-chat' },
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
                  generatedReply: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～',
                  visible: true,
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '📲 发送推荐回复', value: 'send-ai-reply' },
        ],
      },
      // Step 4: Reply sent → Wang Ge agrees to meet Saturday 3pm
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 回复已发送给王哥\n\n📩 **王哥回复：**\n"行啊，那咱们约个时间。周六下午3点怎么样？在南山那边的星巴克聊聊？"\n\n💡 **AI建议：**\n王哥表现出明确的面谈意愿！建议立即确认并同步录入日历。',
            speechText: '王哥同意周六下午3点在南山星巴克面谈。建议立即确认并录入日历。',
            wechatEvents: [
              { type: 'hide-screenshot-helper', data: null },
              { type: 'swap-panels', data: null },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～', timestamp: '10:53' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '行啊，那咱们约个时间。周六下午3点怎么样？在南山那边的星巴克聊聊？', timestamp: '10:55' },
              },
              {
                type: 'update-memory',
                data: {
                  understandingLevel: 15,
                  newMemory: {
                    category: 'client-update',
                    content: '🆕 新增潜在客户：王哥 — 三高体况，主动咨询保险，约定周六下午面访',
                  },
                },
              },
              {
                type: 'add-client',
                data: {
                  name: '王哥',
                  avatar: '👤',
                  status: 'potential',
                  addedReason: '微信互动，三高体况咨询',
                  profile: {
                    '来源': '朋友圈互动',
                    '健康状况': '三高（体检查出）',
                    '意向阶段': '初步咨询',
                    '约定面访': '周六下午3点',
                  },
                  memories: [],
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '确认并记录日历', value: 'confirm-calendar' },
        ],
      },
      // Step 5: Calendar event created
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **已完成：**\n\n📅 **日历已更新**\n• 周六下午 3:00 — 与王哥面访\n• 地点：南山星巴克\n\n📩 **已自动回复王哥：**\n"好的王哥，周六下午3点南山星巴克，我准时到！"\n\n⏰ **AI将自动为你：**\n• 周六上午 → 抓取王哥朋友圈，分析画像\n• 周六上午 → 推送面访提醒 + 沟通策略\n• 周六下午3点 → 自动开启录音\n\n放心，一切交给我。',
            speechText: '日历已更新，周六下午3点与王哥面访。AI将在周六上午自动为你准备面访策略。',
            wechatEvents: [
              { type: 'unswap-panels', data: null },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '好的王哥，周六下午3点南山星巴克，我准时到！', timestamp: '10:56' },
              },
              { type: 'switch-app', data: 'calendar' },
              {
                type: 'add-calendar-event',
                data: {
                  title: '与王哥面访',
                  date: '周六',
                  time: '15:00',
                  location: '南山星巴克',
                  color: '#3B82F6',
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '⏩ 到周六上午', value: 'skip-to-saturday' },
        ],
        quickReplyDelay: 800,
      },
      // Step 6: Saturday morning → AI reminder + profile + strategy
      {
        aiMessages: [
          {
            type: 'text',
            content: '☀️ **周六上午 9:30**\n\n小李，今天下午3点你和王哥的面访，我已经帮你做好了全部准备。\n\n📱 我已抓取王哥最近的朋友圈动态，生成了客户画像👇',
            speechText: '周六上午，今天下午3点你和王哥的面访，我已经帮你做好了全部准备。',
            wechatEvents: [
              { type: 'switch-app', data: 'wechat-moments' },
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
          {
            type: 'field-customer-profile',
            content: 'AI已扫描王哥朋友圈，输出客户画像',
            speechText: '已完成王哥朋友圈分析。王哥约42到48岁，企业中高层，爱好高尔夫和养生，孩子约10岁。',
            delay: 800,
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
              {
                type: 'update-client',
                data: {
                  name: '王哥',
                  profile: {
                    '来源': '朋友圈互动',
                    '年龄': '约42-48岁',
                    '职业': '企业中高层',
                    '健康状况': '三高（体检查出）',
                    '爱好': '高尔夫、养生',
                    '家庭': '孩子约10岁',
                    '消费偏好': '注重品质',
                    '约定面访': '周六下午3点',
                  },
                  newMemory: {
                    category: 'recent',
                    content: '朋友圈分析：王哥是企业中高层，爱好高尔夫和养生，孩子约10岁，注重品质消费。',
                  },
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '查看沟通策略', value: 'view-strategy' },
        ],
      },
      // Step 7: Communication strategy
      {
        aiMessages: [
          {
            type: 'text',
            content: '🎯 **今日面访沟通策略**\n\n**核心目标：** 了解王哥的保障现状和真实需求\n\n**沟通要点：**\n\n1️⃣ **破冰（5分钟）**\n聊高尔夫、孩子 → 拉近距离\n\n2️⃣ **信息收集（15分钟）**\n• 了解王哥目前有哪些保障\n• 了解家庭成员保障情况\n• 了解三高具体指标\n\n3️⃣ **需求激发（10分钟）**\n• 引导王哥思考保障缺口\n• "如果有一天..."的场景化引导\n\n4️⃣ **留下钩子**\n• 不急于推产品，承诺做专属分析\n\n⚠️ **注意事项：**\n• 王哥决策型人格，不喜欢啰嗦\n• 对品质敏感，对价格不敏感\n• 三高话题先安抚再专业分析',
            speechText: '面访沟通策略已准备好。核心是了解保障现状和真实需求，分为四个阶段。',
            wechatEvents: [
              { type: 'switch-app', data: 'home' },
              {
                type: 'update-memory',
                data: {
                  understandingLevel: 16,
                  newMemory: {
                    category: 'recent',
                    content: 'AI已为周六面访准备沟通策略：破冰→信息收集→需求激发→留钩子',
                  },
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '⏩ 到下午3点面访', value: 'skip-to-meeting' },
        ],
      },
      // Step 8: 3pm → Recording starts, meeting content
      {
        aiMessages: [
          {
            type: 'text',
            content: '⏰ **周六下午 3:00 — 面访开始**\n\n🎙️ **录音已自动开启**\n\n我会实时分析对话内容，为你提供支持。\n\n---\n\n📝 **实时记录：**\n\n🗣️ 小李："王哥，上次说的三高情况，具体指标怎么样？"\n\n👤 王哥："血压140多，血糖偏高但没到糖尿病，血脂也有点高。公司团险买了意外险和医疗险，重疾险之前买过一份，好像是20万保额，其他就没有了。"\n\n🗣️ 小李："了解了。那嫂子和孩子呢？有没有配置什么保障？"\n\n👤 王哥："孩子有个学平险，其他就没有了。"',
            speechText: '面访已开始，录音已自动开启。王哥透露了保障现状。',
            wechatEvents: [
              { type: 'swap-panels', data: null },
              { type: 'switch-app', data: 'recorder' },
              { type: 'start-recording', data: null },
              {
                type: 'update-client',
                data: {
                  name: '王哥',
                  newMemory: {
                    category: 'recent',
                    content: '面访实录：血压140+，血糖偏高，血脂偏高。公司团险覆盖意外和医疗，重疾险仅20万。孩子只有学平险。',
                  },
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '查看实时分析', value: 'view-analysis' },
        ],
      },
      // Step 9: Real-time analysis → needs + gap diagnosis
      {
        aiMessages: [
          {
            type: 'field-needs-analysis',
            content: 'AI实时需求分析',
            speechText: '王哥的核心需求是健康风险对冲和家庭收入保全。',
            data: {
              customerName: '王哥',
              coreNeeds: [
                { label: '健康风险对冲', detail: '三高状态下，医疗和重疾保障是第一需求' },
                { label: '家庭收入保全', detail: '作为家庭经济主力，需要高额寿险兜底' },
              ],
              secondaryNeeds: [
                { label: '子女教育', detail: '孩子约10岁，教育金规划黄金窗口' },
                { label: '财富传承', detail: '企业主身份，资产保全需提前布局' },
              ],
              urgency: 4,
              urgencyNote: '三高状态下投保窗口期有限，现在是配置保障的关键时机。',
            },
          },
          {
            type: 'field-gap-diagnosis',
            content: '王哥保障缺口诊断报告',
            speechText: '保障缺口诊断完成。重疾险严重不足，寿险几乎空白。',
            delay: 600,
            data: {
              customerName: '王哥',
              coverageItems: [
                { name: '意外险', status: 'covered', current: '公司团险覆盖', note: '团险与工作绑定，离职即失效' },
                { name: '医疗险', status: 'covered', current: '公司团险覆盖', note: '不可单独续保，依赖性强' },
                { name: '重疾险', status: 'warning', current: '20万保额', required: '100万+', gap: '80万+', note: '以王哥收入和家庭负担，至少需100万' },
                { name: '寿险', status: 'danger', current: '无', required: '200万+', note: '家庭支柱，风险敞口极大' },
                { name: '养老规划', status: 'danger', current: '无', note: '完全未启动' },
              ],
              riskWarnings: [
                '团险保障与工作绑定，离职即失效',
                '重疾险缺口高达80万以上',
                '寿险几乎空白，家庭存在重大风险敞口',
              ],
            },
            wechatEvents: [
              {
                type: 'update-client',
                data: {
                  name: '王哥',
                  newMemory: {
                    category: 'recent',
                    content: '保障缺口诊断：重疾险缺口80万+，寿险空白，养老规划为零。',
                  },
                },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '面访结束，生成方案', value: 'end-meeting' },
        ],
      },
      // Step 10: Meeting ends → 2 plans
      {
        aiMessages: [
          {
            type: 'text',
            content: '🎙️ **录音已结束** | 时长 42分钟\n\n面访内容已完整记录并分析。根据王哥的情况，我为你生成了两套方案👇',
            speechText: '面访录音结束，为你生成两套方案。',
            wechatEvents: [
              { type: 'stop-recording', data: null },
              { type: 'unswap-panels', data: null },
              { type: 'switch-app', data: 'home' },
            ],
          },
          {
            type: 'field-product-plans',
            content: 'AI根据面访结果输出两套方案',
            speechText: '均衡版是重疾加医疗加寿险三险联动；尊享版增加年金险。',
            delay: 500,
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
          { label: '帮我算一下这两个方案我能拿多少佣金', value: 'calc-commission' },
        ],
      },
      // Step 11: Commission calculation
      {
        aiMessages: [
          {
            type: 'field-commission',
            content: '代理人收益测算',
            speechText: '均衡版首年佣金约1.12万元。尊享版首年约2万，是均衡版的1.7倍。',
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
          { label: '选择均衡版，生成材料', value: 'select-balanced' },
        ],
      },
      // Step 12: Generate 4 materials + script
      {
        aiMessages: [
          {
            type: 'field-materials',
            content: 'AI已自动生成四份材料和发送话术',
            speechText: 'AI已生成四份材料和一段发送话术。',
            data: {
              summary: '以下材料已根据王哥画像和均衡版方案自动生成，可一键发送',
              materials: [
                {
                  icon: '📄',
                  title: '一页纸方案总览',
                  description: '配图简洁，适合王哥发给家人共同决策',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
                  detailContent: '📌 王哥专属保障方案总览\n\n🔷 均衡版（AI主推）\n• 重疾险：保额100万\n• 医疗险：百万医疗\n• 寿险：保额200万\n💰 年缴保费：约3.2万元',
                },
                {
                  icon: '🏥',
                  title: '三高客户核保说明',
                  description: '逐条说明承保条件和所需体检材料',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop',
                  detailContent: '🏥 三高客户核保指南\n\n✅ 1级高血压：标准体承保\n⚠️ 2级高血压：加费承保\n\n📋 需补充：血压记录、血液检查、心电图',
                },
                {
                  icon: '🎬',
                  title: '理赔流程动图',
                  description: '30秒看懂理赔全流程',
                  fileType: 'GIF',
                  imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848e968838?w=400&h=200&fit=crop',
                  detailContent: '报案→提交材料→审核→核赔→打款\n最快5个工作日到账',
                },
                {
                  icon: '📋',
                  title: '同类客户案例',
                  description: '"45岁企业主，三高，心梗获赔108万"',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
                  detailContent: '📋 真实案例（已脱敏）\n\n张先生，45岁，高血压2级\n2024年突发急性心梗\n💰 合计获赔：108.6万元',
                },
              ],
            },
          },
          {
            type: 'text',
            content: '💬 **推荐发送话术：**\n\n"王哥，今天聊得很开心！我根据你的情况做了个专属分析，附上几份材料你看看。有什么问题随时问我，不急着决定，最重要的是适合你。"',
            delay: 400,
          },
        ],
        quickReplies: [
          { label: '📤 一键全部发送给王哥', value: 'send-all' },
        ],
      },
      // Step 13: Sent → Wang Ge responds
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **四份材料 + 话术已全部发送给王哥**',
            speechText: '材料已发送。',
            wechatEvents: [
              { type: 'swap-panels', data: null },
              { type: 'switch-app', data: 'wechat-chat' },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥，今天聊得很开心！我根据你的情况做了个专属分析，附上几份材料你看看。有什么问题随时问我，不急着决定，最重要的是适合你。', timestamp: '17:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 一页纸方案总览.pdf', contentType: 'file', timestamp: '17:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 三高客户核保说明.pdf', contentType: 'file', timestamp: '17:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 理赔流程动图.gif', contentType: 'file', timestamp: '17:31' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 同类客户案例.pdf', contentType: 'file', timestamp: '17:31' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '你这个做得很专业啊，我晚上回去跟老婆看看。', timestamp: '17:45' },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '⏩ 次日晚上', value: 'skip-to-next-day' },
        ],
        quickReplyDelay: 800,
      },
      // Step 14: Next day → Wang Ge decides to buy
      {
        aiMessages: [
          {
            type: 'text',
            content: '📩 **王哥来消息了！**\n\n👤 王哥：\n"小李，昨晚和老婆研究了一下，你那个均衡版方案挺合适的。核保需要什么材料，你列个清单给我？"\n\n🎉 **恭喜！王哥决定投保均衡版方案！**\n\n💡 AI已自动生成核保材料清单并发送给王哥。',
            speechText: '恭喜！王哥决定投保均衡版方案！',
            wechatEvents: [
              { type: 'unswap-panels', data: null },
              {
                type: 'update-memory',
                data: {
                  understandingLevel: 19,
                  newMemory: {
                    category: 'client-update',
                    content: '🎉 王哥确认投保均衡版方案（重疾100万+医疗+寿险200万），进入核保阶段',
                  },
                },
              },
              {
                type: 'update-client',
                data: {
                  name: '王哥',
                  status: 'active',
                  newMemory: {
                    category: 'recent',
                    content: '确认投保均衡版方案，年缴约3.2万，首年佣金约1.12万。',
                  },
                },
              },
            ],
          },
          {
            type: 'text',
            content: '📊 **本次服务全流程总结：**\n\n| 阶段 | 完成情况 |\n| --- | --- |\n| 朋友圈获客 | ✅ 个性化内容引发互动 |\n| 智能回复 | ✅ 截图帮回快速响应 |\n| 面访约定 | ✅ 周六下午3点 |\n| 客户画像 | ✅ 朋友圈+面访双重分析 |\n| 缺口诊断 | ✅ 重疾+寿险缺口明确 |\n| 方案匹配 | ✅ 均衡版成交 |\n| 佣金预期 | 💰 首年1.12万，续期1.8万 |\n\n🎯 从朋友圈发布到成交确认，全流程AI协同完成。\n\n**代理人记忆了解度已更新至 19%** — AI将持续学习和了解你。',
            delay: 600,
            speechText: '全流程完成！从朋友圈获客到成交，AI全程协同。',
          },
        ],
        quickReplies: [
          { label: '🎉 太棒了！', value: 'back-to-menu' },
        ],
        quickReplyDelay: 1000,
      },
    ],
  },
];
