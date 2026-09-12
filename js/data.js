/* ============================================================
 * 大学生活模拟器 · 剧情数据文件（data.js）
 *
 * ★ 这是唯一的"填表区"：剧情文案、选项文本、效果、称号都在这里改。
 *   图片放入 images/ 目录，路径写在 image 字段。
 *   路径中含 %g 表示按性别取图：1 = 男生图，2 = 女生图。
 *
 * ── 五个属性 id ──
 *   study  = 学业     plan  = 实践（实习、项目等实操能力）
 *   social = 社交     mind  = 心态
 *   life   = 自理
 *
 *   （界面显示顺序：学业、实践、社交、心态、自理）
 *
 * ── 模式机制 ──
 *   三个选项的文本在三种模式下完全一致；
 *   差别只在"选完之后"：
 *     · 效果：ideal 用 effects.ideal（素材"理想线"），hard 用 effects.hard（素材"现实线"）
 *     · 结果文案：resultText.ideal / resultText.hard（同一选择，两种结局）
 *     · 随机模式：50% 按 ideal、50% 按 hard 结算，文案跟随实际结果
 *   效果写法：{ study: 2 } 表示学业 +2；不写的属性视为 0。
 * ============================================================ */

const GAME_DATA = {

  /* ────────── 五项属性 ────────── */
  attrs: [
    { id: 'study',  name: '学业' },
    { id: 'plan',   name: '实践' },
    { id: 'social', name: '社交' },
    { id: 'mind',   name: '心态' },
    { id: 'life',   name: '自理' }
  ],

  /* ────────── 性别 ────────── */
  genders: [
    { id: '1', name: '男生' },
    { id: '2', name: '女生' }
  ],
  defaultGender: '1',   // 初始界面的默认选择

  /* ────────── 初始规则 ────────── */
  startPoints: 10,   // 初始可分配点数
  minAttr: 0,
  maxAttr: 10,

  /* ────────── 三种游戏模式 ────────── */
  modes: [
    { id: 'ideal',  name: '理想模式', desc: '同样的选择，结果往往向好' },
    { id: 'hard',   name: '困难模式', desc: '同样的选择，常常碰壁受挫' },
    { id: 'random', name: '随机模式', desc: '同一选择，好坏各占一半' }
  ],

  /* ────────── 开篇剧情（大学生活开始） ──────────
   * 开始游戏后先播放：从 images 中随机选一张 + 文案，点按钮后进入第一个矛盾 */
  intro: {
    first: 'images/大学生活开始.jpg',   // 固定首图
    pool: [
      'images/大学生活开始1.jpg',
      'images/大学生活开始2.jpg',
      'images/大学生活开始3.jpg',
      'images/大学生活开始4.jpg'
    ],
    title: '大学生活开始',
    text: '九月的风还是热的。你拖着行李箱站在大学门口，看着来来往往的迎新横幅，心里一半是新鲜，一半是发懵。\n从今天起，没有人再叫你起床，也没有人提醒你交作业。宿舍、食堂、图书馆，一切都要自己摸索。\n你深吸一口气：大学生活，开始了。'
  },

  /* ────────── 称号素材：每维三档（0-3 低档 / 4-7 中档 / 8-10 高档） ──────────
   * desc = 描述语（用于总称号「X却Y的Z」的前后两句）
   * tag  = 人的称谓（用于结果列表与总称号的收尾）
   * 总称号 = 最高维desc ＋ 却 ＋ 最低维desc ＋ 的 ＋ 次高维tag
   * 五维取三（10 种组合）× 每维三档（27 种档位）= 270 种总称号自动生成 */
  attrTitles: {
    study: {
      low:  { desc: '学无长进', tag: '学沫' },
      mid:  { desc: '踏实好学', tag: '稳步学子' },
      high: { desc: '学富五车', tag: '学术大牛' }
    },
    plan: {
      low:  { desc: '初出茅庐',   tag: '实习新手' },
      mid:  { desc: '脚踏实地',   tag: '实干家' },
      high: { desc: '驾轻就熟',   tag: '实践达人' }
    },
    social: {
      low:  { desc: '独来独往',   tag: '独行侠' },
      mid:  { desc: '左右逢源',   tag: '圈子常客' },
      high: { desc: '长袖善舞',   tag: '社交达人' }
    },
    mind: {
      low:  { desc: '心思敏感',   tag: '玻璃人' },
      mid:  { desc: '不疾不徐',   tag: '从容者' },
      high: { desc: '处变不惊',   tag: '强心脏' }
    },
    life: {
      low:  { desc: '不谙世事',   tag: '生活小白' },
      mid:  { desc: '精打细算',   tag: '持家人' },
      high: { desc: '打理有方',   tag: '生活大师' }
    }
  },

  /* ────────── 六个矛盾场景 ──────────
   * text = 矛盾剧情文案（描述底下的背景；
   * options[].text = 选项文案；resultText = 选完后的结局叙述；
   * image = 场景图，options[].image = 分支图；含 %g 时按性别取图。
   * effects 按素材记分.txt：ideal = 理想线，hard = 现实线（数值不变）。 */
  scenes: [

    /* ========== 场景 1：洗衣房矛盾（人际、沟通） ========== */
    {
      id: 'laundry',
      title: '洗衣房矛盾',
      // 剧情配图男女标反：男生(gender 1)用 洗衣房2.jpg，女生(gender 2)用 洗衣房1.jpg
      image: { '1': 'images/洗衣房2.jpg', '2': 'images/洗衣房1.jpg' },
      text: '这天你抱着洗衣篮走进公共洗衣机房，看到的一幕让你愣住了：室友那双沾着泥的运动鞋，正静静地躺在公共洗衣机里转。',
      options: [
        {
          text: '直接当面指出，明确说明公用洗衣机不能洗鞋',
          image: 'images/洗衣房A%g.jpg',
          effects: {
            ideal: { study: 0, plan: 1, social: -2, mind: 2, life: 1 },
            hard:  { study: 0, plan: 1, social: -3, mind: -1, life: 0 }
          },
          resultText: {
            ideal: '说话直白，但道理站得住脚。室友意识到卫生问题，后续不再这么做，宿舍公共卫生规则得到确立。',
            hard: '当众说出口让室友下不来台，对方觉得你小题大做，记恨你，宿舍气氛变得尴尬紧张。'
          }
        },
        {
          text: '私下找这位室友委婉沟通，讲清卫生顾虑',
          image: 'images/洗衣房B%g.jpg',
          effects: {
            ideal: { study: 0, plan: 1, social: 1, mind: 1, life: 1 },
            hard:  { study: 0, plan: 1, social: 0, mind: 0, life: 0 }
          },
          resultText: {
            ideal: '私下温和沟通保全了对方的面子，室友虚心接受，主动道歉，宿舍关系没有受损。',
            hard: '对方觉得你多管闲事，嘴上应付，背地里依旧拿洗衣机洗鞋，问题根本没有改变。'
          }
        },
        {
          text: '选择不说话，心里膈应，以后尽量避开这台洗衣机',
          image: 'images/洗衣房C%g.jpg',
          effects: {
            ideal: { study: 0, plan: 0, social: 0, mind: -1, life: 1 },
            hard:  { study: 0, plan: 0, social: 0, mind: -3, life: 0 }
          },
          resultText: {
            ideal: '不发生冲突，自己规避风险，内心不断提醒自己注意公共礼仪。',
            hard: '憋在心里反复恶心，对室友心生芥蒂，每次洗衣服都提心吊胆，宿舍隔阂悄悄累积。'
          }
        }
      ]
    },

    /* ========== 场景 2：小组作业甩锅矛盾（合作、沟通） ========== */
    {
      id: 'groupwork',
      title: '小组作业甩锅矛盾',
      image: 'images/小组作业.jpg',
      text: '小组队友集体摆烂不干活，进度表上一片空白，所有压力都压在你一个人身上。',
      options: [
        {
          text: '直接当众指出问题，要求队友分担',
          image: 'images/小组作业A.jpg',
          effects: {
            ideal: { study: 1, plan: 1, social: -1, mind: 2, life: 1 },
            hard:  { study: 1, plan: 1, social: -3, mind: 0, life: 1 }
          },
          resultText: {
            ideal: '你把话说开，理性沟通，团队氛围反而变好，任务重新分配了下去。',
            hard: '当众撕破脸，团队彻底闹僵，项目剩下的路更难走了。'
          }
        },
        {
          text: '自己多干一点，包容团队缺陷',
          image: 'images/小组作业B.jpg',
          effects: {
            ideal: { study: 1, plan: 2, social: 0, mind: -2, life: 2 },
            hard:  { study: 1, plan: 2, social: 0, mind: -3, life: 2 }
          },
          resultText: {
            ideal: '你默默多吃一点亏，经验却快速积累，能力肉眼可见地涨。',
            hard: '你任劳任怨却被人拿捏，一次退让，换来次次被欺负。'
          }
        },
        {
          text: '直接摆烂一起混，谁都别想高分',
          image: 'images/小组作业C.jpg',
          effects: {
            ideal: { study: -2, plan: -1, social: 0, mind: -1, life: -2 },
            hard:  { study: -2, plan: -1, social: 0, mind: -2, life: -2 }
          },
          resultText: {
            ideal: '你佛系对待，不再内耗，分数嘛，听天由命。',
            hard: '项目崩盘，全员低分背锅，你的名字排在第一个。'
          }
        }
      ]
    },

    /* ========== 场景 3：社交攀比内耗（个人心态） ========== */
    {
      id: 'compare',
      title: '社交攀比内耗',
      image: 'images/社交攀比.jpg',
      text: '身边同学竞赛拿奖、奖学金公示、朋友圈的生活都比你精彩。你躺在床上反复对比，强烈的自卑感涌了上来。',
      options: [
        {
          text: '减少刷圈，专注自己的节奏默默努力',
          image: 'images/社交攀比A.jpg',
          effects: {
            ideal: { study: 1, plan: 2, social: 0, mind: 2, life: 2 },
            hard:  { study: 1, plan: 2, social: 0, mind: 0, life: 2 }
          },
          resultText: {
            ideal: '你摆脱内耗，专注自我成长，节奏渐渐稳了下来。',
            hard: '你刻意压抑情绪，假装不在意，内耗却在暗处越积越深。'
          }
        },
        {
          text: '跟风参加各种活动、竞赛强行刷履历',
          image: 'images/社交攀比B.jpg',
          effects: {
            ideal: { study: 2, plan: 2, social: 0, mind: -1, life: -1 },
            hard:  { study: 2, plan: 2, social: 0, mind: -2, life: -1 }
          },
          resultText: {
            ideal: '你试着把每场活动当成窗口，眼界确实被撑大了。',
            hard: '你盲目跟风，越忙越空虚，精力被切成碎片。'
          }
        },
        {
          text: '封闭自己，避免社交对比',
          image: 'images/社交攀比C%g.jpg',   // 分男女：C1 男 / C2 女
          effects: {
            ideal: { study: 0, plan: -1, social: -1, mind: -2, life: -2 },
            hard:  { study: 0, plan: 1, social: -3, mind: -2, life: -1 }
          },
          resultText: {
            ideal: '你享受独处，在安静里沉淀出自己的想法。',
            hard: '你越来越孤僻，朋友圈子一点点缩小。'
          }
        }
      ]
    },

    /* ========== 场景 4：竞赛与学业冲突（学业取舍） ========== */
    {
      id: 'contest',
      title: '竞赛与学业冲突',
      image: 'images/竞赛学业.jpg',
      text: '重要科创竞赛临近提交，同时期中考试就在两周后。课内压力很大，时间严重不够用。',
      options: [
        {
          text: '咬牙两头硬扛，竞赛和期中都不放弃，压缩睡觉时间双线推进',
          image: 'images/竞赛学业A.jpg',
          effects: {
            ideal: { study: 3, plan: 1, social: 0, mind: -2, life: -1 },
            hard:  { study: -1, plan: 2, social: 0, mind: -3, life: -1 }
          },
          resultText: {
            ideal: '你靠时间表硬撑了过来：竞赛拿到参与奖，期中小幅波动。你学会了高效规划。',
            hard: '硬扛透支了身体，竞赛仓促完成没获奖，期中翻车。你先睡了整整一天。'
          }
        },
        {
          text: '优先保住课内成绩，竞赛降低投入，只完成最低限度提交，不冲奖项',
          image: 'images/竞赛学业B.jpg',
          effects: {
            ideal: { study: 2, plan: 2, social: 0, mind: 2, life: 2 },
            hard:  { study: 0, plan: -1, social: 0, mind: 1, life: 2 }
          },
          resultText: {
            ideal: '取舍很果断：考试保住了，竞赛也完整走完流程，攒下一段扎实的项目经验。',
            hard: '竞赛凑了份材料混掉，没有任何收获，报名机会白费，考试倒是保住了。'
          }
        },
        {
          text: '直接放弃这次竞赛，全身心扑到期中复习',
          image: 'images/竞赛学业C.jpg',
          effects: {
            ideal: { study: 1, plan: 1, social: 0, mind: 2, life: 1 },
            hard:  { study: 1, plan: -2, social: 0, mind: 2, life: 2 }
          },
          resultText: {
            ideal: '你认清了精力上限，专注夯实课内，等待更适合的竞赛机会。',
            hard: '你不甘心放弃，心里一直盘算着同学参赛的事，复习效率直线下滑。'
          }
        }
      ]
    },

    /* ========== 场景 5：拒绝讨好型人格（人际、个人心态） ========== */
    {
      id: 'pleaser',
      title: '拒绝讨好型人格',
      image: 'images/拒绝讨好型人格.jpg',
      text: '同学、社团频繁找你帮忙打杂、跑腿、占座。你不想继续被消耗，可「不」字到了嘴边，又咽了回去。',
      options: [
        {
          text: '果断拒绝不合理请求',
          image: 'images/拒绝讨好型人格A.jpg',
          effects: {
            ideal: { study: 1, plan: 1, social: -1, mind: 2, life: 2 },
            hard:  { study: 1, plan: 0, social: -3, mind: 0, life: 2 }
          },
          resultText: {
            ideal: '你第一次感到边界带来的安全感，拒绝之后，尊重反而多了起来。',
            hard: '拒绝的话刚出口，背后就传来「高冷」「难相处」的议论。'
          }
        },
        {
          text: '半推半就，不好意思拒绝',
          image: 'images/拒绝讨好型人格B.jpg',
          effects: {
            ideal: { study: 0, plan: 0, social: 1, mind: 0, life: 0 },
            hard:  { study: 0, plan: 1, social: 0, mind: -1, life: 0 }
          },
          resultText: {
            ideal: '你半推半就地应了，人情和自我的天平，勉强还能坐住。',
            hard: '你天天消耗自己，答应得越多，心里亏欠自己的越多。'
          }
        },
        {
          text: '全部答应，维持好人形象',
          image: 'images/拒绝讨好型人格C.jpg',
          effects: {
            ideal: { study: -2, plan: 2, social: 2, mind: -1, life: -2 },
            hard:  { study: -2, plan: 2, social: -1, mind: -2, life: -2 }
          },
          resultText: {
            ideal: '短期看一片和气，人缘确实不错，大家都爱找你。',
            hard: '你彻底变成老好人，时间被掏空，连自己是谁都快忘了。'
          }
        }
      ]
    },

    /* ========== 场景 6：毕业去向（生涯规划） ========== */
    {
      id: 'career',
      title: '毕业去向',
      image: 'images/毕业去向.jpg',
      text: '大三，身边人已经开始确定未来出路。考研、直接就业实习、考公，三条路摆在面前，都写着「选我」。',
      options: [
        {
          text: '选择考研，全身心投入备考，暂缓实习找工作',
          image: 'images/毕业去向A.jpg',
          effects: {
            ideal: { study: 2, plan: 0, social: 0, mind: 2, life: 2 },
            hard:  { study: -1, plan: 0, social: 0, mind: -2, life: -1 }
          },
          resultText: {
            ideal: '目标明确之后，每天的书都踏实。哪怕结果未知，学识在沉淀。',
            hard: '看见大家考你也考，备考浑浑噩噩，最后考研失利，还错过了秋招黄金期。'
          }
        },
        {
          text: '去找实习，积累职场经验，优先准备直接就业',
          image: 'images/毕业去向B.jpg',
          effects: {
            ideal: { study: 0, plan: 2, social: 0, mind: 2, life: 2 },
            hard:  { study: 0, plan: 2, social: 0, mind: -2, life: -1 }
          },
          resultText: {
            ideal: '你在实习里摸清了行业的脾气，也看清了自己适合什么。',
            hard: '水实习只为简历好看，没有思考职业方向，越实习越迷茫。'
          }
        },
        {
          text: '准备考公，埋头刷公考习题',
          image: 'images/毕业去向C.jpg',
          effects: {
            ideal: { study: 2, plan: 0, social: 0, mind: 2, life: 2 },
            hard:  { study: 0, plan: 0, social: 0, mind: -2, life: -1 }
          },
          resultText: {
            ideal: '你沉下心刷题，心智在日复一日的节奏里变得稳重。',
            hard: '你随大流考公，不懂岗位只懂刷题，几次失利后开始怀疑自己。'
          }
        }
      ]
    }
  ]
};