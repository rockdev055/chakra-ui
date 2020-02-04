import React from "react";
import { storiesOf } from "@storybook/react";
import { Portal, PortalManager } from ".";
import setup from "../story.setup";

const stories = storiesOf("Portal", module);

stories.addDecorator(story => <PortalManager>{setup(story)}</PortalManager>);

function Wrapper(props: any) {
  const { offset, color, children, forwardedRef } = props;
  return (
    <div
      style={{
        position: "fixed",
        top: offset || "46%",
        left: offset || "46%",
        width: "200px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        backgroundColor: color,
        textAlign: "center",
      }}
      ref={forwardedRef}
    >
      {children}
    </div>
  );
}

const Example = () => {
  const [isFirstOpen, setIsFirstOpen] = React.useState(false);
  const [isSecondOpen, setIsSecondOpen] = React.useState(false);
  return (
    <>
      <Portal>
        <Wrapper color="red">Welcome</Wrapper>
        <Portal>
          <Wrapper offset="40%" color="green">
            Welcome
          </Wrapper>
          <Portal>
            <Wrapper offset="30%" color="yellow">
              Welcome
            </Wrapper>
          </Portal>
        </Portal>
      </Portal>

      <button onClick={() => setIsFirstOpen(true)}>Render Red Portal</button>

      {isFirstOpen ? (
        <Portal>
          <Wrapper color="rgba(255, 190, 190, 0.86)">
            <button onClick={() => setIsFirstOpen(false)}>Close</button>
          </Wrapper>
        </Portal>
      ) : null}
      <br />
      <br />
      <button onClick={() => setIsSecondOpen(true)}>
        Render Orange Portal
      </button>

      {isSecondOpen ? (
        <Portal>
          <Wrapper color="rgba(255, 212, 135, 0.86)" offset="48%">
            <button onClick={() => setIsSecondOpen(false)}>Close</button>
          </Wrapper>
        </Portal>
      ) : null}
    </>
  );
};

stories.add("Default", () => <Example />);
