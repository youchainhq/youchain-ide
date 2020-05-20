import './style.less';

import _ from 'lodash';
import React,{PureComponent} from 'react';

import NotifyItem from './item';

export default class Notify extends PureComponent{
    constructor(props){
        super(props);

        this.idx = 1;

        this.state = {
            items:[]
        };

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    addItem(notify){
        let item = _.extend({},notify);
        item.id = this.idx;

        this.idx ++;

        this.setState({
            items: [...this.state.items,item]
        });
    }

    removeItem(id){
        this.setState({
           items: [...this.state.items.filter((item)=>{
               return id !== item.id
           })]
        });
    }

    render(){
        return (
            <div className="notify-layout">
                {
                    this.state.items.map((item)=>{
                        return <NotifyItem key={`notify_${item.id}`} notify={item} id={item.id} remove={this.removeItem}/>
                    })
                }
            </div>
        )
    }
}
