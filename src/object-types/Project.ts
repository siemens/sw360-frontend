// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.
// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { Links, User } from '@/object-types'

interface Project {
    id?: string
    considerReleasesFromExternalList?: boolean
    additionalData?: object
    businessUnit?: string
    clearingState?: string
    clearingSummary?: string
    contributors?: string[]
    defaultVendorId?: string
    deliveryChannels?: string
    deliveryStart?: string
    description?: string
    domain?: string
    externalIds?: object
    externalUrls?: object
    generalRisks3rdParty?: string
    leadArchitect?: string
    licenseInfoHeaderText?: string
    moderators?: string[]
    name: string
    phaseOutSince?: string
    preevaluationDeadline?: string
    projectResponsible?: string
    projectType: string
    remarksAdditionalRequirements?: string
    specialRisks3rdParty?: string
    specialRisksOSS?: string
    securityResponsibles?: Array<string>
    state?: string
    systemTestEnd?: string
    systemTestStart?: string
    tag?: string
    version?: string
    visibility?: string
    linkedProjects?: {
        [key: string]: {
            projectRelationship: string
            enableSvm: boolean
        }
    }
    _links?: Links
    _embedded?: {
        leadArchitect?: User
        createdBy?: User
    }
}

export default Project