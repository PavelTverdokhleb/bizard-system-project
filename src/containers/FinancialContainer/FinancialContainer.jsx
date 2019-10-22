import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import Transactions from '../../components/FinancialStatistics/Transactions/Transactions';
import Billing from '../../components/FinancialStatistics/Billing/Billing';
import NoMatch from "../NoMatch/NoMatch";

import {financial_statistics} from "../../helpers/navigation-items";

class FinancialContainer extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
    }

    render(){
        return (
            <div className="financial_statistics_page">
                <div className="page_header">
                    <h2>Financial Statistics</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.baseUrl}
                        items={financial_statistics}
                    />
                    <div className="financial_statistics_page_wrapper">
                        <Switch>
                            <Route path={`${this.baseUrl}`} exact render={()=>(<Redirect to={`${this.baseUrl}transactions`} push/>)}/>
                            <Route path={`${this.baseUrl}transactions`} exact component={Transactions}/>
                            <Route path={`${this.baseUrl}billing`} exact component={Billing}/>
                            <Route component={NoMatch}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default (FinancialContainer);