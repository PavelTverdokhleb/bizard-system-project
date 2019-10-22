import React from 'react';
import {Link} from 'react-router-dom';
import './BreadCrumbs.scss';

const BreadCrumbs = ({items = []}) => {
    return (
        <div className="bread_crumbs">
            {items.map((el, i)=>{
                if(el.url === null) return <span key={i}>{el.name}</span>
                return (
                    <div key={i} className="bread_crumbs_item">
                        <Link to={`${el.url}`}>{el.name}</Link>
                        <span>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BreadCrumbs;