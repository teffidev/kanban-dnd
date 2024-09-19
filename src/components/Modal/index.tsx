"use client";

import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

interface ModalAddItemProps {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const ModalAddItem: React.FC<ModalAddItemProps> = ({
  children,
  showModal,
  setShowModal,
  className,
}) => {
  const desktopModalRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    },
    [setShowModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      {showModal && (
        <>
          <FocusTrap focusTrapOptions={{ initialFocus: false }}>
            <motion.div
              ref={desktopModalRef}
              key="desktop-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onMouseDown={(e) => {
                if (desktopModalRef.current === e.target) {
                  setShowModal(false);
                }
              }}
              className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex">
              <div className="overflow relative w-full mas-w-lg transform rounded-xl border border-gray-200 bg-white p-6 text-left shadow-2xl transition-all">
                {children}
              </div>
            </motion.div>
          </FocusTrap>
          <motion.div
            key="desktop-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalAddItem;
