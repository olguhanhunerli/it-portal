import DepartmentCard from "@/components/admin/department/departmentform";

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <div>
      <DepartmentCard id={id} />
    </div>
  );
}
