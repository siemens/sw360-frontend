// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useTranslations } from 'next-intl'
import { Table, _ } from 'next-sw360'
import { FaTrashAlt } from 'react-icons/fa'

export default function EditProjectAttachments() {
    const t = useTranslations('default')

    const columns = [
        {
            id: 'projects.edit.attachments',
            name: t('Attachments'),
            columns: [
                {
                    id: 'projects.edit.fileName',
                    name: t('Filename'),
                    sort: true,
                    width: '100%',
                },
                {
                    id: 'projects.edit.type',
                    name: t('Type'),
                    sort: true,
                    formatter: (type: string) =>
                        _(
                            <>
                                <select className='form-select' name='type' value={type}>
                                    <option value='SOURCE_FILE'>{t('Source file')}</option>
                                    <option value='COMPONENT_LICENSE_INFORMATION_XML'>
                                        {t('COMPONENT_LICENSE_INFORMATION_XML')}
                                    </option>
                                    <option value='COMPONENT_LICENSE_INFORMATION_COMBINED'>
                                        {t('COMPONENT_LICENSE_INFORMATION_COMBINED')}
                                    </option>
                                    <option value='DOCUMENT'>{t('Document')}</option>
                                    <option value={'DESIGN_DOCUMENT'}>{t('Design Document')}</option>
                                    <option value={'REQUIREMENT_DOCUMENT'}>{t('Requirement Document')}</option>
                                    <option value={'SCAN_RESULT_REPORT'}>{t('Scan result report')}</option>
                                    <option value={'SCAN_RESULT_REPORT_XML'}>{t('Scan result report (XML)')}</option>
                                    <option value={'SOURCE_FILE_SELF_MADE'}>{t('Source file (Self-made)')}</option>
                                    <option value={'BINARIES'}>{t('Binaries')}</option>
                                    <option value={'BINARIES_SELF_MADE'}>{t('Binaries (Self-made)')}</option>
                                    <option value={'DECISION_REPORT'}>{t('Decision report')}</option>
                                    <option value={'LOG_EVALUATION_REPORT'}>{t('Log evaluation report')}</option>
                                    <option value={'LICENSE_AGREEMENT'}>{t('License agreement')}</option>
                                    <option value={'SCREENSHOT_OF_WEBSITE'}>{t('Screenshot of website')}</option>
                                    <option value={'OTHER'}>{t('Other')}</option>
                                    <option value={'README_OSS'}>{t('ReadMe OSS')}</option>
                                    <option value={'SECURITY_ASSESSMENT'}>{t('Security Assessment')}</option>
                                    <option value={'INITIAL_SCAN_REPORT'}>{t('Initial Scan Report')}</option>
                                    <option value={'SBOM'}>{t('SBOM')}</option>
                                    <option value={'INTERNAL_USE_SCAN'}>{t('Internal Use Scan')}</option>
                                </select>
                            </>
                        ),
                },
                {
                    id: 'projects.edit.upload',
                    name: t('Upload'),
                    columns: [
                        {
                            id: 'projects.edit.upload.comments',
                            name: t('Comments'),
                            sort: true,
                            formatter: (comment: string) =>
                                _(
                                    <>
                                        <input type='text' className='form-control' value={comment} readOnly />
                                    </>
                                ),
                        },
                        {
                            id: 'projects.edit.upload.group',
                            name: t('Group'),
                            sort: true,
                        },
                        {
                            id: 'projects.edit.upload.name',
                            name: t('Name'),
                            sort: true,
                        },
                        {
                            id: 'projects.edit.upload.date',
                            name: t('Date'),
                            sort: true,
                        },
                    ],
                },
                {
                    id: 'projects.edit.approval',
                    name: t('Approval'),
                    columns: [
                        {
                            id: 'projects.edit.approval.status',
                            name: t('Status'),
                            formatter: (status: string) =>
                                _(
                                    <>
                                        <select className='form-select' name='status' value={status}>
                                            <option value='NOT_CHECKED'>{t('Not checked')}</option>
                                            <option value='ACCEPTED'>{t('Accepted')}</option>
                                            <option value='REJECTED'>{t('Rejected')}</option>
                                        </select>
                                    </>
                                ),
                            sort: true,
                        },
                        {
                            id: 'projects.edit.approval.comment',
                            name: t('Comment'),
                            sort: true,
                            formatter: (comment: string) =>
                                _(
                                    <>
                                        <input type='text' className='form-control' value={comment} readOnly />
                                    </>
                                ),
                        },
                        {
                            id: 'projects.edit.approval.group',
                            name: t('Group'),
                            sort: true,
                        },
                        {
                            id: 'projects.edit.approval.name',
                            name: t('Name'),
                            sort: true,
                        },
                        {
                            id: 'projects.edit.approval.date',
                            name: t('Date'),
                            sort: true,
                        },
                    ],
                },
                {
                    id: 'projects.edit.delete',
                    name: t(''),
                    formatter: () =>
                        _(
                            <div className='d-flex justify-content-center'>
                                <FaTrashAlt className='btn-icon' size={22} />
                            </div>
                        ),
                },
            ],
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                data={[
                    [
                        'Project_Project 2 (1.2.1)_05_09_2023__14_14_02_SBOM_.json',
                        'SOURCE_FILE',
                        'Comment',
                        'DEPARTMENT',
                        'user@sw360.org',
                        '12-08-2023',
                        'ACCEPTED',
                        'Comment 2',
                        'DEPARTMENT',
                        'user2@sw360.org',
                        '28-05-2023',
                    ],
                ]}
                selector={true}
                sort={false}
            />
        </>
    )
}
