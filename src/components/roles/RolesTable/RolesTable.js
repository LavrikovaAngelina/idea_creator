import React, { useEffect, useState } from 'react';
import { Table, ConfigProvider, Tag, Avatar } from "antd";
import "./RolesTable.css";
import blank_photo from "../../../resources/account-menu-icon.svg";
import { queryWithJWT } from '../../../jwtQueries.js';
import { getHandle } from '../../../commonQueries.js';

import { AddRoleForm } from "../AddRole/AddRole.js";

import { Button } from 'antd';

const columns = [{
    title: 'Фото',
    dataIndex: 'avatarUrl',
    key: 'avatar',
    render: (avatarUrl) => (
        <Avatar
            src={avatarUrl || blank_photo}
            size={40}
            alt="Profile Photo"
        />
    ),
},
    {
        title: 'ФИО или Название ООО',
        dataIndex: 'profileType',
        key: 'name',
        render: (text, record) => {
            if (record.profileType == "INDIVIDUAL") {
                return <p>{record.surname + " " + record.name + " " + record.patronymic}</p>;
            } else {
                return <p>{record.orgName}</p>;
            }
        }
    },
    {
        title: 'Специальность',
        dataIndex: 'profileType',
        key: 'spec',
        render: (text, record) => {
            if (record.speciality == "PROGRAMMER") {
                return <p>Программист</p>;
            } else if (record.speciality == "DESIGNER") {
                return <p>Дизайнер</p>;
            } else if (record.speciality == "ENGINEER") {
                return <p>Инженер</p>;
            }
        }
    },
    {
        title: 'Статус профиля',
        dataIndex: 'profileType',
        key: 'state',
        render: (text, record) => {
            if (record.state == "ACTIVE") {
                return <Tag className="status" color="#B9E1C5">Активный</Tag>;
            } else {
                return <Tag className="status" color="#E1B9B9">Не активный</Tag>;
            }
        }
    },
    {
        title: '',
        dataIndex: 'profileType',
        key: 'changeButton',
        render: (text, record) => <a>Изменить роль</a>
    }];

const RolesTable = () => {
    const [data, setData] = useState();

    const sendQueryEmp = async (handle, fetch_opts) => {
        let response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/users/" + handle + "/employees", fetch_opts);
        if (response.ok) {
            var data = JSON.parse(await response.text());
            return data;
        }
    };

    const sendQueryCust = async (handle, fetch_opts) => {
        let response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/users/" + handle + "/customers", fetch_opts);
        if (response.ok) {
            var data = JSON.parse(await response.text());
            return data;
        }
    };

    useEffect(() => {
        const abortCtrl = new AbortController();
        async function fetchData(ctrl) {
            const fetch_opts = { signal: ctrl.signal, mode: 'cors' };

            const handle = getHandle();
            const res = [sendQueryEmp(handle, fetch_opts), sendQueryCust(handle, fetch_opts)];
            var tableData1 = [];
            var tableData2 = [];
            const [empRes, custRes] = await Promise.all(res);
            if (empRes) {
                tableData1 = empRes.map((x, index) => { x.key = index.toString(); return x; });
            }
            if (custRes) {
                tableData2 = custRes.map((x, index) => { x.key = (index + res.length).toString(); return x; });
            }
            const td = tableData1.concat(tableData2);
            setData(td);
        }

        fetchData(abortCtrl).catch((error) => console.log(error.message));

        return () => abortCtrl.abort();
    }, []);

    const [isAddRoleFormVisible, setAddRoleFormVisible] = useState(false);

    const openAddRoleForm = () => {
        setAddRoleFormVisible(true);
    };

    const closeAddRoleForm = (_, newRole) => {
        setAddRoleFormVisible(false);
        if (newRole) {
            newRole.key = data.length;
            setData(data.concat(newRole));
        }
    };

    return (
        <div className='roles-container'>
            <h1>Мои роли</h1>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            footerBg: "#ffffff",
                            headerBg: "#ffffff",
                            headerBorderRadius: 10,
                            headerColor: "#707A8A",
                            headerSplitColor: "#ffffff",
                            cellPaddingInlineMD: 16,
                        },
                    },
                }}
            >
                <Table
                    dataSource={data}
                    columns={columns}
                    footer={() =>
                      <Button type="primary" onClick={openAddRoleForm} style={{ margin: '20px 20px 20px 20px' }}>
                          Добавить роль
                      </Button>
                    }
                    size="middle"
                    pagination={false}
                />
            </ConfigProvider>
            <AddRoleForm visible={isAddRoleFormVisible} onClose={closeAddRoleForm}/>
        </div>
    );
};

export default RolesTable;
