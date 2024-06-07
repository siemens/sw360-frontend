// Copyright (C) TOSHIBA CORPORATION, 2024. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2024. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'
import { Annotations, InputKeyValue, SPDX } from '@/object-types'
import CommonUtils from '@/utils/common.utils'
import { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import styles from '../detail.module.css'
import AnnotationDate from './AnnotationInformation/AnnotationDate'
import Annotator from './AnnotationInformation/Annotator'

interface Props {
    indexAnnotations?: number
    setIndexAnnotations?: React.Dispatch<React.SetStateAction<number>>
    annotationsSPDXs?: Annotations[]
    setAnnotationsSPDXs?: React.Dispatch<React.SetStateAction<Annotations[]>>
    annotationsPackages?: Annotations[]
    setAnnotationsPackages?: React.Dispatch<React.SetStateAction<Annotations[]>>
    SPDXPayload?: SPDX
    setSPDXPayload?: React.Dispatch<React.SetStateAction<SPDX>>
}

const EditAnnotationInformation = ({
    indexAnnotations,
    setIndexAnnotations,
    annotationsSPDXs,
    setAnnotationsSPDXs,
    annotationsPackages,
    setAnnotationsPackages,
    SPDXPayload,
    setSPDXPayload,
}: Props) => {
    const [toggle, setToggle] = useState(false)
    const [changeSource, setChangeSource] = useState(false)
    const [isSourceSPDXDocument, setIsSourceSPDXDocument] = useState<boolean>(true)

    const [dataAnnotator, setDataAnnotator] = useState<InputKeyValue>()
    const handleInputKeyToAnnotator = (data: InputKeyValue) => {
        return data.key + ':' + data.value
    }

    const setAnnotatorToAnnotation = (input: InputKeyValue) => {
        if (isSourceSPDXDocument) {
            const annotationUpdates: Annotations[] = annotationsSPDXs.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        annotator: handleInputKeyToAnnotator(input),
                    }
                }
                return annotation
            })
            setAnnotationsSPDXs(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                spdxDocument: {
                    ...SPDXPayload.spdxDocument,
                    annotations: annotationUpdates,
                },
            })
        } else {
            const annotationUpdates: Annotations[] = annotationsPackages.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        annotator: handleInputKeyToAnnotator(input),
                    }
                }
                return annotation
            })
            setAnnotationsPackages(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                packageInformation: {
                    ...SPDXPayload.packageInformation,
                    annotations: annotationUpdates,
                },
            })
        }
    }

    const handleDataAnnotator = (data: string) => {
        if (CommonUtils.isNullEmptyOrUndefinedString(data)) {
            const input: InputKeyValue = {
                key: 'Organization',
                value: '',
            }
            return input
        }
        const input: InputKeyValue = {
            key: data.split(':')[0],
            value: data.split(':')[1],
        }
        return input
    }

    useEffect(() => {
        if (isSourceSPDXDocument) {
            if (CommonUtils.isNullEmptyOrUndefinedString(annotationsSPDXs[indexAnnotations]?.annotator)) {
                const input: InputKeyValue = {
                    key: 'Organization',
                    value: '',
                }
                setDataAnnotator(input)
            } else {
                setDataAnnotator(handleDataAnnotator(annotationsSPDXs[indexAnnotations]?.annotator))
            }

            if (CommonUtils.isNullEmptyOrUndefinedString(annotationsSPDXs[indexAnnotations]?.annotationDate)) {
                const input: InputKeyValue = {
                    key: '',
                    value: '',
                }
                setDataAnnotationDate(input)
            } else {
                setDataAnnotationDate(handleAnnotationDate(annotationsSPDXs[indexAnnotations]?.annotationDate))
            }
        } else {
            if (CommonUtils.isNullEmptyOrUndefinedString(annotationsPackages[indexAnnotations]?.annotator)) {
                const input: InputKeyValue = {
                    key: 'Organization',
                    value: '',
                }
                setDataAnnotator(input)
            } else {
                setDataAnnotator(handleDataAnnotator(annotationsPackages[indexAnnotations]?.annotator))
            }

            if (CommonUtils.isNullEmptyOrUndefinedString(annotationsPackages[indexAnnotations]?.annotationDate)) {
                const input: InputKeyValue = {
                    key: '',
                    value: '',
                }
                setDataAnnotationDate(input)
            } else {
                setDataAnnotationDate(handleAnnotationDate(annotationsPackages[indexAnnotations]?.annotationDate))
            }
        }
    }, [
        isSourceSPDXDocument,
        indexAnnotations,
        annotationsPackages[indexAnnotations]?.annotator,
        annotationsSPDXs[indexAnnotations]?.annotator,
    ])

    const changeAnnotationSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeSource(!changeSource)
        const relationshipType: string = e.target.value
        if (relationshipType === 'spdxDocument') {
            setIndexAnnotations(0)
            setIsSourceSPDXDocument(true)
            if (!CommonUtils.isNullEmptyOrUndefinedArray(annotationsSPDXs)) {
                setAnnotationsSPDXs(annotationsSPDXs)
                setSPDXPayload({
                    ...SPDXPayload,
                    spdxDocument: {
                        ...SPDXPayload.spdxDocument,
                        annotations: annotationsSPDXs,
                    },
                })
            } else {
                setAnnotationsSPDXs([])
                setSPDXPayload({
                    ...SPDXPayload,
                    spdxDocument: {
                        ...SPDXPayload.spdxDocument,
                        annotations: [],
                    },
                })
            }
        } else if (relationshipType === 'package') {
            setIndexAnnotations(0)
            setIsSourceSPDXDocument(false)
            if (!CommonUtils.isNullEmptyOrUndefinedArray(annotationsPackages)) {
                setAnnotationsPackages(annotationsPackages)
                setSPDXPayload({
                    ...SPDXPayload,
                    packageInformation: {
                        ...SPDXPayload.packageInformation,
                        annotations: annotationsPackages,
                    },
                })
            } else {
                setAnnotationsPackages([])
                setSPDXPayload({
                    ...SPDXPayload,
                    packageInformation: {
                        ...SPDXPayload.packageInformation,
                        annotations: [],
                    },
                })
            }
        }
    }

    const [increIndex, setIncreIndex] = useState(0)
    const [isAdd, setIsAdd] = useState(false)

    const displayIndex = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeSource(false)
        const index: string = e.target.value
        if (isSourceSPDXDocument) {
            setIndexAnnotations(parseInt(index))
            setNumberIndexSPDX(parseInt(index))
            if (parseInt(index) === increIndex) {
                setIsAdd(true)
            } else {
                setIncreIndex(parseInt(index))
            }
        } else {
            if (parseInt(index) === increIndex) {
                setIsAdd(true)
            } else {
                setIncreIndex(parseInt(index))
            }
            setIndexAnnotations(parseInt(index))
            setNumberIndexPackage(parseInt(index))
        }
    }

    const addAnnotationsSPDXsSPDX = () => {
        setChangeSource(false)
        const arrayExternals: Annotations[] = [...annotationsSPDXs]
        setIncreIndex(annotationsSPDXs.length)
        setNumberIndexSPDX(annotationsSPDXs.length)
        setIsAdd(true)
        if (CommonUtils.isNullEmptyOrUndefinedArray(annotationsPackages)) {
            setIndexAnnotations(0)
        }
        const relationshipsBetweenSPDXElements: Annotations = {
            annotator: '', // 12.1
            annotationDate: '', // 12.2
            annotationType: '', // 12.3
            spdxIdRef: '', // 12.4
            annotationComment: '', // 12.5
            index: annotationsSPDXs.length,
        }
        setDataAnnotationDate({
            key: '',
            value: '',
        })
        setIndexAnnotations(annotationsSPDXs.length)
        arrayExternals.push(relationshipsBetweenSPDXElements)
        setAnnotationsSPDXs(arrayExternals)
        setSPDXPayload({
            ...SPDXPayload,
            spdxDocument: {
                ...SPDXPayload.spdxDocument,
                annotations: arrayExternals,
            },
        })
    }

    const addAnnotationsSPDXsPackage = () => {
        setChangeSource(false)
        const arrayExternals: Annotations[] = [...annotationsPackages]
        setIncreIndex(annotationsPackages.length)
        setIsAdd(true)
        setNumberIndexPackage(annotationsPackages.length)
        if (CommonUtils.isNullEmptyOrUndefinedArray(annotationsPackages)) {
            setIndexAnnotations(0)
        }
        const relationshipsBetweenSPDXElements: Annotations = {
            annotator: '', // 12.1
            annotationDate: '', // 12.2
            annotationType: '', // 12.3
            spdxIdRef: '', // 12.4
            annotationComment: '', // 12.5
            index: annotationsPackages.length,
        }
        setDataAnnotationDate({
            key: '',
            value: '',
        })
        setIndexAnnotations(annotationsPackages.length)
        arrayExternals.push(relationshipsBetweenSPDXElements)
        setAnnotationsPackages(arrayExternals)
        setSPDXPayload({
            ...SPDXPayload,
            packageInformation: {
                ...SPDXPayload.packageInformation,
                annotations: arrayExternals,
            },
        })
    }

    const addAnnotation = () => {
        isSourceSPDXDocument ? addAnnotationsSPDXsSPDX() : addAnnotationsSPDXsPackage()
    }

    const updateField = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        if (isSourceSPDXDocument) {
            const annotationUpdates: Annotations[] = annotationsSPDXs.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        [e.target.name]: e.target.value,
                    }
                }
                return annotation
            })
            setAnnotationsSPDXs(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                spdxDocument: {
                    ...SPDXPayload.spdxDocument,
                    annotations: annotationUpdates,
                },
            })
        } else {
            const annotationUpdates: Annotations[] = annotationsPackages.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        [e.target.name]: e.target.value,
                    }
                }
                return annotation
            })
            setAnnotationsPackages(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                packageInformation: {
                    ...SPDXPayload.packageInformation,
                    annotations: annotationUpdates,
                },
            })
        }
    }

    const [dataAnnotationDate, setDataAnnotationDate] = useState<InputKeyValue>()
    const handleAnnotationDate = (data: string) => {
        const input: InputKeyValue = {
            key: CommonUtils.fillDate(data),
            value: CommonUtils.fillTime(data),
        }
        return input
    }

    const convertInputToAnnotationDate = (data: InputKeyValue) => {
        if (data.key == '' || data.value == '') {
            return ''
        }
        const localDate = new Date(data.key + ' ' + data.value)
        if (isNaN(+localDate)) return
        return localDate.toISOString().slice(0, -5) + 'Z'
    }

    const setAnnotationDate = (input: InputKeyValue) => {
        if (isSourceSPDXDocument) {
            const annotationUpdates = annotationsSPDXs.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        annotationDate: convertInputToAnnotationDate(input),
                    }
                }
                return annotation
            })
            setAnnotationsSPDXs(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                spdxDocument: {
                    ...SPDXPayload.spdxDocument,
                    annotations: annotationUpdates,
                },
            })
        } else {
            const annotationUpdates = annotationsPackages.map((annotation, index) => {
                if (index === indexAnnotations) {
                    return {
                        ...annotation,
                        annotationDate: convertInputToAnnotationDate(input),
                    }
                }
                return annotation
            })
            setAnnotationsPackages(annotationUpdates)
            setSPDXPayload({
                ...SPDXPayload,
                packageInformation: {
                    ...SPDXPayload.packageInformation,
                    annotations: annotationUpdates,
                },
            })
        }
    }

    const [numberIndexSPDX, setNumberIndexSPDX] = useState<number>(0)
    const [numberIndexPackage, setNumberIndexPackage] = useState<number>(0)
    const [isDeleteSucces, setIsDeleteSucces] = useState(false)

    const deleteAnnotation = () => {
        if (isSourceSPDXDocument) {
            if (annotationsSPDXs.length == 1) {
                setAnnotationsSPDXs([])
                setSPDXPayload({
                    ...SPDXPayload,
                    spdxDocument: {
                        ...SPDXPayload.spdxDocument,
                        annotations: [],
                    },
                })
            } else {
                let annotations: Annotations[] = []
                annotations = annotationsSPDXs.filter((annotations) => numberIndexSPDX != annotations.index)
                for (let index = 0; index < annotations.length; index++) {
                    annotations[index].index = index
                }
                setAnnotationsSPDXs(annotations)
                setSPDXPayload({
                    ...SPDXPayload,
                    spdxDocument: {
                        ...SPDXPayload.spdxDocument,
                        annotations: annotations,
                    },
                })
                setNumberIndexSPDX(indexAnnotations)
                setIsDeleteSucces(true)
                setIndexAnnotations(0)
                if (!CommonUtils.isNullEmptyOrUndefinedArray(annotations)) {
                    setNumberIndexSPDX(annotations[0].index)
                }
            }
        } else {
            if (annotationsPackages.length == 1) {
                setAnnotationsPackages([])
                setSPDXPayload({
                    ...SPDXPayload,
                    packageInformation: {
                        ...SPDXPayload.packageInformation,
                        annotations: [],
                    },
                })
            } else {
                let annotations: Annotations[] = []
                annotations = annotationsPackages.filter((annotations) => numberIndexPackage != annotations.index)
                for (let index = 0; index < annotations.length; index++) {
                    annotations[index].index = index
                }
                setAnnotationsPackages(annotations)
                setSPDXPayload({
                    ...SPDXPayload,
                    packageInformation: {
                        ...SPDXPayload.packageInformation,
                        annotations: annotations,
                    },
                })
                setNumberIndexPackage(indexAnnotations)
                setIsDeleteSucces(true)
                setIndexAnnotations(0)
                if (!CommonUtils.isNullEmptyOrUndefinedArray(annotations)) {
                    setNumberIndexPackage(annotations[0].index)
                }
            }
        }
    }

    return (
        <table className={`table label-value-table ${styles['summary-table']}`}>
            <thead
                title='Click to expand or collapse'
                onClick={() => {
                    setToggle(!toggle)
                }}
            >
                <tr>
                    <th colSpan={3}>12. Annotation Information</th>
                </tr>
            </thead>
            <tbody hidden={toggle}>
                <tr>
                    <td>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '0.75rem',
                                paddingLeft: '1rem',
                            }}
                        >
                            <label
                                htmlFor='selectAnnotationSource'
                                style={{ textDecoration: 'underline' }}
                                className='sub-title lableSPDX'
                            >
                                Select Source
                            </label>
                            <select
                                id='selectAnnotationSource'
                                className='form-control spdx-select always-enable form-select'
                                style={{ marginRight: '4rem' }}
                                onChange={changeAnnotationSource}
                            >
                                <option value='spdxDocument'>SPDX Document</option>
                                <option value='package'>Package</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '0.75rem' }}>
                                <label
                                    htmlFor='selectAnnotation'
                                    style={{ textDecoration: 'underline' }}
                                    className='sub-title lableSPDX'
                                >
                                    Select Annotation
                                </label>
                                <select
                                    id='selectAnnotation'
                                    className='form-control spdx-select form-select'
                                    onChange={displayIndex}
                                    disabled={
                                        isSourceSPDXDocument
                                            ? CommonUtils.isNullEmptyOrUndefinedArray(annotationsSPDXs)
                                            : CommonUtils.isNullEmptyOrUndefinedArray(annotationsPackages)
                                    }
                                    value={
                                        changeSource
                                            ? 0
                                            : isAdd
                                            ? isDeleteSucces
                                                ? indexAnnotations
                                                : increIndex
                                            : isSourceSPDXDocument
                                            ? numberIndexSPDX
                                            : numberIndexPackage
                                    }
                                >
                                    {isSourceSPDXDocument
                                        ? annotationsSPDXs.map((item) => (
                                              <option key={item.index} value={item.index}>
                                                  {item.index + 1}
                                              </option>
                                          ))
                                        : annotationsPackages.map((item) => (
                                              <option key={item.index} value={item.index}>
                                                  {item.index + 1}
                                              </option>
                                          ))}
                                </select>
                                <FaTrashAlt className='spdx-delete-icon-main-index' onClick={deleteAnnotation} />
                            </div>
                            <button className='spdx-add-button-main' name='add-annotation' onClick={addAnnotation}>
                                Add new Annotation
                            </button>
                        </div>
                    </td>
                </tr>
                {(isSourceSPDXDocument
                    ? annotationsSPDXs[indexAnnotations]
                    : annotationsPackages[indexAnnotations]) && (
                    <>
                        <tr>
                            <td>
                                <div style={{ display: 'flex' }}>
                                    <Annotator
                                        dataAnnotator={dataAnnotator}
                                        setDataAnnotator={setDataAnnotator}
                                        setAnnotatorToAnnotation={setAnnotatorToAnnotation}
                                    />
                                    <AnnotationDate
                                        dataAnnotationDate={dataAnnotationDate}
                                        setDataAnnotationDate={setDataAnnotationDate}
                                        setAnnotationDate={setAnnotationDate}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ display: 'flex' }}>
                                    <div className='form-group' style={{ flex: 1, marginRight: '1rem' }}>
                                        <label htmlFor='annotationType' className='lableSPDX'>
                                            12.3 Annotation type
                                        </label>
                                        <input
                                            id='annotationType'
                                            className='form-control'
                                            type='text'
                                            placeholder='Enter annotation type'
                                            name='annotationType'
                                            onChange={updateField}
                                            value={
                                                isSourceSPDXDocument
                                                    ? annotationsSPDXs[indexAnnotations]?.annotationType ?? ''
                                                    : annotationsPackages[indexAnnotations]?.annotationType ?? ''
                                            }
                                        />
                                    </div>
                                    <div className='form-group' style={{ flex: 1 }}>
                                        <label htmlFor='spdxIdRef' className='lableSPDX'>
                                            12.4 SPDX identifier reference
                                        </label>
                                        <input
                                            id='spdxIdRef'
                                            className='form-control'
                                            name='spdxIdRef'
                                            type='text'
                                            placeholder='Enter SPDX identifier reference'
                                            onChange={updateField}
                                            value={
                                                isSourceSPDXDocument
                                                    ? annotationsSPDXs[indexAnnotations]?.spdxIdRef ?? ''
                                                    : annotationsPackages[indexAnnotations]?.spdxIdRef ?? ''
                                            }
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='form-group'>
                                    <label htmlFor='annotationComment' className='lableSPDX'>
                                        12.5 Annotation comment
                                    </label>
                                    <textarea
                                        className='form-control'
                                        id='annotationComment'
                                        rows={5}
                                        placeholder='Enter annotation comment'
                                        name='annotationComment'
                                        onChange={updateField}
                                        value={
                                            isSourceSPDXDocument
                                                ? annotationsSPDXs[indexAnnotations]?.annotationComment ?? ''
                                                : annotationsPackages[indexAnnotations]?.annotationComment ?? ''
                                        }
                                    ></textarea>
                                </div>
                            </td>
                        </tr>
                    </>
                )}
            </tbody>
        </table>
    )
}

export default EditAnnotationInformation
