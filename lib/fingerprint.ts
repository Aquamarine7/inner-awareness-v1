const STORAGE_KEY = "ia_voter_fingerprint";

export function getVoterFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = window.localStorage.getItem(STORAGE_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, fp);
  }
  return fp;
}
