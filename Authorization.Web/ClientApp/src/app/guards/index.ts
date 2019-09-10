import { AdminGuard } from './admin-guard';
import { OrgGuard } from './org-guard';

export const Guards = [
  AdminGuard,
  OrgGuard
];

export * from './admin-guard';
export * from './org-guard';
