import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./RegistrationForm.css";
import Notification from '../Notification/Notification.js';
import {Input, message} from 'antd';
import main_image from "../../../resources/main-image.png";
import visible_password from "../../../resources/visible-password.svg";
import invisible_password from "../../../resources/invisible-password.svg";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { queryGetsJWT } from '../../../jwtQueries.js';


const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notifications, setNotifications] = useState([]);

    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^([a-z0-9_]{5,63})$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password) => {
        const allowedSymbolsRegex = /^([A-Za-z\d_]{8,})$/;
        return (
            allowedSymbolsRegex.test(password)
        );
    };

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
        if (validateUsername(newUsername)) {
            setUsernameError(false);
        }
    };

    const handleUsernameBlur = () => {
        if (!validateUsername(username)) {
            setUsernameError(true);
        }
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (validateEmail(newEmail)) {
            setEmailError(false);
        }
    };

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setEmailError(true);
        }
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

    const closeNotification = (index) => {
        setNotifications((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        let isValid = true;

        if (!validateUsername(username)) {
            setUsernameError(true);
            message.error("Имя пользователя может состоять только из строчных латинских букв, цифр и подчеркиваний.");
            isValid = false;
        }

        if (!validateEmail(email)) {
            setEmailError(true);
            message.error("Поле email введено неправильно.");
            isValid = false;
        }

        if (!validatePassword(password)) {
            setPasswordError(true);
            message.error("Пароль должен быть не менее 8 символов в длину и обязательно состоять из строчных и прописных латинских букв, символов подчеркивания и цифр.");
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            message.error("Введенные пароли не совпадают.");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            registrationQuery();
        }
    };

    const registrationQuery = async () => {
        await queryGetsJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/auth/sign-up", {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                email: email,
                handle: username,
                hashedPass: Base64.stringify(sha256(password + process.env.REACT_APP_SALT)),
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate("/email-confirmation");
                } else if (response.status === 400) {
                    message.error("Неверная почта/ошибка отправки письма.");
                } else if (response.status === 406) {
                    message.error("Для данного имени пользователя или email уже существует аккаунт.");
                } else {
                    message.error("Сервер прислал некорректный ответ.");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <div className='registration-container'>
        <div className="image-container">
            <img src={main_image} />
        </div>
        <div className="form-container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Регистрация</h2>

            <Input
                className='sign-up-input'
                value={username}
                placeholder="Логин" 
                status = {usernameError? "error":""}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
            />
            

            <Input 
                className='sign-up-input'
                value = {email}
                placeholder="Email" 
                status = {emailError ? "error":""}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
            />

            <Input.Password
                className='sign-up-input'
                value = {password}
                placeholder="Пароль" 
                status = {passwordError ? "error":""}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                iconRender={(visible) =>
                    visible ? <img src={invisible_password}/> :<img src={visible_password} />
                }
            />
            
            <Input.Password
                className='sign-up-input'
                value = {confirmPassword}
                placeholder="Повторите пароль" 
                status = {confirmPasswordError ? "error":""}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                iconRender={(visible) =>
                    visible ? <img src={invisible_password}/> :<img src={visible_password} />
                }
            />


            <p className='text'>Нажимая кнопку «Зарегистрироваться», я соглашаюсь с Пользовательским соглашением ООО и даю согласие на обработку персональных данных на условиях, определенный
            «Политикой конфиденциальности» и получение писем от WWW (отписаться можно в любой момент)</p>

                <button type="submit">Зарегистрироваться</button>
            </form>

            <div className="notifications-container">
                {notifications.map((message, index) => (
                    <Notification key={index} message={message} onClose={() => closeNotification(index)} />
                ))}
            </div>
        </div>
        </div>
    );
};

export default RegistrationForm;
