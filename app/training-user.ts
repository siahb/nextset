import {getEmailUser} from './email-auth';
// Direct Cloudflare requests never trust caller-supplied Sites identity headers.
export async function getTrainingUser(request:Request){return getEmailUser(request);}
