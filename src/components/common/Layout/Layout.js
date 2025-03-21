import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Menu, Button, Divider } from 'antd';
import { UserOutlined, TeamOutlined, GlobalOutlined, SearchOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
import { getHandle } from '../../../commonQueries.js';

import "./Layout.css";
import logo from "../../../resources/logo.png";
import projects_icon from "../../../resources/projects-icon.svg";
import account_menu_icon from "../../../resources/account-menu-icon.svg";
import news_icon from "../../../resources/news-icon.svg";
import my_projects_icon from "../../../resources/my-projects-icon.svg";
import logout from "../../../resources/logout.svg";
import { deleteAllJWT } from '../../../jwtQueries.js';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {

    const navigate = useNavigate();
    const navigateProfiles = () => {
        navigate('/profiles');
    };
    const navigateRoles = () => {
        navigate('/roles');
    };
    const navigateProjects = () => {
        navigate('/projects');
    };

    const items1 = [
        {
            key: "logo", label: <img
                src={logo}
                alt="Логотип"
                style={{ width: '50px', height: 'auto' }}
            />, className: 'header-column-element'
        },
        { key: "news", label: <Button className="header-button" type="text" icon={<img src={news_icon} />}>Новости</Button>, className: 'header-column-element' },
    ];
    const buttons = [
        { key: "my_projects", label: <Button className="header-button" type="default" icon={<img src={my_projects_icon} />}>мои проекты</Button>, className: 'header-column-element' },
    ];

    const [handle, setHandle] = useState('loading');
    const [items2, setItems2] = useState(buttons.concat({ key: "account_menu", label: <Button className="header-button" type="default" icon={<img src={account_menu_icon} />}>{handle}</Button>, className: 'header-column-element' }
    ));
    const logOut = () => {
        deleteAllJWT();
        navigate('/sign-in');
    }
    const logOutButton = { key: "log_out", label: <Button className="header-button" icon={<img src={logout} onClick={logOut} />} />, className: 'header-column-element' }

    useEffect(() => {
        const abortCtrl = new AbortController();
        async function fetchData(ctrl) {
            const fetch_opts = { signal: ctrl.signal, mode: 'cors' };
            try {
                var res = await getHandle(fetch_opts);
                if (res && (handle != res)) {
                    setHandle(res);
                    setItems2(buttons.concat([{ key: "account_menu", label: <Button className="header-button" type="default" icon={<img src={account_menu_icon} />}>{res}</Button>, className: 'header-column-element' },
                        logOutButton]));
                } else if (!res) {
                    navigate('/sign-in');
                }
            } catch (err) { }
        }
        fetchData(abortCtrl);
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className='header' style={{ display: "flex" }}>
                <Menu
                    mode="horizontal"
                    items={items1}
                    style={{ flex: 2500, minWidth: 0, justifyContent: 'flex-start' }}
                />
                <Menu
                    mode="horizontal"
                    items={items2}
                    style={{ flex: 1247, minWidth: 0, justifyContent: "flex-end" }}
                />
            </Header>

            <Divider className='divider' />

            <Content className='content'>
                {children}
            </Content>

            <Divider className='divider' />

            <Footer className="footer">
                <Row gutter={[16, 16]} justify="space-between" align="top">
                    <Col xs={24} sm={24} md={6}>
                        <div className='logo-and-contacts'>
                            <img
                                src={logo}
                                alt="Логотип"
                                style={{ width: '103px', height: 'auto', marginBottom: '16px' }}
                            />
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={18}>
                        <Row gutter={[16, 16]} justify="end" >
                            <Col xs={24} sm={8} md={7}>
                                <div className='footer-column'>
                                    <h4>О платформе</h4>
                                    <p><a href="/blank">Пользовательское соглашение</a></p>
                                    <p><a href="/blank">Политика конфиденциальности</a></p>
                                    <p><a href="/blank">Контакты</a></p>
                                </div>
                            </Col>

                            <Col xs={24} sm={6} md={5}>
                                <div className='footer-column'>
                                    <h4>Помощь</h4>
                                    <p><a href="/blank">Вопрос - Ответ</a></p>
                                    <p><a href="/blank">Служба поддержки</a></p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className='footer-column-copyright'>
                    <p>2025 © IdeaCreator</p>
                </div>
            </Footer>
        </Layout>
    );
};

export { AppLayout };
