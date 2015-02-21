function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}

var utils = {};
utils.getQueryParams = getQueryParams;
utils.getQueryParamValue = function(queryStrings, queryParamToLookFor) {
    var qs = getQueryParams(queryStrings);
    return qs[queryParamToLookFor] ? qs[queryParamToLookFor] : false;
}

module.exports = utils;