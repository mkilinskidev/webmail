import Vue from 'vue'
import _ from 'lodash'

import typesUtils from 'src/utils/types'

import enums from 'src/enums'

import GroupModel from 'src/classes/group'

class UserModel {
  constructor (tenantId, serverData, completeData = null) {
    const UserRoles = enums.getUserRoles()

    this.tenantId = tenantId
    this.id = typesUtils.pInt(serverData?.Id)
    this.name = typesUtils.pString(serverData?.Name)
    this.publicId = typesUtils.pString(serverData?.PublicId)
    this.role = typesUtils.pEnum(serverData?.Role, UserRoles, UserRoles.Anonymous)
    this.uuid = typesUtils.pString(serverData?.UUID)
    this.quotaBytes = typesUtils.pInt(serverData?.QuotaBytes)

    Vue.set(this, 'groups', typesUtils.pArray(serverData.Groups).map(groupData => new GroupModel(groupData)))

    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    this.completeData = data

    this.update(data)
  }

  update (data, allTenantGroups = null) {
    const UserRoles = enums.getUserRoles()
    if (data !== null) {
      this.role = typesUtils.pEnum(data?.Role, UserRoles, UserRoles.Anonymous)
    }
    this.writeSeparateLog = typesUtils.pBool(data?.WriteSeparateLog)

    if (data?.PublicId) {
      this.publicId = typesUtils.pString(data?.PublicId)
    }

    if (data?.QuotaBytes) {
      this.quotaBytes = typesUtils.pInt(data?.QuotaBytes)
    }

    if (_.isArray(allTenantGroups)) {
      const groupIds = typesUtils.pArray(data?.GroupIds)
      Vue.set(this, 'groups', groupIds.map(id => allTenantGroups.find(group => group.id === id)))
    }
  }

  addGroup (groupToAdd) {
    if (!this.groups.find(group => group.id === groupToAdd.id)) {
      Vue.set(this, 'groups', this.groups.concat([groupToAdd]))
    }
  }

  removeGroup (groupToRemove) {
    Vue.set(this, 'groups', this.groups.filter(group => group.id !== groupToRemove.id))
  }

  getData (field) {
    return this.completeData && this.completeData[field]
  }

  updateData (fieldsData) {
    if (!_.isEmpty(this.completeData)) {
      fieldsData.forEach(data => {
        this.completeData[data.field] = data.value
      })
    }
  }
}

export default UserModel
