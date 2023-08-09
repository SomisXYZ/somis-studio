type Nullable<T> = T | null

// maybe not the best way to remove null values
export function convertMapNullToUndefined(
    input: Record<string, Nullable<unknown>>,
    nested = false,
): Record<string, unknown | undefined> {
    const output: Record<string, unknown | undefined> = {}

    for (const key in input) {
        let value = input[key]
        if (value != null) {
            if (typeof value === 'object') {
                value = convertMapNullToUndefined({ ...value }, nested)
            }
            output[key] = value
        }
    }

    return output
}
