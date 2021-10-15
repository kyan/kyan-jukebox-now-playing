// deno-lint-ignore-file no-explicit-any
export interface SettingsSchema {
  key: string;
  value: {
    currentTrack: any
  };
}
