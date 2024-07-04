// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Table, _ } from '@/components/sw360'
import { ProjectObligationsList, Session, LicenseObligationRelease, ActionType, ProjectObligation } from '@/object-types'
import { useSession } from 'next-auth/react'
import { BsCaretDownFill, BsCaretRightFill } from 'react-icons/bs'
import { Spinner, Modal } from 'react-bootstrap'
import { SW360_API_URL } from '@/utils/env'

const Capitalize = (text: string) =>
    text.split('_').reduce((s, c) => s + ' ' + (c.charAt(0) + c.substring(1).toLocaleLowerCase()), '')

function ExpandableList({ previewString, releases }: { previewString: string, releases: LicenseObligationRelease[] }) {
    const [ isExpanded, setExpanded ] = useState(false)
    return (
        <>
            {
                isExpanded ?
                <div>
                    <span><BsCaretDownFill onClick={() => setExpanded(false)} />{' '}</span>
                    {releases.map((release: LicenseObligationRelease, index: number) => {
                        return (
                            <li key={release.id ?? ''} style={{ display: 'inline' }}>
                                <Link href={`/components/releases/detail/${release.id ?? ''}`} className='text-link'>
                                    {`${release.name ?? ''} ${release.version ?? ''}`}
                                </Link>
                                {index >= releases.length - 1 ? '' : ', '}{' '}
                            </li>
                        )
                    })}
                </div>:
                <div>
                    {
                        releases.length !== 0 &&
                        <div><BsCaretRightFill onClick={() => setExpanded(true)} />{' '}{previewString}</div>
                    }
                </div>
            }
        </>
    )
}

function ShowObligationTextOnExpand({id, infoText, colLength}: {id: string, infoText: string, colLength: number }): JSX.Element {
    const [isExpanded, setIsExpanded] = useState(false)
    useEffect(() => {
        if(isExpanded) {
            const el = document.getElementById(id)
            const par = el.parentElement.parentElement.parentElement
            const tr = document.createElement('tr')
            tr.id = `${id}_text`
            const td = document.createElement('td')
            td.colSpan = colLength
            const licenseObligationText = document.createElement('p')
            licenseObligationText.style.whiteSpace = 'pre-line'
            licenseObligationText.textContent = infoText
            licenseObligationText.className = 'ps-5 pt-2 pe-3'
            td.appendChild(licenseObligationText)
            tr.appendChild(td)
            par.parentNode.insertBefore(tr, par.nextSibling)
        }
        else {
            const el = document.getElementById(`${id}_text`)
            if(el) {
                el.remove()
            }
        }
    }, [isExpanded])
    
    return (
        <>
            {
                isExpanded 
                ? <BsCaretDownFill color='gray' id={id} onClick={() => setIsExpanded(!isExpanded)} />
                : <BsCaretRightFill color='gray' id={id} onClick={() => setIsExpanded(!isExpanded)} />
            }
        </>
    )
}

interface UpdateCommentModalMetadata {
    obligation: string
    comment: string
}

