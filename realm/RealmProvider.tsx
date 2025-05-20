// realm/RealmProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import { SCHEMA_VERSION, schemas } from './schemas';

// 建立 context
const RealmContext = createContext<Realm | null>(null);

// provider 組件
export const RealmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [realmInstance, setRealmInstance] = useState<Realm | null>(null);

  useEffect(() => {
    const openRealm = async () => {
      const realm = await Realm.open({
        schema: schemas,
        schemaVersion: SCHEMA_VERSION,
      });
      setRealmInstance(realm);
    };

    openRealm();

    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, [realmInstance]);

  if (!realmInstance) return null;

  return (
    <RealmContext.Provider value={realmInstance}>
      {children}
    </RealmContext.Provider>
  );
};

// 快捷 hook
export const useRealm = (): Realm => {
  const realm = useContext(RealmContext);
  if (!realm) {
    throw new Error('useRealm must be used inside RealmProvider');
  }
  return realm;
};
