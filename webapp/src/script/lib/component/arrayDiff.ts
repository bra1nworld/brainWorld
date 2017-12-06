export abstract class ArrayDiff {
    static diff<T>(arr1: T[] = [], arr2: T[] = [], identical?: (a: T, b: T) => boolean): {
        left: T[]
        right: T[]
        interact: T[]
    } {
        if (!identical) {
            identical = (a, b) => {
                return a === b
            }
        }
        arr1 = arr1.slice()
        arr2 = arr2.slice()
        let interact: T[] = []
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (identical(arr2[j], arr1[i])) {
                    interact.push(arr1[i])
                    arr1.splice(i, 1)
                    arr2.splice(j, 1)
                    console.log("arr diff?", i)
                    i--;
                    break;
                }
            }
        }
        return {
            left: arr1,
            right: arr2,
            interact
        }
    }
}
