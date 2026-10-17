import ReportDetail from "../../../components/reports-page/ReportDetail";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ReportDetail id={id} />;
}
