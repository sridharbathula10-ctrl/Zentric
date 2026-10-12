import Portal from "../../../../components/Portal";export default async function Page({params}){return <Portal view="adminCustomerDetail" id={(await params).id}/>}
