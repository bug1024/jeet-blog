import type { CharacterProfile } from "../types";

export const characters: CharacterProfile[] = [
  {
    id: "ms-wu",
    name: "吴女士",
    level: 35,
    className: "家庭守护者",
    scene: "girl",
    attributes: [
      { label: "善良", value: 99 },
      { label: "共情", value: 98 },
      { label: "探索", value: 95 },
      { label: "母亲", value: 100 }
    ],
    skill: "让家温暖",
    description: "温柔、善良，愿意理解别人，也总能把一家人的生活照顾得妥帖。"
  },
  {
    id: "yaya",
    name: "丫丫",
    level: 7,
    className: "小小伙伴",
    scene: "cat",
    attributes: [
      { label: "可爱", value: 100 },
      { label: "温暖", value: 95 },
      { label: "恋家", value: 99 }
    ],
    skill: "让家热闹起来",
    description: "一只三花猫，也是这个家最早加入的新成员。"
  }
];

export const futureLetter = {
  year: "2040",
  title: "来自未来的我",
  paragraphs: [
    "谢谢你陪我走过这么多年，也让一个总在思考世界的人，有了一个可以回去的小世界。",
    "希望到了那时，我们仍然会一起出门，一起回家，也仍然愿意听对方说当天发生的事。"
  ]
};
