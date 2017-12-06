export declare abstract class ArrayDiff {
    static diff<T>(arr1?: T[], arr2?: T[], identical?: (a: T, b: T) => boolean): {
        left: T[];
        right: T[];
        interact: T[];
    };
}
