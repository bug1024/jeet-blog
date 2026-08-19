import type { Chapter } from "../types";

export const chapters: Chapter[] = [
  {
    id: "beginning",
    year: "2018",
    mapLabel: "相遇",
    title: "我们相遇",
    subtitle: "两个人的开始",
    scene: "couple",
    x: 15,
    y: 31,
    paragraphs: [
      "那一年，我遇见了一个和我完全不同的人。",
      "我习惯思考世界，而你让我更多地感受到它。"
    ],
    memorySlots: [{ label: "第一次并肩", scene: "meeting" }]
  },
  {
    id: "yaya",
    year: "2019",
    mapLabel: "丫丫",
    title: "丫丫来了",
    subtitle: "从两个人，到三个人",
    scene: "cat",
    x: 32,
    y: 17,
    paragraphs: [
      "丫丫来到家里以后，我们第一次需要一起照顾另一个小生命。",
      "屋子里多了猫粮、猫砂和随处可见的猫毛，偶尔还混着猫尿猫屎的味道。照顾另一个生命，大概就是从这些具体而琐碎的事情开始。"
    ],
    memorySlots: [{ label: "初来乍到", scene: "cat-arrival" }, { label: "家里的日常", scene: "cat-life" }]
  },
  {
    id: "home",
    year: "2020",
    mapLabel: "成家",
    title: "我们成为一家人",
    subtitle: "有了共同的方向",
    scene: "house",
    x: 49,
    y: 40,
    paragraphs: [
      "2020 年，我们成为夫妻。",
      "从这一天开始，很多决定不再只考虑自己，我们也真正开始经营同一个家。"
    ],
    memorySlots: [{ label: "共同的日期", scene: "marriage" }, { label: "亮灯的家", scene: "wedding" }]
  },
  {
    id: "little-star",
    year: "2021",
    mapLabel: "小星星",
    title: "一颗新星来到",
    subtitle: "爸爸和妈妈",
    scene: "girl",
    x: 67,
    y: 20,
    paragraphs: [
      "2021 年 7 月 29 日，王卿梧来到我们的世界。",
      "我们的身份又多了两个，从此开始学习怎样做爸爸和妈妈。"
    ],
    memorySlots: [{ label: "初次见面", scene: "birth" }, { label: "慢慢长大", scene: "growing" }]
  },
  {
    id: "explorer",
    year: "2022—2026",
    mapLabel: "去远方",
    title: "妈妈的远行",
    subtitle: "你们去看更远的地方",
    scene: "travel",
    x: 82,
    y: 47,
    paragraphs: [
      "有时我还在自己的事情里，你已经带着女儿去了新的地方。",
      "陕西、香港、新加坡、贵州和云南，这些路程最后都变成了她小时候的记忆。"
    ],
    destinations: ["陕西", "香港", "新加坡", "贵州", "云南"],
    memorySlots: [{ label: "地图上的脚步", scene: "journey" }]
  },
  {
    id: "future",
    year: "2026—",
    mapLabel: "未完待续",
    title: "未来的旅程",
    subtitle: "地图还没有画完",
    scene: "future",
    x: 61,
    y: 75,
    paragraphs: [
      "以后还会去哪里，现在不用急着决定。",
      "这张地图留一部分空白，等我们一起慢慢补上。"
    ],
    futureList: [
      "看一次极光",
      "和卿梧继续探索世界",
      "去一个没有提前计划过的地方",
      "等卿梧长大，也让她带我们出发",
      "等我们老一点，再回来读取这份存档",
      "一些现在还不知道的旅程"
    ]
  }
];
