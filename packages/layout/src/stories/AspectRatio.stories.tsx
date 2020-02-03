import { chakra } from "@chakra-ui/system";
import { storiesOf } from "@storybook/react";
import React from "react";
import AspectRatioBox from "../AspectRatioBox";
import setup from "../story.setup";

const stories = storiesOf("AspectRatioBox", module).addDecorator(setup);

stories.add("with video", () => (
  <AspectRatioBox maxW="300px" ratio={1}>
    <chakra.iframe
      title="test"
      src="https://www.youtube.com/embed/QhBnZ6NPOY0"
      allowFullScreen
    />
  </AspectRatioBox>
));

stories.add("with image", () => (
  <AspectRatioBox maxW="400px" ratio={4 / 3}>
    <chakra.img
      src="https://upload.wikimedia.org/wikipedia/en/7/7d/Minions_characters.png"
      alt="minions"
    />
  </AspectRatioBox>
));

stories.add("with map", () => (
  <AspectRatioBox maxW="600px" ratio={16 / 9}>
    <chakra.iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1567723392506!5m2!1sen!2sng"
      title="demo"
    />
  </AspectRatioBox>
));
