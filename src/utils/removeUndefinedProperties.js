const removeUndefinedProperties = obj =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? { ...a, [k]: v } : a), {})

module.exports = removeUndefinedProperties
