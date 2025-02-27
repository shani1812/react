export const snakeToCamel = (obj: Record<string, any> | any[]): Record<string, any> | any[] => {
    if (Array.isArray(obj)) {
        // If it's an array, recursively apply snakeToCamel to each element
        return obj.map(item => snakeToCamel(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: Record<string, any> = {};

        // Iterate over each key in the object
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Convert snake_case key to camelCase
                const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
                newObj[camelCaseKey] = snakeToCamel(obj[key]); // Recursively call snakeToCamel for nested objects/arrays
            }
        }

        return newObj;
    }

    // If it's neither an object nor an array, just return the value (no transformation needed)
    return obj;
}