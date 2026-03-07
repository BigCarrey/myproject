import type { Scenario } from '../types';

export const fieldScenarios: Scenario[] = [
  {
    id: 'field-continuous',
    name: '外勤全流程',
    icon: '🚀',
    description: '外勤全流程演示',
    steps: [
      // ==================== Phase 1: 初始化 - AI引导对话收集代理人信息 ====================
      // Step 0: AI打招呼，真实有温度，询问爱好
      {
        aiMessages: [
          {
            type: 'text',
            content: '嘿，小李~ 👋\n\n我是你的AI营销助理。不过比起「助理」，我更想做你的**营销分身**——帮你看客户、出话术、做跟进，让你把精力只花在真正值钱的地方。\n\n不过分身要好用，得先懂你这个人。\n\n**你平时有什么爱好？** 不用正式，随便说说～',
            speechText: '嘿，小李，我是你的AI营销助理，更想做你的营销分身。分身要好用，得先懂你这个人。你平时有什么爱好？',
          },
        ],
        quickReplies: [
          { label: '我平时喜欢跑步和健身', value: 'hobbies-running' },
        ],
      },

      // Step 1: 真实回应爱好，有洞察，问社交圈
      {
        aiMessages: [
          {
            type: 'text',
            content: '跑步和健身 🏃‍♂️\n\n爱运动的人做事通常有韧性、坐得住——做保险其实最需要这个，长期主义嘛。\n\n而且「运动达人」这个人设，用在朋友圈里特别有感染力。你不是在卖保险，你是一个有生活的人，顺便帮朋友做了个靠谱的保障规划。这个差别，客户能感觉出来的。\n\n那**你平时的圈子呢**？身边大多是什么类型的人？',
            speechText: '跑步和健身！爱运动的人通常有韧性。而且运动达人这个人设用在朋友圈里特别有感染力，客户能感觉出来。那你平时的圈子呢？',
            wechatEvents: [
              {
                type: 'update-memory',
                data: [
                  {
                    icon: '🏃',
                    label: '喜好',
                    value: '跑步、健身',
                    category: 'dynamic',
                    narrative: '爱跑步和健身，有韧性、执行力强。「运动达人」是天然的朋友圈IP——有生活感，不像在硬卖保险，客户感觉得出来。',
                  },
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '运动圈朋友为主，也认识一些做生意的老板朋友', value: 'social-circle' },
        ],
      },

      // Step 2: 回应社交圈，问目标
      {
        aiMessages: [
          {
            type: 'text',
            content: '做生意的朋友 + 运动圈 🎯\n\n这个组合挺有意思的——做生意的朋友往往有保障意识、有实力，但信任门槛高，不能急；运动圈的人生活品质感强，对健康话题天然接受，转化路径反而更顺。\n\n**最后一个：今年最想突破的是什么？** 业绩目标？还是某类客户？',
            speechText: '做生意的朋友加运动圈，这个组合很有意思。做生意的朋友有实力但信任门槛高，运动圈转化路径反而更顺。那你今年最想突破的是什么？',
            wechatEvents: [
              {
                type: 'update-memory',
                data: [
                  {
                    icon: '👥',
                    label: '社交圈',
                    value: '运动圈 + 老板朋友',
                    category: 'dynamic',
                    narrative: '社交圈以运动朋友为主，也认识一些做生意的老板朋友。前者生活品质感强、转化顺；后者有实力有意识，是高净值客户的潜在来源。',
                  },
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '目标业绩翻倍，主要挑战是高净值客户开拓', value: 'goals' },
        ],
      },

      // Step 3: 收到目标，鼓励+自然过渡到朋友圈
      {
        aiMessages: [
          {
            type: 'text',
            content: '年度目标业绩翻倍，核心是高净值客户 ✨\n\n好，我记住了。\n\n其实你的圈子里一直有这样的人——做生意的老板朋友、运动圈里注重品质的朋友——他们只是还不知道你能帮到他们。\n\n**先让他们看见你**。来，发一条朋友圈开始今天，我帮你写 😊',
            speechText: '好，记住了。你圈子里一直有这样的人，只是他们还不知道你能帮到他们。先让他们看见你，来发一条朋友圈吧。',
            wechatEvents: [
              {
                type: 'update-memory',
                data: [
                  {
                    icon: '🎯',
                    label: '目标',
                    value: '年度业绩翻倍',
                    category: 'dynamic',
                    narrative: '今年目标是业绩翻倍，核心突破口是高净值客户。圈子里其实一直有这样的人，关键是让他们先看见你、信任你。',
                  },
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '✨ 启动我的AI营销分身', value: 'start-work', primary: true },
        ],
      },

      // ==================== Phase 2: 启动仪式 + 功能介绍 ====================
      // Step 4: 大白话介绍"你能怎么使用我"（在朋友圈之前）
      {
        aiMessages: [
          {
            type: 'text',
            content: '好，**你的AI营销分身**已就位 🚀\n\n大白话说清楚——从今天起，我能帮你干四件事：\n\n**📱 每天帮你发朋友圈**\n根据你的运动人设 + 当天热点，帮你写好内容，你确认就发。让圈子里的人每天都能看见你。\n\n**💬 客户来消息，我帮你回**\n帮你读懂消息背后的意思，给你最合适的回复建议——不用盯着屏幕想半天。\n\n**🤝 见客户前，我帮你备课**\n自动抓取对方朋友圈，分析客户画像，出面访策略和问题清单——有备而来。\n\n**📊 谈完之后，我帮你收尾**\n录音、整理需求、诊断缺口、算方案、生成材料——你只管谈，后台全交给我。\n\n就这四件事，简单直接。**来，先把你的名字发出去——**',
            speechText: '好，你的AI营销分身已就位。来大白话说清楚我能帮你做什么：每天帮你发朋友圈，帮你回复客户，见客户前帮你备课，谈完之后帮你收尾。就这四件事，先把你的名字发出去。',
            delay: 800,
          },
        ],
        quickReplies: [
          { label: '好，先发条朋友圈', value: 'begin-moments' },
        ],
      },

      // ==================== Phase 3: 朋友圈内容定制 ====================
      // Step 5: AI生成个性化朋友圈内容
      {
        aiMessages: [
          {
            type: 'field-moments-post',
            content: '已为您定制个性化朋友圈内容',
            speechText: '我已结合您爱运动的人设和近期体育新闻，为您定制了一条个性化朋友圈内容。',
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

      // Step 5: 发布成功，王哥评论互动
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **朋友圈发布成功，10:32**\n\n📊 预计覆盖好友 800+\n\n🔔 **王哥互动了！** 王哥点赞并评论了您的朋友圈。',
            speechText: '朋友圈已发布成功，王哥点赞并评论了。',
            wechatEvents: [
              { type: 'switch-execution-tab', data: 'moments' },
              {
                type: 'add-moment',
                data: {
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
              },
            ],
          },
        ],
        quickReplies: [
          { label: '继续', value: 'next-smart-reply' },
        ],
      },

      // ==================== Phase 3: 王哥私信咨询健康险 ====================
      // Step 6: 收到王哥微信私信
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
                { label: '应对建议', value: '先安抚再引导预约面谈' },
              ],
            },
            wechatEvents: [
              { type: 'switch-execution-tab', data: 'chat' },
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

      // Step 7: 展示推荐回复
      {
        aiMessages: [
          {
            type: 'field-reply-preview',
            content: 'AI已生成推荐回复',
            speechText: '已生成针对王哥三高咨询的推荐回复，引导周六下午面谈。',
            data: {
              recipient: '王哥',
              replyText: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。这个面对面聊更清楚，你看周六下午方便吗？我帮你做个专属评估，给你一个明确的答复！',
              tips: [
                '用轻松语气消除焦虑感',
                '强调"很多客户类似"减少孤立感',
                '直接引导周六面谈，把握时机',
              ],
            },
          },
        ],
        quickReplies: [
          { label: '一键发送', value: 'send-reply' },
        ],
      },

      // ==================== Phase 4: 王哥答应见面 (新剧情!) ====================
      // Step 8: 王哥答应周六下午3点见面，AI记录日历
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ 回复已发送给王哥\n\n📩 **王哥回复：**\n"行啊，周六下午可以。3点吧，就约在南山那个星巴克。"\n\n🎉 **太好了！王哥答应了面谈！**\n\n📅 **已自动记录到日历：**\n• 时间：周六 下午 3:00\n• 地点：南山星巴克\n• 对象：王哥\n• 目的：三高客户专属评估面谈\n\nAI将在周六上午自动为您准备面访策略。',
            speechText: '好消息！王哥答应周六下午3点在南山星巴克见面。已自动记录到日历，届时会提前为您准备面访策略。',
            wechatEvents: [
              { type: 'hide-screenshot-helper', data: null },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。这个面对面聊更清楚，你看周六下午方便吗？我帮你做个专属评估，给你一个明确的答复！', timestamp: '10:53' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '行啊，周六下午可以。3点吧，就约在南山那个星巴克。', timestamp: '10:56' },
              },
              {
                type: 'add-calendar-entry',
                data: {
                  id: 'meeting-wangge-sat',
                  date: '周六',
                  time: '15:00',
                  title: '面访王哥 - 三高专属评估',
                  description: '南山星巴克 | 王哥，约42-48岁，三高体况，健康险咨询意向',
                  type: 'meeting',
                },
              },
              { type: 'switch-execution-tab', data: 'calendar' },
              {
                type: 'update-memory',
                data: [
                  { icon: '📅', label: '面谈预约', value: '周六 15:00 南山星巴克', category: 'customer' },
                ],
              },
            ],
          },
        ],
        quickReplies: [
          { label: '好的，等待周六', value: 'wait-saturday' },
        ],
      },

      // ==================== Phase 5: 周六上午 - AI自动抓取朋友圈分析 ====================
      // Step 9: [时间跳转] 周六上午10:00
      {
        aiMessages: [
          {
            type: 'text',
            content: '⏰ **[ 时间跳转 → 周六 上午 10:00 ]**\n\n---\n\n☀️ 小李早上好！\n\n📅 **今日提醒：** 下午3点，您和王哥在南山星巴克有面谈。\n\n🔍 我已**自动抓取王哥最新朋友圈动态**，正在分析王哥画像和需求...',
            speechText: '小李早上好！今天下午3点您和王哥有面谈，我已自动分析了王哥最新的朋友圈动态。',
            wechatEvents: [
              { type: 'switch-execution-tab', data: 'moments' },
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
          { label: '查看王哥画像分析', value: 'view-profile' },
        ],
      },

      // Step 10: 王哥画像 + 沟通策略
      {
        aiMessages: [
          {
            type: 'field-customer-profile',
            content: 'AI已扫描王哥朋友圈，输出客户画像',
            speechText: '王哥约42到48岁，企业中高层，爱好高尔夫和养生，孩子约10岁，注重品质消费。',
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
                type: 'update-memory',
                data: [
                  {
                    icon: '👤',
                    label: '客户',
                    value: '王哥',
                    category: 'customer',
                    narrative: '42-48岁，企业中高层，决策型人格，对价格不敏感。高尔夫、养生、转发健康文章——典型的「有品质、有意识」高净值画像。',
                  },
                  {
                    icon: '🏥',
                    label: '王哥健康',
                    value: '三高体况',
                    category: 'customer',
                    narrative: '血压约150，空腹血糖6.8，已在用药。核保窗口随时可能收紧，现在是配置保障的关键时机。',
                  },
                ],
              },
            ],
          },
          {
            type: 'text',
            content: '🎯 **下午面访沟通策略：**\n\n1. **开场** — 先聊高尔夫、孩子等轻松话题建立信任\n2. **收集信息** — 了解王哥现有保障情况（团险、重疾、寿险等）\n3. **了解疾病情况** — 询问三高的具体指标和用药情况\n4. **引导需求** — 从健康管理切入，强调"趁现在还能保"的紧迫性\n5. **不急于推产品** — 今天主要建立信任和收集信息\n\n⚠️ **注意：** 王哥决策型人格，不喜欢被强推。信息收集到位后，AI会自动生成方案。',
            speechText: '面访策略已准备好：先聊轻松话题，再收集保障和疾病信息，今天主要建立信任。',
          },
        ],
        quickReplies: [
          { label: '好的，我准备出发了', value: 'ready-go' },
        ],
      },

      // ==================== Phase 6: 周六下午3点 - 面访录音 ====================
      // Step 11: [时间跳转] 下午3:00，自动开启录音
      {
        aiMessages: [
          {
            type: 'text',
            content: '⏰ **[ 时间跳转 → 周六 下午 3:00 ]**\n\n---\n\n📍 已到达南山星巴克\n\n🎙️ **录音已自动开启** — 面谈内容将实时转写和分析\n\n💡 AI将在后台实时进行：\n• 需求分析\n• 保障缺口分析\n• 关键信息提取',
            speechText: '面访开始，录音已自动开启，AI将在后台实时分析。',
            wechatEvents: [
              { type: 'switch-execution-tab', data: 'recording' },
              { type: 'start-recording', data: null },
              {
                type: 'add-transcript-item',
                data: { speaker: '小李', text: '王哥！好久不见，最近气色不错啊！', time: '15:00' },
              },
              {
                type: 'add-transcript-item',
                data: { speaker: '王哥', text: '哈哈还行，最近开始注意养生了。上次你说的保险的事，我认真想了想...', time: '15:01' },
              },
              {
                type: 'add-transcript-item',
                data: { speaker: '小李', text: '是的，三高其实很多客户都有，关键是趁现在指标还可控的时候做好保障。您目前的保障情况是怎样的？', time: '15:02' },
              },
              {
                type: 'add-transcript-item',
                data: { speaker: '王哥', text: '公司团险有意外险和医疗险，重疾险之前买过一份，好像是20万保额。其他的就没有了。', time: '15:04' },
              },
              {
                type: 'add-transcript-item',
                data: { speaker: '小李', text: '明白了。那您的三高具体是什么情况？有在用药吗？', time: '15:05' },
              },
              {
                type: 'add-transcript-item',
                data: { speaker: '王哥', text: '血压偏高，150左右，血糖空腹6.8，血脂也高。在吃降压药和他汀。医生说要注意，不然容易有心脑血管问题。', time: '15:07' },
              },
            ],
          },
        ],
        quickReplies: [
          { label: '面谈结束', value: 'end-meeting' },
        ],
      },

      // Step 12: 录音结束，AI实时分析出缺口报告
      {
        aiMessages: [
          {
            type: 'text',
            content: '🎙️ **录音已停止** | 时长：约25分钟\n\n---\n\n📊 **AI实时分析完成！** 基于面谈录音，已自动提取关键信息：',
            speechText: '面谈结束，录音已停止。AI已完成实时分析。',
            wechatEvents: [
              { type: 'stop-recording', data: null },
              {
                type: 'add-transcript-item',
                data: { speaker: '系统', text: '--- 录音结束，AI分析中 ---', time: '15:25' },
              },
            ],
          },
          {
            type: 'field-gap-diagnosis',
            content: '王哥保障缺口诊断报告',
            speechText: '王哥保障缺口：团险依赖性强，重疾险严重不足，寿险空白，养老未启动。',
            data: {
              customerName: '王哥',
              coverageItems: [
                { name: '意外险', status: 'covered', current: '公司团险覆盖', note: '团险与工作绑定，离职即失效' },
                { name: '医疗险', status: 'covered', current: '公司团险覆盖', note: '不可单独续保，依赖性极强' },
                { name: '重疾险', status: 'warning', current: '20万保额', required: '100万+', gap: '80万+', note: '以王哥收入和家庭负担，至少需100万' },
                { name: '寿险', status: 'danger', current: '无', required: '200万+', note: '孩子尚小，家庭责任重' },
                { name: '养老规划', status: 'danger', current: '无', note: '完全未启动' },
              ],
              riskWarnings: [
                '团险与工作绑定，离职即失效',
                '重疾险缺口高达80万以上',
                '寿险空白，家庭存在重大风险敞口',
                '三高状态下核保窗口随时可能收紧',
              ],
            },
          },
          {
            type: 'field-needs-analysis',
            content: '王哥需求深度解析',
            speechText: '核心需求是健康风险对冲和家庭收入保全，三高投保窗口期有限。',
            data: {
              customerName: '王哥',
              coreNeeds: [
                { label: '健康风险对冲', detail: '三高状态+150血压+空腹6.8血糖，医疗和重疾保障是第一需求' },
                { label: '家庭收入保全', detail: '企业中高层，家庭经济主力，需要高额寿险兜底' },
              ],
              secondaryNeeds: [
                { label: '子女教育', detail: '孩子约10岁，教育金规划黄金窗口' },
                { label: '财富传承', detail: '企业主身份，资产保全和传承需提前布局' },
              ],
              urgency: 5,
              urgencyNote: '血压150+空腹血糖6.8，已处于核保临界点。部分险种可能因健康恶化而加费或拒保。现在是最后的配置窗口！',
            },
          },
        ],
        quickReplies: [
          { label: '生成保障方案', value: 'generate-plans' },
        ],
      },

      // ==================== Phase 7: AI推送两套方案 ====================
      // Step 13: 两套方案
      {
        aiMessages: [
          {
            type: 'field-product-plans',
            content: 'AI根据王哥面谈信息输出两套方案',
            speechText: '两套方案已生成：均衡版三险联动是主推方案，尊享版额外增加年金险。',
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

      // ==================== Phase 8: 佣金测算 ====================
      // Step 14: 佣金测算结果
      {
        aiMessages: [
          {
            type: 'field-commission',
            content: '代理人收益测算',
            speechText: '均衡版首年佣金约1.12万，尊享版首年约2万，是均衡版的1.7倍。',
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
          { label: '我选均衡版，先帮王哥把核心保障做好', value: 'select-plan-a' },
        ],
      },

      // ==================== Phase 9: 生成材料 + 话术 + 一键转发 ====================
      // Step 15: AI生成四份材料 + 转发话术
      {
        aiMessages: [
          {
            type: 'field-materials',
            content: 'AI已自动生成四份讲解材料 + 转发话术',
            speechText: '已生成四份材料：方案总览、核保说明、理赔流程和同类案例，以及一段转发话术。',
            data: {
              summary: '以下材料已根据王哥面谈信息和均衡版方案自动生成，可一键转发',
              materials: [
                {
                  icon: '📄',
                  title: '一页纸方案总览',
                  description: '配图简洁无术语，适合王哥发给家人共同决策',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
                  detailContent: '📌 王哥专属保障方案总览\n\n👤 客户：王哥 | 年龄：约45岁 | 家庭支柱\n\n━━━━━━━━━━━━━━━━━━━━━\n🔷 均衡版方案（AI主推）\n━━━━━━━━━━━━━━━━━━━━━\n• 重疾险：保额100万，覆盖120种重疾+60种轻症\n• 医疗险：百万医疗，不限社保用药\n• 寿险：保额200万，定期至65岁\n💰 年缴保费：约3.2万元',
                },
                {
                  icon: '🏥',
                  title: '三高客户核保说明',
                  description: '逐条说明承保条件和所需体检材料',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop',
                  detailContent: '🏥 三高客户核保指南\n\n一、高血压（王哥：150左右）\n⚠️ 1-2级高血压：加费承保\n\n二、高血糖（王哥：空腹6.8）\n✅ 空腹 < 7.0 且糖化 < 7%：标准体承保\n\n三、高血脂\n⚠️ 中度升高需用药：加费承保\n\n📋 王哥需补充材料：\n1. 近6个月血压监测记录\n2. 最新血液检查报告\n3. 心电图检查报告\n4. 目前用药清单',
                },
                {
                  icon: '🎬',
                  title: '理赔流程动图',
                  description: '30秒看懂从报案到到账全流程',
                  fileType: 'GIF',
                  imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848e968838?w=400&h=200&fit=crop',
                  detailContent: '🎬 理赔全流程（5步到账）\n\n1️⃣ 报案（当天） → 2️⃣ 提交材料（1-3天） → 3️⃣ 审核（3-5个工作日） → 4️⃣ 核赔确认（1-2天） → 5️⃣ 打款到账（1-3天）\n\n⏱️ 全流程最快 5 个工作日到账',
                },
                {
                  icon: '📋',
                  title: '同类客户脱敏案例',
                  description: '45岁企业主，同样三高，确诊心梗理赔到账108万',
                  fileType: 'PDF',
                  imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
                  detailContent: '📋 真实案例（已脱敏处理）\n\n👤 张先生，45岁，企业负责人\n身体状况：高血压2级、高血脂\n2023年投保：重疾险80万 + 百万医疗\n\n⚡ 2024年3月，突发急性心肌梗塞\n💰 合计获赔：108.6万元（8个工作日到账）\n\n📌 与王哥情况高度相似，现在正是配置窗口期。',
                },
              ],
            },
          },
          {
            type: 'text',
            content: '📝 **AI生成转发话术：**\n\n---\n\n*"王哥，今天聊得很开心！我根据咱们聊的情况，帮你整理了一份专属方案和几份参考资料，你抽空看看～ 核保说明里我标注了你的情况对应的条件，有疑问随时问我。也可以转发给嫂子一起看看，毕竟这种事两个人商量比较好 😊"*\n\n---\n\n👆 材料 + 话术已就绪，点击一键转发给王哥',
            speechText: '转发话术已生成，点击即可一键转发给王哥。',
          },
        ],
        quickReplies: [
          { label: '一键转发给王哥', value: 'send-all' },
        ],
      },

      // Step 16: 完成！
      {
        aiMessages: [
          {
            type: 'text',
            content: '✅ **四份材料 + 话术已全部发送给王哥！**\n\n📩 **王哥回复（几分钟后）：**\n"小李你这个做得很专业！我发给老婆看看，下周给你答复。"\n\n---\n\n🎯 **本次服务全流程总结：**\n\n✅ 朋友圈营销 → 王哥互动\n✅ 智能回复 → 建立信任\n✅ 预约面谈 → 周六3点星巴克\n✅ 朋友圈画像分析 → 面访策略准备\n✅ 面谈录音 → 实时需求分析\n✅ 保障缺口诊断 → 方案匹配\n✅ 佣金测算 → 选定均衡版\n✅ 材料生成 → 一键转发\n\n💰 **预期佣金：首年1.12万，续期3年合计1.8万**\n\n王哥已进入决策阶段，保持适度跟进，预计下周内可推进到签约环节！',
            speechText: '材料已发送，王哥表示发给老婆看看下周答复。本次全流程服务完成，预计下周可推进到签约。',
            wechatEvents: [
              { type: 'switch-execution-tab', data: 'chat' },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '王哥，今天聊得很开心！我根据咱们聊的情况，帮你整理了一份专属方案和几份参考资料，你抽空看看～', timestamp: '16:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 一页纸方案总览.pdf', contentType: 'file', timestamp: '16:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 三高客户核保说明.pdf', contentType: 'file', timestamp: '16:30' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 理赔流程动图.gif', contentType: 'file', timestamp: '16:31' },
              },
              {
                type: 'add-chat',
                data: { sender: 'xiaoli', content: '[文件] 同类客户脱敏案例.pdf', contentType: 'file', timestamp: '16:31' },
              },
              {
                type: 'add-chat',
                data: { sender: 'wangge', content: '小李你这个做得很专业！我发给老婆看看，下周给你答复。', timestamp: '16:38' },
              },
              {
                type: 'add-calendar-entry',
                data: {
                  id: 'followup-wangge-1',
                  date: '下周三',
                  time: '10:00',
                  title: '跟进王哥 - 询问家人意见',
                  description: '主动联系王哥，了解嫂子对方案的看法',
                  type: 'reminder',
                },
              },
              {
                type: 'add-calendar-entry',
                data: {
                  id: 'followup-wangge-2',
                  date: '下周五',
                  time: '14:00',
                  title: '跟进王哥 - 推进签约',
                  description: '若有意向，约线下面签',
                  type: 'task',
                },
              },
              {
                type: 'show-followup-reminder',
                data: {
                  title: 'AI自动跟进提醒已设置',
                  schedule: [
                    { date: '📅 下周三 10:00', action: '主动询问王哥和家人的意见' },
                    { date: '📅 下周五 14:00', action: '推进签约，约线下面签' },
                  ],
                  summary: '从朋友圈获客到方案转发全流程完成，王哥已进入决策阶段。预期首年佣金1.12万元。',
                },
              },
            ],
          },
        ],
        quickReplies: [],
      },
    ],
  },
];
