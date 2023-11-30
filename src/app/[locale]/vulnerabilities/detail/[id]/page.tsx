// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { HttpStatus, Resource, Vulnerability } from '@/object-types'
import { ApiUtils } from '@/utils'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import ProjectTab from './components/ProjectTab'
import Summary from './components/Summary'

export const metadata: Metadata = {
    title: 'Vulnerabilites',
}

interface Context {
    params: { id: string }
}

async function getVulnerabilityDetail(vulnerabilityId: string): Promise<Resource<Vulnerability>> {
    try {
        const session = await getServerSession(authOptions)

        const response = await ApiUtils.GET(`vulnerabilities/${vulnerabilityId}`, session.user.access_token)

        const data = await response.json()

        return {
            resource: response.status === HttpStatus.OK ? data : null,
            status: response.status as HttpStatus,
        }
    } catch (e) {
        console.error(e)
        return {
            resource: null,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }
    }
}

export default async function VulnerabilityDetail({ params }: Context) {
    try {
        const vulnerability = await getVulnerabilityDetail(params.id)

        if (vulnerability.status === HttpStatus.UNAUTHORIZED) return redirect('/')

        if (vulnerability.status !== HttpStatus.OK) return notFound()
        return (
            <>
                <div className='ms-5 mt-2'>
                    <ProjectTab summary={<Summary summaryData={vulnerability.resource} />} />
                </div>
            </>
        )
    } catch (e) {
        console.error(e)
        notFound()
    }
}
