"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { ISpecialty } from "@/types/specialties.interface";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import DoctorFormDialog from "./DoctorFormDialog";

interface DoctorsManagementHeaderProps {
  specialties?: ISpecialty[];
}

const DoctorsManagementHeader = ({
  specialties,
}: DoctorsManagementHeaderProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1); //Force Remount
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <DoctorFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        specialties={specialties}
      />

      <ManagementPageHeader
        title='Doctors Management'
        description='Manage Doctors information and details'
        action={{
          label: "Add Doctor    ",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default DoctorsManagementHeader;
