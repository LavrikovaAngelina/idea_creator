import "./AddProfile.css";
import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, Upload, Row, Col} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getHandle, postProfile } from '../../../commonQueries';

const { TabPane } = Tabs;

const AddProfileForm = ({ visible, onClose }) => {
    const [formIndividual] = Form.useForm();
    const [formLLC] = Form.useForm();
    const [formIP] = Form.useForm();
    const [formSelfEmployed] = Form.useForm();
    const [profileKey, setProfileKey] = useState('Individual');

    const profileSourceForms = {
        "Individual": formIndividual,
        "LLC": formLLC,
        "IP": formIP,
        "SelfEmployed": formSelfEmployed,
    };

    const individualFields = (
    <>
    <Row gutter={[1, 1]} justify={"space-between"} style={{marginBottom: "none"}}>
        <Col>
        <Form.Item
            name="name"
            label="Имя"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
        >
            <Input className='role-input'/>
        </Form.Item>
        </Col>
        <Col>
        <Form.Item
            name="patronymic"
            label="Отчество"
            rules={[
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
        >
            <Input className='role-input'/>
        </Form.Item>
        </Col>
    </Row>
    <Row gutter={[1, 1]} justify={"space-between"} style={{marginBottom: "none"}}>
        <Col>
        <Form.Item
            name="surname"
            label="Фамилия"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
        >
            <Input className='role-input'/>
        </Form.Item>
        </Col>
        <Col>
        <Form.Item
            name="phoneNumber"
            label="Номер телефона"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^\+7\d{10}$/, message: 'Введите в формате +7XXXXXXXXXX (11 цифр)' },
            ]}
        >
            <Input className='role-input'/>
        </Form.Item>
        </Col>
    </Row>
    </>
    );

    const legalFields = (
    <>
        <Row gutter={[1, 1]} justify={"space-between"} style={{marginBottom: "none"}}>
            <Form.Item
            name="legalFirstName"
            label="Имя"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>

            <Form.Item
            name="position"
            label="Должность"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { max: 100, message: 'Должность не должна превышать 100 символов' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>
        </Row>
        <Row gutter={[1, 1]} justify={"space-between"} style={{marginBottom: "none"}}>
            <Form.Item
            name="legalLastName"
            label="Фамилия"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>

            <Form.Item
            name="orgName"
            label="Название организации c правовой формой"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { max: 150, message: 'Название организации не должно превышать 150 символов' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>
        </Row>
        <Row gutter={[1, 1]} justify={"space-between"} style={{marginBottom: "none"}}>
            <Form.Item
            name="legalMiddleName"
            label="Отчество"
            rules={[
                { pattern: /^[А-Яа-яёЁa-zA-Z\-]+$/, message: 'Допустимы только буквы и дефис' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>

            <Form.Item
            name="legalPhoneNumber"
            label="Номер телефона"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^\+7\d{10}$/, message: 'Введите в формате +7XXXXXXXXXX (11 цифр)' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>

            <Form.Item
            name="legalInn"
            label="ИНН"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^\d{10}$/, message: 'ИНН должен содержать 10 цифр' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>
            <Form.Item
            name="ogrn"
            label="ОГРН"
            rules={[
                { required: true, message: 'Поле является обязательным' },
                { pattern: /^\d{13}$/, message: 'ОГРН должен содержать 13 цифр' },
            ]}
            >
            <Input className='role-input'/>
            </Form.Item>
        </Row>
    </>
    );

    const handleOk = async () => {
        try {

        const abortCtrl = new AbortController();
        const fetch_opts = { signal: abortCtrl.signal, mode: 'cors' };

        const handle = await getHandle(fetch_opts);

        const profileData = await profileSourceForms[profileKey].validateFields();
        const profile = await postProfile(handle, profileKey, profileData, fetch_opts);

        onClose(null, profile);

        return () => abortCtrl.abort();
        } catch (error) {
        console.error(error);
        }
    };

    return (
    <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        className="role-form-container"
    >
        <h2>Добавление профиля</h2>
            <>
            <Tabs activeKey={profileKey} onChange={setProfileKey} className="role-form" centered={false} >
                {/* TODO: extrude into separate component shared with add role */}
                <TabPane tab={<Button className="tab-button">Физ лицо</Button>} key="Individual">
                <Form form={formIndividual} layout="vertical">
                {individualFields}
                </Form>
                </TabPane>
                <TabPane tab={<Button className="tab-button">Юр лицо</Button>} key="LLC">
                <Form form={formLLC} layout="vertical">
                {legalFields}
                </Form>
                </TabPane>
                <TabPane tab={<Button className="tab-button">ИП</Button>} key="IP">
                <Form form={formIP} layout="vertical">
                {legalFields}
                </Form>
                </TabPane>
                <TabPane tab={<Button className="tab-button">Самозанятый</Button>} key="SelfEmployed">
                <Form form={formSelfEmployed} layout="vertical">
                {legalFields}
                </Form>
                </TabPane>
            </Tabs>
            </>

            <Button onClick={handleOk}>
            Добавить
            </Button>
    </Modal>
    );
};

export { AddProfileForm };
