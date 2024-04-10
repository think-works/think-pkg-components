import { stringHash } from "@/utils/crypto";

export type ColorType = {
  bgColor: string;
  color: string;
};

export type IndexColorType = {
  [text: string]: ColorType;
};

/**
 * 调色板
 */
export const colorPalette: ColorType[] = [
  { bgColor: "#A697FB", color: "#FFFFFF" },
  { bgColor: "#6F77B0", color: "#FFFFFF" },
  { bgColor: "#BE97FB", color: "#FFFFFF" },
  { bgColor: "#6A9DB0", color: "#FFFFFF" },
  { bgColor: "#FBA397", color: "#FFFFFF" },
  { bgColor: "#B0726A", color: "#FFFFFF" },
  { bgColor: "#B0986A", color: "#FFFFFF" },
  { bgColor: "#926AB0", color: "#FFFFFF" },
  { bgColor: "#81A5FF", color: "#FFFFFF" },
  { bgColor: "#5A89B3", color: "#FFFFFF" },
  { bgColor: "#9591FF", color: "#FFFFFF" },
  { bgColor: "#5AB391", color: "#FFFFFF" },
  { bgColor: "#B35A7C", color: "#FFFFFF" },
  { bgColor: "#B3885A", color: "#FFFFFF" },
  { bgColor: "#795AB3", color: "#FFFFFF" },
  { bgColor: "#AD81FF", color: "#FFFFFF" },
  { bgColor: "#58A4B3", color: "#FFFFFF" },
  { bgColor: "#58B368", color: "#FFFFFF" },
  { bgColor: "#B35892", color: "#FFFFFF" },
  { bgColor: "#B38058", color: "#FFFFFF" },
  { bgColor: "#988BFF", color: "#FFFFFF" },
  { bgColor: "#6A61B3", color: "#FFFFFF" },
  { bgColor: "#66D2A9", color: "#FFFFFF" },
  { bgColor: "#479383", color: "#FFFFFF" },
  { bgColor: "#6690D2", color: "#FFFFFF" },
  { bgColor: "#4F9347", color: "#FFFFFF" },
  { bgColor: "#D266C2", color: "#FFFFFF" },
  { bgColor: "#934788", color: "#FFFFFF" },
  { bgColor: "#D2B766", color: "#FFFFFF" },
  { bgColor: "#D28766", color: "#FFFFFF" },
  { bgColor: "#935F47", color: "#FFFFFF" },
  { bgColor: "#4D5693", color: "#FFFFFF" },
  { bgColor: "#6D7BD2", color: "#FFFFFF" },
  { bgColor: "#549D35", color: "#FFFFFF" },
  { bgColor: "#8E9D35", color: "#FFFFFF" },
  { bgColor: "#E0924B", color: "#FFFFFF" },
  { bgColor: "#359D8F", color: "#FFFFFF" },
  { bgColor: "#B3A95F", color: "#FFFFFF" },
  { bgColor: "#5F93B3", color: "#FFFFFF" },
  { bgColor: "#FF88C1", color: "#FFFFFF" },
  { bgColor: "#815FB3", color: "#FFFFFF" },
  { bgColor: "#93B35F", color: "#FFFFFF" },
  { bgColor: "#B39D40", color: "#FFFFFF" },
  { bgColor: "#B38640", color: "#FFFFFF" },
  { bgColor: "#40AFB3", color: "#FFFFFF" },
  { bgColor: "#9AB340", color: "#FFFFFF" },
  { bgColor: "#FFA047", color: "#FFFFFF" },
  { bgColor: "#B37B32", color: "#FFFFFF" },
  { bgColor: "#FF8647", color: "#FFFFFF" },
  { bgColor: "#B35E32", color: "#FFFFFF" },
  { bgColor: "#B3A232", color: "#FFFFFF" },
  { bgColor: "#FF98AC", color: "#FFFFFF" },
  { bgColor: "#B36A84", color: "#FFFFFF" },
  { bgColor: "#B36AAE", color: "#FFFFFF" },
  { bgColor: "#B3AD6A", color: "#FFFFFF" },
  { bgColor: "#76B36A", color: "#FFFFFF" },
  { bgColor: "#B3896A", color: "#FFFFFF" },
  { bgColor: "#FF8A82", color: "#FFFFFF" },
  { bgColor: "#B3605B", color: "#FFFFFF" },
  { bgColor: "#B35B95", color: "#FFFFFF" },
  { bgColor: "#FFB782", color: "#FFFFFF" },
  { bgColor: "#AEB35B", color: "#FFFFFF" },
  { bgColor: "#5BB367", color: "#FFFFFF" },
  { bgColor: "#B3895B", color: "#FFFFFF" },
  { bgColor: "#5591A8", color: "#FFFFFF" },
  { bgColor: "#F0887A", color: "#FFFFFF" },
  { bgColor: "#A88C55", color: "#FFFFFF" },
  { bgColor: "#6692FF", color: "#FFFFFF" },
  { bgColor: "#4780B3", color: "#FFFFFF" },
  { bgColor: "#B37E47", color: "#FFFFFF" },
  { bgColor: "#70D5FF", color: "#FFFFFF" },
  { bgColor: "#4EA3B3", color: "#FFFFFF" },
  { bgColor: "#4EB360", color: "#FFFFFF" },
  { bgColor: "#B37A4E", color: "#FFFFFF" },
  { bgColor: "#BD7AF0", color: "#FFFFFF" },
  { bgColor: "#45C897", color: "#FFFFFF" },
  { bgColor: "#308C78", color: "#FFFFFF" },
  { bgColor: "#4578C8", color: "#FFFFFF" },
  { bgColor: "#B3A645", color: "#FFFFFF" },
  { bgColor: "#20B3B3", color: "#FFFFFF" },
  { bgColor: "#B39520", color: "#FFFFFF" },
  { bgColor: "#95B320", color: "#FFFFFF" },
  { bgColor: "#FF8A1F", color: "#FFFFFF" },
  { bgColor: "#B36F16", color: "#FFFFFF" },
  { bgColor: "#B3AC5A", color: "#FFFFFF" },
  { bgColor: "#FF8199", color: "#FFFFFF" },
  { bgColor: "#B35A76", color: "#FFFFFF" },
  { bgColor: "#FFA181", color: "#FFFFFF" },
  { bgColor: "#B35AAB", color: "#FFFFFF" },
  { bgColor: "#81BDFF", color: "#FFFFFF" },
  { bgColor: "#68B35A", color: "#FFFFFF" },
  { bgColor: "#5471E9", color: "#FFFFFF" },
  { bgColor: "#37A346", color: "#FFFFFF" },
  { bgColor: "#7B67EE", color: "#FFFFFF" },
  { bgColor: "#488DA7", color: "#FFFFFF" },
  { bgColor: "#A75448", color: "#FFFFFF" },
  { bgColor: "#EE7767", color: "#FFFFFF" },
  { bgColor: "#EEC067", color: "#FFFFFF" },
  { bgColor: "#A78648", color: "#FFFFFF" },
  { bgColor: "#7E48A7", color: "#FFFFFF" },
  { bgColor: "#B774DB", color: "#FFFFFF" },
  { bgColor: "#5586FF", color: "#FFFFFF" },
  { bgColor: "#3B7AB3", color: "#FFFFFF" },
  { bgColor: "#3BB386", color: "#FFFFFF" },
  { bgColor: "#B3793B", color: "#FFFFFF" },
  { bgColor: "#55CDFF", color: "#FFFFFF" },
  { bgColor: "#3C9FB2", color: "#FFFFFF" },
  { bgColor: "#3CB250", color: "#FFFFFF" },
  { bgColor: "#FE9F55", color: "#FFFFFF" },
  { bgColor: "#B26F3C", color: "#FFFFFF" },
  { bgColor: "#30C28B", color: "#FFFFFF" },
  { bgColor: "#228872", color: "#FFFFFF" },
  { bgColor: "#C29E30", color: "#FFFFFF" },
  { bgColor: "#52C41B", color: "#FFFFFF" },
  { bgColor: "#ADC41B", color: "#FFFFFF" },
  { bgColor: "#798913", color: "#FFFFFF" },
  { bgColor: "#C46A1B", color: "#FFFFFF" },
  { bgColor: "#138977", color: "#FFFFFF" },
  { bgColor: "#B3A329", color: "#FFFFFF" },
  { bgColor: "#B38729", color: "#FFFFFF" },
  { bgColor: "#297EB3", color: "#FFFFFF" },
  { bgColor: "#FFAB00", color: "#FFFFFF" },
  { bgColor: "#B39000", color: "#FFFFFF" },
  { bgColor: "#FF9B00", color: "#FFFFFF" },
  { bgColor: "#B36D00", color: "#FFFFFF" },
  { bgColor: "#00ADB3", color: "#FFFFFF" },
  { bgColor: "#8DB300", color: "#FFFFFF" },
  { bgColor: "#3078A5", color: "#FFFFFF" },
  { bgColor: "#9CD149", color: "#FFFFFF" },
  { bgColor: "#FF96C2", color: "#FFFFFF" },
  { bgColor: "#63DDB5", color: "#FFFFFF" },
  { bgColor: "#FF7A00", color: "#FFFFFF" },
  { bgColor: "#B36600", color: "#FFFFFF" },
  { bgColor: "#FFC300", color: "#FFFFFF" },
  { bgColor: "#B39B00", color: "#FFFFFF" },
  { bgColor: "#FF708B", color: "#FFFFFF" },
  { bgColor: "#B34E6E", color: "#FFFFFF" },
  { bgColor: "#FF9470", color: "#FFFFFF" },
  { bgColor: "#B34EAA", color: "#FFFFFF" },
  { bgColor: "#B3AB4E", color: "#FFFFFF" },
  { bgColor: "#70B4FF", color: "#FFFFFF" },
  { bgColor: "#5EB34E", color: "#FFFFFF" },
  { bgColor: "#B3794E", color: "#FFFFFF" },
];

/**
 * 哈希映射颜色(无状态)
 */
export const hashColor = (text: string) => {
  const hash = stringHash(text || "");
  const idx = hash % colorPalette.length;
  return colorPalette[idx];
};

/**
 * 索引映射颜色(有状态)
 */
export class IndexColor {
  private indexNum = 0;
  private indexObj: IndexColorType = {};

  public resetIndex = () => {
    this.indexNum = 0;
    this.indexObj = {};
  };

  public nextColor = (text: string) => {
    let color = this.indexObj[text];

    // 已存在映射，直接返回
    if (color) {
      return color;
    }

    // 索引超出待选列表长度，重置索引
    if (this.indexNum >= colorPalette.length) {
      this.indexNum = 0;
    }

    // 索引颜色
    color = colorPalette[this.indexNum];

    // 索引自增
    this.indexNum++;

    // 缓存映射
    this.indexObj[text] = color;

    return color;
  };
}
