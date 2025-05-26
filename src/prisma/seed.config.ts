import { Actions, Resources } from 'generated/prisma';

export const seedRoles = [
  {
    name: 'ROOT',
    description: 'Superuser with full access',
    permissions: Object.values(Resources).map((resource) => ({
      resource,
      permissions: Object.values(Actions),
    })),
  },
  {
    name: 'ADMIN',
    description: 'Administrator with elevated privileges',
    permissions: [
      {
        resource: Resources.USERS,
        permissions: [Actions.READ],
      },
      {
        resource: Resources.ORDERS,
        permissions: [Actions.READ],
      },
      {
        resource: Resources.PRODUCTS,
        permissions: [Actions.CREATE],
      },
    ],
  },
];
