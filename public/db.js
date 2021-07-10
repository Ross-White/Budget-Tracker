const indexedDB =
  window.indexedDB ||
  window.shimIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB;

let db;
const request = indexedDB.open('BudgetStore', 1);

request.onsuccess = event => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore('BudgetStore', { autoIncrement: true });
};

request.onerror = event => {
    console.log('Error:: ' + event.target.errorCode);
};

const saveRecord = (record) => {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
};

