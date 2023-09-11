export const consecutiveCheck = (arr:number[]) => {
    if(arr.includes(1)){
        // Check if the array is null or undefined
    if (arr === null || arr === undefined || arr.length === 0) {
        return 1; // Return 1 for null, undefined, or empty arrays
    }

    const n = arr.length;

    // If the array has only one element, return the next consecutive number
    if (n === 1) {
        return arr[0] !== undefined ? arr[0] + 1 : 1;
    }

    let prevElement = arr[0] !== undefined ? arr[0] : 1;

    for (let i = 1; i < n; i++) {
        const currentElement = arr[i];
        if (currentElement !== undefined && currentElement !== prevElement + 1) {
            return prevElement + 1; // Found a gap, return the missing number
        }
        prevElement = currentElement !== undefined ? currentElement : prevElement;
    }

    // If there is no missing number, return the next consecutive number
    return prevElement + 1;
    }

    else{
        return 1
    }
}