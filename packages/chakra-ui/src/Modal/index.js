import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef,
} from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import FocusLock from "react-focus-lock";
import { wrapEvent, useForkRef, getFocusables } from "../utils";
import Box from "../Box";
import Flex from "../Flex";
import Portal from "../Portal";
import CloseButton from "../CloseButton";
import { hideOthers } from "aria-hidden";
import { useId } from "@reach/auto-id";
import { Transition } from "react-spring/renderprops.cjs";
import { useColorMode } from "../ColorModeProvider";

////////////////////////////////////////////////////////////////////////

const ModalContext = createContext({});
const useModalContext = () => useContext(ModalContext);

////////////////////////////////////////////////////////////////////////

function useAriaHider({ isOpen, id, enableInert }) {
  const mountRef = useRef(
    document.getElementById(id) || document.createElement("div"),
  );

  useEffect(() => {
    let undoAriaHidden = null;
    let mountNode = mountRef.current;

    if (isOpen) {
      mountRef.current.id = id;
      document.body.appendChild(mountRef.current);
      if (enableInert) {
        undoAriaHidden = hideOthers(mountNode);
      }
    }

    return () => {
      if (enableInert && undoAriaHidden != null) {
        undoAriaHidden();
      }
      if (mountNode.parentElement) {
        mountNode.parentElement.removeChild(mountNode);
      }
    };
  }, [isOpen, id, enableInert]);

  return mountRef;
}

////////////////////////////////////////////////////////////////////////

const Modal = ({
  isOpen,
  initialFocusRef,
  finalFocusRef,
  onClose,
  blockScrollOnMount = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  useInert = true,
  hasHeader = true,
  scrollBehavior = "outside",
  isCentered,
  returnFocusOnClose = true,
  children,
  id,
  size = "md",
}) => {
  const contentRef = useRef(null);

  const fallbackId = `modal-${useId()}`;
  const _id = id || fallbackId;
  const headerId = `${_id}-header`;
  const bodyId = `${_id}-content`;

  useEffect(() => {
    const dialogNode = contentRef.current;
    if (isOpen && blockScrollOnMount) {
      disableBodyScroll(dialogNode);
    }
    return () => enableBodyScroll(dialogNode);
  }, [isOpen, blockScrollOnMount]);

  const mountRef = useAriaHider({
    isOpen,
    id: "chakra-portal",
    enableInert: useInert,
  });

  const context = {
    isOpen,
    initialFocusRef,
    onClose,
    blockScrollOnMount,
    closeOnEsc,
    closeOnOverlayClick,
    returnFocusOnClose,
    contentRef,
    scrollBehavior,
    isCentered,
    headerId,
    bodyId,
    id: _id,
    size,
    hasHeader,
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContext.Provider value={context}>
      <Portal container={mountRef.current}>
        <FocusLock
          returnFocus={returnFocusOnClose}
          onActivation={() => {
            if (initialFocusRef && initialFocusRef.current) {
              initialFocusRef.current.focus();
            } else {
              let focusables = getFocusables(contentRef.current);
              if (focusables.length === 0) {
                contentRef.current.focus();
              }
            }
          }}
          onDeactivation={() => {
            if (finalFocusRef && finalFocusRef.current) {
              finalFocusRef.current.focus();
            }
          }}
        >
          {children}
        </FocusLock>
      </Portal>
    </ModalContext.Provider>
  );
};

////////////////////////////////////////////////////////////////////////

