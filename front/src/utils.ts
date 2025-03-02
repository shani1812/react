export const snakeToCamel = (obj: Record<string, any> | any[]): Record<string, any> | any[] => {
    if (Array.isArray(obj)) {
        return obj.map(item => snakeToCamel(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: Record<string, any> = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const camelCaseKey = key.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
                newObj[camelCaseKey] = snakeToCamel(obj[key]); 
            }
        }

        return newObj;
    }

    return obj;
}