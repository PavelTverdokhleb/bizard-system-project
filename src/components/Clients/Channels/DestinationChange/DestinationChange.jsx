import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import TooltipMessage from '../../../HelpersBlocks/TooltipMessage/TooltipMessage';

import {updateChannel} from "../../../../actions/updateRedux";
import {patchEditChannel} from "../../../../actions/channelsActions";

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ErrorIcon from '../../../../../assets/img/error_icon.png';

import './DestinationChange.scss';

class DestinationChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: props.value,
            items: props.data,
            loading: false,
            error: null
        };
    }

    handleChange = event => {
        const {value} = this.state;
        if(event.target.value === 'Not set' || event.target.value === value) {
            this.setState({ value: event.target.value});
        }
        else {
            this.changePool(event.target.value);
        }
    };

    changePool = (value) => {
        const {patchEditChannel, updateChannel, ids} = this.props;
        const {items} = this.state;
        let obj = {
            destination: value
        };
        this.setState({loading: true});
        patchEditChannel(ids[0], ids[1], obj).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200) {
                let obj2 = {
                    id: ids[1],
                    url: res.payload.data.watcher_url
                };
                updateChannel(obj2);
                this.setState({ value: value, loading: false});
                if(items[0] === 'Not set') {
                    let arr = items;
                    arr.splice(0,1);
                    this.setState({items: arr});
                }
            }
            else {
                this.setState({error: res.error.response.data, loading: false});
            }
        })
    };

    render(){
        const {auto_switch} = this.props;
        const {value, items, loading, error} = this.state;
        return (
            <div className={loading ? "flex-center destination_load" : "channel_select_destination"}>
                {loading ?
                    <CircularProgress size={20} thickness={3} />
                    :
                    error === null ?
                        <TooltipMessage delay={auto_switch ? 0 : 1000} text={auto_switch ? 'Turn off auto switching to manually switch the pool' : value}>
                            <div className="destination_select_wrapper">
                                <Select
                                    value={value}
                                    onChange={this.handleChange}
                                    IconComponent={KeyboardArrowDownIcon}
                                    MenuProps={{
                                        classes: {
                                            paper: 'select_paper_destination',
                                        }
                                    }}
                                    classes={{
                                        disabled: 'destination_select_disabled'
                                    }}
                                    disabled={auto_switch}
                                >
                                    {items.map((el, i)=>(
                                        <MenuItem value={el} key={i}>{el}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </TooltipMessage>
                        :
                        <p className="destination_error_wrapper">
                            <TooltipMessage error text={error.destination ? error.destination : 'Change destination failed.'}>
                                <img src={ErrorIcon} alt="error"/>
                            </TooltipMessage>
                        </p>
                }
            </div>
        );
    }
}

DestinationChange.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        //name: state.name,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchEditChannel,
        updateChannel
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DestinationChange);