const configs = {
  modes:{
    'sol': 'solidity',
    'js': 'javascript',
    'py': 'python',
    'vy': 'python',
    'txt': 'text',
    'json': 'json',
    'abi': 'json'
  },
  regular:{
    github:/^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*)/,
    http:/^(http?:\/\/?(.*))$/,
    https:/^(https?:\/\/?(.*))$/,
    swarm:/^(bzz-raw?:\/\/?(.*))$/,
    ipfs:/^(ipfs:\/\/?.+)/
  }
};

export default configs;
