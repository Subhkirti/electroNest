import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import InputField from "../../../../common/components/inputField";
import AddressFields from "../checkout/addressFields";
import { EditUserReqBody } from "../../types/userTypes";

function EditProfile({
  open,
  onClose,
  onSave,
  profileData,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  profileData: EditUserReqBody;
  onChange: (value: any, fieldId: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <form onSubmit={onSave}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              {/* image uploader */}
              <InputField
                label={"Image"}
                required={true}
                id={"image"}
                value={profileData?.firstName}
                maxLength={50}
                onChange={onChange}
              />
            </Grid>

            {/* address fields */}
            <AddressFields formData={profileData} handleOnChange={onChange} />

            <Grid item xs={12} lg={12}>
              <InputField
                id={"email"}
                value={profileData?.email}
                label={"Email Address"}
                required={true}
                type={"email"}
                onChange={onChange}
                maxLength={70}
              />
            </Grid>

            <Grid
              item
              xs={12}
              lg={12}
              className="flex justify-between space-x-4"
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                className="shadow-none hover:shadow-none hover:bg-primary hover:border-transparent hover:bg-opacity-10"
              >
                Cancel
              </Button>

              <Button
                fullWidth
                onClick={onSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
