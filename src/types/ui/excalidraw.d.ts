export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDeleted?: boolean;
  // Add any other fields you use
}

export type NonDeleted<T extends { isDeleted?: boolean }> = T & { isDeleted?: false };

export interface AppState {
  // Define minimal shape you need here
  // For example:
  viewBackgroundColor: string;
  // ... add others as necessary
}

export interface BinaryFiles {
  [key: string]: Blob | File;
}
