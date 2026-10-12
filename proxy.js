import {NextResponse} from "next/server";
export function proxy(request){const path=request.nextUrl.pathname,token=request.cookies.get("zentrix_token")?.value;if(!token)return NextResponse.redirect(new URL("/login",request.url));const role=JSON.parse(Buffer.from(token.split(".")[1],"base64url").toString()||"{}").role;if(path.startsWith("/admin")&&role!=="ADMIN")return NextResponse.redirect(new URL("/customer/dashboard",request.url));return NextResponse.next()}
export const config={matcher:["/customer/:path*","/admin/:path*"]};
