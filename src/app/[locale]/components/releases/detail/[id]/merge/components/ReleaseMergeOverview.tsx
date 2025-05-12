// Copyright (C) Siemens AG, 2025. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useTranslations } from 'next-intl'
import { ReactNode, useState, useEffect } from 'react'
import { ErrorDetails, HttpStatus,
         ComponentProcessorActionType, ReleaseDetail } from '@/object-types'
import MessageService from '@/services/message.service'
import { ApiUtils, CommonUtils } from '@/utils'
import { getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Spinner } from 'react-bootstrap'


export default function ReleaseMergeOverview({ releaseId }: Readonly<{ releaseId: string }>): ReactNode {
    const router = useRouter()
    const t = useTranslations('default')
    const [mergeState, ] = useState<ComponentProcessorActionType>(ComponentProcessorActionType.CHOOSE_SOURCE)
    const [targetRelease, setTargetRelease] = useState<null | ReleaseDetail>(null)
    // const [sourceRelease, setSourceRelease] = useState<null | ReleaseDetail>(null)
    // const [finalReleasePayload, setFinalReleasePayload] = useState<null | ReleaseDetail>(null)
    // const [err, setErr] = useState<null | string>(null)
    // const [loading, setLoading] = useState(false)


    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

            ; (async () => {
                try {
                    const session = await getSession()
                    if (CommonUtils.isNullOrUndefined(session))
                        return signOut()
                    const response = await ApiUtils.GET(`releases/${releaseId}`,
                                                         session.user.access_token, signal)

                    if (response.status === HttpStatus.UNAUTHORIZED) {
                        return signOut()
                    } else if (response.status === HttpStatus.OK) {
                        const releaseData = await response.json() as ReleaseDetail
                        setTargetRelease(releaseData)
                    } else {
                        const err = await response.json() as ErrorDetails
                        throw new Error(err.message)
                    }
                } catch (error) {
                    if (error instanceof DOMException && error.name === "AbortError") {
                        return
                    }
                    const message = error instanceof Error ? error.message : String(error)
                    MessageService.error(message)
                    router.push(`releases/${releaseId}`)
                }
            })()

        return () => controller.abort()
    }, [releaseId])

    return (
        <div className='mx-5 mt-3'>
            {
                targetRelease
                    ? <>
                        <div className='col-auto buttonheader-title mb-3'>
                            {
                                t.rich('MERGE INTO RELEASE', {
                                    name: targetRelease.name,
                                })
                            }
                        </div>
                        <div className='d-flex justify-content-between text-center mb-3'>
                            <div className={`p-2 border rounded-2 col-12 col-md ${mergeState === ComponentProcessorActionType.CHOOSE_SOURCE ? 'componentprocessor-active' : 'componentprocessor'}`} role="alert">
                                <h6 className="fw-bold">1. {t('Choose source')}</h6>
                                <p>{t('Choose a release that should be merged into the current one')}</p>
                            </div>
                            <div className={`mx-4 p-2 border rounded-2 col-12 col-md ${mergeState === ComponentProcessorActionType.PROCESS_DATA ? 'componentprocessor-active' : 'componentprocessor'}`} role="alert">
                                <h6 className="fw-bold">2. {t('Merge data')}</h6>
                                <p>{t('Merge data from source into target release')}</p>
                            </div>
                            <div className={`p-2 border rounded-2 col-12 col-md ${mergeState === ComponentProcessorActionType.CONFIRM ? 'componentprocessor-active' : 'componentprocessor'}`} role="alert">
                                <h6 className="fw-bold">3. {t('Confirm')}</h6>
                                <p>{t('Check the merged version and confirm')}</p>
                            </div>
                        </div>
                    </>
                    : <div className='col-12 text-center'>
                        <Spinner className='spinner' />
                    </div>
            }
        </div>
    )
}