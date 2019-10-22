import React, {Component} from 'react';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import TableLoader from '../../TableLoader/TableLoader';
import Pagination from '../../Pagination/Pagination';
import {getError} from "../../../helpers/functions";
import moment from 'moment';

import {getFinancialBilling} from "../../../actions/financesActions";

import "./Billing.scss";

class Billing extends Component {
    state = {
        loading: true,
        empty: false,
        activePage: 1
    };

    componentDidMount() {
        const {activePage} = this.state;
        this.doRequest(activePage);
    }

    componentWillMount() {
        this.props.finances.financial_billing = {};
        this.props.finances.billing_error = [];
    }

    doRequest = (page) => {
        const {getFinancialBilling} = this.props;

        let params = [];

        params.push(`page=${page}`);
        params.push(`page_size=20`);

        this.setState({loading: true, empty: false});
        getFinancialBilling(params).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                if(res.payload.data.results.length === 0){
                    this.setState({empty: true});
                }
            }
            else {
                this.setState({loading: false});
            }
        });
    };

    changePage = (pageNumber) => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    render(){
        const {finances:{financial_billing, billing_error}} = this.props;
        const {loading, empty, activePage} = this.state;
        return (
            <div className="billing_page">
                {loading ? <TableLoader/> : null}
                {billing_error.length !== 0 ? <div className="page_error">{getError(billing_error)}</div> : null}
                <div className="info_page_wrapper">
                    <div className="table_container billing_columns">
                        <div className="table_header">
                            <div className="table_row">
                                <p>Date/Time</p>
                                <p>Amount</p>
                                <p>Destination</p>
                            </div>
                        </div>
                        {!empty && financial_billing.results && financial_billing.results.length ?
                            <div className="table_body">
                                {financial_billing.results.map(({amount, date, description}, i) => {
                                    let value = Math.abs(Number(amount)).toFixed(6);
                                    return (
                                        <div className="table_row" key={i}>
                                            <p className="gray_text">{moment(date).format('DD/MM/YYYY  HH:mm')}</p>
                                            <p className={amount >= 0 ? "green_text" : "red_text"}>${Number(value).toString()}</p>
                                            <p className="gray_text">{description}</p>
                                        </div>
                                    )})}
                            </div>
                            :
                            empty ?
                                <div className="table_body">
                                    <div className="table_row">
                                        <p className="table_no_items">No items</p>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {financial_billing.count && financial_billing.count > 20 ?
                            <Pagination
                                current={activePage}
                                pageCount={20}
                                total={financial_billing.count}
                                onChange={this.changePage}
                            />
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Billing.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        finances: state.finances
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFinancialBilling
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Billing);

