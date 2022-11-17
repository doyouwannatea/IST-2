/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POPULATION_COUNT: string;
  readonly VITE_MAX_POPULATION_COUNT: string;
  readonly VITE_TARGET_FITNESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
