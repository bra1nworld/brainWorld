import { fail } from "assert";

export function isDevMode(name?: string): boolean {
    let search = location.search
    if (search.match("dev")) {
        if (!name) {
            return true
        }
        if (search.match(name)) {
            return true
        }
    }
    return false
}

export function cloneObject(object: any) {
    return JSON.parse(JSON.stringify(object))
}

export function downloadFile(file: string) {
    let uri = file
    let form = document.createElement("form")
    form.setAttribute('action', uri);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

type Sex = "male" | "female"
export function parseRpcId(rpcId: string): {
    sex: "male" | "female"
    birth: string
    age: number
} {
    let pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/
    if (!pat.test(rpcId)) {
        return null
    }
    let sex: Sex = "male"
    let birth = ""
    let age: number = 0

    let sexIndexStart = rpcId.length == 15 ? 14 : 16
    let birthYearSpan = rpcId.length == 15 ? 2 : 4

    let sexIndex = 1 - parseInt(rpcId.substr(sexIndexStart, 1), 10) % 2

    let year = (birthYearSpan == 2 ? "19" : "") + rpcId.substr(6, birthYearSpan)
    let month = rpcId.substr(6 + birthYearSpan, 2)
    let day = rpcId.substr(8 + birthYearSpan, 2)
    let d = new Date()
    let monthFloor = ((d.getMonth() + 1) < parseInt(month, 10) || (d.getMonth() + 1) == parseInt(month, 10) && d.getDate() < parseInt(day, 10)) ? 1 : 0;

    birth = `${year}-${month}-${day}`

    sex = (sexIndex == 1) ? "female" : "male"

    age = d.getFullYear() - parseInt(year, 10) - monthFloor

    return {
        sex,
        birth,
        age
    }
}

export function isValidDate(date: Date): boolean {
    if (!date.getTime) {
        return false
    }
    return !isNaN(date.getTime())
}

export function parseDate(date: Date): {
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number
} {
    let readable = ""
    let d = new Date(date)
    if (!isValidDate(d)) {
        return
    }
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let _date = d.getDate()
    let hours = d.getHours()
    let minutes = d.getMinutes()
    let seconds = d.getSeconds()
    return {
        year,
        month,
        date: _date,
        hours,
        minutes,
        seconds
    }
}

export function toDigitNumberString(number: number, digit: number = 2) {
    let numStr = `${number}`
    if (number / 10 * digit < digit) {
        let len = number.toString().length
        let strs: string[] = []
        for (let i = 0; i < digit - len; i++) {
            strs.push("0")
        }
        strs.push(numStr)
        return strs.join("")
    }
    return numStr
}

export function toReadableDate(date: Date | string, option?: {
    precision: "day" | "minute"
}, chinese?: string): string {
    let readable = ""
    let d = new Date(date as Date)
    if (!isValidDate(d)) {
        return "无效日期"
    }
    let dateObj = parseDate(d)
    let { year, month, hours, minutes, seconds } = dateObj
    let _date = dateObj.date
    let [
        monthStr,
        dateStr,
        hourStr,
        minuteStr,
        secondStr
    ] = [month, _date, hours, minutes, seconds].map((v) => toDigitNumberString(v))

    readable = chinese == "chinese" ? `${year}年${monthStr}月${dateStr}日` : `${year}-${monthStr}-${dateStr}`
    if (option && option.precision == "minute") {
        readable = chinese == "chinese" ? `${readable} ${hourStr}时${minuteStr}分` : `${readable} ${hourStr}:${minuteStr}`
    }
    return readable
}


export function toReadableTime(date: Date | string, option?: {
    precision: "hour" | "minute" | "second"
}): string {
    let readable = ""
    let d = new Date(date as Date)
    if (!isValidDate(d)) {
        return "无效日期"
    }
    let dateObj = parseDate(d)
    let { hours, minutes, seconds } = dateObj
    let [
        hourStr,
        minuteStr,
        secondStr
    ] = [hours, minutes, seconds].map((v) => toDigitNumberString(v))
    readable = `${hourStr}:${minuteStr}`
    if (option && option.precision == "hour") {
        readable = `${hourStr}:00`
    }
    return readable
}

export function isValidPhone(phone: string): boolean {
    let regex = /^1[0-9]\d{9}$/
    return regex.test(phone)
}

export function isValidTel(tel: string): boolean {
    let regex = /(\d{3}-|\d{4}-)?(\d{8}|\d{7})?/
    return regex.test(tel)
}

export function isValidEmail(email: string): boolean {
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    return regex.test(email)
}


export function toNumberRange(start, end, step = 1): number[] {
    // const len = Math.floor((end - start) / step) + 1
    // return (new Array(len) as any).fill().map((_, idx) => start + (idx * step))
    let range: number[] = [];
    for (var i = start; i <= end; i = i + step) {
        range.push(i);
    }
    return range
}


export function arrayToDict(items: (number | string)[]): DictItem[] {
    return items.map((item) => {
        return {
            value: item,
            displayText: `${item}`
        }
    })
}
export function objToDictReverse<T>(map: {
    [key: string]: T
}): DictItem<T>[] {
    let keys = Object.keys(map)
    let value = keys.map((item) => {
        return {
            displayText: map[item].toString(),
            value: item as any as T
        }
    })
    return value
}
export function objToDict<T>(map: {
    [key: string]: T
}): DictItem<T>[] {
    let keys = Object.keys(map)
    let value = keys.map((item) => {
        return {
            displayText: item,
            value: map[item]
        }
    })
    return value
}


export function camelToDash(str: string) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

export function changeMoneyToChinese(num: number) {
    if (num == 0) {
        return "零"
    }
    let numString = num.toString()

    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(numString))
        return "数据非法";
    let unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
    numString += "00";
    let pointIndex = numString.indexOf('.');
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

export function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function getFileNameFromPath(filePath: string): string {
    let arr = filePath.split("/");
    return arr[arr.length - 1];
}

export function objectEquals(object1: Object, object2: Object): boolean {
    //For the first loop, we only check for types
    for (let propName in object1) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false
        }
    }
    for (let propName in object2) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false
        }
        if (!object1.hasOwnProperty(propName)) {
            continue
        }

        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
            if (!arrayEquals(object1[propName], object2[propName])) {
                return false
            }
        } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
            if (!objectEquals(object1[propName], object2[propName])) {
                return false
            }
        } else if (object1[propName] != object2[propName]) {
            return false
        }
    }
    return true
}

export function arrayEquals(array1, array2): boolean {
    if (!array1 && !array2) {
        return true
    }
    if (!array1 && array2 || array1 && !array2) {
        return false
    }
    if (array1.length != array2.length) {
        return false
    }
    for (let i = 0, l = array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!arrayEquals(array1[i], array2[i]))
                return false
        } else if (array1[i] instanceof Object && array2[i] instanceof Object) {
            if (!objectEquals(array1[i], array2[i]))
                return false
        } else if (array1[i] != array2[i]) {
            return false
        }
    }
    return true
}