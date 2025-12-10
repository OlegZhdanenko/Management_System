export default function DashboardLayout({
  groups,
  groupAdmins,
  groupNotes,
}: {
  groups: React.ReactNode;
  groupAdmins: React.ReactNode;
  groupNotes: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>{groupAdmins}</div>
      <div>{groups}</div>
      <div>{groupNotes}</div>
    </div>
  );
}
