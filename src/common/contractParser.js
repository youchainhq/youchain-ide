export default class ContractParser {
  constructor(name,contract,source){
    return this.parser(name,contract,source);
  }

  parser(name,contract,source){
    let detail = {};
    detail.name = name;

    detail.metadata = contract.metadata;
    if (contract.evm.bytecode.object) {
      detail.bytecode = contract.evm.bytecode.object;
    }

    detail.abi = contract.abi;

    if (contract.evm.bytecode.object) {
      detail.bytecode = contract.evm.bytecode;

      detail.metadataHash = this.retrieveMetadataHash(contract.evm.bytecode.object);
      if (detail.metadataHash) {
        detail.swarmLocation = 'bzzr://' + detail.metadataHash
      }
    }

    detail.functionHashes = {};
    for (let fun in contract.evm.methodIdentifiers) {
      detail.functionHashes[contract.evm.methodIdentifiers[fun]] = fun;
    }

    detail.gasEstimates = this.formatGasEstimates(contract.evm.gasEstimates);

    detail.devdoc = contract.devdoc;
    detail.userdoc = contract.userdoc;

    if (contract.evm.deployedBytecode && contract.evm.deployedBytecode.object.length > 0) {
      detail.runtime = contract.evm.deployedBytecode;
    }

    if (source && contract.assembly !== null) {
      detail.assembly = this.formatAssemblyText(contract.evm.legacyAssembly, '', source.content)
    }

    return detail;
  }

  retrieveMetadataHash(bytecode) {
    let match = /a165627a7a72305820([0-9a-f]{64})0029$/.exec(bytecode)
    if (!match) {
      match = /a265627a7a72305820([0-9a-f]{64})6c6578706572696d656e74616cf50037$/.exec(bytecode)
    }
    if (match) {
      return match[1]
    }
  }

  formatAssemblyText(asm, prefix, source) {
    if (typeof asm === typeof '' || asm === null || asm === undefined) {
      return prefix + asm + '\n'
    }
    let text = prefix + '.code\n';
    asm['.code'].forEach((item, _i)=> {
      let v = item.value === undefined ? '' : item.value;
      let src = '';
      if (item.begin !== undefined && item.end !== undefined) {
        src = source.slice(item.begin, item.end).replace('\n', '\\n', 'g')
      }
      if (src.length > 30) {
        src = src.slice(0, 30) + '...'
      }
      if (item.name !== 'tag') {
        text += '  '
      }
      text += prefix + item.name + ' ' + v + '\t\t\t' + src + '\n'
    });

    text += prefix + '.data\n';
    let asmData = (asm['.data'] || []);
    for (let i in asmData) {
      let item = asmData[i];

      text += '  ' + prefix + '' + i + ':\n';
      text += this.formatAssemblyText(item, prefix + '    ', source)
    }
    return text;
  }

  formatGasEstimates(data) {
    if (!data) return {}
    if (data.creation === undefined && data.external === undefined && data.internal === undefined) return {};

    let gasToText = function (g) {
      return g === null ? 'unknown' : g;
    };

    let ret = {};
    let fun;
    if ('creation' in data) {
      ret['Creation'] = data.creation;
    }

    if ('external' in data) {
      ret['External'] = {};
      for (fun in data.external) {
        ret['External'][fun] = gasToText(data.external[fun]);
      }
    }

    if ('internal' in data) {
      ret['Internal'] = {};
      for (fun in data.internal) {
        ret['Internal'][fun] = gasToText(data.internal[fun]);
      }
    }
    return ret;
  }

}