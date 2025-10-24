/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAGIC_API_KEY: string
  readonly VITE_WERT_PARTNER_ID: string
  readonly VITE_WERT_CONTRACT_ADDRESS: string
  readonly VITE_DEFAULT_EOA_ADDRESS: string
  readonly VITE_WERT_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
