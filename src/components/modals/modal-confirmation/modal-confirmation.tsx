import { ModalBase } from "@/src/components/modals/modal-base/modal-base";

interface IModalConfirmationProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ModalConfirmation = ({
  visible,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onClose,
  onConfirm,
  isLoading,
}: IModalConfirmationProps) => (
  <ModalBase
    visible={visible}
    title={title}
    description={description}
    confirmText={confirmText}
    cancelText={cancelText}
    onClose={onClose}
    onConfirm={onConfirm}
    isLoading={isLoading}
  />
);
