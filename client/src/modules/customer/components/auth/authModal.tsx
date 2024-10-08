import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import RegisterForm from "./registerForm";
import { useLocation } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import LoginForm from "./loginForm";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const location = useLocation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {location.pathname === AppRoutes.register ? (
          <RegisterForm />
        ) : (
          <LoginForm />
        )}
      </Box>
    </Modal>
  );
}
