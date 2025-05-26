import { SetMetadata } from '@nestjs/common';
import { Actions, Resources } from 'generated/prisma';

export interface Permission {
  resource: Resources;
  action: Actions;
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
