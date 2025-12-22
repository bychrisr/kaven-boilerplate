/**
 * Users Page
 * Now using sections architecture pattern
 * Simple page that just imports and renders UserView
 */

import { UserView } from '@/sections/user';

export default function UsersPage() {
  return <UserView />;
}
