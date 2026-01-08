export interface Dictionary {
  id: string;
  name: string;
  remark: string;
  createdAt: number;
}

export interface DictionaryContent {
  id: string;
  dictionaryId: string;
  name: string;
  remark: string;
  createdAt: number;
}

const DB_NAME = 'DictionaryDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
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

      if (!database.objectStoreNames.contains('dictionaries')) {
        const dictStore = database.createObjectStore('dictionaries', { keyPath: 'id' });
        dictStore.createIndex('name', 'name', { unique: false });
      }

      if (!database.objectStoreNames.contains('dictionaryContents')) {
        const contentStore = database.createObjectStore('dictionaryContents', { keyPath: 'id' });
        contentStore.createIndex('dictionaryId', 'dictionaryId', { unique: false });
      }
    };
  });
};

// Dictionary operations
export const addDictionary = async (dictionary: Dictionary): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaries'], 'readwrite');
    const store = transaction.objectStore('dictionaries');
    const request = store.add(dictionary);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const updateDictionary = async (dictionary: Dictionary): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaries'], 'readwrite');
    const store = transaction.objectStore('dictionaries');
    const request = store.put(dictionary);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteDictionary = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaries'], 'readwrite');
    const store = transaction.objectStore('dictionaries');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getAllDictionaries = async (): Promise<Dictionary[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaries'], 'readonly');
    const store = transaction.objectStore('dictionaries');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const dictionaries = request.result as Dictionary[];
      resolve(dictionaries.sort((a, b) => b.createdAt - a.createdAt));
    };
  });
};

export const getDictionary = async (id: string): Promise<Dictionary | undefined> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaries'], 'readonly');
    const store = transaction.objectStore('dictionaries');
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Dictionary Content operations
export const addDictionaryContent = async (content: DictionaryContent): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaryContents'], 'readwrite');
    const store = transaction.objectStore('dictionaryContents');
    const request = store.add(content);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const updateDictionaryContent = async (content: DictionaryContent): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaryContents'], 'readwrite');
    const store = transaction.objectStore('dictionaryContents');
    const request = store.put(content);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteDictionaryContent = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaryContents'], 'readwrite');
    const store = transaction.objectStore('dictionaryContents');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getContentsByDictionaryId = async (dictionaryId: string): Promise<DictionaryContent[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaryContents'], 'readonly');
    const store = transaction.objectStore('dictionaryContents');
    const index = store.index('dictionaryId');
    const request = index.getAll(dictionaryId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const contents = request.result as DictionaryContent[];
      resolve(contents.sort((a, b) => b.createdAt - a.createdAt));
    };
  });
};

export const getDictionaryContent = async (id: string): Promise<DictionaryContent | undefined> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['dictionaryContents'], 'readonly');
    const store = transaction.objectStore('dictionaryContents');
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
