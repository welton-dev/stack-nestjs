import { clientServices } from './client/index.services';
import { serverServices } from './server/index.services';

export const rootServices = [...clientServices, ...serverServices];
