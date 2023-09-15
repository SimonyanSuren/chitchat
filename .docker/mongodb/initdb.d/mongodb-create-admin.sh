set -Eeuo pipefail

mongo -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin "$MONGODB_NAME" <<EOF
    db.createUser({
        user: '$MONGODB_USER',
        pwd: '$MONGODB_PASS',
        roles: [ { role: 'readWrite', db: '$MONGODB_NAME' } ]
 })
EOF
