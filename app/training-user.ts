import {getChatGPTUser} from './chatgpt-auth';
import {getEmailUser} from './email-auth';
export async function getTrainingUser(request:Request){return request.headers.has('authorization')?getEmailUser(request):getChatGPTUser();}
