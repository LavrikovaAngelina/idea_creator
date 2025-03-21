import React from 'react';
import "./ProjectCard.css";
import { Descriptions, Tag, Button, ConfigProvider } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useWindowSize } from "@uidotdev/usehooks";

const ProjectCard = (props) => {
    const size = useWindowSize();
    const items = [
        {
            key: '1',
            label: '№' + props.id,
        },
        {
            key: '2',
            label: 'Категория',
        },
        {
            key: '3',
            label: 'Срок реализации:',
            children: props.deadline,
        },
        {
            key: '4',
            label: 'Бюджет:',
            children: props.cost,
        },
        {
            key: '5',
            label: 'Слоты:',
            children: <Tag className="slots" color={props.slotsColor}>{props.slots}</Tag>,
        },
        {
            key: '6',
            label: 'Статус:',
            children: <Tag className='status' color={props.statusColor}>{props.status}</Tag>,
        },
    ];

    return (
            <Descriptions
                className='project-card'
                title={<p>{props.title}</p>}
                items={items}
                colon={false}
                column={2}
                layout={size.width > 600 ? "horizontal" : "vertical"}
                extra={<Button type="text" shape="circle" icon={<EllipsisOutlined />} />}
            />
    );
};

export default ProjectCard;