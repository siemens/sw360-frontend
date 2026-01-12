// Copyright (C) TOSHIBA CORPORATION, 2025. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2025. Part of the SW360 Frontend Project.
// Copyright (C) Siemens AG, 2026. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { useEffect, useState } from 'react'
import { ObligationElement, TreeNode } from '../../../../../object-types/Obligation'

interface ObligationTreeReturn {
    tree: TreeNode | undefined
    treeText: string
    addChild: (parentId?: string) => void
    addSibling: (nodeId: string, parentId?: string) => void
    deleteNode: (nodeId: string, parentId?: string) => void
    updateNode: (
        nodeId: string,
        field: 'type' | 'text' | 'languageElement' | 'action' | 'object',
        value: string,
    ) => void
    updateNodeElement: (nodeId: string, element: ObligationElement) => void
}

export function useObligationTree(initialText?: string, initialTree?: string): ObligationTreeReturn {
    const [tree, setTree] = useState<TreeNode>()
    const [treeText, setTreeText] = useState(initialText ?? '')
    const generateId = () => Math.random().toString(36).substring(2, 11)
    const getTreeAsText = (nodes: TreeNode, level = 0): string => {
        let result = ''
        nodes.children.forEach((node, index) => {
            const indent = level > 0 ? '\t'.repeat(level) : ''
            let nodeText = ''
            if (node.languageElement != null) {
                nodeText = `${node.languageElement} ${node.action} ${node.object}`.trim()
            } else {
                nodeText = `${node.type} ${node.text}`.trim()
            }
            result += index === 0 && level === 0 ? nodeText : `\n${indent}${nodeText}`
            if (node.children.length > 0) {
                result += getTreeAsText({ ...node, children: node.children }, level + 1)
            }
        })
        return result
    }

    const addChild = (parentId?: string) => {
        if (!tree) return
        const newNode: TreeNode = {
            id: generateId(),
            type: '',
            text: '',
            children: [],
            parentId,
        }
        const updatedTree : TreeNode =
            parentId != null
                ? {
                    ...tree,
                    children: updateChildren(
                        tree.children,
                        parentId,
                        newNode,
                    ),
                }
                : {
                    ...tree,
                    children: [...tree.children, newNode],
                }
        setTree(updatedTree)
        setTreeText(getTreeAsText(updatedTree))
    }

    const updateChildren = (children: TreeNode[],
                            parentId: string,
                            newNode: TreeNode):
                                TreeNode[] => {
        return children.map((child) =>
            child.id === parentId
                ? {
                      ...child,
                      children: [
                          ...child.children,
                          newNode,
                      ],
                  }
                : {
                      ...child,
                      children: updateChildren(child.children,
                                               parentId,
                                               newNode),
                  },
        )
    }

    const addSibling = (nodeId: string, parentId?: string) => {
        const newNode: TreeNode = {
            id: generateId(),
            type: '',
            text: '',
            children: [],
            parentId,
        }
        const updatedTree =
            parentId != null
                ? tree.map((node) =>
                      node.id === parentId
                          ? {
                                ...node,
                                children: [
                                    ...node.children,
                                    newNode,
                                ],
                            }
                          : {
                                ...node,
                                children: updateChildren(node.children, parentId, newNode),
                            },
                  )
                : [
                      ...tree,
                      newNode,
                  ]
        setTree(updatedTree)
        setTreeText(getTreeAsText(updatedTree))
    }

    const deleteNode = (nodeId: string, parentId?: string) => {
        const updatedTree =
            parentId != null
                ? tree.map((node) =>
                      node.id === parentId
                          ? {
                                ...node,
                                children: node.children.filter((child) => child.id !== nodeId),
                            }
                          : {
                                ...node,
                                children: deleteFromChildren(node.children, nodeId),
                            },
                  )
                : tree.filter((node) => node.id !== nodeId)
        setTree(updatedTree)
        setTreeText(getTreeAsText(updatedTree))
    }

    const deleteFromChildren = (children: TreeNode[], nodeId: string): TreeNode[] => {
        return children
            .map((child) => ({
                ...child,
                children: deleteFromChildren(child.children, nodeId),
            }))
            .filter((child) => child.id !== nodeId)
    }

    const updateNode = (
        nodeId: string,
        field: 'type' | 'text' | 'languageElement' | 'action' | 'object',
        value: string,
    ) => {
     const updateRecursively = (node: TreeNode): TreeNode => {
        console.log('Updating node:--', nodeId, field, value)
            if (node.id === nodeId) {
                return {
                    ...node,
                    [field]: value,
                }
            }
            return {
                ...node,
                children: node.children.map(updateRecursively),
            }
        }
        if (tree === undefined) return
        const updatedTree = updateRecursively(tree)
        console.log('Updated tree: at update tree', updatedTree)
        setTreeText(getTreeAsText(updatedTree))
        setTree(updatedTree)
    }

    const updateNodeElement = (nodeId: string, element: ObligationElement) => {
        const updateNodeInTree = (nodes: TreeNode): TreeNode => {
            return nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        ['languageElement']: element.languageElement,
                        ['action']: element.action,
                        ['object']: element.object,
                    }
                }
                return {
                    ...node,
                    children: updateNodeInTree(node.children),
                }
            })
        }
        const updatedTree = updateNodeInTree(tree)
        setTree(updatedTree)
        setTreeText(getTreeAsText(updatedTree))
    }

    const renameTree = (node: TreeNode): TreeNode => {
        const normalized: TreeNode | undefined = { ...node }
        // console.log('Normalizing node:', normalized)

        // rename langElement → languageElement if present
        if ("langElement" in normalized && !("languageElement" in normalized)) {
            normalized.languageElement = normalized.langElement as string
            delete normalized.langElement
        }

        normalized.children = Array.isArray(normalized.children)
            ? normalized.children.map((child: TreeNode) => {
                const childWithParent = {
                ...child,
                parentId: normalized.id,
                };
                return renameTree(childWithParent);
            })
            : []

    return normalized as TreeNode
    }

    const parseTextToTree = (text: string): TreeNode => {
        if (!text.trim()) return {} as TreeNode
        const rootNodes: TreeNode = JSON.parse(text);
        const tree : TreeNode = renameTree(rootNodes);
        // const blob = new Blob([JSON.stringify(tree, null, 2)], {
        //                         type: "application/json",
        //                     })
        // const url = URL.createObjectURL(blob)
        // const a = document.createElement("a")
        // a.href = url
        // a.download = "tree.json"
        // a.click()
        // URL.revokeObjectURL(url)
        // console.log(tree)
        return tree
    }

    useEffect(() => {
        if (initialTree !== undefined) {
            const parsedTree = parseTextToTree(initialTree)
            setTree(parsedTree)
        }
    }, [])

    return {
        tree,
        treeText,
        addChild,
        addSibling,
        deleteNode,
        updateNode,
        updateNodeElement,
    }
}
