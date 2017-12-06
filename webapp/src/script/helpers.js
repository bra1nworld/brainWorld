"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDevMode(name) {
    var search = location.search;
    if (search.match("dev")) {
        if (!name) {
            return true;
        }
        if (search.match(name)) {
            return true;
        }
    }
    return false;
}
exports.isDevMode = isDevMode;
function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}
exports.cloneObject = cloneObject;
function downloadFile(file) {
    var uri = file;
    var form = document.createElement("form");
    form.setAttribute('action', uri);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
exports.downloadFile = downloadFile;
function parseRpcId(rpcId) {
    var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/;
    if (!pat.test(rpcId)) {
        return null;
    }
    var sex = "male";
    var birth = "";
    var age = 0;
    var sexIndexStart = rpcId.length == 15 ? 14 : 16;
    var birthYearSpan = rpcId.length == 15 ? 2 : 4;
    var sexIndex = 1 - parseInt(rpcId.substr(sexIndexStart, 1), 10) % 2;
    var year = (birthYearSpan == 2 ? "19" : "") + rpcId.substr(6, birthYearSpan);
    var month = rpcId.substr(6 + birthYearSpan, 2);
    var day = rpcId.substr(8 + birthYearSpan, 2);
    var d = new Date();
    var monthFloor = ((d.getMonth() + 1) < parseInt(month, 10) || (d.getMonth() + 1) == parseInt(month, 10) && d.getDate() < parseInt(day, 10)) ? 1 : 0;
    birth = year + "-" + month + "-" + day;
    sex = (sexIndex == 1) ? "female" : "male";
    age = d.getFullYear() - parseInt(year, 10) - monthFloor;
    return {
        sex: sex,
        birth: birth,
        age: age
    };
}
exports.parseRpcId = parseRpcId;
function isValidDate(date) {
    if (!date.getTime) {
        return false;
    }
    return !isNaN(date.getTime());
}
exports.isValidDate = isValidDate;
function parseDate(date) {
    var readable = "";
    var d = new Date(date);
    if (!isValidDate(d)) {
        return;
    }
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var _date = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return {
        year: year,
        month: month,
        date: _date,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}
exports.parseDate = parseDate;
function toDigitNumberString(number, digit) {
    if (digit === void 0) { digit = 2; }
    var numStr = "" + number;
    if (number / 10 * digit < digit) {
        var len = number.toString().length;
        var strs = [];
        for (var i = 0; i < digit - len; i++) {
            strs.push("0");
        }
        strs.push(numStr);
        return strs.join("");
    }
    return numStr;
}
exports.toDigitNumberString = toDigitNumberString;
function toReadableDate(date, option, chinese) {
    var readable = "";
    var d = new Date(date);
    if (!isValidDate(d)) {
        return "无效日期";
    }
    var dateObj = parseDate(d);
    var year = dateObj.year, month = dateObj.month, hours = dateObj.hours, minutes = dateObj.minutes, seconds = dateObj.seconds;
    var _date = dateObj.date;
    var _a = [month, _date, hours, minutes, seconds].map(function (v) { return toDigitNumberString(v); }), monthStr = _a[0], dateStr = _a[1], hourStr = _a[2], minuteStr = _a[3], secondStr = _a[4];
    readable = chinese == "chinese" ? year + "\u5E74" + monthStr + "\u6708" + dateStr + "\u65E5" : year + "-" + monthStr + "-" + dateStr;
    if (option && option.precision == "minute") {
        readable = chinese == "chinese" ? readable + " " + hourStr + "\u65F6" + minuteStr + "\u5206" : readable + " " + hourStr + ":" + minuteStr;
    }
    return readable;
}
exports.toReadableDate = toReadableDate;
function toReadableTime(date, option) {
    var readable = "";
    var d = new Date(date);
    if (!isValidDate(d)) {
        return "无效日期";
    }
    var dateObj = parseDate(d);
    var hours = dateObj.hours, minutes = dateObj.minutes, seconds = dateObj.seconds;
    var _a = [hours, minutes, seconds].map(function (v) { return toDigitNumberString(v); }), hourStr = _a[0], minuteStr = _a[1], secondStr = _a[2];
    readable = hourStr + ":" + minuteStr;
    if (option && option.precision == "hour") {
        readable = hourStr + ":00";
    }
    return readable;
}
exports.toReadableTime = toReadableTime;
function isValidPhone(phone) {
    var regex = /^1[0-9]\d{9}$/;
    return regex.test(phone);
}
exports.isValidPhone = isValidPhone;
function isValidTel(tel) {
    var regex = /(\d{3}-|\d{4}-)?(\d{8}|\d{7})?/;
    return regex.test(tel);
}
exports.isValidTel = isValidTel;
function isValidEmail(email) {
    var regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return regex.test(email);
}
exports.isValidEmail = isValidEmail;
function toNumberRange(start, end, step) {
    if (step === void 0) { step = 1; }
    // const len = Math.floor((end - start) / step) + 1
    // return (new Array(len) as any).fill().map((_, idx) => start + (idx * step))
    var range = [];
    for (var i = start; i <= end; i = i + step) {
        range.push(i);
    }
    return range;
}
exports.toNumberRange = toNumberRange;
function arrayToDict(items) {
    return items.map(function (item) {
        return {
            value: item,
            displayText: "" + item
        };
    });
}
exports.arrayToDict = arrayToDict;
function objToDictReverse(map) {
    var keys = Object.keys(map);
    var value = keys.map(function (item) {
        return {
            displayText: map[item].toString(),
            value: item
        };
    });
    return value;
}
exports.objToDictReverse = objToDictReverse;
function objToDict(map) {
    var keys = Object.keys(map);
    var value = keys.map(function (item) {
        return {
            displayText: item,
            value: map[item]
        };
    });
    return value;
}
exports.objToDict = objToDict;
function camelToDash(str) {
    return str.replace(/([A-Z])/g, function (g) { return "-" + g[0].toLowerCase(); });
}
exports.camelToDash = camelToDash;
function changeMoneyToChinese(num) {
    if (num == 0) {
        return "零";
    }
    var numString = num.toString();
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(numString))
        return "数据非法";
    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
    numString += "00";
    var pointIndex = numString.indexOf('.');
    if (pointIndex >= 0)
        numString = numString.substring(0, pointIndex) + numString.substr(pointIndex + 1, 2);
    unit = unit.substr(unit.length - numString.length);
    for (var i = 0; i < numString.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(Number(numString.charAt(i))) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零")
        .replace(/(零)+/g, "零")
        .replace(/零(万|亿|元)/g, "$1")
        .replace(/(亿)万|壹(拾)/g, "$1$2")
        .replace(/^元零?|零分/g, "")
        .replace(/元$/g, "元整");
}
exports.changeMoneyToChinese = changeMoneyToChinese;
function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
exports.uuid = uuid;
function getFileNameFromPath(filePath) {
    var arr = filePath.split("/");
    return arr[arr.length - 1];
}
exports.getFileNameFromPath = getFileNameFromPath;
function objectEquals(object1, object2) {
    //For the first loop, we only check for types
    for (var propName in object1) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
    }
    for (var propName in object2) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
        if (!object1.hasOwnProperty(propName)) {
            continue;
        }
        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
            if (!arrayEquals(object1[propName], object2[propName])) {
                return false;
            }
        }
        else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
            if (!objectEquals(object1[propName], object2[propName])) {
                return false;
            }
        }
        else if (object1[propName] != object2[propName]) {
            return false;
        }
    }
    return true;
}
exports.objectEquals = objectEquals;
function arrayEquals(array1, array2) {
    if (!array1 && !array2) {
        return true;
    }
    if (!array1 && array2 || array1 && !array2) {
        return false;
    }
    if (array1.length != array2.length) {
        return false;
    }
    for (var i = 0, l = array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!arrayEquals(array1[i], array2[i]))
                return false;
        }
        else if (array1[i] instanceof Object && array2[i] instanceof Object) {
            if (!objectEquals(array1[i], array2[i]))
                return false;
        }
        else if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayEquals = arrayEquals;
