export interface Tag {
  id: string;
  is_matchable: boolean;
  name?: string;
  desc?: string;
  children?: Tag[];
}

export const tagData: Tag[] = [
  {
    id: "mental_shelter",
    name: "「精神角落」",
    is_matchable: false,
    children: [
      {
        id: "gaming",
        name: "游戏人生🎮",
        is_matchable: false,
        children: [
          {
            id: "competitive_games",
            name: "竞技向玩家",
            is_matchable: true,
            children: [
              {
                id: "pc_fps",
                name: "PC端FPS",
                desc: "Apex/PUBG/Valorant等",
                is_matchable: true,
              },
              {
                id: "moba",
                name: "MOBA",
                desc: "Dota2/LOL/王者等",
                is_matchable: true,
              },
              {
                id: "mobile_games",
                name: "其余各类手游",
                is_matchable: true,
              },
            ],
          },
          {
            id: "story_rich_games",
            name: "偏好剧情体验的玩家",
            desc: "更注重游戏沉浸性和故事情节",
            is_matchable: true,
            children: [
              {
                id: "rpg_games",
                name: "RPG/动作冒险",
                desc: "巫师/艾尔登法环/2077等大作",
                is_matchable: true,
              },
              {
                id: "puzzle_games",
                name: "沉浸式解谜/精品独立游戏",
                desc: "玩法、美术或叙事独具匠心，能带来独特情感体验，如小小梦魇/Undertale/星际拓荒/Celeste",
                is_matchable: true,
              },
            ],
          },
          {
            id: "strategy_games",
            name: "战略类游戏的甲级战犯",
            desc: "回合制(如文明)/即时制(如星际争霸)",
            is_matchable: true,
          },
          {
            id: "simulation_games",
            name: "模拟经营佛系玩家",
            desc: "缺氧/天际线/图灵完备/模拟飞行等模拟或沙盒",
            is_matchable: true,
          },
          {
            id: "music_games",
            name: "音游人",
            is_matchable: true,
          },
          {
            id: "party_games",
            name: "派对游戏爱好者",
            desc: "适合与朋友同屏或联机并主打欢乐互动的游戏，如双人成行、胡闹厨房、马力欧派对、糖豆人",
            is_matchable: true,
          },
        ],
      },
      {
        id: "art_perception",
        name: "艺术感知 👀",
        is_matchable: false,
        children: [
          {
            id: "acg",
            name: "ACG 异次元🌌",
            desc: "动漫，二次元文化认同",
            is_matchable: true,
          },
          {
            id: "film_enthusiast",
            name: "电影阅片家🎬",
            desc: "不只看电影，还热爱分析、讨论、影评",
            is_matchable: true,
          },
          {
            id: "livehouse_fan",
            name: "Livehouse 常客🎸",
            desc: "沉迷现场音乐的氛围和体验",
            is_matchable: true,
          },
          {
            id: "karaoke",
            name: "预备役KTV麦霸🎤",
            desc: "听着歌即兴就想唱出来，或许还能弹唱",
            is_matchable: false,
            children: [
              {
                id: "karaoke_western",
                name: "🎤欧美",
                is_matchable: true,
              },
              {
                id: "karaoke_chinese",
                name: "🎤华语",
                is_matchable: true,
              },
              {
                id: "karaoke_jp_kr",
                name: "🎤日韩",
                is_matchable: true,
              },
            ],
          },
        ],
      },
      {
        id: "lifestyle",
        name: "生活美学",
        is_matchable: false,
        children: [
          {
            id: "pet_lover",
            name: "猫奴/狗奴🐾",
            desc: "对宠物有很多的爱和亲切感",
            is_matchable: true,
          },
          {
            id: "fashion_artist",
            name: "穿搭艺术家👕",
            desc: "始终追求时尚和个人风格",
            is_matchable: true,
          },
          {
            id: "home_chef",
            name: "人间烟火厨神🍳",
            desc: "享受自己动手做饭或烹饪的乐趣和成就感",
            is_matchable: true,
          },
          {
            id: "diy_creator",
            name: "DIY 创造者🛠",
            desc: "喜欢手工、手帐、编织等",
            is_matchable: true,
          },
          {
            id: "board_gamer",
            name: "线下桌游气氛组🎲",
            desc: "喜欢桌游、剧本杀等线下社交游戏",
            is_matchable: true,
          },
          {
            id: "painter",
            name: "即兴画手🎨",
            desc: "板绘、水彩、速写、漫画",
            is_matchable: true,
          },
          {
            id: "photographer",
            name: "摄影爱好者/扫街派📷",
            desc: "从镜头中观察世界，探索街角小巷的惊喜",
            is_matchable: true,
          },
          {
            id: "foodie",
            name: "美食探店家🍜",
            desc: "对美食有热情，热衷于发现和品尝各种餐厅",
            is_matchable: true,
          },
        ],
      },
    ],
  },
  {
    id: "physical_activity",
    name: "「永远鲜活」",
    is_matchable: false,
    children: [
      {
        id: "volleyball",
        name: "排球🏐",
        is_matchable: true,
      },
      {
        id: "basketball",
        name: "篮球🏀",
        is_matchable: true,
      },
      {
        id: "soccer",
        name: "足球⚽",
        is_matchable: true,
      },
      {
        id: "badminton",
        name: "羽毛球🏸",
        is_matchable: true,
      },
      {
        id: "table_tennis",
        name: "乒乓球🏓",
        is_matchable: true,
      },
      {
        id: "tennis",
        name: "网球/壁球🎾",
        is_matchable: true,
      },
      {
        id: "running",
        name: "跑步🏃",
        is_matchable: true,
      },
      {
        id: "wild",
        name: "山野⛰(登山/远足/露营)",
        is_matchable: true,
      },
      {
        id: "ice_snow_sports",
        name: "冰雪运动⛷",
        is_matchable: true,
      },
      {
        id: "water_sports",
        name: "游泳/水上运动🏊",
        is_matchable: true,
      },
      {
        id: "fitness",
        name: "塑形健身💪",
        is_matchable: true,
      },
    ],
  },
  {
    id: "intellectual",
    name: "「思想碰撞」",
    is_matchable: false,
    children: [
      {
        id: "tech_geek",
        name: "技术宅Geek💻",
        desc: "对编程、数码产品、硬核科技有浓厚兴趣",
        is_matchable: true,
      },
      {
        id: "literary_creation",
        name: "文学创作党🖊",
        desc: "小说、诗歌、随笔、同人文……用文字构建世界和疗愈自身",
        is_matchable: true,
      },
      {
        id: "language_exchange",
        name: "语言交换搭子🌐",
        desc: "热衷于学习外语，并希望与人练习",
        is_matchable: true,
        children: [
          {
            id: "japanese",
            name: "日语🇯",
            is_matchable: true,
          },
          {
            id: "spanish",
            name: "西班牙语🇪",
            is_matchable: true,
          },
          {
            id: "korean",
            name: "韩语🇰",
            is_matchable: true,
          },
          {
            id: "french",
            name: "法语🇫",
            is_matchable: true,
          },
          {
            id: "german",
            name: "德语🇩",
            is_matchable: true,
          },
          {
            id: "russian",
            name: "俄语🇷",
            is_matchable: true,
          },
        ],
      },
      {
        id: "deep_thinker",
        name: "沉思型常驻辩手🤔",
        desc: "喜欢讨论社会议题、哲学、心理学等深度话题",
        is_matchable: true,
      },
    ],
  },
];
