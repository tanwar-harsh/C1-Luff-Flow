import { User, UserSummary } from '../types/domain';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ValidationError } from '../utils/AppError';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async listUsers(): Promise<UserSummary[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
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
