/*
 * Run using the mongo shell. For example:
 * localhost:
 *   mongo tutorial_IT5007 scripts/init.mongo.js
 */

db.waitlist.deleteMany({});

// sample initialization
const sample_list = [
    {
        serialNo: 1, name: 'Ravan', phone: "12345678",
        timestamp: new Date('2019-01-15 00:01:02'),
    },
    {
        serialNo: 12, name: 'Eddie', phone: "11110000",
        timestamp: new Date('2019-01-16 06:05:04'),
    },
];

db.waitlist.insertMany(sample_list);

const count = db.waitlist.count();
print('Inserted ', count, ' sample customers\n');

db.waitlist.createIndex({ serialNo: 1 }, { unique: true });
db.waitlist.createIndex({ name: 1 });
db.waitlist.createIndex({ phone: 1 });