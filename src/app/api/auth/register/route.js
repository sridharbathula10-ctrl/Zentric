import {fail,safe} from "../../../../../lib/http";
export async function POST(){return safe(async()=>fail("Customer accounts can only be created by an administrator.",403))}
