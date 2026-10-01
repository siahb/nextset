import {z} from 'zod';
export const customId=z.string().regex(/^custom-[0-9a-f-]{36}$/);
const exercise=z.object({id:z.string().min(1).max(80),name:z.string().trim().min(1).max(100),sets:z.number().int().min(1).max(10),min:z.number().int().min(1).max(3600),max:z.number().int().min(1).max(3600),unit:z.enum(['reps','seconds']),restSeconds:z.number().int().min(0).max(600)}).refine(e=>e.max>=e.min&&(e.unit==='seconds'||e.max<=100),'Check the rep range.');
export const customDefinition=z.object({name:z.string().trim().min(1).max(80),description:z.string().trim().max(500),equipment:z.string().trim().max(200),progression:z.string().trim().max(1000),days:z.array(z.object({label:z.string().trim().min(1).max(50),exercises:z.array(exercise).min(1).max(20).refine(es=>new Set(es.map(e=>e.id)).size===es.length,'Exercise IDs must be unique within a day.')})).min(1).max(7)});
export type CustomDefinition=z.infer<typeof customDefinition>;
export type CustomProgram=CustomDefinition&{id:string};
