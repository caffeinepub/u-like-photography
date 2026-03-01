/**
 * ExternalBlob - simplified blob storage utility
 * Used for photo uploads in U Like Photography
 */
export class ExternalBlob {
  private _bytes: Uint8Array | null = null;
  private _url: string | null = null;
  private _onProgress?: (percentage: number) => void;

  private constructor() {}

  static fromBytes(bytes: Uint8Array): ExternalBlob {
    const blob = new ExternalBlob();
    blob._bytes = bytes;
    return blob;
  }

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob._url = url;
    return blob;
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this._onProgress = onProgress;
    return this;
  }

  getDirectURL(): string {
    if (this._url) return this._url;
    if (this._bytes) {
      // Simulate upload progress
      if (this._onProgress) {
        this._onProgress(100);
      }
      const blob = new Blob([this._bytes.buffer as ArrayBuffer]);
      return URL.createObjectURL(blob);
    }
    throw new Error("No data available");
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const response = await fetch(this._url);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    throw new Error("No data available");
  }
}