const ModalOverlay = React.forwardRef((props, ref) => {
  return (
    <Box
      data-chakra-modal-overlay=""
      pos="fixed"
      bg="rgba(0,0,0,0.4)"
      left="0"
      top="0"
      w="100vw"
      h="100vh"
      ref={ref}
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////

const ModalContent = React.forwardRef(
  ({ onClick, children, zIndex = 1, ...props }, ref) => {
    const {
      contentRef,
      onClose,
      isCentered,
      bodyId,
      headerId,
      id,
      size,
      closeOnEsc,
      hasHeader,
      scrollBehavior,
      closeOnOverlayClick,
    } = useModalContext();
    const _contentRef = useForkRef(ref, contentRef);
    const { colorMode } = useColorMode();

    const colorModeStyles = {
      light: {
        bg: "white",
        shadow: "0 7px 14px 0 rgba(0,0,0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)",
      },
      dark: {
        bg: "gray.700",
        shadow: `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px`,
      },
    };

    const boxStyleProps = colorModeStyles[colorMode];

    let wrapperStyle = {};
    let contentStyle = {};

    if (isCentered) {
      wrapperStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    } else {
      contentStyle = {
        top: "3.75rem",
        mx: "auto",
      };
    }

    if (scrollBehavior === "inside") {
      wrapperStyle = {
        ...wrapperStyle,
        maxHeight: "calc(100vh - 7.5rem)",
        overflow: "hidden",
        top: "3.75rem",
      };

      contentStyle = {
        ...contentStyle,
        height: "100%",
      };
    }

    if (scrollBehavior === "outside") {
      wrapperStyle = {
        ...wrapperStyle,
        overflowY: "auto",
        overflowX: "hidden",
      };

      contentStyle = {
        ...contentStyle,
        my: "3.75rem",
        top: 0,
      };
    }

    return (
      <Box
        data-chakra-modal-content-wrapper=""
        pos="fixed"
        left="0"
        top="0"
        w="100%"
        h="100%"
        zIndex={zIndex}
        onClick={event => {
          event.stopPropagation();
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
        onKeyDown={event => {
          if (event.key === "Escape") {
            event.stopPropagation();
            if (closeOnEsc) {
              onClose();
            }
          }
        }}
        {...wrapperStyle}
      >
        <Box
          ref={_contentRef}
          data-chakra-modal-content=""
          as="section"
          // role="dialog"
          aria-modal="true"
          tabIndex={-1}
          outline={0}
          maxW={size}
          w="100%"
          id={id}
          aria-describedby={bodyId}
          {...(hasHeader && { "aria-labelledby": headerId })}
          pos="relative"
          d="flex"
          flexDir="column"
          zIndex={zIndex}
          rounded={{ md: "lg" }}
          onClick={wrapEvent(onClick, event => event.stopPropagation())}
          {...boxStyleProps}
          {...contentStyle}
          {...props}
        >
          {children}
        </Box>
      </Box>
    );
  },
);

////////////////////////////////////////////////////////////////////////

const ModalHeader = forwardRef((props, ref) => {
  const { headerId } = useModalContext();
  return (
    <Box
      ref={ref}
      px={6}
      py={4}
      id={headerId}
      as="header"
      position="relative"
      fontSize="xl"
      fontWeight="semibold"
      data-chakra-modal-header=""
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////

const ModalFooter = forwardRef((props, ref) => {
  return (
    <Flex
      ref={ref}
      data-chakra-modal-footer=""
      px={6}
      py={4}
      as="footer"
      justifyContent="flex-end"
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////

const ModalBody = forwardRef((props, ref) => {
  const { bodyId, scrollBehavior } = useModalContext();

  let style = {};
  if (scrollBehavior === "inside") {
    style = { overflowY: "auto" };
  }

  return (
    <Box
      ref={ref}
      data-chakra-modal-body=""
      id={bodyId}
      px={6}
      py={2}
      flex="1"
      {...style}
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////

const ModalCloseButton = forwardRef((props, ref) => {
  const { onClose } = useModalContext();
  return (
    <CloseButton
      ref={ref}
      data-chakra-modal-close-btn=""
      onClick={onClose}
      position="absolute"
      top="8px"
      right="12px"
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////

let transitions = {
  slideIn: {
    from: { opacity: 0, transform: `translate3d(0, 10px, 0)` },
    enter: { opacity: 1, transform: `translate3d(0, 0, 0)` },
    leave: { opacity: 0, transform: `translate3d(0, -10px, 0)` },
  },
  scale: {
    from: { opacity: 0, transform: `scale(0.95)` },
    enter: { opacity: 1, transform: `scale(1)` },
    leave: { opacity: 0, transform: `scale(0.95)` },
  },
};

const ModalTransition = ({ isOpen, duration = 150, children }) => (
  <Transition items={isOpen} {...transitions["slideIn"]} config={{ duration }}>
    {isOpen => isOpen && (styles => children(styles))}
  </Transition>
);

export {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalTransition,
};
