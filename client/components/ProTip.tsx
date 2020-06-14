import { Link, Theme, Typography, makeStyles } from "@material-ui/core";
import LightBulbIcon from "./LightBulbIcon";
import React from "react";

const ProTip = (props: { [index: string]: unknown }): JSX.Element => {
  const theme = props.theme as Theme;

  const useStyles = makeStyles(() => {
    return {
      root: {
        margin: theme.spacing(6, 0, 3),
      },
      lightBulb: {
        verticalAlign: "middle",
        marginRight: theme.spacing(1),
      },
    };
  });

  const classes = useStyles();

  return (
    <Typography color="textSecondary" className={classes.root}>
      <LightBulbIcon className={classes.lightBulb} />
      Pro tip: See more{" "}
      <Link href="https://material-ui.com/getting-started/templates/">
        templates
      </Link>{" "}
      on the Material-UI documentation.
    </Typography>
  );
};

export default ProTip;
