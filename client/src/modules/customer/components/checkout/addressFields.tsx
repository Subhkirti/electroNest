import { Grid } from "@mui/material";
import InputField from "../../../../common/components/inputField";
import { addressStateIds } from "../../../admin/utils/userUtil";

function AddressFields({
  formData,
  handleOnChange,
}: {
  formData: any;
  handleOnChange: (value: any, fieldId: string) => void;
}) {
  return (
    <>
      <Grid item xs={12} lg={6}>
        <InputField
          label={"First Name"}
          required={true}
          id={addressStateIds.firstName}
          value={formData?.firstName}
          maxLength={50}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"Last Name"}
          id={addressStateIds.lastName}
          value={formData?.lastName}
          maxLength={50}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <InputField
          label={"House no. / Street / Building name / Area "}
          required={true}
          id={addressStateIds.street}
          value={formData?.street}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"City"}
          required={true}
          id={addressStateIds.city}
          value={formData?.city}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"State"}
          required={true}
          id={addressStateIds.state}
          value={formData?.state}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"Zip / Postal code"}
          required={true}
          id={addressStateIds.zipCode}
          value={formData?.zipCode}
          type="number"
          maxLength={6}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"Phone Number"}
          required={true}
          id={addressStateIds.mobile}
          value={formData.mobile}
          type="number"
          maxLength={10}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <InputField
          label={"Landmark"}
          id={addressStateIds.landmark}
          value={formData?.landmark}
          onChange={handleOnChange}
        />
      </Grid>
    </>
  );
}

export default AddressFields;
