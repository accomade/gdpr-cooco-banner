export type CookieType= 'necessary' | 'tracking' | 'analytics' | 'marketing'

export interface CookieChoice {
  value: boolean
}

export interface Translation {
  heading: string
  description: string
  acceptLabel: string
  rejectLabel: string
  settingsLabel: string
  closeLabel: string
  editLabel: string
  
  cookieLabels: {[key in CookieType]?: string}
  cookieDescriptions: {[key in CookieType]?: string} 
}