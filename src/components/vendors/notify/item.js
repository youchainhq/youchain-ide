import './style.less';
import _ from "lodash";
import React,{PureComponent} from 'react';
import classnames from 'classnames';

export default class NotifyItem extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            show:true,
            remove:false
        }
    }

    componentDidMount(){
        const {notify,remove,id} = this.props;

        const delay = notify.delay || 2500;
        const time = delay + 500;

        setTimeout(()=>{
            this.setState({
                show:false
            });
        },delay);

        setTimeout(()=>{
            this.setState({
                remove:true
            });

            remove(id);
        },time);
    }

    render(){
        const {notify} = this.props;

        const cns = ['notify-item','animated',{
            'fadeInRight':this.state.show,
            'fadeOutRight':!this.state.show
        }];

        const className = classnames(cns,notify.type);

        return (
            this.state.remove ? null :
            <div className={className}>
                <i className={`fa icon-${notify.type}`} />
                <section>
                    {
                        _.isPlainObject(notify.msg) ?
                          <span>{`${_.join(_.keys(notify.msg), ',')} 有误`}</span> :
                          <span>{notify.msg}</span>
                    }
                </section>
            </div>
        )
    }
}
