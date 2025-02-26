
import { makeStyles } from 'tss-react/mui';

const dataGridStyle = makeStyles<{}>()((theme) => {
  return {
    totalTypo: {
      paddingTop: "10px !important",
      paddingBottom: "10px !important",
    },
    typographyFont: {
      [theme.breakpoints.up("xl")]: {
        fontSize: "18px !important"
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "16px !important"
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px !important"
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "17px !important"
      },
      [theme.breakpoints.up("xs")]: {
        fontSize: "14px !important"
      },
    },
    dataGridOuterBox: {
      height: 'auto',
      backgroundColor: theme.palette.background.paper,
      borderRadius: "16px",
      marginBottom: "16px",
      marginTop: "16px",
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
      padding: "16px",
      transition: 'all 1s linear',

    },
    dataGrid: {
      "& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
        marginTop: "1em",
        marginBottom: "1em"
      },
      "& .MuiDataGrid-footerContainer": {
        [theme.breakpoints.only("xs")]: {
          justifyContent: 'center',
          marginBottom: '2px'
        }
      }
    }
  }
})

export default dataGridStyle;