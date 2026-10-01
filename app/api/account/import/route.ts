export const dynamic='force-dynamic';
export async function POST(){
 return Response.json({error:'The previous Sites login has been retired. Use your Siahverse email account.'},{status:410,headers:{'Cache-Control':'no-store'}});
}
