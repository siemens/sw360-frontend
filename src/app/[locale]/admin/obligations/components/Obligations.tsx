// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { QuickFilter, Table, _ } from 'next-sw360'
import { FaPencilAlt, FaClipboard, FaTrashAlt } from 'react-icons/fa'
import { LuFileText } from "react-icons/lu"
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap'
import { SW360_API_URL } from '@/utils/env'
import { Obligation, Embedded } from '@/object-types'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EmbeddedObligations = Embedded<Obligation, 'sw360:obligations'>

const Capitalize = (text: string) =>
    text.split('_').reduce((s, c) => s + ' ' + (c.charAt(0) + c.substring(1).toLocaleLowerCase()), '')

export default function Obligations() {
    const t = useTranslations('default')
    const { data: session, status } = useSession()
    const [num, setNum]  = useState< null | number >(null)
    const router = useRouter()

    const handleAddObligations = () => {
        router.push('/admin/obligations/add')
    }

    const columns = [
        {
            id: 'obligations.title',
            name: t('Title'),
            sort: true,
        },
        {
            id: 'obligations.text',
            name: t('Text'),
            sort: true,
        },
        {
            id: 'obligations.obligationLevel',
            name: t('Obligation Level'),
            width: '20%',
            formatter: (level: string) => _(<>{Capitalize(level)}</>),
            sort: true,
        },
        {
            id: 'obligations.actions',
            name: t('Actions'),
            width: '9%',
            formatter: (id: string) =>
            _(
                <>
                    <span className='d-flex justify-content-evenly'>
                        <OverlayTrigger overlay={<Tooltip>{t('Edit')}</Tooltip>}>
                            <Link href={`/admin/obligations/edit/${id}`} className='overlay-trigger'>
                                <FaPencilAlt className='btn-icon' />
                            </Link>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>{t('Duplicate')}</Tooltip>}>
                            <Link href={`/projects/duplicate/${id}`} className='overlay-trigger'>
                                <FaClipboard className='btn-icon' />
                            </Link>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>{t('Change Log')}</Tooltip>}>
                            <span className='d-inline-block'>
                                <LuFileText className='btn-icon overlay-trigger' />
                            </span>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>{t('Delete')}</Tooltip>}>
                            <span className='d-inline-block'>
                                <FaTrashAlt
                                    className='btn-icon'
                                    style={{ color: 'gray', fontSize: '18px' }}
                                />
                            </span>
                        </OverlayTrigger>
                    </span>
                </>
            ),
            sort: true,
        },
    ]

    const server = {
        url: `${SW360_API_URL}/resource/api/obligations`,
        then: (data: EmbeddedObligations) => {
            setNum(data.page.totalElements)
            return data._embedded['sw360:obligations'].map((elem: Obligation) => [
                elem.title ?? '',
                elem.text ?? '',
                elem.obligationLevel ?? '',
                elem._links.self.href.split('/').at(-1),
            ])
        },
        total: (data: EmbeddedObligations) => data.page.totalElements,
        headers: { Authorization: `Bearer ${status === 'authenticated' ? session.user.access_token : ''}` },
    }

    return (
        <>
            <div className='mx-3 mt-3'>
                <div className='row'>
                    <div className='col-lg-2'>
                        <QuickFilter id='obligationSearch' />
                    </div>
                    <div className='col-lg-10'>
                        <div className='row d-flex justify-content-between ms-1'>
                            <button className='btn btn-primary col-auto' onClick={handleAddObligations}>
                                {t('Add Obligation')}
                            </button>
                            <div className='col-auto buttonheader-title'>{`${t('Obligations')} (${num ? num : ''})`}</div>
                        </div>
                        {
                            status === 'authenticated' ?
                            <div className="ms-1">
                                <Table columns={columns} server={server} selector={true} sort={false}/>
                            </div> :
                            <div className='col-12 mt-1 text-center'>
                                <Spinner className='spinner' />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
