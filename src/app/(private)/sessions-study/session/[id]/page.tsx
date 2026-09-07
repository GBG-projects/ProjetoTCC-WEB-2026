
import SessaoDetalhe from "@/app/components/SessionStudy/SessaoDetalhe";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SessaoDetalhe sessaoId={id} />;
}

