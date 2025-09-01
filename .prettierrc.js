import checkerNetworkConfig from '@checkernetwork/prettier-config'

const config = { ...checkerNetworkConfig }

Object.structuredClone
config.plugins = [...(checkerNetworkConfig.plugins ?? [])]
config.plugins.push('prettier-plugin-solidity')

export default config
