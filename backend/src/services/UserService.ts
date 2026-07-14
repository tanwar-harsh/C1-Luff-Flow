import { Role, User, UserSummary } from '../types/domain';
import { IUserRepository, PaginatedUsers } from '../repositories/interfaces/IUserRepository';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { hashPassword } from '../utils/password';

export interface AdminCreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AdminUpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UpdateMeInput {
  name?: string;
  email?: string;
}

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async listUsers(): Promise<UserSummary[]> {
    return this.userRepository.findAll();
  }

  async listUsersPaginated(page: number, limit: number): Promise<PaginatedUsers> {
    return this.userRepository.findManyPaginated({ page, limit });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async createUser(input: AdminCreateUserInput): Promise<User> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ValidationError('Validation failed', [
        { field: 'email', message: 'Email is already registered' },
      ]);
    }

    const passwordHash = await hashPassword(input.password);
    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
  }

  async updateUser(id: string, input: AdminUpdateUserInput): Promise<User> {
    await this.getUserByIdOrThrow(id);

    if (input.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new ValidationError('Validation failed', [
          { field: 'email', message: 'Email is already registered' },
        ]);
      }
    }

    const data: { name?: string; email?: string; passwordHash?: string; role?: Role } = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.email !== undefined) data.email = input.email;
    if (input.role !== undefined) data.role = input.role;
    if (input.password) {
      data.passwordHash = await hashPassword(input.password);
    }

    return this.userRepository.update(id, data);
  }

  async updateMe(userId: string, input: UpdateMeInput): Promise<User> {
    await this.getUserByIdOrThrow(userId);

    if (input.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing && existing.id !== userId) {
        throw new ValidationError('Validation failed', [
          { field: 'email', message: 'Email is already registered' },
        ]);
      }
    }

    const data: { name?: string; email?: string } = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.email !== undefined) data.email = input.email;

    return this.userRepository.update(userId, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserByIdOrThrow(id);

    const relatedCount = await this.userRepository.countRelatedRecords(id);
    if (relatedCount > 0) {
      throw new ValidationError('Validation failed', [
        {
          field: 'id',
          message: 'Cannot delete user with existing tickets or comments',
        },
      ]);
    }

    await this.userRepository.delete(id);
  }

  async ensureUserExists(id: string, field: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError('Validation failed', [
        { field, message: 'User not found' },
      ]);
    }
    return user;
  }
}
