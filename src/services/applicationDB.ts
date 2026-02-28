export interface Application {
  id: string;
  name: string;
  type: 'external' | 'internal_template' | 'internal_custom';
  remark: string;
  deployment_url?: string;
  template_type?: 'MES' | 'QMS';
  navigation_type?: 'none' | 'level_1' | 'level_2' | 'level_3';
  business_entity_type?: 'custom_form' | 'data_source' | 'business_rule' | 'custom_dashboard';
  created_at: string;
  updated_at: string;
}

const DB_NAME = 'ApplicationDB';
const STORE_NAME = 'applications';

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
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };
  });
}

export async function getApplications(): Promise<Application[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const apps = (request.result as Application[]).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      resolve(apps);
    };
  });
}

export async function getApplication(id: string): Promise<Application | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function createApplication(app: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
  const database = await initDB();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const newApp: Application = {
    ...app,
    id,
    created_at: now,
    updated_at: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newApp);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newApp);
  });
}

export async function updateApplication(id: string, updates: Partial<Omit<Application, 'id' | 'created_at'>>): Promise<Application> {
  const database = await initDB();
  const existing = await getApplication(id);
  if (!existing) throw new Error('Application not found');

  const updated: Application = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updated);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(updated);
  });
}

export async function deleteApplication(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
