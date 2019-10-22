import React, {Component} from 'react';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import DialogComponent from '../../HelpersBlocks/DialogComponent/DialogComponent';
import RenderField from "../../HelpersBlocks/RenderField/RenderField";
import ActionButton from "../../Buttons/ActionButton/ActionButton";
import Loader from '../../Loader/Loader';
import {required, integerNumber, minAmount} from "../../../helpers/validation";
import {balanceTopUp} from "../../../helpers/normalize";

import ExitDialog from '../../../../assets/img/exit.png';
import AddIcon from '@material-ui/icons/Add';

import './BalanceTopUp.scss';

class BalanceTopUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            disabled: false,
            open: props.dialog || false
        };
    }

    SubmitForm=(data)=>{
        this.setState({loading: true});
        setTimeout(()=>{this.setState({loading: false})}, 3000);
    };

    openDialog = () => {
        const {reset} = this.props;
        reset();
        this.setState({open: true});
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    render(){
        const {submitting, pristine, dialog, user, amountf_field, valid } = this.props;
        const {open, loading} = this.state;
        let currentDomain = window.location.host;
        return (
            <div className="page_add_btn">
                {!dialog ?
                    <Button variant="outlined" onClick={this.openDialog}>
                        <AddIcon/>
                        top up
                    </Button>
                    :
                    null
                }
                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <div className="balance-dialog">
                        <form action="https://www.coinpayments.net/index.php" method="post">
                            <input type="hidden" name="cmd" value="_pay"/>
                            <input type="hidden" name="reset" value="1"/>
                            <input type="hidden" name="merchant" value="86100783eb18adccddced92557c69706"/>
                            <input type="hidden" name="item_name" value="Balance replenishment"/>
                            <input type="hidden" name="item_number" value={user.pk}/>
                            <input type="hidden" name="currency" value="USD"/>
                            <input type="hidden" value={amountf_field === undefined ? '' : amountf_field} name="amountf" placeholder="Amount ($)"/>
                            <input type="hidden" name="success_url" value={currentDomain}/>
                            <input type="hidden" name="cancel_url" value={currentDomain}/>
                            <input type="hidden" name="want_shipping" value="0"/>
                            <h3 className="balance-dialog-title">Balance Topup</h3>
                            <Field
                                name="amount"
                                type="text"
                                classes="edit_input full_width_text_field"
                                component={RenderField}
                                validate={[required, integerNumber, minAmount(1)]}
                                normalize={balanceTopUp}
                                label="Amount ($)"
                            />
                            <div className="flex-center btn_wrapper_wide">
                                {!loading ?
                                    <ActionButton
                                        text="CONFIRM"
                                        class="save"
                                        type="button"
                                        disabled={submitting || pristine || !valid}
                                        full
                                        formAction
                                    />
                                    :
                                    <Loader class="btn"/>
                                }
                            </div>
                            <div className="balance-dialog-description">The amount must be a whole number, <br/> the minimum amount is 1 dollar</div>
                        </form>
                        <div className="exit-dialog" onClick={this.closeDialog}>
                            <img src={ExitDialog} alt="exit"/>
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

const afterSubmit = (result, dispatch) => dispatch(reset('BalanceTopUp'));

const selector = formValueSelector('BalanceTopUp');

BalanceTopUp = reduxForm({
    form: 'BalanceTopUp',
    enableReinitialize: true,
    onSubmitSuccess: afterSubmit
})(BalanceTopUp);

function mapStateToProps(state, props) {
    return{
        amountf_field: selector(state, 'amount')
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        //login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceTopUp);