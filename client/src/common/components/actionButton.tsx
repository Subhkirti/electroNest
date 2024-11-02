import { Button, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

function ActionButton({
  endIcon: EndIcon,
  startIcon: StartIcon,
  onClick,
  disabled,
  text,
}: {
  endIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  startIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  onClick: () => void;
  disabled?: boolean;
  text: string;
}) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      endIcon={EndIcon ? <EndIcon className="text-lightpurple" /> : undefined}
      startIcon={
        StartIcon ? <StartIcon className="text-lightpurple" /> : undefined
      }
      disabled={disabled}
      className="text-slate-300 min-w-[36px] py-2 px-3 h-[26px] text-[12px] border rounded-3xl border-lightpurple"
    >
      {text}
    </Button>
  );
}

export default ActionButton;
