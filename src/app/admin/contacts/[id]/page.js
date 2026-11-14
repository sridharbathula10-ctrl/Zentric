import Portal from "../../../../components/Portal";

export default async function Page({ params }) {
  const { id } = await params;
  return <Portal view="adminContactDetail" id={id} />;
}
