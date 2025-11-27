import SpecialtiesManagementHeader from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesManagementHeader";
import RefreshButton from "@/components/shared/RefreshButton";

const AdminSpecialtiesManagementPage = () => {
  return (
    <div className='space-y-6'>
      <SpecialtiesManagementHeader />
      <div className='flex'>
        <RefreshButton />
      </div>
      
    </div>
  );
};

export default AdminSpecialtiesManagementPage;
