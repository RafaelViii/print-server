const admin = require('firebase-admin');
const { exec } = require('child_process');
const fs = require('fs');

// 🔑 Firebase Admin Key (download this from Firebase console)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://print-cloud-relay-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const printQueueRef = db.ref('printQueue');

console.log("🖨️ Print server listening for jobs...");

printQueueRef.on('child_added', snapshot => {
  const job = snapshot.val();
  const jobId = snapshot.key;

  if (job.status !== "pending") return;

  const filePath = `print_${jobId}.txt`;
  fs.writeFileSync(filePath, job.message);

  exec(`notepad /p ${filePath}`, err => {
    if (err) {
      console.error("Print error:", err);
      return;
    }

    snapshot.ref.update({ status: "printed" });
    console.log("✅ Printed job:", jobId);
  });
});
