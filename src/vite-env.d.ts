/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string; // Add this line
  readonly VITE_APPWRITE_COLLECTION_ID: string; // Add this line
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}