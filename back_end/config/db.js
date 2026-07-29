const { createClient } = require('@libsql/client');

const db = createClient({
    url: 'libsql://gestion-interventions-zaoudi.aws-eu-west-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ3NDg4NzYsImlkIjoiMDE5ZjhhNTAtMzEwMS03MDA5LTk3NzQtMTkyODc2YmRkNjUwIiwia2lkIjoieVVmMU45bWV0aEt0TFNDbWZ3ZzNfblFVcklKZ2N3aUstTW03N1JNUEREbyIsInJpZCI6ImU5ZTA1NjdkLTBkNmMtNDcxYy04Yjk3LTc5ZWMyZjA4MGFmMSJ9.92qrXw_Xxi9rDtnabMASMpV5-51zhfKxahqVdedHtKX3WXR7LRUVN7Z9HH9IgRRIp60Ye_W5bqKJbozYnjc_Cw'
});

console.log('✅ Connecté à la base de données Turso');

module.exports = db;