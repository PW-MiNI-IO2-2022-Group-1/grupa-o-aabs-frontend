const getOrDefault = <T, V>(map: Map<T, V>, key: T, defaultVal: V): V => {
    const value = map.get(key);
    return (value === undefined) ? defaultVal : value;
}

export { getOrDefault };