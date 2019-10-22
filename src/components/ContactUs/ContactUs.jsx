import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ContactUs.scss';

class ContactUs extends Component {
    getJivoChat=()=>{
        if(window.jvo_init == 'init') return;
        window.jvo_init = 'init';
        var widget_id = 'Ijp8QtKlVB';
        var d=document;
        var w=window;
        function l(){
            var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);}if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);
        }}
    };

    componentWillUnmount() {
        if(window.location.host !== 'localhost:8080') window.jivo_api.close();
    }

    render(){
        return (
            <div className="contact-us-container">
                <div className="header">
                    <div className="flex-beetwen">
                        <Link to="/">
                            <img src="../../../assets/img/logo_light_small.png" alt="header-logo"/>
                        </Link>
                    </div>
                </div>
                <div className="contact-us-block">
                    <div className="half-block contact-background">
                        <div className="contact-wrapper">
                            <div className="captions">
                                <h1 className="main-caption">Get in Touch</h1>
                                <h2 className="sub-caption">If you have any questions, please use the form below to contact us</h2>
                            </div>
                            <div className="centered-blocks">
                                <div className="contact-box message">
                                    <h1>Send us a Message</h1>
                                    <p>Every opinion is important to us!</p>
                                    <a className="leave-message" href="javascript:jivo_api.open();">
                                        <img src="../../../assets/img/chat.png"/>Leave the message
                                    </a>
                                </div>
                                <div className="contact-box contact-info">
                                    <h1>Contact Information</h1>
                                    <div className="contact-item">
                                        <img className="phone-icon" src="../../../assets/img/phone-icon.png"/>
                                        <p>+(4205)392 051 66</p>
                                    </div>
                                    <div className="contact-item">
                                        <a href="mailto:contact@bizard-tunnel.com">
                                            <img src="../../../assets/img/email-icon.png"/>
                                            contact@bizard-tunnel.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {window.location.host !== 'localhost:8080' ? this.getJivoChat() : null}
            </div>
        );
    }
}

export default (ContactUs);