// Stub for helper mutations
export function useHelperMutations() {
  return {
    uploadFile: async (file: File) => {
      // Stub implementation
      return { url: '', id: '' };
    },
    uploadMedia: async (file: File | FormData) => {
      // Stub implementation
      return { url: '', id: '' };
    },
    deleteFile: async (id: string) => {
      // Stub implementation
      return true;
    },
  };
}

