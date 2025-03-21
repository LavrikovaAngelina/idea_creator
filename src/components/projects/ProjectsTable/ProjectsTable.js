import React from 'react';
import { Table, ConfigProvider, Space, Tag, Button } from "antd";
import { greenColor, yellowColor, redColor, greyColor } from '../colors.js';
import { EllipsisOutlined } from '@ant-design/icons';
import "./ProjectsTable.css";


const columns = [{
    title: 'Название',
    dataIndex: 'title',
    key: 'name',
    width: '45%',
    render: (text, record) => {
        return <>
        <h6>{record.name}</h6>
        <Space size="middle">
            <p className='projects-label'>{"№" + record.id}</p>
            <p className='projects-label'>Категория</p>
        </Space>
        </>;
    }
},
{
    title: 'Бюджет',
    dataIndex: 'budget',
    key: 'budget',
    render: (text, record) => (<p>{(record.budget || '?') + " р."}</p>)
},
{
    title: 'Срок реализации',
    dataIndex: 'deadline',
    key: 'deadline',
    render: (text, record) => (record.deadline || 'неизвестно')
},
{
    title: 'Слоты',
    dataIndex: 'jobsCount',
    key: 'slots',
    render: (text, record) => {
        var slots = "" + record.employeeCount + "/" + record.jobsCount;
        var slotsColor = greyColor;
        if (record.employeeCount == 0) {
            slotsColor = greyColor;
        } else if (record.employeeCount * 2 < record.jobsCount) {
            slotsColor = redColor;
        } else if (record.employeeCount == record.jobsCount) {
            slotsColor = greenColor;
        } else {
            slotsColor = yellowColor;
        }
        return <Tag className="slots" color={slotsColor}>{slots}</Tag>;
    }
},
{
    title: 'Статус',
    dataIndex: 'state',
    key: 'status',
    render: (text, record) => {
        var status = "Неизвестен";
        var statusColor = greyColor;
        if (record.state == "DRAFT") {
            status = "Черновик";
            statusColor = redColor;
        } else if (record.state == "ON_REVIEW") {
            status = "На модерации";
            statusColor = yellowColor;
        } else if (record.state == "PUBLISHED") {
            status = "Опубликован";
            statusColor = greenColor;
        }
        return <Tag className='status' color={statusColor}>{status}</Tag>;
    }
},
{
    title: '',
    dataIndex: 'deadline',
    key: 'more',
    render: (text, record) => (<Button type="text" shape="circle" icon={<EllipsisOutlined />} />)
},
];

const ProjectsTable = (props) => {
    return (
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
                dataSource={props.data}
                columns={columns}
                footer={() =>
                    <a>+ добавить проект</a>
                  }
                size="middle"
                pagination={false}
            />
        </ConfigProvider>
    );
};

export { ProjectsTable} ;