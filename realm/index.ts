import Realm from "realm";
import { SCHEMA_VERSION, schemas } from "./schemas";

export const openRealm = () => {
    return new Realm({
        schema: schemas,
        schemaVersion: SCHEMA_VERSION,
    });
};
