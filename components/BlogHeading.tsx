import { ReactNode, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styled from "@emotion/styled";

import Heading from "@components/Heading";
import LinkIcon from "@icons/LinkIcon";
import { useAppThemeValue } from "@hooks/useAppThemeValue";
import { useInView } from "@hooks/useInView";
import { ColorShade } from "@typings/emotion";

const BlogAnchorHeadingStyled = styled(motion.a)`
  position: relative;
  scroll-margin-top: 5rem;
  text-decoration: none;

  div {
    opacity: 0;
  }
`;

const BlogAnchorIcon = styled(motion.div)`
  position: absolute;
  right: 10px;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

type BlogHeadingProps = {
  children: ReactNode;
};

const textMotion = {
  rest: {
    transition: {
      duration: 2,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const slashMotion = {
  rest: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween" },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeIn",
    },
  },
};

const BlogHeading = ({ children }: BlogHeadingProps) => {
  const controls = useAnimation();
  const { containerRef, isVisible } = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    }
  }, [controls, isVisible]);

  const title =
    typeof children === "string" ? children : (children as any[])[0];

  return (
    <BlogAnchorHeadingStyled
      initial="rest"
      animate="rest"
      ref={containerRef}
      id={title.toLowerCase().replaceAll(" ", "-")}
      href={`#${title.toLowerCase().replaceAll(" ", "-")}`}
    >
      <Heading
        fgColor="yellow.900"
        fontWeight={500}
        fontSize={"1.75rem"}
        margin={"0"}
        initial={["hidden", "rest"]}
        whileHover="hover"
        animate={controls}
        variants={textMotion}
        transition={{ duration: 0.4 }}
      >
        <BlogAnchorIcon variants={slashMotion}>
          <LinkIcon />
        </BlogAnchorIcon>
        {children}
      </Heading>
    </BlogAnchorHeadingStyled>
  );
};

export default BlogHeading;