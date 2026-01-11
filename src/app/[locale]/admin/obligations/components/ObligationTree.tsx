// Copyright (C) TOSHIBA CORPORATION, 2025. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2025. Part of the SW360 Frontend Project.
// Copyright (C) Siemens AG, 2026. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ObligationElement, ObligationNode, ObligationTreeProps, TreeNode } from '../../../../../object-types/Obligation'
import ImportElementDialog from './ImportElementDialog'
import { getSession, signOut } from 'next-auth/react'
import CommonUtils from '@/utils/common.utils'
import { ApiUtils } from '@/utils/index'
import { StatusCodes } from 'http-status-codes'
import MessageService from '@/services/message.service'
import { Embedded } from '@/object-types'

type EmbeddedObligationNodes = Embedded<ObligationNode, 'sw360:obligationNodes'>

export function ObligationTree({
    tree,
    title,
    onUpdateNode,
    onAddChild,
    onAddSibling,
    onDeleteNode,
    onUpdateNodeElement,
}: ObligationTreeProps): ReactNode {
    const t = useTranslations('default')
    const [showImportElement, setShowImportElement] = useState(false)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [obligationNodes, setObligationNodes] = useState<ObligationNode[]>([])

    const handleImportElement = (element: ObligationElement, nodeId: string) => {
        onUpdateNodeElement(nodeId, element)
        setShowImportElement(false)
    }

    const fetchData = useCallback(async (url: string) => {
        const session = await getSession()
        if (CommonUtils.isNullOrUndefined(session)) return signOut()
        const response = await ApiUtils.GET(url, session.user.access_token)
        if (response.status === StatusCodes.OK) {
            const data = await response.json() as EmbeddedObligationNodes
            return data
        } else if (response.status === StatusCodes.UNAUTHORIZED) {
            return signOut()
        } else {
            return undefined
        }
    }, [])

    useEffect(() => {
        fetchData('obligations/nodes')
            .then((response: EmbeddedObligationNodes | undefined) => {
                if (response === undefined) return

                if (
                    !CommonUtils.isNullOrUndefined(response['_embedded']) &&
                    !CommonUtils.isNullOrUndefined(response['_embedded']['sw360:obligationNodes'])
                ) {
                    setObligationNodes(response['_embedded']['sw360:obligationNodes'])
                } else {
                    setObligationNodes([])
                }
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return
                }
                const message = error instanceof Error ? error.message : String(error)
                MessageService.error(message)
            })
    }, [
        fetchData,
    ])

    const renderTree = (nodes: TreeNode[], level = 1) => {
        console.log('Rendering level:', level, 'with nodes:', nodes)
        return nodes && nodes.map((node) => (
            <div
                key={node.id}
                style={{
                    marginLeft: `${level * 20}px`,
                }}
                className='tree-row'
            >
                {node?.languageElement != null ? (
                    <div className='row mb-2 align-items-center position-relative'>
                        <div className='col-md-2'>
                            <input
                                type='text'
                                className='form-control'
                                id='obligationType'
                                value={node.type === 'obligationElement' ? 'Obligation' : node.type}
                                hidden={!node?.languageElement}
                                onChange={(e) => {
                                    e.preventDefault()
                                    onUpdateNode(node.id, 'type', e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-md-2'>
                            <input
                                type='text'
                                className='form-control'
                                value={node.languageElement}
                                hidden={!node?.languageElement}
                                onChange={(e) => {
                                    e.preventDefault()
                                    onUpdateNode(node.id, 'languageElement', e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-md-2'>
                            <input
                                type='text'
                                className='form-control'
                                value={node.action}
                                hidden={!node?.languageElement}
                                onChange={(e) => {
                                    e.preventDefault()
                                    onUpdateNode(node.id, 'action', e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-md-2'>
                            <input
                                type='text'
                                className='form-control'
                                value={node.object}
                                hidden={!node?.languageElement}
                                onChange={(e) => {
                                    e.preventDefault()
                                    onUpdateNode(node.id, 'object', e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-md-2 d-flex align-items-center action-buttons opacity-0'>
                            <span>»</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onAddChild(node.id)
                                }}
                            >
                                +Child
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onAddSibling(node.id, node.parentId)
                                }}
                            >
                                +Sibling
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onDeleteNode(node.id, node.parentId)
                                }}
                            >
                                Delete
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSelectedNodeId(node.id)
                                    setShowImportElement(true)
                                }}
                            >
                                Import
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className='row mb-2 align-items-center position-relative'>
                        <div className='col-md-3'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={t('Type')}
                                value={node?.type}
                            // onChange={(e) => onUpdateNode(node.id, 'type', e.target.value)}
                            />
                        </div>
                        <div className='col-md-3'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={t('Text')}
                                value={node?.text}
                            // onChange={(e) => onUpdateNode(node.id, 'text', e.target.value)}
                            />
                        </div>
                        <div className='col-md-3 d-flex align-items-center action-buttons opacity-0'>
                            <span>»</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                            // onClick={(e) => {
                            //     e.preventDefault()
                            //     onAddChild(node.id)
                            // }}
                            >
                                +Child
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                            // onClick={(e) => {
                            //     e.preventDefault()
                            //     onAddSibling(node.id, node.parentId)
                            // }}
                            >
                                +Sibling
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                            // onClick={(e) => {
                            //     e.preventDefault()
                            //     onDeleteNode(node.id, node.parentId)
                            // }}
                            >
                                Delete
                            </a>
                            <span>|</span>
                            <a
                                href='#'
                                className='mx-2'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                }}
                            // onClick={(e) => {
                            //     e.preventDefault()
                            //     setSelectedNodeId(node.id)
                            //     setShowImportElement(true)
                            // }}
                            >
                                Import
                            </a>
                        </div>
                    </div>
                )}
                {node.children.length > 0 && renderTree(node.children, level + 1)}
            </div>
        ))
    }

    console.log('ObligationTree rendered with tree:----', tree)
    return (
        <>
            <ImportElementDialog
                show={showImportElement}
                setShow={setShowImportElement}
                onImport={(element) => {
                    if (selectedNodeId != null) {
                        handleImportElement(element, selectedNodeId)
                    }
                }}
            />
            <div className='col-12'>
                <label
                    className='form-label'
                    style={{
                        fontWeight: 'bold',
                    }}
                >
                    {t('Text')}
                </label>
                <div className='row mb-2 align-items-center'>
                    <div className='col-md-4'>
                        <input
                            type='text'
                            className='form-control'
                            id='textTitle'
                            placeholder={t('Title')}
                            disabled
                            value={title}
                        />
                    </div>
                    <div className='col-md-2'>
                        <span>» </span>
                        <a
                            href='#'
                            onClick={(e) => {
                                e.preventDefault()
                                onAddChild()
                            }}
                            style={{
                                color: 'blue',
                                textDecoration: 'none',
                            }}
                        >
                            +Child
                        </a>
                    </div>
                </div>
                {
                    tree && renderTree(tree.children)
                }
            </div>
        </>
    )
}
