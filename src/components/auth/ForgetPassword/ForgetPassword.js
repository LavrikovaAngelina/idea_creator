import React, { useState } from 'react';
import "./ForgetPassword.css";
import {Input, Button, message} from 'antd';
import main_image from "../../../resources/main-image.png";
import { useNavigate } from 'react-router-dom';

import go_back from "../../../resources/go-back.svg";

const ForgetPasswordForm = () =>{

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setEmailError(true);
        }
        else{
            setEmailError(false);
        }
    };

    const handleGoBack = () => {
        navigate('/sign-in');
    }

    const handleClick = (e) =>{
        e.preventDefault();
        if (!emailError) {
            forgetPasswordQuery();
        }
        else{
            message.error("Поле email введено неправильно.");
        }
    }

    const forgetPasswordQuery = async () =>{
        await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/auth/request-password-change", {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email }),
        })
            .then((response) => {
                if (response.status === 200) {
                    message.success("Ссылка для смены пароля отправлена на вашу почту!");
                    navigate('/sign-in');
                } else if (response.status === 400) {
                    message.error("Поле email обязательно для заполнения.");
                } else if (response.status === 404) {
                    message.error("Пользователь не найден.");
                } else if (response.status === 406) {
                    message.error("Для данного пользователя не привязана почта.");
                } else {
                    message.error("Произошла ошибка. Попробуйте снова.");
                }
            })
            .catch((err) => {
                message.error("Произошла ошибка. Попробуйте позже.");
                console.error(err.message);
            });
    }


    return (
        <div className='forget-password-container'>
            <div className="image-container">
                <img src={main_image} />
            </div>
        <div className="form-container" style={{position:'relative'}}>
                <div style={{position:'absolute',top:'15px',left:'15px'}}>
                    <Button className='go-back-button-upper' onClick={handleGoBack} type="text" icon={<img src={go_back}/>}>Назад</Button>
                </div>
            <div className="forget-password-form">
                <div>
                    <Button className='go-back-button-next-to' onClick={handleGoBack} type="text" icon={<img src={go_back}/>}>Назад</Button>
                </div>
                <h2>Забыли пароль?</h2>

                <p className='text'>Введите ваш e-mail, указанный при регистрации. Мы пришлём ссылку с информацией о восстановлении доступа.</p>

                <Input 
                className='forget-password-input'
                value = {email}
                placeholder="Email" 
                status = {emailError ? "error":""}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                />

                <button type="submit" className='forget-password-form-button' onClick={handleClick}>Восстановить</button>

            </div>
            </div>
            </div>
    )
}

export default ForgetPasswordForm;
