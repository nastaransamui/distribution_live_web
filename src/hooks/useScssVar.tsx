import { CSSProperties } from "react";
import { useTheme } from "@mui/material";
import { cssTransition } from "react-toastify";

const useScssVar = (() => {
  const theme = useTheme();
  const threeOptionMain: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }

  const wrapper: { [key: string]: CSSProperties } = {
    ["--bgColor" as string]: theme.palette.background.paper as CSSProperties,
    ["--h1Color" as string]: theme.palette.secondary.main as CSSProperties,
  }

  const left: { [key: string]: CSSProperties } = {
    ["--bgColor" as string]: theme.palette.background.paper as CSSProperties,
  }
  const right: { [key: string]: CSSProperties } = {
    ["--bgColor" as string]: theme.palette.primary.dark as CSSProperties,
  }

  const modal: { [key: string]: CSSProperties } = {
    ["--bgColor0" as string]: theme.palette.secondary.light as CSSProperties,
    ["--bgColor100" as string]: theme.palette.primary.light as CSSProperties,
  }

  const bounce = cssTransition({
    enter: "animate__animated animate__backInDown",
    exit: "animate__animated animate__backOutUp"
  })
  const muiVar: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties,
    ["--bgPaper" as string]: theme.palette.background.paper as CSSProperties,
    ["--bgDefault" as string]: theme.palette.background.default as CSSProperties,
    ["--textDisabled" as string]: theme.palette.text.disabled as CSSProperties,
    ["--textHint" as string]: theme.palette.text.hint as CSSProperties,
    ["--textSecondary" as string]: theme.palette.text.secondary as CSSProperties,
    ["--warningMain" as string]: theme.palette.warning.main as CSSProperties,
    ["--warningDark" as string]: theme.palette.warning.dark as CSSProperties,
    ["--primaryLight" as string]: theme.palette.primary.light as CSSProperties,
    ["--secondaryDark" as string]: theme.palette.secondary.dark as CSSProperties,
    ["--secondaryLight" as string]: theme.palette.secondary.light as CSSProperties,
    ['--primaryDark' as string]: theme.palette.primary.dark as CSSProperties,
    ['--primaryLight' as string]: theme.palette.primary.light as CSSProperties,
    ['--primaryContrastText' as string]: theme.palette.primary.contrastText as CSSProperties,
    ['--secondaryContrastText' as string]: theme.palette.secondary.contrastText as CSSProperties,
    ['--successMain' as string]: theme.palette.success.main as CSSProperties,
    ['--errorMain' as string]: theme.palette.error.main as CSSProperties,
  }

  const secondaryMain: { [key: string]: CSSProperties } = {
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties
  }
  const primaryMain: { [key: string]: CSSProperties } = {
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }


  const circleMain: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryDark' as string]: theme.palette.secondary.dark as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }

  const circleOne: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryDark' as string]: theme.palette.secondary.dark as CSSProperties,
    ['--primaryLight' as string]: theme.palette.primary.light as CSSProperties
  }

  const textColor: { [key: string]: CSSProperties } = { ["--color" as string]: theme.palette.text.color as CSSProperties }

  const pieceOne: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }

  const pieceTwo: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }
  const pieceThree: { [key: string]: CSSProperties } = {
    ["--color" as string]: theme.palette.text.color as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties,
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties
  }
  const twoMain: { [key: string]: CSSProperties } = {
    ['--primaryMain' as string]: theme.palette.primary.main as CSSProperties,
    ['--secondaryMain' as string]: theme.palette.secondary.main as CSSProperties
  }
  const inputAutoSelectDefault: { [key: string]: CSSProperties } = {
    '& .MuiOutlinedInput-input': {
      boxShadow: `0 0 0 100px ${theme.palette.background.default} inset`,
      borderRadius: "initial ",
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: hover': {
      boxShadow: `0 0 0 100px ${theme.palette.background.default} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: active': {
      boxShadow: `0 0 0 100px ${theme.palette.background.default} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: focus': {
      boxShadow: `0 0 0 100px ${theme.palette.background.default} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input:-webkit-autofill': {
      boxShadow: `0 0 0 100px ${theme.palette.background.default} inset !important`,
      WebkitTextFillColor: theme.palette.text.color,
      borderRadius: "initial ",
    }
  }
  const inputAutoSelectPaper: { [key: string]: CSSProperties } = {
    '& .MuiOutlinedInput-input': {
      boxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
      borderRadius: "initial ",
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: hover': {
      boxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: active': {
      boxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input: focus': {
      boxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: theme.palette.text.color
    },
    '& .MuiOutlinedInput-input:-webkit-autofill': {
      boxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: theme.palette.text.color,
      borderRadius: "initial ",
    }
  }

  return {
    threeOptionMain,
    wrapper,
    left,
    right,
    modal,
    bounce,
    theme,
    muiVar,
    secondaryMain,
    primaryMain,
    circleMain,
    circleOne,
    textColor,
    pieceOne,
    pieceTwo,
    pieceThree,
    twoMain,
    inputAutoSelectDefault,
    inputAutoSelectPaper,
  }
})

export default useScssVar;