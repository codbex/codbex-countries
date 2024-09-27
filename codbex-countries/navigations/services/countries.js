const navigationData = {
    id: 'countries-navigation',
    label: "Countries",
    view: "countries",
    group: "countries",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-countries/gen/codbex-countries/ui/Countries/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }