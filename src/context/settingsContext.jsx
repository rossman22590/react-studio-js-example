import { createContext, useEffect, useReducer } from 'react';
import { dark, light } from '../theme';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ContextMenu from '../components/ContextMenu';
import Montserrat from '../assets/Montserrat/Montserrat-VariableFont_wght.ttf';
// ======Imports============
const THEME_DARK = 'THEME_DARK';
const THEME_LIGHT = 'THEME_LIGHT';
const RESIZE_SCREEN = 'RESIZE_SCREEN';
const CONTEXT_MENU = 'CONTEXT_MENU';
const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';
const KEY_PRESS = 'KEY_PRESS';
const EVENT_EMITTER = 'EVENT_EMITTER';
const PODCAST_TITLE = 'PODCAST_TITLE';
const SETSHOWANNOTATIONS = 'SETSHOWANNOTATIONS';
const SETENEABLEANNOTATIONS = 'SETENEABLEANNOTATIONS';
const ANNOTATIONS = 'ANNOTATIONS';
const SETDIALOGBOX = 'SETDIALOGBOX';
const initialState = {
  podcast: 'Podcast',
  theme: {
    mode: 'dark',
    backgroundColor: dark,
    textColor: 'white',
  },
  screen: {
    width: '100vw',
    height: '100vh',
  },
  contextMenu: {
    clientX: 0,
    clientY: 0,
    display: false,
  },
  keyPress: {
    key: '',
    shiftKey: false,
  },
  event_Emitter: null,
  showAnnotations: false,
  enableAnnotations: true,
  annotations: [],
  dialogBox: false,
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case THEME_DARK:
      return {
        ...state,
        theme: { mode: 'dark', backgroundColor: dark, textColor: 'white' },
      };

    case THEME_LIGHT:
      return {
        ...state,
        theme: { mode: 'light', backgroundColor: light, textColor: 'black' },
      };

    case RESIZE_SCREEN:
      return { ...state, screen: payload };

    case CONTEXT_MENU:
      return { ...state, contextMenu: payload };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: { ...state.contextMenu, display: false },
      };

    case KEY_PRESS:
      return { ...state, keyPress: payload };
    case EVENT_EMITTER:
      return { ...state, event_Emitter: payload };
    case PODCAST_TITLE:
      return { ...state, podcast: payload };
    case ANNOTATIONS:
      return { ...state, annotations: payload };
    case SETSHOWANNOTATIONS:
      return { ...state, showAnnotations: payload };
    case SETENEABLEANNOTATIONS:
      return { ...state, enableAnnotations: payload };
    case SETDIALOGBOX:
      return { ...state, dialogBox: payload };
    default:
      return state;
  }
}
const ThemeSettings = createContext({
  ...initialState,
});

export const SettingsContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setEventEmitter = (payload) =>
    dispatch({
      type: EVENT_EMITTER,
      payload,
    });

  // Change theme mode
  const themeMode = () => {
    const { mode } = state.theme;
    if (mode === 'dark') {
      return dispatch({ type: THEME_LIGHT });
    }
    dispatch({ type: THEME_DARK });
  };

  // close context menu
  const closeContextMenu = () => {
    dispatch({
      type: CLOSE_CONTEXT_MENU,
    });
  };

  // Change podcast Title
  const changeTitle = (value) => {
    dispatch({
      type: PODCAST_TITLE,
      payload: value,
    });
  };

  // get Annotations data
  function setAnnotations(value) {
    dispatch({
      type: ANNOTATIONS,
      payload: value,
    });
  }

  // Set show annotations on/off
  function setShowAnnotations(value) {
    dispatch({
      type: SETSHOWANNOTATIONS,
      payload: value,
    });
  }
  // Set Enable annotations buttons on/off
  function setEnableAnnotations(value) {
    dispatch({
      type: SETENEABLEANNOTATIONS,
      payload: value,
    });
  }

  // Handle Modal
  function setDialogBox(value) {
    dispatch({
      type: SETDIALOGBOX,
      payload: value,
    });
  }

  // handle events
  useEffect(() => {
    window.onresize = () => {
      const { innerWidth, innerHeight } = window;
      dispatch({
        type: RESIZE_SCREEN,
        payload: { height: innerHeight, width: innerWidth },
      });
    };

    // context menu event listener
    const editor = document.getElementById('editor');
    editor.oncontextmenu = (e) => {
      e.preventDefault();
      const { clientX, clientY } = e;
      const display = true;
      const value = { clientX, clientY, display };
      dispatch({
        type: CONTEXT_MENU,
        payload: value,
      });
    };

    // on key press event listener
    window.onkeydown = (event) => {
      const { key, shiftKey, code } = event;

      dispatch({
        type: KEY_PRESS,
        payload: { key, shiftKey, code },
      });
    };
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, Roboto',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `@font-face{
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Raleway'), local('Raleway-Regular'), url(${Montserrat}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        
        }`,
      },
    },
  });

  return (
    <ThemeSettings.Provider
      value={{
        ...state,
        themeMode,
        closeContextMenu,
        setEventEmitter,
        changeTitle,
        setShowAnnotations,
        setEnableAnnotations,
        setAnnotations,
        setDialogBox,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ContextMenu
          position={state.contextMenu}
          closeContextMenu={closeContextMenu}
        />
        {children}
      </ThemeProvider>
    </ThemeSettings.Provider>
  );
};

export default ThemeSettings;