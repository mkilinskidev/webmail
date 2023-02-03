import _ from 'lodash'

import typesUtils from 'src/utils/types'

class CalendarSettings {
  constructor (appData) {
    const calendarWebclientData = typesUtils.pObject(appData.Calendar)
    if (!_.isEmpty(calendarWebclientData)) {
      this.allowTasks = typesUtils.pBool(calendarWebclientData.AllowTasks)
      this.defaultTab = typesUtils.pInt(calendarWebclientData.DefaultTab) // 1 - day, 2 - week, 3 - month
      this.highlightWorkingDays = typesUtils.pBool(calendarWebclientData.HighlightWorkingDays)
      this.highlightWorkingHours = typesUtils.pBool(calendarWebclientData.HighlightWorkingHours)
      this.publicCalendarId = typesUtils.pString(calendarWebclientData.PublicCalendarId)
      this.weekStartsOn = typesUtils.pInt(calendarWebclientData.WeekStartsOn); // 0 - sunday
      this.workdayEnds = typesUtils.pInt(calendarWebclientData.WorkdayEnds)
      this.workdayStarts = typesUtils.pInt(calendarWebclientData.WorkdayStarts)
    }
  }

  saveCalendarSettings ({ highlightWorkingDays, highlightWorkingHours, workdayStarts, workdayEnds, weekStartsOn, defaultTab }) {
    this.defaultTab = defaultTab
    this.highlightWorkingDays = highlightWorkingDays
    this.highlightWorkingHours = highlightWorkingHours
    this.weekStartsOn = weekStartsOn
    this.workdayEnds = workdayEnds
    this.workdayStarts = workdayStarts
  }
}

let settings = null

export default {
  init (appData) {
    settings = new CalendarSettings(appData)
  },
  saveCalendarSettings (data) {
    settings.saveCalendarSettings(data)
  },
  getCalendarSettings () {
    return {
      highlightWorkingDays: settings.highlightWorkingDays,
      highlightWorkingHours: settings.highlightWorkingHours,
      workdayStarts: settings.workdayStarts,
      workdayEnds: settings.workdayEnds,
      weekStartsOn: settings.weekStartsOn,
      defaultTab: settings.defaultTab
    }
  },

}
