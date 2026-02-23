export interface Organization {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  level: number;
  order: number;
  createdAt: number;
}

const DB_NAME = 'OrganizationDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initOrganizationDB = (): Promise<IDBDatabase> => {
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

      if (!database.objectStoreNames.contains('organizations')) {
        const store = database.createObjectStore('organizations', { keyPath: 'id' });
        store.createIndex('parentId', 'parentId', { unique: false });
        store.createIndex('level', 'level', { unique: false });
      }
    };
  });
};

export const addOrganization = async (org: Organization): Promise<void> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readwrite');
    const store = transaction.objectStore('organizations');
    const request = store.add(org);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const updateOrganization = async (org: Organization): Promise<void> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readwrite');
    const store = transaction.objectStore('organizations');
    const request = store.put(org);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteOrganization = async (id: string): Promise<void> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readwrite');
    const store = transaction.objectStore('organizations');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getAllOrganizations = async (): Promise<Organization[]> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readonly');
    const store = transaction.objectStore('organizations');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const orgs = request.result as Organization[];
      resolve(orgs.sort((a, b) => {
        if (a.parentId === b.parentId) return a.order - b.order;
        return 0;
      }));
    };
  });
};

export const getOrganization = async (id: string): Promise<Organization | undefined> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readonly');
    const store = transaction.objectStore('organizations');
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getOrganizationsByParentId = async (parentId: string | null): Promise<Organization[]> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readonly');
    const store = transaction.objectStore('organizations');
    const index = store.index('parentId');
    const request = index.getAll(parentId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const orgs = request.result as Organization[];
      resolve(orgs.sort((a, b) => a.order - b.order));
    };
  });
};

export const updateBatch = async (orgs: Organization[]): Promise<void> => {
  const database = await initOrganizationDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['organizations'], 'readwrite');
    const store = transaction.objectStore('organizations');

    orgs.forEach(org => {
      store.put(org);
    });

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};
