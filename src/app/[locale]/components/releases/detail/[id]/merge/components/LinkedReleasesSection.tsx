// Copyright (C) Siemens AG, 2025. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { FaLongArrowAltLeft, FaUndo } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'
import { ListFieldProcessComponent, ReleaseDetail, ReleaseLink } from '@/object-types'

export default function LinkedReleasesSection({
    targetRelease,
    sourceReleaseDetail,
    finalReleasePayload,
    setFinalReleasePayload,
}: {
    targetRelease: ReleaseDetail | null
    sourceReleaseDetail: ReleaseDetail | null
    finalReleasePayload: ReleaseDetail | null
    setFinalReleasePayload: Dispatch<SetStateAction<null | ReleaseDetail>>
}): ReactNode {
    const t = useTranslations('default')
    const [linkedReleaseMergeList, setLinkedReleaseMergeList] = useState<ListFieldProcessComponent[]>([])
    const session = useSession()

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            signOut()
        }
    }, [
        session,
    ])

    useEffect(() => {

        setLinkedReleaseMergeList([
            ...(targetRelease?._embedded['sw360:releaseLinks']
                ? targetRelease._embedded['sw360:releaseLinks'].map(
                    (con) => `${con.name} (${con.version})`)
                : ([] as string[])
            )
                .filter(
                    (c) =>
                        (sourceReleaseDetail?._embedded['sw360:releaseLinks']
                            ? sourceReleaseDetail._embedded['sw360:releaseLinks'].map(
                                (con) => `${con.name} (${con.version})`)
                            : ([] as string[])
                        ).indexOf(c) !== -1,
                )
                .map((c) => ({
                    value: c,
                    presentInSource: true,
                    presentInTarget: true,
                    overWritten: false,
                })),

            ...(targetRelease?._embedded['sw360:releaseLinks']
                ? targetRelease._embedded['sw360:releaseLinks'].map(
                    (con) => `${con.name} (${con.version})`)
                : ([] as string[])
            )
                .filter(
                    (c) =>
                        (sourceReleaseDetail?._embedded['sw360:releaseLinks']
                            ? sourceReleaseDetail._embedded['sw360:releaseLinks'].map(
                                (con) => `${con.name} (${con.version})`)
                            : ([] as string[])
                        ).indexOf(c) === -1,
                )
                .map((c) => ({
                    value: c,
                    presentInSource: false,
                    presentInTarget: true,
                    overWritten: false,
                })),

            ...(sourceReleaseDetail?._embedded['sw360:releaseLinks']
                ? sourceReleaseDetail._embedded['sw360:releaseLinks'].map(
                    (con) => `${con.name} (${con.version})`)
                : ([] as string[])
            )
                .filter(
                    (c) =>
                        (targetRelease?._embedded['sw360:releaseLinks']
                            ? targetRelease._embedded['sw360:releaseLinks'].map(
                                (con) => `${con.name} (${con.version})`)
                            : ([] as string[])
                        ).indexOf(c) === -1,
                )
                .map((c) => ({
                    value: c,
                    presentInSource: true,
                    presentInTarget: false,
                    overWritten: false,
                })),
        ])

    }, [
        targetRelease,
        sourceReleaseDetail,
    ])

    return (
        <>
            {targetRelease && sourceReleaseDetail && finalReleasePayload && (
                <div className='mb-3'>
                    <h6 className='border-bottom fw-bold text-uppercase text-blue border-blue mb-2'>{t('Linked Releases')}</h6>
                    <div className='border border-top-0 border-blue p-2'>
                        <div className='fw-bold text-blue'>{t('Linked Releases')}</div>
                        {linkedReleaseMergeList.map((c) => {
                            if (c.presentInSource && c.presentInTarget) {
                                return (
                                    <div
                                        className='d-flex row mb-1'
                                        key={c.value}
                                    >
                                        <div className='mt-2 col text-end'>{c.value}</div>
                                        <div className='col-12 col-md-2 mx-5 text-center'>
                                            <TiTick
                                                size={25}
                                                className='green'
                                            />
                                        </div>
                                        <div className='mt-2 col text-start'>{c.value}</div>
                                    </div>
                                )
                            } else if (c.presentInTarget) {
                                return (
                                    <div
                                        className='d-flex row mb-1'
                                        key={c.value}
                                    >
                                        <div className='mt-2 col text-end'>{c.overWritten ? '' : c.value}</div>
                                        <div className='col-12 col-md-2 mx-5 text-center'>
                                            {!c.overWritten ? (
                                                <button
                                                    className='btn btn-secondary px-2'
                                                    onClick={() => {
                                                        const newContributorList = (
                                                            finalReleasePayload.contributors ?? []
                                                        ).filter((con) => con !== c.value)
                                                        setFinalReleasePayload({
                                                            ...finalReleasePayload,
                                                            contributors: newContributorList,
                                                        })

                                                        const updatedContributorMergeList = linkedReleaseMergeList.map(
                                                            (con) => {
                                                                if (con.value === c.value) {
                                                                    return {
                                                                        ...con,
                                                                        overWritten: true,
                                                                    }
                                                                }
                                                                return con
                                                            },
                                                        )
                                                        setLinkedReleaseMergeList(updatedContributorMergeList)
                                                    }}
                                                >
                                                    <FaLongArrowAltLeft />
                                                </button>
                                            ) : (
                                                <button
                                                    className='btn btn-secondary px-2'
                                                    onClick={() => {
                                                        const contributorsData = finalReleasePayload.contributors ?? []
                                                        contributorsData.push(c.value)
                                                        setFinalReleasePayload({
                                                            ...finalReleasePayload,
                                                            contributors: contributorsData,
                                                        })

                                                        const updatedContributorsMergeList = linkedReleaseMergeList.map(
                                                            (con) => {
                                                                if (con.value === c.value) {
                                                                    return {
                                                                        ...con,
                                                                        overWritten: false,
                                                                    }
                                                                }
                                                                return con
                                                            },
                                                        )
                                                        setLinkedReleaseMergeList(updatedContributorsMergeList)
                                                    }}
                                                >
                                                    <FaUndo />
                                                </button>
                                            )}
                                        </div>
                                        <div className='mt-2 col text-start'></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div
                                        className='d-flex row mb-1'
                                        key={c.value}
                                    >
                                        <div className='mt-2 col text-end'>{!c.overWritten ? '' : c.value}</div>
                                        <div className='col-12 col-md-2 mx-5 text-center'>
                                            {!c.overWritten ? (
                                                <button
                                                    className='btn btn-secondary px-2'
                                                    onClick={() => {
                                                        const contributorList = finalReleasePayload.contributors ?? []
                                                        contributorList.push(c.value)
                                                        setFinalReleasePayload({
                                                            ...finalReleasePayload,
                                                            contributors: contributorList,
                                                        })

                                                        const updatedContributorsMergeList = linkedReleaseMergeList.map(
                                                            (con) => {
                                                                if (con.value === c.value) {
                                                                    return {
                                                                        ...con,
                                                                        overWritten: true,
                                                                    }
                                                                }
                                                                return con
                                                            },
                                                        )
                                                        setLinkedReleaseMergeList(updatedContributorsMergeList)
                                                    }}
                                                >
                                                    <FaLongArrowAltLeft />
                                                </button>
                                            ) : (
                                                <button
                                                    className='btn btn-secondary px-2'
                                                    onClick={() => {
                                                        const contributorList = (
                                                            finalReleasePayload.contributors ?? []
                                                        ).filter((con) => con !== c.value)
                                                        setFinalReleasePayload({
                                                            ...finalReleasePayload,
                                                            contributors: contributorList,
                                                        })

                                                        const updatedContributorMergeList = linkedReleaseMergeList.map(
                                                            (con) => {
                                                                if (con.value === c.value) {
                                                                    return {
                                                                        ...con,
                                                                        overWritten: false,
                                                                    }
                                                                }
                                                                return con
                                                            },
                                                        )
                                                        setLinkedReleaseMergeList(updatedContributorMergeList)
                                                    }}
                                                >
                                                    <FaUndo />
                                                </button>
                                            )}
                                        </div>
                                        <div className='mt-2 col text-start'>{c.value}</div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
