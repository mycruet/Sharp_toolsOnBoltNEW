export type ApplicationType = 'external' | 'internal-template' | 'internal-custom';
export type TemplateType = 'mes' | 'qms';
export type NavigationType = 'none' | 'level1' | 'level2' | 'level3';
export type EntityType = 'form' | 'datasource' | 'rule' | 'dashboard';

export interface Application {
  id: string;
  name: string;
  type: ApplicationType;
  remark: string;
  deploymentUrl?: string;
  template?: TemplateType;
  designData?: DesignData;
  createdAt: number;
}

export interface DesignData {
  navigationLevel: NavigationType;
  selectedEntity?: EntityType;
  contentData?: Record<string, any>;
}

const DB_NAME = 'ApplicationDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initApplicationDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('applications')) {
        database.createObjectStore('applications', { keyPath: 'id' });
      }
    };
  });
};

export const addApplication = async (app: Application): Promise<void> => {
  const database = await initApplicationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    const request = store.add(app);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const updateApplication = async (app: Application): Promise<void> => {
  const database = await initApplicationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    const request = store.put(app);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteApplication = async (id: string): Promise<void> => {
  const database = await initApplicationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getAllApplications = async (): Promise<Application[]> => {
  const database = await initApplicationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['applications'], 'readonly');
    const store = transaction.objectStore('applications');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const apps = request.result as Application[];
      resolve(apps.sort((a, b) => b.createdAt - a.createdAt));
    };
  });
};

export const getApplication = async (id: string): Promise<Application | undefined> => {
  const database = await initApplicationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['applications'], 'readonly');
    const store = transaction.objectStore('applications');
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
