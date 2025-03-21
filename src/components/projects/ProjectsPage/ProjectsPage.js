import React from 'react';
import { useState, useEffect } from 'react';
import { useWindowSize } from "@uidotdev/usehooks";

import { ConfigProvider, List } from 'antd';
import { queryWithJWT } from '../../../jwtQueries.js';
import { ProjectsTable } from "../ProjectsTable/ProjectsTable.js";
import ProjectCard from '../ProjectCard/ProjectCard';
import { greenColor, yellowColor, redColor, greyColor } from '../colors.js';

import "./ProjectsPage.css";

async function getProjects(fetch_opts) {
    let response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + '/projects/my', fetch_opts);
    if (response.ok) {
        var json = JSON.parse(await response.text());
        return json;
    }
};

const ProjectsPage = (props) => {
    const size = useWindowSize();
    const [data, setData] = useState([]);

    useEffect(() => {
        const abortCtrl = new AbortController();
        const fetch_opts = { signal: abortCtrl.signal, mode: 'cors' };
        getProjects(fetch_opts).then((res) => {
            var tableData = null;
            if (res) {
                tableData = res.map((x, index) => { x.key = index.toString(); return x; });
            } else {
                tableData = mock;
            }
            setData(tableData);
        }).catch((error) => console.log(error.message));
        return () => abortCtrl.abort();
    }, []);

    return size.width > 768 ?
        <div className='projects-container'>
            <h1>Мои проекты</h1> <ProjectsTable data={data} /> </div> : <div className='projects-container'>
            <h1>Мои проекты</h1>
            <ConfigProvider
                theme={{
                    components: {
                        List: {
                            itemPadding: "5px 0",
                        },
                    },
                }}
            >
                <List
                    // grid={{
                    //     gutter: 10,
                    //     column: 1,
                    // }}
                    itemLayout='vertical'
                    bordered={false}
                    split={false}
                    dataSource={data}
                    renderItem={(item) => {
                        var status = "Неизвестен";
                        var statusColor = greyColor;
                        if (item.state == "DRAFT") {
                            status = "Черновик";
                            statusColor = redColor;
                        } else if (item.state == "ON_REVIEW") {
                            status = "На модерации";
                            statusColor = yellowColor;
                        } else if (item.state == "PUBLISHED") {
                            status = "Опубликован";
                            statusColor = greenColor;
                        }

                        var slots = "" + item.employeeCount + "/" + item.jobsCount;
                        var slotsColor = greyColor;
                        if (item.employeeCount == 0) {
                            slotsColor = greyColor;
                        } else if (item.employeeCount * 2 < item.jobsCount) {
                            slotsColor = redColor;
                        } else if (item.employeeCount == item.jobsCount) {
                            slotsColor = greenColor;
                        } else {
                            slotsColor = yellowColor;
                        }
                        return <List.Item>
                            <ProjectCard
                                deadline='неизвестно'
                                id={item.id}
                                title={item.name}
                                status={status}
                                statusColor={statusColor}
                                slots={slots}
                                slotsColor={slotsColor}
                                cost={(item.budget || '?') + " р."}
                            />
                        </List.Item>;
                    }}
                />
                <a>+ добавить проект</a>
            </ConfigProvider></div>;
}

export default ProjectsPage;

const mock = [
    {
        id: 1,
        name: "Сайт для завода гвоздей",
        budget: 1000000,
        state: "DRAFT",
        jobsCount: 5,
        employeeCount: 2
    },
    {
        id: 2,
        name: "Сайт для организации работы",
        state: "ON_REVIEW",
        jobsCount: 5,
        employeeCount: 4
    },
    {
        id: 3,
        name: "Чилл",
        state: "PUBLISHED",
        jobsCount: 5,
        employeeCount: 5
    }
];