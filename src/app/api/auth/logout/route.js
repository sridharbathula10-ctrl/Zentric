import {ok} from "../../../../../lib/http";export async function POST(){const response=ok({},"Logout successful");response.cookies.set("zentrix_token","",{path:"/",maxAge:0});return response}
