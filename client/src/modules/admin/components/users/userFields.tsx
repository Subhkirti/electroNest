import { Grid } from "@mui/material";
import InputField from "../../../../common/components/inputField";
import { UserReqBody } from "../../../customer/types/userTypes";
import { userRoles, userStateIds } from "../../utils/userUtil";
import AppStrings from "../../../../common/appStrings";

function UserFields({
  isViewPage,
  user,
  handleOnChange,
}: {
  isViewPage?: boolean;
  user: UserReqBody;
  handleOnChange?: (elementValue: any, id: string) => void;
}) {
  return (
    <>
      <Grid item xs={12} lg={6}>
        <InputField
          label={"First Name"}
          required={true}
          type={"text"}
          readOnly={isViewPage}
          id={userStateIds.firstName}
          value={user.firstName}
          onChange={handleOnChange}
          maxLength={50}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <InputField
          label={"Last Name"}
          type={"text"}
          readOnly={isViewPage}
          id={userStateIds.lastName}
          value={user.lastName}
          onChange={handleOnChange}
          maxLength={50}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <InputField
          label={"Email Address"}
          required={true}
          type={"email"}
          readOnly={isViewPage}
          id={userStateIds.email}
          value={user.email}
          onChange={handleOnChange}
          maxLength={70}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <InputField
          label={"Mobile Number"}
          required={true}
          type={"number"}
          readOnly={isViewPage}
          id={userStateIds.mobile}
          value={user.mobile}
          onChange={handleOnChange}
          maxLength={10}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <InputField
          label={"Login Password"}
          required={true}
          type={"text"}
          readOnly={isViewPage}
          id={userStateIds.password}
          value={user.password}
          onChange={handleOnChange}
          maxLength={12}
          infoText={AppStrings.passwordError}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <InputField
          label={"User Role"}
          type={"dropdown"}
          readOnly={isViewPage}
          dropdownOptions={userRoles}
          id={userStateIds.role}
          value={user.role}
          onChange={handleOnChange}
        />
      </Grid>
    </>
  );
}

export default UserFields;
