'use client';

import { UserEditView } from '@/sections/user/view/user-edit-view';
import { useParams } from 'next/navigation';

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;

  return <UserEditView userId={userId} />;
}
