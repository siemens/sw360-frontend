// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { ListGroup, Tab } from 'react-bootstrap'

export default function ProjectTab({ summary }: { summary: ReactNode }) {
    const t = useTranslations('default')
    return (
        <>
            <Tab.Container defaultActiveKey='summary'>
                <div className='row me-3'>
                    <div className='col-sm-2'>
                        <ListGroup>
                            <ListGroup.Item action eventKey='summary'>
                                <div className='my-2'>{t('Summary')}</div>
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey='metadata'>
                                <div className='my-2'>{t('Metadata')}</div>
                            </ListGroup.Item>
                            <ListGroup.Item action eventKey='references'>
                                <div className='my-2'>{t('References')}</div>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className='col-sm-10'>
                        <Tab.Content>
                            <Tab.Pane eventKey='summary'>{summary}</Tab.Pane>
                            <Tab.Pane eventKey='metadata'></Tab.Pane>
                            <Tab.Pane eventKey='references'></Tab.Pane>
                        </Tab.Content>
                    </div>
                </div>
            </Tab.Container>
        </>
    )
}
