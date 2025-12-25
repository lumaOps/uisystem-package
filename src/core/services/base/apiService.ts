// Stub API service
class ApiService {
  async get<T>(url: string): Promise<T> {
    throw new Error('ApiService.get not implemented - this is a stub');
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    throw new Error('ApiService.post not implemented - this is a stub');
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    throw new Error('ApiService.put not implemented - this is a stub');
  }

  async delete<T>(url: string): Promise<T> {
    throw new Error('ApiService.delete not implemented - this is a stub');
  }
}

export default new ApiService();

