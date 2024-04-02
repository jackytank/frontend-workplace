import { HvNotistackSnackMessageProps, useHvSnackbar } from '@hitachivantara/uikit-react-core';
import { useCallback } from 'react';

/**
 * Create notifications control.
 */
const useTRANotification = () => {
  const notificationControl = useHvSnackbar();
  const createNotification = useCallback(
    (message: string, options?: HvNotistackSnackMessageProps) =>
      notificationControl.enqueueSnackbar(message, {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 4000, // 4s
        ...options
      }),
    []
  );

  return { createNotification };
};

export default useTRANotification;
