// Copyright (C) Siemens AG, 2025. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client';
import { HttpStatus } from '@/object-types';
import MessageService from '@/services/message.service';
import CommonUtils from '@/utils/common.utils';
import { ApiUtils } from '@/utils/index';
import { getSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState, type JSX } from "react";
import { Button, Modal } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';

interface Props {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

interface ImportSPDXResponse {
    result: string
    message: string
    totalAffectedLicenses: number
    totalLicenses: number
}

export default function ImportSPDXModal ({show,
                                          setShow}: Props) : JSX.Element {
    const t = useTranslations('default')
    const [loading, setLoading] = useState<boolean>(false)
    const [responseText, setResponseText] = useState<ImportSPDXResponse>()

    console.log('loading', loading, responseText)

    const handleImportSPDXInfo = async () => {
        setLoading(true)
        try {
            const session = await getSession()
            if (CommonUtils.isNullOrUndefined(session))
                return signOut()
            const response = await ApiUtils.POST('licenses/import/SPDX', {}, session.user.access_token)
            if (response.status == HttpStatus.OK) {
                const responseData = await response.json() as ImportSPDXResponse
                if (responseData !== null) {
                    setResponseText(responseData)
                }
            } else if (response.status === HttpStatus.UNAUTHORIZED) {
                MessageService.warn(t('Unauthorized request'))
            } else {
                MessageService.error(t('Something went wrong'))
            }
        } catch(error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return
            }
            const message = error instanceof Error ? error.message : String(error)
            MessageService.error(message)
        } finally {
            setLoading(false)
        }
    }
            

    const handleCloseDialog = () => {
        setShow(!show)
    }


    return (
        <>

            <Modal show={show} onHide={handleCloseDialog} backdrop='static' centered size='lg'>
                <Modal.Header
                        style={{ backgroundColor: '#eef2fa', color: '#2e5aac' }}
                        closeButton
                >
                    <h5>
                        <Modal.Title style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                            <BsQuestionCircle />
                            &nbsp;
                            {t('Import SPDX Information')}?
                        </Modal.Title>
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <>
                        {
                            t('Do you really want to import SPDX information')                         }
                    </>
                </Modal.Body>
                <Modal.Footer className='justify-content-end'>
                    <Button className='delete-btn'
                            variant='light'
                            onClick={handleCloseDialog}
                    >
                        {/* {
                            licenseTypeInUse
                                ? t('OK')
                                : t('Cancel')
                        } */}
                        {t('Cancel')}
                    </Button>
                    <Button className='login-btn'
                            variant='primary'
                            onClick={() => handleImportSPDXInfo()}
                    >
                        {t('Import SPDX Licenses')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

