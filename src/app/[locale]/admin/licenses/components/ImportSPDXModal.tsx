// Copyright (C) Siemens AG, 2025. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client';
import { useTranslations } from 'next-intl';
import { useState, type JSX } from "react";
import { Button, Modal } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';

interface Props {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImportSPDXModal ({show,
                                          setShow}: Props) : JSX.Element {
    const t = useTranslations('default')
    const [loading, setLoading] = useState<boolean>(false)

    console.log('loading', loading, setLoading)

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
                            // onClick={() => handleImportSPDXInfo()}
                    >
                        {t('Import SPDX Licenses')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

