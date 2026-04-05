import 'server-only';

export function isAuthenticated(): boolean {
  return true;
}

export function isAuthorized(): boolean {
  return true;
}

export function canManageSpots(): boolean {
  return isAuthenticated() && isAuthorized();
}
