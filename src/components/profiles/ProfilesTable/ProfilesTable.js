import React, { useEffect, useState } from 'react';
import { Table, ConfigProvider, Avatar } from "antd";
import "./ProfilesTable.css";
import blank_photo from "../../../resources/account-menu-icon.svg";
import { getHandle, getProfiles } from '../../../commonQueries.js';

import { AddProfileForm } from "../AddProfile/AddProfile.js";

import { Button } from 'antd';

const columns = [
{
    title: 'Юридическая форма',
    dataIndex: 'profileType',
    key: 'form',
    render: (text, record) => {
        if (record.profileType == "INDIVIDUAL") {
            return <p>Физическое лицо</p>;
        } else {
            if (record.legalKind == "INDIVIDUAL") {
                return <p>ИП</p>;
            } else if (record.legalKind == "LLC") {
                return <p>Юридическое лицо</p>;
            } else if (record.legalKind == "SELF_EMPLOYED") {
                return <p>Самозанятый</p>;
            } else {
                return <p>Не определено</p>;
            }
        }
    }
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
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
}];

const ProfilesTable = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        const abortCtrl = new AbortController();
        const fetch_opts = { signal: abortCtrl.signal, mode: 'cors' };
        const handle = getHandle(fetch_opts)
        getProfiles(handle, fetch_opts).then((res) => {
            var tableData = null;
            if (res) {
                tableData = res.map((x, index) => { x.key = index.toString(); return x; });
            } else {
                tableData = [];
            }
            setData(tableData);
        }).catch((error) => console.log(error.message));
        return () => abortCtrl.abort();
    }, []);

    const [isAddProfileFormVisible, setAddProfileFormVisible] = useState(false);

    const openAddProfileForm = () => {
        setAddProfileFormVisible(true);
    };

    const closeAddProfileForm = (_, newProfile=null) => {
        setAddProfileFormVisible(false);
        if (newProfile) {
            newProfile.key = data.length;
            setData(data.concat(newProfile));
        }
    };

    return (
        <div className='profiles-container'>
            <h1>Мои профили</h1>
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
                      <Button type="primary" onClick={openAddProfileForm} style={{ margin: '20px 20px 20px 20px' }}>
                          Добавить профиль
                      </Button>
                    }
                    size="middle"
                    pagination={false}
                />
            </ConfigProvider>
            <AddProfileForm visible={isAddProfileFormVisible} onClose={closeAddProfileForm} />
        </div>
    );
};

export default ProfilesTable;

const mocked = [
    {
        key: '1',
        profileType: "INDIVIDUAL",
        name: "Andrey",
        surname: "Khorokhorin",
        patronymic: "Sergeevich"
    },
    {
        key: '2',
        profileType: "LEGAL",
        orgName: "Квадроберы РФ",
        inn: "123456789",
        legalKind: "LLC"
    }
];
