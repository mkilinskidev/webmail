export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../ActiveServer/vue/manager'),
      await import('src/../../../BrandingWebclient/vue/manager'),
      await import('src/../../../CalendarWebclient/vue/manager'),
      await import('src/../../../CoreWebclient/vue/manager'),
      await import('src/../../../CpanelIntegrator/vue/manager'),
      await import('src/../../../Dropbox/vue/manager'),
      await import('src/../../../Facebook/vue/manager'),
      await import('src/../../../FilesWebclient/vue/manager'),
      await import('src/../../../GMailConnector/vue/manager'),
      await import('src/../../../Google/vue/manager'),
      await import('src/../../../LicensingWebclient/vue/manager'),
      await import('src/../../../LogsViewerWebclient/vue/manager'),
      await import('src/../../../MailChangePasswordPoppassdPlugin/vue/manager'),
      await import('src/../../../MailMasterPassword/vue/manager'),
      await import('src/../../../MailWebclient/vue/manager'),
      await import('src/../../../MobileSyncWebclient/vue/manager'),
      await import('src/../../../S3Filestorage/vue/manager'),
      await import('src/../../../TwoFactorAuth/vue/manager'),
    ]
  },
}
