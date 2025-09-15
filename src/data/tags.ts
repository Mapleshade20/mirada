export const tagData = [
  {
    id: "sports",
    name: "运动",
    is_matchable: true,
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
        name: "骑行🚴/徒步🚶/登山⛰/露营⛺/攀岩🧗",
        is_matchable: true,
      },
      {
        id: "yoga",
        name: "瑜伽🧘",
        is_matchable: true,
      },
      {
        id: "martial_arts",
        name: "武术/搏击🥋",
        is_matchable: true,
      },
      {
        id: "dance",
        name: "舞蹈💃",
        is_matchable: true,
      },
      {
        id: "ice_snow_sports",
        name: "冰雪运动⛷",
        is_matchable: true,
      },
      {
        id: "water_sports",
        name: "游泳🏊/水上运动",
        is_matchable: true,
      },
    ],
  },
  {
    id: "desktop",
    name: "在桌面上的活动",
    is_matchable: false,
    children: [
      {
        id: "board_games",
        name: "桌游🐺/牌类🃏/棋类♟",
        is_matchable: true,
      },
      {
        id: "competitive_games",
        name: "竞技向电子游戏🎮",
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
            name: "MOBA类游戏",
            desc: "Dota2/LOL/王者等",
            is_matchable: true,
          },
          {
            id: "mobile",
            name: "除MOBA外的各类手游",
            is_matchable: true,
          },
        ],
      },
      {
        id: "mind_challenging_games",
        name: "偏好智力挑战的电子游戏🎮",
        desc: "需要开动脑筋，解决谜题或完成挑战的游戏",
        is_matchable: true,
        children: [
          {
            id: "strategy_games",
            name: "战略类游戏",
            desc: "回合制(如文明)/即时制(如星际争霸)",
            is_matchable: true,
          },
          {
            id: "simulation_games",
            name: "模拟经营类游戏",
            desc: "缺氧/天际线等",
            is_matchable: true,
          },
          {
            id: "sandbox_games",
            name: "纯沙盒类/模拟器游戏",
            desc: "图灵完备/Roblox/模拟飞行等",
            is_matchable: true,
          },
        ],
      },
      {
        id: "music_games",
        name: "音游和强技术性玩法的游戏",
        desc: "强技术性玩法：速通等“与自己竞技”的玩法",
        is_matchable: true,
      },
      {
        id: "story_rich_games",
        name: "偏好剧情/氛围的电子游戏🎮",
        desc: "更注重游戏沉浸性和故事情节的游戏",
        is_matchable: true,
        children: [
          {
            id: "narrative_adventure",
            name: "RPG/动作冒险游戏",
            desc: "巫师/艾尔登法环/2077等大作",
            is_matchable: true,
          },
          {
            id: "puzzle_games",
            name: "沉浸式解谜/精品独立/创意游戏",
            desc: "玩法、美术或叙事独具匠心，能带来独特情感体验，如小小梦魇/Undertale/星际拓荒/Celeste",
            is_matchable: true,
          },
        ],
      },
      {
        id: "coop_party",
        name: "合作/派对游戏",
        desc: "适合与朋友同屏或联机并主打欢乐互动的游戏，如双人成行、胡闹厨房、马力欧派对、星露谷",
        is_matchable: true,
      },
    ],
  },
  {
    id: "leisure",
    name: "休闲活动",
    is_matchable: false,
    children: [
      {
        id: "singing",
        name: "唱歌🎤",
        is_matchable: false,
        children: [
          {
            id: "eu_us",
            name: "欧美歌曲",
            is_matchable: true,
          },
          {
            id: "japan_korea",
            name: "日韩歌曲",
            is_matchable: true,
          },
          {
            id: "china",
            name: "华语歌曲",
            is_matchable: true,
          },
        ],
      },
      {
        id: "instruments",
        name: "乐器🎸🎹🎻🥁",
        desc: "各种乐器都可以捏，互相交流",
        is_matchable: true,
      },
      {
        id: "arts",
        name: "独立创作类活动(绘画🖊/摄影📸/写作)",
        is_matchable: true,
      },
      {
        id: "crafts",
        name: "手工DIY🧵/烘焙/烹饪🍳",
        is_matchable: true,
      },
    ],
  },
  {
    id: "knowledge",
    name: "知识型活动",
    is_matchable: false,
    children: [
      {
        id: "language_exchange",
        name: "语言交换🗣",
        desc: "喜欢二外的友友快来",
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
        id: "study_together",
        name: "双人自习📚",
        desc: "简单地一起学习，互相监督",
        is_matchable: true,
      },
      {
        id: "humanities_reading",
        name: "人文社科/读书分享🧠",
        desc: "读书会、电影鉴赏、历史哲学思辨、社会议题讨论等",
        is_matchable: true,
      },
      {
        id: "tech_exchange",
        name: "研究计算机技术💻",
        desc: "装机、编程开发、算法研究等",
        is_matchable: true,
      },
    ],
  },
];
