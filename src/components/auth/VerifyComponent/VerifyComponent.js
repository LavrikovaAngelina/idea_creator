import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import "./VerifyComponent.css";
import main_image from "../../../resources/main-image.png";


const VerifyComponent = () => {
    const [searchParams] = useSearchParams();
    const sendQuery = async () => {
        const params = new URLSearchParams({
            email: searchParams.get('email'),
            handle: searchParams.get('handle'),
            timestamp: searchParams.get('timestamp'),
            sign: searchParams.get('sign')
        }).toString();
        await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/auth/email-verify?" + params, {
            mode: 'cors',
        })
            .then((response) => {
                if (response.status === 201) {

                } else {
                    console.log(response.status);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        sendQuery();
    }, []);

    return (
        <div className='verify-container'>
            <div className="image-container">
                <img src={main_image} />
            </div>
            <div className='form-container'>
                <div className='message-container-large'>
                    <h2>Почта успешно подтверждена</h2>
                    <p>Теперь эту вкладку можно закрыть.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyComponent;
