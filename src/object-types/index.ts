// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

// Interfaces
import AddtionalDataType from './AddtionalDataType'
import AdministrationDataType from './AdministrationDataType'
import Attachment from './Attachment'
import AuthToken from './AuthToken'
import COTSDetails from './COTSDetails'
import CVEReference from './CVEReference'
import Changelogs from './Changelogs'
import ClearingInformation from './ClearingInformation'
import Component from './Component'
import ComponentOwner from './ComponentOwner'
import ComponentOwnerType from './ComponentOwnerType'
import ComponentPayload from './ComponentPayLoad'
import ECCInformation from './ECCInformation'
import Embedded from './Embedded'
import FossologyProcessInfo from './FossologyProcessInfo'
import FossologyProcessStatus from './FossologyProcessStatus'
import InputKeyValue from './InputKeyValue'
import Licenses from './Licenses'
import LicensesType from './LicensesType'
import LinkedAttachments from './LinkedAttachments'
import LinkedRelease from './LinkedRelease'
import LinkedVulnerability from './LinkedVulnerability'
import Links from './Links'
import Moderators from './Moderators'
import ModeratorsType from './ModeratorsType'
import NodeData from './NodeData'
import OAuthClient from './OAuthClient'
import Project from './Project'
import ProjectReleaseEcc from './ProjectReleaseEcc'
import Release from './Release'
import ReleaseDetail from './ReleaseDetail'
import ReleaseLink from './ReleaseLink'
import Repository from './Repository'
import RequestContent from './RequestContent'
import { Resource } from './Resource'
import Resources from './Resources'
import RestrictedResource from './RestrictedResource'
import RolesType from './RolesType'
import SearchResult from './SearchResult'
import Session from './Session'
import SummaryDataType from './SummaryDataType'
import ToastData from './ToastData'
import User from './User'
import UserCredentialInfo from './UserCredentialInfo'
import Vendor from './Vendor'
import VendorAdvisory from './VendorAdvisory'
import VendorType from './VendorType'
import VerificationStateInfo from './VerificationStateInfo'
import Vulnerability from './Vulnerability'

export type {
    AddtionalDataType,
    AdministrationDataType,
    Attachment,
    AuthToken,
    COTSDetails,
    CVEReference,
    Changelogs,
    ClearingInformation,
    Component,
    ComponentOwner,
    ComponentOwnerType,
    ComponentPayload,
    ECCInformation,
    Embedded,
    FossologyProcessInfo,
    FossologyProcessStatus,
    InputKeyValue,
    Licenses,
    LicensesType,
    LinkedAttachments,
    LinkedRelease,
    LinkedVulnerability,
    Links,
    Moderators,
    ModeratorsType,
    NodeData,
    OAuthClient,
    Project,
    ProjectReleaseEcc,
    Release,
    ReleaseDetail,
    ReleaseLink,
    Repository,
    RequestContent,
    Resource,
    Resources,
    RestrictedResource,
    RolesType,
    SearchResult,
    Session,
    SummaryDataType,
    ToastData,
    User,
    UserCredentialInfo,
    Vendor,
    VendorAdvisory,
    VendorType,
    VerificationStateInfo,
    Vulnerability,
}

// Enums
import ActionType from './enums/ActionType'
import AttachmentType from './enums/AttachmentTypes'
import CommonTabIds from './enums/CommonTabsIds'
import ComponentTabIds from './enums/ComponentTabIds'
import DocumentTypes from './enums/DocumentTypes'
import HttpStatus from './enums/HttpStatus'
import ReleaseTabIds from './enums/ReleaseTabIds'
import VulnerabilitiesVerificationState from './enums/VulnerabilitiesVerificationState'

export {
    ActionType,
    AttachmentType,
    CommonTabIds,
    ComponentTabIds,
    DocumentTypes,
    HttpStatus,
    ReleaseTabIds,
    VulnerabilitiesVerificationState,
}
