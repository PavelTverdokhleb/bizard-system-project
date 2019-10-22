import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionButton from '../../../Buttons/ActionButton/ActionButton';
import VerifyPool from '../VerifyPool/VerifyPool';
import VerifyFailed from '../VerifyPool/VerifyFailed/VerifyFailed';
import VerifySuccess from '../VerifyPool/VerifySuccess/VerifySuccess';
import DialogComponent from '../../../HelpersBlocks/DialogComponent/DialogComponent';

class VerifyPoolComponent extends Component {
    state = {
        open: false
    };

    openDialog = () => {
        this.setState({open: true});
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    render(){
        const {data, algorithm} = this.props;
        const {open} = this.state;
        return (
            <div>
                <button className="underline_btn_table" onClick={this.openDialog}>Verify</button>
                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <VerifyPool
                        closeAction={this.closeDialog}
                        data={data}
                        algorithm={algorithm}
                    />
                </DialogComponent>
            </div>
        );
    }
}

VerifyPoolComponent.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state, props) {
    return{
        //name: state.name
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        //login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPoolComponent);