const usageData = new Map();

function recordUsage(identifier, endpoint) {
    const key = `${identifier}:${endpoint}`;

    const current = usageData.get(key) || {
        identifier,
        endpoint,
        requests: 0,
        lastRequest: null
    };

    current.requests += 1;
    current.lastRequest = new Date().toISOString();

    usageData.set(key, current);

    return current;
}

function getUsage(identifier) {
    const results = [];

    for (const item of usageData.values()) {
        if (item.identifier === identifier) {
            results.push({ ...item });
        }
    }

    return results;
}

module.exports = {
    recordUsage,
    getUsage
};
