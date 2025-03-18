import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }
  private dbName = 'settingsDB';
  private storeName = 'settingsStore';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  private encryptData(data: any, userKey: string, key: string): string {
    const combinedKey = CryptoJS.SHA256(`${userKey}_${key}`).toString();
    const jsonData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonData, combinedKey).toString();
    return encryptedData;
  }

  private decryptData(encryptedData: string, userKey: string, key: string): any {
    const combinedKey = CryptoJS.SHA256(`${userKey}_${key}`).toString();
    const bytes = CryptoJS.AES.decrypt(encryptedData, combinedKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  async saveSetting(key: string, data: any, userKey: string): Promise<void> {
    const encryptedData = this.encryptData(data, userKey, key);
    const db = await this.openDB();
    const store = this.getTransaction(this.storeName, 'readwrite');
    const combinedKey = CryptoJS.MD5(`${userKey}_${key}`).toString();
    return new Promise((resolve, reject) => {
      const request = store.put({ key:combinedKey, data: encryptedData });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getSetting(key: string, userKey: string): Promise<any> {
    const db = await this.openDB();
    const store = this.getTransaction(this.storeName, 'readonly');
    const combinedKey = CryptoJS.MD5(`${userKey}_${key}`).toString();

    return new Promise((resolve, reject) => {
      const request = store.get(combinedKey);

      request.onsuccess = () => {
        if (request.result) {
          const decryptedData = this.decryptData(request.result.data, userKey, key);

          if(decryptedData==null || decryptedData==undefined){
            reject('Data not found');
          }else{
            resolve(decryptedData);
          }

        } else {
          reject('Data not found');
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private getTransaction(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database is not initialized');
    }
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  private encodeData(data: any): Uint8Array {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    return bytes;
  }

  private decodeData(bytes: Uint8Array): any {
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }

  async deleteSetting(key: string, userKey: string): Promise<void> {
    const db = await this.openDB();
    const store = this.getTransaction(this.storeName, 'readwrite');
    const combinedKey = `${userKey}_${key}`;

    return new Promise((resolve, reject) => {
      const request = store.delete(combinedKey);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
