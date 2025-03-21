import React, { useState } from 'react';
import "./SignInForm.css";
import {Input, Row, Col, Button, Checkbox, message} from 'antd';
import main_image from "../../../resources/main-image.png";
import visible_password from "../../../resources/visible-password.svg";
import invisible_password from "../../../resources/invisible-password.svg";
import { Link, useNavigate } from 'react-router-dom';
import { queryGetsJWT } from '../../../jwtQueries';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const SignInForm = () =>{
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    const handleClick = () => {
        navigate('/sign-up');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        queryGetsJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/auth/sign-in", {
            method: "POST",
            mode: "cors",
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                handle: username,
                hashedPass: Base64.stringify(sha256(password + process.env.REACT_APP_SALT)),
            })
        }).then(async (response) => {
            if (response.status === 200) {
                // console.log(document.cookie)
                navigate('/');
            } else if (response.status == 403) {
                message.error("Неверный логин/пароль или логин не зарегистрирован");
            } else if (response.status == 429) {
                message.error("Лимит попыток авторизации исчерпан. Попробуйте позже");
            } else {
                message.error("Неизвестная ошибка");
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
    };

    return (
        <div className='sign-in-container'>
            <div className="image-container">
                <img src={main_image} />
            </div>
        <div className="form-container">
            <div className="sign-in-form">
                <h2>Вход</h2>

                <Input
                    className='sign-in-input'
                    value={username}
                    style={{borderColor:'transparent', boxShadow: "0px 0px 0px transparent"}}
                    placeholder="Логин" 
                    onChange={handleUsernameChange}
                />


                <Input.Password
                    className='sign-in-input'
                    value = {password}
                    style={{borderColor:'transparent', boxShadow: "0px 0px 0px transparent"}}
                    placeholder="Пароль"
                    onChange={handlePasswordChange}
                    iconRender={(visible) =>
                        visible ? <img src={invisible_password}/> :<img src={visible_password} />
                    }
                />
                <Checkbox className='sign-in-checkbox' onChange={onChange}>Запомнить меня</Checkbox>

                <Link to="/auth/request-password-change" style={{marginBottom: '30px'}}>Забыли пароль или логин?</Link>
                <Row>
                    <Col md='1' xd ='2' style={{marginRight:'20px'}}>
                    <button className='sign-in-form-button' onClick={handleSubmit} >Войти</button>
                    </Col>
                    <Col md='1' xd='2'> 
                    <Button className='sign-in-form-button sign-in-form-button-outlined' onClick={handleClick}>
                        Зарегистрироваться
                    </Button >
                    </Col>
                </Row>

            </div>
            </div>
            </div>
    )
}

export default SignInForm;
