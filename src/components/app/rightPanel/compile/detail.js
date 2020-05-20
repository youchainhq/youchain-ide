import "./style.less";
import React, { PureComponent } from "react";
import ReactJson from 'react-json-view';

import {Modal} from "../../../../components/vendors";

export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderJsonTree(src){
    return (
      <ReactJson
        src={src}
        name={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        collapsed={1}
      />
    )
  }

  renderCopy(data){
    return (
      <a className="m-l-10" onClick={()=>{
        this.props.onCopy(data);
      }}>
        <i className="fa icon-file"/>
      </a>
    )
  }

  render() {
    const {contract,onDismiss} = this.props;

    return (
      <Modal
        title={contract.name}
        hideFooter={true}
        larger={true}
        onDismiss={onDismiss}
      >
        <div className="contract-detail-wrapper">
          <section>
            <h5>NAME</h5>
            <div>{contract.name}</div>
          </section>
          <section>
            <h5>
              METADATA
              {this.renderCopy(contract.metadata)}
            </h5>
            <div className="metadata-wrapper">
              {contract.metadata ? this.renderJsonTree(JSON.parse(contract.metadata)) : ""}
            </div>
          </section>
          <section>
            <h5>
              BYTECODE
              {this.renderCopy(JSON.stringify(contract.bytecode))}
            </h5>
            <div className="bytecode-wrapper">
              {this.renderJsonTree(contract.bytecode)}
            </div>
          </section>
          <section>
            <h5>
              ABI
              {this.renderCopy(JSON.stringify(contract.abi))}
            </h5>
            <div className="abi-wrapper">
              {this.renderJsonTree(contract.abi)}
            </div>
          </section>
          <section>
            <h5>
              METADATAHASH
              {this.renderCopy(contract.metadataHash)}
            </h5>
            <div>
              "{contract.metadataHash}"
            </div>
          </section>
          <section>
            <h5>
              SWARMLOCATION
              {this.renderCopy(contract.swarmLocation)}
            </h5>
            <div>
              "{contract.swarmLocation}"
            </div>
          </section>
          <section>
            <h5>
              FUNCTIONHASHES
              {this.renderCopy(JSON.stringify(contract.functionHashes))}
            </h5>
            <div className="functionHashes-wrapper">
              {this.renderJsonTree(contract.functionHashes)}
            </div>
          </section>
          <section>
            <h5>
              GASESTIMATES
              {this.renderCopy(JSON.stringify(contract.gasEstimates))}
            </h5>
            <div className="gasEstimates-wrapper">
              {this.renderJsonTree(contract.gasEstimates)}
            </div>
          </section>
          <section>
            <h5>
              DEVDOC
              {this.renderCopy(JSON.stringify(contract.devdoc))}
            </h5>
            <div className="devdoc-wrapper">
              {this.renderJsonTree(contract.devdoc)}
            </div>
          </section>
          <section>
            <h5>
              USERDOC
              {this.renderCopy(JSON.stringify(contract.userdoc))}
            </h5>
            <div className="userdoc-wrapper">
              {this.renderJsonTree(contract.userdoc)}
            </div>
          </section>
          <section>
            <h5>
              RUNTIME BYTECODE
              {this.renderCopy(JSON.stringify(contract.runtime))}
            </h5>
            <div className="runtime-wrapper">
              {this.renderJsonTree(contract.runtime)}
            </div>
          </section>
          <section>
            <h5>
              ASSEMBLY
              {this.renderCopy(contract.assembly)}
            </h5>
            <div>
              <pre>
                {contract.assembly}
              </pre>
            </div>
          </section>
        </div>
      </Modal>
    );
  }
}