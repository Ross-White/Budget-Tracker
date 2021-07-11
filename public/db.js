const indexedDB =
  window.indexedDB ||
  window.shimIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB;

let db;
const request = indexedDB.open('BudgetStore', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkLiveDatabase();
    }
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore('BudgetStore', { autoIncrement: true });
};

request.onerror = (event) => {
    console.log('Error:: ' + event.target.errorCode);
};

const saveRecord = (record) => {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
};

const checkLiveDatabase = () => {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(() => {
                transaction = db.transaction(['BudgetStore'], 'readwrite');
                const currrentStore = transaction.objectStore('BudgetStore');
                currrentStore.clear();
            });
        } 
    }
};

window.addEventListener('online', checkLiveDatabase);