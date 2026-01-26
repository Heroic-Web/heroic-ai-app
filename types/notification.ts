export type NotificationType =
  | 'quota'
  | 'tool'
  | 'workflow'
  | 'system'
  | 'info'

export type Notification = {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
}