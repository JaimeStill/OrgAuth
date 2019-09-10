import { ConfirmDialog } from './confirm.dialog';

import { AddUserDialog } from './user/add-user.dialog';
import { AdminUserDialog } from './user/admin-user.dialog';
import { UserBinDialog } from './user/user-bin.dialog';
import { UserSettingsDialog } from './user/user-settings.dialog';

import { BriefDialogs } from './brief';
import { ItemDialogs } from './item';
import { OrgDialogs } from './org';

export const Dialogs = [
  ConfirmDialog,
  AddUserDialog,
  AdminUserDialog,
  UserBinDialog,
  UserSettingsDialog,
  ...BriefDialogs,
  ...ItemDialogs,
  ...OrgDialogs
];

export * from './confirm.dialog';

export * from './user/add-user.dialog';
export * from './user/admin-user.dialog';
export * from './user/user-bin.dialog';
export * from './user/user-settings.dialog';

export * from './brief';
export * from './item';
export * from './org';
