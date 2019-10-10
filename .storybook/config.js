import { addDecorator, configure } from "@storybook/react";
import React from "react";
import { CSSReset, ThemeProvider } from "../packages/chakra-ui/src";

// function loadStories() {
//   require("../stories");
// }

const req = require.context("../packages", true, /examples\.(js|mdx)$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      {children}
      {/* <Box pos="fixed" bottom="24px" right="24px" zIndex={2}>
        <Button
          variant="outline"
          onClick={toggleColorMode}
          leftIcon={colorMode === "dark" ? "sun" : "moon"}
        >
          {colorMode === "dark" ? "Light" : "Dark"}
        </Button>
      </Box> */}
    </ThemeProvider>
  );
};

addDecorator(story => <AppProvider>{story()}</AppProvider>);

configure(loadStories, module);
