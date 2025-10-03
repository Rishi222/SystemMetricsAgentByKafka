function getSystemData(data) {
  return {
    hostname: data.hostname || "unknown",
    system: {
      manufacturer: data.system?.manufacturer || "unknown",
      model: data.system?.model || "unknown",
      version: data.system?.version || "unknown",
      type: data.system?.type || "unknown",
    },
    osInfo: {
      platform: data.osInfo?.platform || "unknown",
      distro: data.osInfo?.distro || "unknown",
      codename: data.osInfo?.codename || "unknown",
    },
    cpu: {
      manufacturer: data.cpu?.manufacturer || "unknown",
      brand: data.cpu?.brand || "unknown",
      cores: data.cpu?.cores || 0,
    },
    memory: {
      total: data.memory?.total || 0,
      free: data.memory?.free || 0,
      used: data.memory?.used || 0,
    },
    networkInterfaces: data.networkInterfaces || [],
    networkStats: data.networkStats || [],
    battery: data.battery || {},
    services: data.services || [],
    users: data.users || [],
    timestamp: data.timestamp || new Date().toISOString(),
  };
}

module.exports = getSystemData;