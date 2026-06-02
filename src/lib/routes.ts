// Application route helpers and navigation constants from routes
﻿export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  projects: "/dashboard/projects",
  patterns: "/dashboard/patterns",
  architectures: "/dashboard/architectures",
  admin: "/admin",
  login: (next?: string) =>
    next ? `/?login=1&next=${encodeURIComponent(next)}` : "/?login=1",
} as const;

export function dashboardResourceList(resource: string) {
  return `/dashboard/${resource}`;
}

export function dashboardResourceNew(resource: string) {
  return `/dashboard/${resource}/new`;
}

export function dashboardResourceDetail(resource: string, id: string) {
  return `/dashboard/${resource}/${id}`;
}

export function isSafeInternalPath(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export function getPostLoginPath(
  user: { is_authorized: boolean },
  next?: string | null
): string {
  if (isSafeInternalPath(next)) {
    return next;
  }
  return user.is_authorized ? ROUTES.admin : ROUTES.dashboard;
}

