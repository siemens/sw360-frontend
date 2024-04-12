// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { ApiUtils } from '@/utils/index'
import { getSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Table, _ } from "next-sw360"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HttpStatus } from '@/object-types'
import { notFound } from 'next/navigation'

function OpenModerationRequest() {


    const t = useTranslations('default')
    const [tableData, setTableData] = useState<Array<any>>([])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        ;(async () => {
            try {
                const session = await getSession()
                if (!session) {
                    return signOut()
                }

                const response = await ApiUtils.GET(
                    `moderationrequest`,
                    session.user.access_token,
                    signal
                )
                if (response.status === HttpStatus.UNAUTHORIZED) {
                    return signOut()
                } else if (response.status !== HttpStatus.OK) {
                    return notFound()
                }
                const data = await response.json()
                setTableData(data)
            } catch (e) {
                console.error(e)
            }
        })()

        return () => controller.abort()
    }, [])

    const columns = [
        {
            id: 'openModerationRequest.date',
            name: t('Date'),
            width: '10%',
            sort: true,
        },
        {
            id: 'openModerationRequest.type',
            name: t('Type'),
            width: '10%',
            sort: true,
        },
        {
            id: 'openModerationRequest.documentName',
            name: t('Document Name'),
            width: '20%',
            formatter: ({ id }: { id: string}) =>
                _(
                    <>
                        <Link href={`/moderationrequest/${id}`} className='text-link'/>
                    </>
                ),
            sort: true,
        },
        {
            id: 'openModerationRequest.requestingUser',
            name: t('Requesting User'),
            width: '15%',
            formatter: (email: string) =>
                _(
                    <>
                        <Link href={`mailto:${email}`} className='text-link'>
                            {email}
                        </Link>
                    </>
                ),
            sort: true,
        },
        {
            id: 'openModerationRequest.department',
            name: t('Department'),
            width: '10%',
            sort: true,
        },
        {
            id: 'openModerationRequest.moderators',
            name: t('Moderators'),
            width: '15%',
            formatter: (email: string) =>
                _(
                    <>
                        <Link href={`mailto:${email}`} className='text-link'>
                            {email}
                        </Link>
                    </>
                ),
            sort: true,
        },
        {
            id: 'openModerationRequest.state',
            name: t('State'),
            sort: true,
        },
        {
            id: 'openModerationRequest.actions',
            name: t('Actions'),
            sort: true,
        }
    ]


    return (
        <>
            <div className='row mb-4'>
                <div style={{ paddingLeft: '0px' }}>
                    <Table columns={columns} data={tableData} sort={false} selector={true} />
                </div>
            </div>
        </>
    )
}

export default OpenModerationRequest
