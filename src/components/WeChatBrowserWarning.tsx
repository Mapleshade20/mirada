import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WeChatBrowserWarningProps {
  open: boolean;
  onClose: () => void;
}

export const WeChatBrowserWarning = ({
  open,
  onClose,
}: WeChatBrowserWarningProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="glass-card border-white/20 bg-white/10 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {t("auth.wechatWarning.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line text-white/90">
            {t("auth.wechatWarning.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className="glass-button bg-white/20 text-white hover:bg-white/30"
          >
            {t("auth.wechatWarning.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
