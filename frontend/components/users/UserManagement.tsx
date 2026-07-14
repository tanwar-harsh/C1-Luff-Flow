'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { UserTable } from '@/components/users/UserTable';
import { CreateUserForm, EditUserForm } from '@/components/users/UserForm';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { UserSummary } from '@/types/domain';
import {
  createUser,
  deleteUser,
  fetchUsersPaginated,
  PaginatedUsers,
  updateUser,
} from '@/services/userService';
import { parseApiError } from '@/utils/errors';
import { CreateUserFormData, UpdateUserFormData } from '@/utils/validators';

export function UserManagement() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'none' | 'create' | 'edit'>('none');
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadUsers = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsersPaginated(pageNum, 10);
      setData(result);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/login?redirect=/admin/users');
      return;
    }
    if (isAdmin) {
      loadUsers(page);
    }
  }, [authLoading, isAdmin, page, loadUsers, router]);

  const handleCreate = async (formData: CreateUserFormData) => {
    setFormError(null);
    try {
      await createUser(formData);
      setFormMode('none');
      await loadUsers(page);
    } catch (err) {
      const parsed = parseApiError(err);
      setFormError(parsed.message);
      throw parsed;
    }
  };

  const handleUpdate = async (formData: UpdateUserFormData) => {
    if (!editingUser) return;
    setFormError(null);
    try {
      await updateUser(editingUser.id, formData);
      setFormMode('none');
      setEditingUser(null);
      await loadUsers(page);
    } catch (err) {
      const parsed = parseApiError(err);
      setFormError(parsed.message);
      throw parsed;
    }
  };

  const handleDelete = async (user: UserSummary) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await deleteUser(user.id);
      await loadUsers(page);
    } catch (err) {
      setError(parseApiError(err).message);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <PageContainer title="User Management">
        <p className="text-body-md text-on-surface-variant">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="User Management"
      subtitle="Create, edit, and manage user accounts and roles"
    >
      <div className="mb-4 flex justify-end">
        {formMode === 'none' && (
          <Button onClick={() => { setFormMode('create'); setFormError(null); }}>
            Add User
          </Button>
        )}
      </div>

      {error && <Alert message={error} />}

      {formMode === 'create' && (
        <div className="mb-6 rounded-lg bg-surface-container-lowest p-6">
          <h2 className="mb-4 text-headline-md text-foreground">Create User</h2>
          <CreateUserForm
            apiError={formError}
            onCancel={() => setFormMode('none')}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {formMode === 'edit' && editingUser && (
        <div className="mb-6 rounded-lg bg-surface-container-lowest p-6">
          <h2 className="mb-4 text-headline-md text-foreground">Edit User</h2>
          <EditUserForm
            user={editingUser}
            apiError={formError}
            onCancel={() => { setFormMode('none'); setEditingUser(null); }}
            onSubmit={handleUpdate}
          />
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-body-md text-on-surface-variant">
          Loading users...
        </p>
      ) : (
        data && (
          <>
            <UserTable
              users={data.items}
              onEdit={(user) => {
                setEditingUser(user);
                setFormMode('edit');
                setFormError(null);
              }}
              onDelete={handleDelete}
            />
            {data.pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono text-label-md text-on-surface-variant">
                  Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} users)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )
      )}
    </PageContainer>
  );
}
