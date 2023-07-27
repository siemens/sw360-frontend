// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

"use client"

import { Nav, Dropdown, Tab } from "react-bootstrap"
import NavItem from 'react-bootstrap/NavItem';
import ObligationsViewTable from "./ObligationsViewTable/ObligationsViewTable"

export default function ObligationsView() {
    return (
        <>
            <Tab.Container id="views-tab" defaultActiveKey="obligations-view">
                <div className="row ps-0">
                    <Nav variant="pills" className="d-inline-flex">
                        <Nav.Item>
                            <Nav.Link eventKey="obligations-view">Obligations View</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="release-view">Release View</Nav.Link>
                        </Nav.Item>
                        <Dropdown as={NavItem} className="ms-3">
                        <Dropdown.Toggle variant='primary'>
                            Create Project Clearing Report
                        </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Projects only</Dropdown.Item>
                                <Dropdown.Item>Projects with sub projects</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </div>
                <Tab.Content className="mt-3">
                    <Tab.Pane eventKey="obligations-view"><ObligationsViewTable/></Tab.Pane>
                    <Tab.Pane eventKey="release-view">Release View Table</Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    )
}