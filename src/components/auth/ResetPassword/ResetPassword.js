import React, { useState, useEffect } from 'react';
import "./ResetPassword.css";
import {Input, message} from 'antd';
import main_image from "../../../resources/main-image.png";
import visible_password from "../../../resources/visible-password.svg";
import invisible_password from "../../../resources/invisible-password.svg";
import { useNavigate, useLocation } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const ResetPasswordForm = () =>{

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [handle, setHandle] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [sign, setSign] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const validatePassword = (password) => {
        const allowedSymbolsRegex = /^([A-Za-z\d_]{8,})$/;
        return (
            allowedSymbolsRegex.test(password)
        );
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (validatePassword(newPassword)) {
            setPasswordError(false);
        }
        if (newPassword === confirmPassword) {
            setConfirmPasswordError(false);
        }
    };

    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setPasswordError(true);
        }
        if (password && password !== confirmPassword) {
            setConfirmPasswordError(true);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (validatePassword(password)) {
            setPasswordError(false);
        }
        if (newConfirmPassword === password) {
            setConfirmPasswordError(false);
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (password && confirmPassword !== password) {
            setConfirmPasswordError(true);
        }
    };

    const handleClick = (e) =>{
        if (confirmPasswordError) {
            message.error('Пароли не совпадают.');
        }
        if (passwordError){
            message.error('Пароль не соответствует требованиям.')
        }
        if (!passwordError && !confirmPasswordError){
            resetPasswordQuery();
        }
    }

    const resetPasswordQuery = async () => {
            await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/approve-password-change?` +
                new URLSearchParams({
                    handle,
                    timestamp,
                    sign,
                    newPassHash: (Base64.stringify(sha256(password + process.env.REACT_APP_SALT))),
                }),
                { method: 'GET',
                mode: 'cors' }
            ).then((response) => {
                if (response.status === 200) {
                    message.success("Пароль успешно изменён!");
                    navigate('/sign-in');
                } else if (response.status === 406) {
                    message.error("Проверка безопасности не пройдена.");
                } else if (response.status === 410) {
                    message.error("Ссылка устарела.");
                } else {
                    message.error("Произошла ошибка. Попробуйте снова.");
                }
            })
            .catch((err) => {
                message.error("Произошла ошибка. Попробуйте позже.");
                console.error(err.message);
            });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        setHandle(queryParams.get('handle'));
        setTimestamp(queryParams.get('timestamp'));
        setSign(queryParams.get('sign'));
    }, [location]);


    return (
        <div className='reset-password-container'>
            <div className="image-container">
                <img src={main_image} />
            </div>
        <div className="form-container">
            <div className="reset-password-form">
                <h2>Придумайте новый пароль</h2>

                <p className='text'>Пароль должен быть не менее 8 символов в длину и обязательно состоять из строчных и прописных латинских букв, символов подчеркивания и цифр</p>


                <Input.Password
                    className='reset-password-input'
                    value = {password}
                    status = {passwordError ? "error":""}
                    placeholder="Введите новый пароль"
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    iconRender={(visible) =>
                        visible ? <img src={invisible_password}/> :<img src={visible_password} />
                    }
                />


                <Input.Password
                    className='reset-password-input'
                    value = {confirmPassword}
                    status = {confirmPasswordError ? "error":""}
                    placeholder="Повторите пароль"
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    iconRender={(visible) =>
                        visible ? <img src={invisible_password}/> :<img src={visible_password} />
                    }
                />

                <button type="submit" className='reset-password-form-button' onClick={handleClick}>Сохранить</button>

            </div>
            </div>
            </div>
    )
}

export default ResetPasswordForm;
