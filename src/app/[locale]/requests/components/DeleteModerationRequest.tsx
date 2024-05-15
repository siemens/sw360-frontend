// Copyright (C) Siemens AG, 2024. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { HttpStatus } from '@/object-types'
import { ApiUtils } from '@/utils'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import MessageService from '@/services/message.service'


interface Props {
    moderationRequestId?: string
    show?: boolean
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
}

function DeleteModerationRequest ({ moderationRequestId, show, setShow }: Props) {
    
    const { data: session, status } = useSession()
    const t = useTranslations('default')
    const router = useRouter()
    const [reloadPage, setReloadPage] = useState(false)


    const handleError = useCallback(() => {
        MessageService.warn(t('Error when processing'))
        setReloadPage(true)
    }, [t])

    const deleteProject = async () => {
        const response = await ApiUtils.DELETE(`moderationrequest/${moderationRequestId}`, session.user.access_token)
        try {
            if (response.status == HttpStatus.OK) {
                MessageService.success(t('Moderation request deleted successfully'))
                router.push('/moderationrequest')
                setReloadPage(true)
            } else if (response.status == HttpStatus.UNAUTHORIZED) {
                await signOut()
            } else {
                MessageService.warn(t('Error when processing'))
            }
        } catch (err) {
            handleError()
        }
    }

    const handleSubmit = () => {
        deleteProject().catch((err) => {
            console.log(err)
        })
    }

    const handleCloseDialog = () => {
        setShow(!show)
        if (reloadPage === true) {
            window.location.reload()
        }
    }

    
    if (status === 'unauthenticated') {
        signOut()
    } else {
    return (
        <Modal show={show} onHide={handleCloseDialog} backdrop='static' centered size='lg'>
            <Modal.Header closeButton style={{ color: 'red' }}>
                <Modal.Title>
                    <AiOutlineQuestionCircle style={{ marginBottom: '5px' }} />
                    {t('Delete Moderation Request')} ?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label className='mb-3'>
                            {t('Do you really want to delete the moderation request') +
                               'moderationRequestName' + '?'
                            }
                        </Form.Label>
                    </Form.Group>
                    <hr />
                </Form>
            </Modal.Body>
            <Modal.Footer className='justify-content-end'>
                <Button className='delete-btn' variant='light' onClick={handleCloseDialog}>
                    {' '}
                    {t('Cancel')}{' '}
                </Button>
                <Button
                    className='login-btn'
                    variant='danger'
                    onClick={() => handleSubmit()}
                    hidden={reloadPage}
                >
                    {t('Delete Moderation Request')}
                </Button>
            </Modal.Footer>
        </Modal>
    )}
}

export default DeleteModerationRequest
