import { User } from '../../types/domain';
import { Role } from '../../types/domain';

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedUsers {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findManyPaginated(params: PaginationParams): Promise<PaginatedUsers>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  countRelatedRecords(id: string): Promise<number>;
}
