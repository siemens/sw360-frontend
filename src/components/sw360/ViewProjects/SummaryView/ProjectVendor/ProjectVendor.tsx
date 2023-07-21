// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

"use client"

export default function ProjectVendor() {

    return (
        <>
            <div className="row mb-4">
                <div className="row header mb-2">
                    <h6>Project Version</h6>
                </div>
                <div className="row">
                    <div className="col-lg-4">{"Full Name"}:</div>
                    <div className="col"></div>
                    <hr className="my-2" />
                </div>
                <div className="row">
                    <div className="col-lg-4">{"Short Name"}:</div>
                    <div className="col"></div>
                    <hr className="my-2" />
                </div>
                <div className="row">
                    <div className="col-lg-4">{"URL"}:</div>
                    <div className="col"></div>
                    <hr className="my-2" />
                </div>
            </div>
        </>
    )
}