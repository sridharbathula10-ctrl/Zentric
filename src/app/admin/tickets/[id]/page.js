import Portal from "../../../../components/Portal";export default async function Page({params}){return <Portal view="adminDetail" id={(await params).id}/>}
