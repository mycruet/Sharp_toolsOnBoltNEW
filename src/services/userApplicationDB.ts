import { Application } from './applicationDB';

export interface UserApplication {
  id: string;
  applicationId: string;
  application: Application;
  addedAt: string;
}

const DB_NAME = 'UserApplicationDB';
const STORE_NAME = 'user_applications';

let db: IDBDatabase | null = null;

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('applicationId', 'applicationId', { unique: false });
        store.createIndex('addedAt', 'addedAt', { unique: false });
      }
    };
  });
}

export async function getUserApplications(applications: Application[]): Promise<UserApplication[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const userApps = (request.result as any[]).map((ua) => ({
        ...ua,
        application: applications.find((app) => app.id === ua.applicationId),
      })).filter((ua) => ua.application) as UserApplication[];

      const sorted = userApps.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
      resolve(sorted);
    };
  });
}

export async function addUserApplication(applicationId: string, application: Application): Promise<UserApplication> {
  const database = await initDB();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const userApp: any = {
    id,
    applicationId,
    application,
    addedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(userApp);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(userApp);
  });
}

export async function removeUserApplication(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
