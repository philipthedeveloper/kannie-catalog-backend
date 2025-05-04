"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminStat = exports.createContentStat = exports.createStatData = exports.TABS = exports.getDecimals = void 0;
exports.generateSuffix = generateSuffix;
const badgeIconClasses = {
    "+": "fi fi-rr-arrow-small-right -rotate-45",
    "-": "fi fi-rr-arrow-small-right rotate-45",
};
const getDecimals = (value) => {
    return value < 1000 ? 0 : 2;
};
exports.getDecimals = getDecimals;
var TABS;
(function (TABS) {
    TABS["ANALYTICS"] = "pills-analytics";
    TABS["CONTENT"] = "pills-content";
})(TABS || (exports.TABS = TABS = {}));
function generateSuffix(num) {
    if (num >= 1000000) {
        return "M";
    }
    else if (num >= 1000) {
        return "K";
    }
    else {
        return "";
    }
}
const createStatData = ({ label, colorClass, percentageSign, percentage, counterStart, totalCount, prefix, duration, decimal, seperator, linkType, link, linkUrl, widgetIconClass, }) => {
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
        decimals: (0, exports.getDecimals)(totalCount) || 0,
        seperator: seperator || ",",
        linkType,
        link,
        linkUrl,
        widgetIconBg: `${colorClass}-bg`,
        widgetIconClass: widgetIconClass,
        widgetIconColor: colorClass,
    };
};
exports.createStatData = createStatData;
const createContentStat = (totalCount) => (0, exports.createStatData)({
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
exports.createContentStat = createContentStat;
const createAdminStat = (totalCount) => (0, exports.createStatData)({
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
exports.createAdminStat = createAdminStat;
