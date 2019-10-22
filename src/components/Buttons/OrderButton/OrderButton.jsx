import React from 'react';
import ArrowIcon from '@material-ui/icons/ArrowDropUp';
import './OrderButton.scss';

const OrderButton = ({text, order, sort, field, disabled}) => {
    return (
        <button
            type="button"
            className={
                order === field ?
                    'arrow-down order_btn'
                    :
                    order === `-${field}` ?
                        'arrow-up order_btn'
                        :
                        'order_btn'
            }
            onClick={sort}
            disabled={disabled}
        >
            {text}
            <ArrowIcon/>
        </button>
    );
};

export default OrderButton;