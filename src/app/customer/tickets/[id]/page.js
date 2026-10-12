import Portal from "../../../../components/Portal";export default async function Page({params}){return <Portal view="customerDetail" id={(await params).id}/>}
