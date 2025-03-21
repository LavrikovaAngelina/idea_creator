import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./EmailConfirmation.css";
import { queryWithJWT } from '../../../jwtQueries.js';
import main_image from "../../../resources/main-image.png";

const DELAY = 2000;

const EmailConfirmation = () => {
    const navigate = useNavigate();

    const checkAccess = async () => {
        await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/users/me", {
            method: 'GET',
            mode: 'cors',
        }).then((response) => {
                if (response.status == 200) {
                    navigate("/");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };


    useEffect(() => {
        const timer = setInterval(checkAccess, DELAY);
        return () => clearInterval(timer);
    }, []);

    const handleClick = () =>{
        navigate('/sign-in');
    }

    return (
        <div className='email-confirmation-container'>
            <div className="image-container">
                <img src={main_image} />
            </div>
            <div className='form-container'>
                <div className='confirmation-message-container-large'>
                    <h2>Спасибо за регистрацию!</h2>
                    <p>Вам было отправлено письмо на почту, проверьте её и перейдите по ссылке из письма для завершения регистрации.
                    После подтвержения почты вы будете автоматически перенаправлены в личный кабинет в текущей вкладке.</p>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
