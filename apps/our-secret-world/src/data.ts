export type Scene = "crowd" | "dog" | "cactus" | "park" | "track" | "mountain" | "hotel" | "balance";

export interface SecretChapter {
  id: string;
  index: string;
  title: string;
  label: string;
  scene: Scene;
  distance: number;
  paragraphs: string[];
}

export const chapters: SecretChapter[] = [
  {
    id: "crowd",
    index: "01",
    title: "人海里",
    label: "相遇",
    scene: "crowd",
    distance: 82,
    paragraphs: [
      "那段时间，两个人都过得不轻松，各自背着没有说完的压力，混在人群里照常生活。",
      "相遇起初没有特别之处，只是后来才发现，对方似乎能够听懂那些很难向别人解释的部分。"
    ]
  },
  {
    id: "dog",
    index: "02",
    title: "一只小狗",
    label: "靠近",
    scene: "dog",
    distance: 64,
    paragraphs: [
      "有些话不必从沉重的地方开始。一只路过的小狗，一件很小的事情，也能让两个人暂时从各自的压力里走出来。",
      "慰藉并不总是解决问题，更多时候只是让人知道，此刻不必独自承受。"
    ]
  },
  {
    id: "cactus",
    index: "03",
    title: "仙人掌",
    label: "边界",
    scene: "cactus",
    distance: 56,
    paragraphs: [
      "靠近会带来温度，也会碰到彼此身上的刺。两个人都知道，有些边界不能因为理解而消失。",
      "于是学着在想靠近的时候停一下，在想说更多的时候留下一部分。"
    ]
  },
  {
    id: "park",
    index: "04",
    title: "公园",
    label: "喘息",
    scene: "park",
    distance: 48,
    paragraphs: [
      "公园把城市的声音隔开了一点。树、长椅和走过的人，让短暂的相处显得普通。",
      "没有人急着定义什么，只是在一段并不轻松的日子里，给彼此留出一点可以喘息的空间。"
    ]
  },
  {
    id: "track",
    index: "05",
    title: "田径场",
    label: "循环",
    scene: "track",
    distance: 45,
    paragraphs: [
      "田径场上的路总会绕回原点。很多话题也是这样，说过、放下，过一阵又从另一个方向回来。",
      "关系没有继续向前冲，也没有退回陌生人，只是慢慢找到自己的节奏。"
    ]
  },
  {
    id: "mountain",
    index: "06",
    title: "山路",
    label: "同行",
    scene: "mountain",
    distance: 42,
    paragraphs: [
      "爬山时不需要一直说话。有人走在身边，累的时候停一会儿，已经足够。",
      "山路有明确的起点和终点，人与人的距离却没有。能做的只是看清脚下，再走下一段。"
    ]
  },
  {
    id: "hotel",
    index: "07",
    title: "一扇门",
    label: "克制",
    scene: "hotel",
    distance: 36,
    paragraphs: [
      "有些空间离日常很远，反而会让现实变得更清楚。门可以打开，也必须知道什么时候关上。",
      "真正维持这段关系的，不是毫无顾忌地靠近，而是两个人始终知道什么不能越过。"
    ]
  },
  {
    id: "balance",
    index: "08",
    title: "那一格距离",
    label: "平衡",
    scene: "balance",
    distance: 28,
    paragraphs: [
      "后来，两个人没有试图把这段关系变成一个标准答案。它既不是逃离现实，也不是对未来的许诺。",
      "只是在人海里遇见过，彼此理解过，也在最靠近的时候留下了一格距离。"
    ]
  }
];
