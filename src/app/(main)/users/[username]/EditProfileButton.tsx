"use client";

import { Button } from "@/components/ui/button";
import { TUserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

interface IEditProfileButtonProps {
  user: TUserData;
}

const EditProfileButton = ({ user }: IEditProfileButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default EditProfileButton;
