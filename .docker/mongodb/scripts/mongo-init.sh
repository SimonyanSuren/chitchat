#!/bin/bash

MONGODB1=mongors-0
MONGODB2=mongors-1
MONGODB3=mongors-2
DELAY=10

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY

echo SETUP.sh time now: `date +"%T" `
mongo --host ${MONGODB1}:30001 -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} <<EOF
var cfg = {
    "_id": "mongors",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB1}:30001",
            "priority": 3
        },
        {
            "_id": 1,
            "host": "${MONGODB2}:30002",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "${MONGODB3}:30003",
            "priority": 1,
        }
    ]
};
rs.initiate(cfg, { force: true });
rs.secondaryOk();
db.getMongo().setReadPref('primary');
rs.status();
EOF

echo "******************* Done *************************"


