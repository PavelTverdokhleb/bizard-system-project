import React from 'react';
import AuthButton from '../../../Buttons/AuthButton/AuthButton';

const CompleteRecovery = () => {
    return (
        <div className="form_container">
            <div className="auth-caption">
                <h2>Password recovery</h2>
                <h3>Your new password has been set successfully. Now you can sign in</h3>
            </div>
            <AuthButton link>
                Sign in
            </AuthButton>
        </div>
    );
};

export default CompleteRecovery;