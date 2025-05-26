export enum Resources {
  USERS = 'users',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  ROLES = 'roles',
}

export enum Actions {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface IPermission {
  resource: Resources;
  permissions: Actions[]; // Array of allowed actions on this resource
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: IPermission[];
}

export interface IUserOverrides {
  resource: Resources;
  deniedPermissions?: Actions[]; // Actions denied for this user on the resource
  allowedPermissions?: Actions[]; // (optional) Actions allowed that override role
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  role: IRole;
  overrides?: IUserOverrides[]; // User-specific permission overrides
}

export function canUserPerformAction(
  user: IUser,
  resource: Resources,
  action: Actions,
): boolean {
  // Check user-specific overrides first
  if (user.overrides) {
    const override = user.overrides.find((o) => o.resource === resource);
    if (override) {
      if (override.deniedPermissions?.includes(action)) {
        return false; // explicitly denied for this user
      }
      if (override.allowedPermissions?.includes(action)) {
        return true; // explicitly allowed for this user
      }
    }
  }

  // Fallback to role permissions
  const rolePerm = user.role.permissions.find((p) => p.resource === resource);
  if (!rolePerm) return false;

  return rolePerm.permissions.includes(action);
}
