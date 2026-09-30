import {accountUrl,accountKey} from '../lib/email-config';
export async function getEmailUser(request:Request){
 const authorization=request.headers.get('authorization');
 if(!authorization?.startsWith('Bearer ')||authorization.length>10000)return null;
 const result=await fetch(`${accountUrl}/auth/v1/user`,{headers:{apikey:accountKey,Authorization:authorization},cache:'no-store'});
 if(result.status===401||result.status===403)return null;
 if(!result.ok)throw Error('Account verification unavailable');
 const user=await result.json() as {id?:string,email?:string,email_confirmed_at?:string};
 if(!user.id||!user.email||!user.email_confirmed_at)return null;
 return {userId:`email:${user.id}`,email:user.email,fullName:null};
}
