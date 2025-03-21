import "./AddRole.css";
import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Form, Input, Button, Upload, Row, Col, Radio, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getProfiles, getHandle, postProfile, postRole } from '../../../commonQueries.js';
import { queryWithJWT } from '../../../jwtQueries.js';

const { TabPane } = Tabs;
const { Option } = Select;

const AddRoleForm = ({ visible, onClose }) => {
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

    const [formEmployee] = Form.useForm();
    const [formCustomer] = Form.useForm();

    const roleSourceForms = {
        "Employee": formEmployee,
        "Customer": formCustomer,
    };

    const [profiles, setProfiles] = useState();

    useEffect(() => {
        const abortCtrl = new AbortController();
        const fetch_opts = { signal: abortCtrl.signal, mode: 'cors' };
        getProfiles(getHandle(), fetch_opts).then((res) => {
            var tableData = null;
            if (res) {
                tableData = res.map((x, index) => { x.key = index.toString(); return x; });
            } else {
                tableData = [];
            }
            setProfiles(tableData);
        }).catch((error) => console.log(error.message));
        return () => abortCtrl.abort();
    }, []);

    const [roleKey, setroleKey] = useState('Employee');
    const [mode, setMode] = useState('new');
    const [selectedProfile, setSelectedProfile] = useState();


    const [avatar, setAvatar] = useState();

    const avatarUploadProps = {
        beforeUpload: (file) => {
            const isPng = file.type === 'image/png';
            if (!isPng) {
              message.error('Поддерживается только PNG формат изображения');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('Размер изображения не должен превышать 2MB');
            }
            if (isPng && isLt2M) {
                setAvatar(file);
            }
            return false;
        },
        avatar,
    };

    const EmployeeForm = (
        <Form form={formEmployee} layout="vertical">
        <>
        <Form.Item
            name="state"
            label="Статус"
            rules={[{ required: true, message: 'Поле является обязательным' }]}
        >
            <Select className='role-input' placeholder="Выберите статус">
            <Option value="ACTIVE">Активный</Option>
            <Option value="INACTIVE">Неактивный</Option>
            </Select>
        </Form.Item>
        <Form.Item
            name="speciality"
            label="Специальность"
            rules={[{ required: true, message: 'Поле является обязательным' }]}
        >
            <Select className='role-input' placeholder="Выберите специальность">
            <Option value="PROGRAMMER">Программист</Option>
            <Option value="DESIGNER">Дизайнер</Option>
            <Option value="ENGINEER">Инженер</Option>
            </Select>
        </Form.Item>
        </>
        </Form>
    );

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

        const handle = getHandle()
        const profileData = await profileSourceForms[profileKey].validateFields();
        const profile = (mode === 'new')
                          ?  await postProfile(handle, profileKey, profileData, fetch_opts)
                          : profiles.find((p) => p.profileId == selectedProfile);
        if (mode === 'new') {
            setProfiles(profiles.concat(profile))
        }

        const roleData = await roleSourceForms[roleKey].validateFields();
        const role = await postRole(handle, profile, roleKey, roleData, fetch_opts);
        const avatarUrl = await tryUploadAvatar(role);
        if (avatarUrl) {
            role.avatarUrl = avatarUrl;
        }

        onClose(null, role);

        return () => abortCtrl.abort();
        } catch (error) {
        console.error(error);
        }
    };

    const tryUploadAvatar = async (role) => {
        let roleKey;
        let id;
        if (!avatar) return;
        if (Object.hasOwn(role, 'employeeId')) {
            roleKey = 'employees';
            id = role.employeeId;
        } else if (Object.hasOwn(role, 'customerId')) {
            roleKey = 'customers';
            id = role.customerId;
        } else {
            return;
        }
        const formData = new FormData();
        formData.append('image', avatar)
        const res = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + `/${roleKey}/${id}/avatar`, {
            method: 'POST',
            body: formData,
        })
        if (res.ok) {
            var json = JSON.parse(await res.text());
            return json.avatarUrl;
        }
    };

    return (
    <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        className="role-form-container"
    >
        <h2>Добавление роли</h2>

        <Tabs activeKey={roleKey} onChange={setroleKey} className="role-form">
            <TabPane tab={<Button className="tab-button1">Исполнитель</Button>} key="Employee" />
            <TabPane tab={<Button className="tab-button1">Заказчик</Button>} key="Customer" />
        </Tabs>

        <Radio.Group onChange={(e) => {setMode(e.target.value);}} value={mode} style={{ marginBottom: 20 }}>
            <Radio value="new">Создать новый профиль</Radio>
            <Radio value="existing">Привязать к существующему профилю</Radio>
        </Radio.Group>

        {mode === 'new' ? (
            <>
            <Tabs activeKey={profileKey} onChange={setProfileKey} className="role-form" centered={false} >
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
        ) : (
        <Form.Item
            name="existingProfileId"
            label="Выберите существующий профиль"
            rules={[{ required: true, message: 'Поле является обязательным' }]}
        >
            <Select className='role-input' placeholder="Выберите профиль" onChange={setSelectedProfile}>
            {profiles.map(p => (
                /* TODO: into function displayName(profile) */
                <Option value={p.profileId}>{`${p.name} ${p.surname} ${p.patronymic}`}</Option>
            ))}
            </Select>
        </Form.Item>
        )}

        {roleKey === 'Employee' && EmployeeForm}

        <Row>
        <Upload
            {...avatarUploadProps}
            showUploadList={false}
        >
            <Button className="upload-button" icon={<UploadOutlined />}>Загрузить</Button>
        </Upload>
        </Row>

        <Button onClick={handleOk}>
        Добавить
        </Button>

    </Modal>
    );
};

export { AddRoleForm };
