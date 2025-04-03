import React from 'react';
import packageJson from "../../../package.json";
import { useTheme } from '@mui/material';

const Version = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        marginBottom: 0,
        color: theme.palette.text.disabled,
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        marginLeft: '6px'
      }}>
      v:{packageJson.version}
    </div>
  );
};

export default Version;