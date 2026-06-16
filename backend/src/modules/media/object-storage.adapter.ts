import { Injectable } from "@nestjs/common";

@Injectable()
export class ObjectStorageAdapter {
  getSignedAssetUrl(path: string) {
    return `https://assets.example.com/${path}`;
  }
}
