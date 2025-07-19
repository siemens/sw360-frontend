// Copyright (C) Siemens AG, 2025. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { Embedded, LinkedRelease, ReleaseDetail } from '@/object-types'
import { CommonUtils } from '@/utils'
import { SW360_API_URL } from '@/utils/env'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Table, _ } from 'next-sw360'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Form } from 'react-bootstrap'

type EmbeddedLinkedReleases = Embedded<LinkedRelease, 'sw360:releaseLinks'>

interface Props {
    componentId: string
    releaseId: string
    sourceRelease: ReleaseDetail | null
    setSourceRelease: Dispatch<SetStateAction<null | ReleaseDetail>>
}

export default function MergeReleaseTable({
    componentId,
    releaseId,
    sourceRelease,
    setSourceRelease,
}: Props): ReactNode {
    const t = useTranslations('default')
    const { data: session } = useSession()

    const columns = [
        {
            id: 'release.merge.select',
            width: '5%',
            formatter: (singleReleaseData: ReleaseDetail) =>
                _(
                    <Form.Check
                        type='radio'
                        name='sourceComponent'
                        checked={sourceRelease !== null && singleReleaseData.id === sourceRelease.id}
                        onChange={() => setSourceRelease(singleReleaseData)}
                    ></Form.Check>,
                ),
        },
        {
            id: 'release.merge.name',
            name: t('Release Name'),
            width: '60%',
            sort: true,
            formatter: ({ name, version }: { name: string; version: string }) =>
                _(
                    <div>
                        <span>{`${name}(${version})`}</span>
                    </div>,
                ),
        },
        {
            id: 'release.merge.version',
            name: t('Version'),
            width: '10%',
        },
        {
            id: 'release.merge.createdBy',
            name: t('Created by'),
            width: '30%',
            sort: true,
        },
    ]

    const initServerPaginationConfig = () => {
        if (CommonUtils.isNullOrUndefined(session)) return
        return {
            url: `${SW360_API_URL}/resource/api/components/${componentId}/releases`,
            then: (data: EmbeddedLinkedReleases) => {
                return data._embedded['sw360:releaseLinks']
                    .map((elem: LinkedRelease) => {
                        if (elem.id !== releaseId) {
                            return [
                                elem,
                                {
                                    name: elem.name,
                                    version: elem.version,
                                },
                                elem.version,
                                elem.name,
                            ]
                        }
                        return null
                    })
                    .filter((item) => item !== null)
            },
            total: (data: EmbeddedLinkedReleases) => data.page?.totalElements ?? 0,
            headers: { Authorization: `${session.user.access_token}` },
        }
    }

    return (
        <Table
            columns={columns}
            selector={true}
            server={initServerPaginationConfig()}
        />
    )
}
