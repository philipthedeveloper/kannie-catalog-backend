const badgeIconClasses: Record<any, any> = {
  "+": "fi fi-rr-arrow-small-right -rotate-45",
  "-": "fi fi-rr-arrow-small-right rotate-45",
};

export const getDecimals = (value: number) => {
  return value < 1000 ? 0 : 2;
};

export enum TABS {
  ANALYTICS = "pills-analytics",
  CONTENT = "pills-content",
}

export type TabOption = TABS.ANALYTICS | TABS.CONTENT;

export function generateSuffix(num: number) {
  if (num >= 1000000) {
    return "M";
  } else if (num >= 1000) {
    return "K";
  } else {
    return "";
  }
}

export const createStatData = ({
  label,
  colorClass,
  percentageSign,
  percentage,
  counterStart,
  totalCount,
  prefix,
  duration,
  decimal,
  seperator,
  linkType,
  link,
  linkUrl,
  widgetIconClass,
}: any) => {
  return {
    label,
    badgeClass: colorClass,
    badgeIconClass: badgeIconClasses[percentageSign] || "",
    percentage: `${percentageSign}${percentage}`,
    counterStart: counterStart || 0,
    counterEnd: totalCount || 0,
    prefix: prefix || "",
    suffix: generateSuffix(totalCount || 0),
    duration: duration || 4,
    decimal: decimal || ".",
    decimals: getDecimals(totalCount) || 0,
    seperator: seperator || ",",
    linkType,
    link,
    linkUrl,
    widgetIconBg: `${colorClass}-bg`,
    widgetIconClass: widgetIconClass,
    widgetIconColor: colorClass,
  };
};

export const createContentStat = (totalCount: number) =>
  createStatData({
    label: "Contents",
    colorClass: "info",
    percentageSign: "+",
    percentage: 40.56,
    totalCount,
    linkType: "section",
    link: "See details",
    linkUrl: TABS.ANALYTICS,
    widgetIconClass: "fi fi-rr-umbrella-beach",
  });

export const createAdminStat = (totalCount: number) =>
  createStatData({
    label: "Admins",
    colorClass: "success",
    percentageSign: "+",
    percentage: 23.48,
    totalCount,
    linkType: "section",
    link: "See details",
    linkUrl: TABS.ANALYTICS,
    widgetIconClass: "fi fi-rr-user-shield",
  });