function UpdateCommentModal({modalMetaData, setModalMetaData, payload, setPayload}: {modalMetaData: UpdateCommentModalMetadata, 
    setModalMetaData: Dispatch<SetStateAction<UpdateCommentModalMetadata>>, payload: ProjectObligation, setPayload: Dispatch<SetStateAction<ProjectObligation>>
}) {
    const t = useTranslations('default')
    const [commentText, setCommentText] = useState('')
    useEffect(() => {
        setCommentText(modalMetaData?.comment ?? '')
    }, [modalMetaData])
    return (
        <Modal show={modalMetaData?true:false} onHide={() => {
            setModalMetaData(null)
            setCommentText('')
        }} backdrop='static' centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{t('Enter obligation comment')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type='text'
                    value={commentText}
                    onChange={(e) => { setCommentText(e.target.value) }}
                    className='form-control'
                    placeholder={t('Enter obligation comment')}
                />
            </Modal.Body>
            <Modal.Footer className='justify-content-end'>
                <button
                    type='button'
                    className="fw-bold btn btn-light me-2"
                    onClick={() => { 
                        setModalMetaData(null)
                        setCommentText('')
                      }}
                >
                    {t('Cancel')}
                </button>
                <button
                    type='button'
                    className="fw-bold btn btn-primary me-2"
                    onClick={() => { 
                        setModalMetaData(null) 
                        let obligationValue = payload?.[modalMetaData.obligation] ?? {}
                        obligationValue = { ...obligationValue, comment: commentText }
                        setPayload((payload: ProjectObligation) => ({ ...payload, [modalMetaData.obligation]: obligationValue }))
                        setCommentText('')
                    }}
                >
                    {t('Update')}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default function LicenseObligation({ projectId, actionType, payload, setPayload }: 
    { projectId: string, actionType: ActionType, payload?: ProjectObligation, setPayload?: Dispatch<SetStateAction<ProjectObligation>> }) {
    const t = useTranslations('default')
    const { data: session, status } = useSession()
    const [updateCommentModalData, setUpdateCommentModalData] = useState<UpdateCommentModalMetadata | null>(null)
    let columns;
    if(actionType === ActionType.DETAIL) {
        columns = [
            {
                id: 'licenseObligation.expand',
                formatter: ({id, infoText}: {id: string, infoText: string }) =>
                _(
                    <>
                        <ShowObligationTextOnExpand id={id} infoText={infoText} colLength={columns.length} />
                    </>
                ),
                width: '4%'
            },
            {
                id: 'licenseObligation.licenseObligation',
                name: t('License Obligation'),
                sort: true,
            },
            {
                id: 'licenseObligation.licenses',
                name: t('Licenses'),
                formatter: (licenseIds: string[]) =>
                _(
                    <div className='text-center'>
                        {
                            <ul className='px-0'>
                                {licenseIds.map((licenseId: string, index: number) => {
                                    return (
                                        <li key={licenseId} style={{ display: 'inline' }}>
                                            <Link href={`/licenses/${licenseId}`} className='text-link'>
                                                {licenseId}
                                            </Link>
                                            {index >= licenseIds.length - 1 ? '' : ', '}{' '}
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </div>
                ),
                sort: true,
            },
            {
                id: 'licenseObligation.releases',
                name: t('Releases'),
                formatter: (releases: LicenseObligationRelease[]) => {
                    const previewString = releases.map((r) => `${r.name ?? ''} ${r.version ?? ''}`).join(', ').substring(0, 10)
                    return _(
                        <ExpandableList releases={releases} previewString={previewString} />
                    )
                },
                sort: true,
            },
            {
                id: 'licenseObligation.status',
                name: t('Status'),
                formatter: ({ status }: { status: string }) => {
                    return _(
                        <>{Capitalize(status ?? '')}</>
                    )
                },
                sort: true,
            },
            {
                id: 'licenseObligation.type',
                name: t('Type'),
                sort: true,
            },
            {
                id: 'licenseObligation.id',
                name: t('Id'),
                sort: true,
            },
            {
                id: 'licenseObligation.comment',
                name: t('Comment'),
                formatter: ({ comment }: { comment: string }) =>
                    _(
                        <p>{comment}</p>
                    ),
                sort: true,
            }
        ]
    } else if(actionType === ActionType.EDIT) {
        columns = [
            {
                id: 'licenseObligation.expand',
                formatter: ({id, infoText}: {id: string, infoText: string }) =>
                _(
                    <>
                        <ShowObligationTextOnExpand id={id} infoText={infoText} colLength={columns.length} />
                    </>
                ),
                width: '4%'
            },
            {
                id: 'licenseObligation.licenseObligation',
                name: t('License Obligation'),
                sort: true,
            },
            {
                id: 'licenseObligation.licenses',
                name: t('Licenses'),
                formatter: (licenseIds: string[]) =>
                _(
                    <div className='text-center'>
                        {
                            <ul className='px-0'>
                                {licenseIds.map((licenseId: string, index: number) => {
                                    return (
                                        <li key={licenseId} style={{ display: 'inline' }}>
                                            <Link href={`/licenses/${licenseId}`} className='text-link'>
                                                {licenseId}
                                            </Link>
                                            {index >= licenseIds.length - 1 ? '' : ', '}{' '}
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </div>
                ),
                sort: true,
            },
            {
                id: 'licenseObligation.releases',
                name: t('Releases'),
                formatter: (releases: LicenseObligationRelease[]) => {
                    const previewString = releases.map((r) => `${r.name ?? ''} ${r.version ?? ''}`).join(', ').substring(0, 10)
                    return _(
                        <ExpandableList releases={releases} previewString={previewString} />
                    )
                },
                sort: true,
            },
            {
                id: 'licenseObligation.status',
                name: t('Status'),
                formatter: ({ payload, obligation, status }: { status: string, payload: ProjectObligation, obligation: string }) => {
                    return _(
                        <select
                            className='form-select'
                            id='licenseObligation.edit.status'
                            name='status'
                            value={payload?.[obligation]?.status ?? ((status && status === '') ? 'OPEN' : status)}
                            onChange={(e) => {
                                if(setPayload)  {
                                    let obligationValue = payload?.[obligation] ?? {}
                                    obligationValue = { ...obligationValue, status: e.target.value }
                                    setPayload((payload: ProjectObligation) => ({ ...payload, [obligation]: obligationValue }))
                                }    
                            }}
                        >
                            <option value='OPEN'>{t('Open')}</option>
                            <option value='ACKNOWLEDGED_OR_FULFILLED'>{t('Acknowledged or Fulfilled')}</option>
                            <option value='WILL_BE_FULFILLED_BEFORE_RELEASE'>{t('Will be fulfilled before release')}</option>
                            <option value='NOT_APPLICABLE'>{t('Not Applicable')}</option>
                            <option value='DEFERRED_TO_PARENT_PROJECT'>{t('Deferred to parent project')}</option>
                            <option value='FULFILLED_AND_PARENT_MUST_ALSO_FULFILL'>{t('Fulfilled and parent must also fulfill')}</option>
                            <option value='ESCALATED'>{t('Escalated')}</option>
                        </select>
                    )
                },
                width: '10%',
                sort: true,
            },
            {
                id: 'licenseObligation.type',
                name: t('Type'),
                sort: true,
            },
            {
                id: 'licenseObligation.id',
                name: t('Id'),
                sort: true,
            },
            {
                id: 'licenseObligation.comment',
                name: t('Comment'),
                formatter: ({ obligation, comment }: { comment: string, obligation: string }) => {
                    return _(
                        <input
                            type='text'
                            value={payload?.[obligation]?.comment ?? comment}
                            onClick={() => { setUpdateCommentModalData({ comment: payload?.[obligation]?.comment ?? comment, obligation }) }}
                            className='form-control'
                            placeholder={t('Enter comments')}
                            readOnly
                        />
                    )
                },
                sort: true,
            }
        ]
    }

    const initServerPaginationConfig = (session: Session) => {
        return {
            url: `${SW360_API_URL}/resource/api/projects/${projectId}/licenseObligations`,
            then: (data: ProjectObligationsList) => {
                const tableRows = []
                for(const [key, val] of Object.entries(data.licenseObligations)) {
                    tableRows.push(
                        [
                            {
                                id: key.split(' ').join('_'),
                                infoText: val.text,
                            },
                            key,
                            val.licenseIds ?? [],
                            val.releases ?? [],
                            { status: val.status ?? '', obligation: key, payload },
                            val.type ?? '',
                            val.id ?? '',
                            { comment: val.comment ?? '', obligation: key, payload }
                        ]
                    )
                }
                return tableRows
            },
            total: (data: ProjectObligationsList) => data.page.totalElements,
            headers: { Authorization: `Bearer ${session.user.access_token}` },
        }
    }

    return (
        <>
            <UpdateCommentModal modalMetaData={updateCommentModalData} setModalMetaData={setUpdateCommentModalData} payload={payload} setPayload={setPayload} />
            {
                (status === 'authenticated') ? 
                <Table columns={columns} server={initServerPaginationConfig(session)} selector={false} />:
                <Spinner className='spinner col-12 mt-1 text-center' />
            }
        </>
    )
}
