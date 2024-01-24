import { SpecialitiesType } from '@/redux/specialities';
import Dexie, { Table } from 'dexie';
import { ClinicStatusType } from '@/redux/clinicStatus';

export class MySubClassedDexie extends Dexie {
  clinicStatusBrowserTable!: Table<ClinicStatusType>;
  specialitiesBrowserTable!: Table<SpecialitiesType>;

  constructor() {
    super('browserDb');
    this.version(1).stores({
      clinicStatusBrowserTable: 'id++',
      // '_id, href, active, hasThemeImage, image, name, customStyle, *createdAt, *updatedAt',
    });
    this.version(1).stores({
      specialitiesBrowserTable: 'id++',
      // '_id, specialities, description, image, image, imageId, users_id, *createdAt, *updatedAt',
    });
  }
}
const browserDb = new MySubClassedDexie();

export default browserDb;

export const createBrowserDb = async () => {
  await browserDb.open();
};
