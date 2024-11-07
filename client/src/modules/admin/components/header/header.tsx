import { KeyboardBackspace } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/storeTypes";
import { textTruncate } from "../../utils/productUtil";
import { useMobile } from "../../../../common/mediaQuery";

function Header({ isMenuDrawerOpen }: { isMenuDrawerOpen: boolean }) {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { showBackIcon, buttons, title } = useSelector(
    (state: RootState) => state.header
  );
  return title ? (
    <>
      <Box
        className="bg-darkpurple flex items-center justify-between  text-white fixed top-0
        right-0 px-10 py-3"
        style={{ paddingLeft: isMenuDrawerOpen ? "18%" : "60px", left: 0 }}
        zIndex={999}
      >
        <Box className="flex items-center space-x-6">
          {showBackIcon && (
            <KeyboardBackspace
              fontSize="large"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
          )}
          <Typography className="text-2xl font-medium">
            {textTruncate(title, isMobile ? 20 : 80)}
          </Typography>
        </Box>
        {buttons && buttons.length
          ? buttons.map((button, index) => {
              return (
                <Button
                  key={index}
                  variant="contained"
                  onClick={button.onClick ? button.onClick : undefined}
                  className="text-white bg-lightpurple border border-white rounded-lg"
                  startIcon={button?.icon ? <button.icon /> : undefined}
                >
                  {button.text}
                </Button>
              );
            })
          : ""}
      </Box>
      <Box mb={6}></Box>
    </>
  ) : null;
}

export default Header;
