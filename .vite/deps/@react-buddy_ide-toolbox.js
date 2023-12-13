import {
  require_react
} from "./chunk-ZAUFE7H7.js";
import {
  __toESM
} from "./chunk-UXIASGQL.js";

// node_modules/@react-buddy/ide-toolbox/dist/index.esm.js
var import_react = __toESM(require_react());
var _a;
var envDevmode = typeof process !== "undefined" ? ((_a = process.env) === null || _a === void 0 ? void 0 : _a.REACT_APP_IDE_DEVMODE) === "true" : false;
var windowDevmode = typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.REACT_BUDDY_IDE_DEVMODE) === true;
var DEV_MODE = windowDevmode || envDevmode;
var withInitialHook = (useInitialHook, ComponentPreviews) => {
  const DevBootstrapWrapped = () => {
    const status = useInitialHook();
    if (status.loading) {
      return import_react.default.createElement("div", null, " loading... ");
    }
    if (status.error) {
      return import_react.default.createElement("div", null, "Unable to bootstrap dev mode. Probably you need to run backend or enable backend mocking mode.");
    }
    return import_react.default.createElement(DevBootstrap, { ComponentPreviews });
  };
  return DevBootstrapWrapped;
};
var DevBootstrap = ({ ComponentPreviews }) => {
  return import_react.default.createElement(
    import_react.Suspense,
    { fallback: import_react.default.createElement("div", null, "Loading sources...") },
    import_react.default.createElement(ComponentPreviews, null)
  );
};
var DevSupport = ({ children, ComponentPreviews, useInitialHook, devmode }) => {
  const isDevmode = enabledDevmode(devmode);
  if (isDevmode) {
    return useInitialHook ? withInitialHook(useInitialHook, ComponentPreviews)({}) : import_react.default.createElement(DevBootstrap, { ComponentPreviews });
  }
  return import_react.default.createElement(import_react.default.Fragment, null, children);
};
function enabledDevmode(devmode) {
  return devmode != null ? devmode : DEV_MODE;
}
function styleInject(css, ref) {
  if (ref === void 0)
    ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$9 = '.table-header {\n  border-color: #363636;\n  border-width: 1px 0;\n  border-style: solid;\n  font-weight: 800;\n  padding: 10px 20px 10px 10px;\n  display: flex;\n}\n.table-header:after {\n  content: "";\n}\n.table-header .table-header-item {\n  flex-basis: 22%;\n  color: #444;\n}\n.table-header .table-header-item-control {\n  flex-basis: 78%;\n  color: #444;\n}';
styleInject(css_248z$9);
var TableHeader = () => {
  return import_react.default.createElement(
    "div",
    { className: "table-header" },
    import_react.default.createElement("div", { className: "table-header-item" }, "Property name"),
    import_react.default.createElement("div", { className: "table-header-item-control" }, "Edit")
  );
};
var PropsControlTypes;
(function(PropsControlTypes2) {
  PropsControlTypes2["Checkbox"] = "checkbox";
  PropsControlTypes2["Input"] = "input";
  PropsControlTypes2["Radio"] = "radio";
  PropsControlTypes2["Select"] = "select";
  PropsControlTypes2["Textarea"] = "textarea";
  PropsControlTypes2["JsonEditor"] = "jsonEditor";
})(PropsControlTypes || (PropsControlTypes = {}));
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
var Input = (_a2) => {
  var { value } = _a2, restProps = __rest(_a2, ["value"]);
  return import_react.default.createElement("input", Object.assign({}, restProps, { value: value !== null && value !== void 0 ? value : "", type: "text" }));
};
var Checkbox = (_a2) => {
  var { checked, className } = _a2, restProps = __rest(_a2, ["checked", "className"]);
  return import_react.default.createElement(
    "div",
    { className },
    import_react.default.createElement("input", Object.assign({}, restProps, { checked: checked !== null && checked !== void 0 ? checked : false, type: "checkbox" }))
  );
};
var Select = (_a2) => {
  var { optionsData } = _a2, restProps = __rest(_a2, ["optionsData"]);
  return import_react.default.createElement("select", Object.assign({}, restProps), optionsData === null || optionsData === void 0 ? void 0 : optionsData.map((value) => {
    return import_react.default.createElement("option", { value, key: value }, value);
  }));
};
var css_248z$8 = ".radio-control {\n  display: flex;\n  align-items: center;\n  margin-right: 15px;\n}\n.radio-control label {\n  margin-right: 5px;\n}";
styleInject(css_248z$8);
var Radio = (_a2) => {
  var { className, radioData, extValue } = _a2, restProps = __rest(_a2, ["className", "radioData", "extValue"]);
  return radioData ? import_react.default.createElement("div", { className }, radioData.map((value) => {
    return import_react.default.createElement(
      "div",
      { key: value, className: "radio-control" },
      import_react.default.createElement(
        "label",
        { htmlFor: String(value) },
        " ",
        value
      ),
      import_react.default.createElement("input", Object.assign({}, restProps, { type: "radio", checked: extValue == value, id: String(value), value }))
    );
  })) : null;
};
var Textarea = (props) => {
  return import_react.default.createElement("textarea", Object.assign({}, props));
};
var css_248z$7 = ".json-editor {\n  flex-direction: column;\n}\n.json-editor .json-editor-textarea {\n  align-self: start;\n  width: 100%;\n  min-height: 100px;\n  margin: 0 0 10px 0;\n}\n.json-editor .json-editor-apply-button {\n  align-self: start;\n}";
styleInject(css_248z$7);
var JsonEditor = ({ className, propName, propValue, propUpdate }) => {
  const [editedJsonValue, setEditedJsonValue] = (0, import_react.useState)();
  const textareaOnChange = (0, import_react.useCallback)((event) => {
    const { currentTarget: { value } } = event;
    setEditedJsonValue(value);
  }, []);
  const isEnabledToApply = (0, import_react.useMemo)(() => {
    return editedJsonValue == null;
  }, [editedJsonValue]);
  const onPropUpdate = (0, import_react.useCallback)(() => {
    propUpdate(propName, editedJsonValue);
    setEditedJsonValue(void 0);
  }, [propName, editedJsonValue]);
  return import_react.default.createElement(
    "div",
    { className: className + " json-editor" },
    import_react.default.createElement(Textarea, { className: "json-editor-textarea", onChange: textareaOnChange, id: propName, value: editedJsonValue !== null && editedJsonValue !== void 0 ? editedJsonValue : propValue }),
    import_react.default.createElement("button", { className: "json-editor-apply-button", disabled: isEnabledToApply, onClick: onPropUpdate }, "Apply changes")
  );
};
var TableItemControl = ({ controlType, data, propName, propValue, onPropChange }) => {
  switch (controlType) {
    case PropsControlTypes.Input:
      return import_react.default.createElement(Input, { className: "table-item-control", id: propName, value: propValue, onChange: onPropChange });
    case PropsControlTypes.Textarea:
      return import_react.default.createElement(Textarea, { className: "table-item-control", id: propName, value: propValue, onChange: onPropChange });
    case PropsControlTypes.Select:
      return import_react.default.createElement(Select, { className: "table-item-control", id: propName, onChange: onPropChange, optionsData: data });
    case PropsControlTypes.Checkbox:
      return import_react.default.createElement(Checkbox, { checked: propValue, id: propName, onChange: onPropChange });
    case PropsControlTypes.Radio:
      return import_react.default.createElement(Radio, { className: "table-item-control", extValue: propValue, name: propName, onChange: onPropChange, radioData: data });
    case PropsControlTypes.JsonEditor:
      return import_react.default.createElement(JsonEditor, { className: "table-item-control", propValue, propName, propUpdate: onPropChange });
    default:
      return import_react.default.createElement(Input, { className: "table-item-control", id: propName, value: propValue, onChange: onPropChange });
  }
};
var css_248z$6 = '.table-item-wrapper {\n  border-color: #363636;\n  border-width: 0 0 1px 0;\n  border-style: solid;\n  padding: 10px;\n  display: flex;\n}\n.table-item-wrapper:after {\n  content: "";\n}\n.table-item-wrapper .table-item,\n.table-item-wrapper .table-item-control {\n  display: flex;\n  align-items: center;\n  justify-content: start;\n}\n.table-item-wrapper .table-item {\n  flex-basis: 22%;\n}\n.table-item-wrapper .table-item-control {\n  flex-basis: 78%;\n}';
styleInject(css_248z$6);
var TableItem = ({ propName, propValue, onPropChange, controlType, data }) => {
  return import_react.default.createElement(
    "div",
    { className: "table-item-wrapper" },
    import_react.default.createElement("div", { className: "table-item" }, propName),
    import_react.default.createElement(TableItemControl, { data, controlType, propName, propValue, onPropChange })
  );
};
var css_248z$5 = '.table-items {\n  background-color: whitesmoke;\n  display: flex;\n  flex-direction: column;\n  overflow-y: scroll;\n}\n.table-items:after {\n  content: "";\n}';
styleInject(css_248z$5);
var TableItems = ({ toolsPropsToEdit }) => {
  const { props = null, initialProps = null, propsEditInfo = null, updateProps } = Object.assign({}, toolsPropsToEdit);
  (0, import_react.useEffect)(() => {
    let propsValuesFromData = {};
    propsEditInfo ? Object.entries(propsEditInfo).map(([propName, propEditInfo]) => {
      const propValue = Array.isArray(propEditInfo.data) ? propEditInfo.data[0] : propEditInfo.data;
      propsValuesFromData = Object.assign(Object.assign({}, propsValuesFromData), { [propName]: propValue });
    }) : null;
    updateProps === null || updateProps === void 0 ? void 0 : updateProps(Object.assign(Object.assign({}, props), propsValuesFromData));
  }, [propsEditInfo]);
  const onInputChange = (0, import_react.useCallback)((event) => {
    const { value: updatedPropValue, id: propName } = event.currentTarget;
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const onCheckboxChange = (0, import_react.useCallback)((event) => {
    const { checked: updatedPropValue, id: propName } = event.currentTarget;
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const onSelectChange = (0, import_react.useCallback)((event) => {
    const { value: updatedPropValue, id: propName } = event.currentTarget;
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const onRadioChange = (0, import_react.useCallback)((event) => {
    const { value: updatedPropValue, name: propName } = event.currentTarget;
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const onTextAreaChange = (0, import_react.useCallback)((event) => {
    const { value: updatedPropValue, id: propName } = event.currentTarget;
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const onJsonChange = (0, import_react.useCallback)((propName, propValue) => {
    let updatedPropValue;
    try {
      updatedPropValue = JSON.parse(propValue);
    } catch (e) {
      alert(`Property ${propName} has incorrect value to object parse`);
      return;
    }
    const updatedProps = Object.assign(Object.assign({}, props), { [propName]: updatedPropValue });
    updateProps(updatedProps);
  }, [props]);
  const getChangeHendler = (0, import_react.useCallback)((controlType) => {
    switch (controlType) {
      case PropsControlTypes.Input:
        return onInputChange;
      case PropsControlTypes.Checkbox:
        return onCheckboxChange;
      case PropsControlTypes.Select:
        return onSelectChange;
      case PropsControlTypes.Radio:
        return onRadioChange;
      case PropsControlTypes.Textarea:
        return onTextAreaChange;
      case PropsControlTypes.JsonEditor:
        return onJsonChange;
      default:
        return onInputChange;
    }
  }, [props]);
  const renderTableItems = (0, import_react.useCallback)(() => {
    let items = [];
    const itemsWithoutInfo = props && Object.entries(props).filter(([propName]) => {
      return !(propsEditInfo === null || propsEditInfo === void 0 ? void 0 : propsEditInfo.hasOwnProperty(propName));
    }).map(([propName, propValue]) => {
      return import_react.default.createElement(TableItem, { key: propName, propName, propValue, initialPropValue: initialProps === null || initialProps === void 0 ? void 0 : initialProps[propName], onPropChange: getChangeHendler() });
    });
    items = itemsWithoutInfo ? [...items, ...itemsWithoutInfo] : items;
    const itemsWithInfo = propsEditInfo && Object.entries(propsEditInfo).map(([propName, propInfo]) => {
      return import_react.default.createElement(TableItem, { key: propName, data: propInfo.data, controlType: propInfo.controlType, propName, propValue: propInfo.controlType === PropsControlTypes.JsonEditor ? JSON.stringify(props === null || props === void 0 ? void 0 : props[propName], null, 2) : props === null || props === void 0 ? void 0 : props[propName], initialPropValue: initialProps === null || initialProps === void 0 ? void 0 : initialProps[propName], onPropChange: getChangeHendler(propInfo.controlType) });
    });
    items = itemsWithInfo ? [...items, ...itemsWithInfo] : items;
    return items;
  }, [props, propsEditInfo]);
  return import_react.default.createElement("div", { className: "table-items" }, renderTableItems());
};
var css_248z$4 = ".props-edit-table {\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}";
styleInject(css_248z$4);
var PropsEditTable = ({ toolsPropsToEdit }) => {
  return import_react.default.createElement(
    "div",
    { className: "props-edit-table" },
    import_react.default.createElement(TableHeader, null),
    import_react.default.createElement(TableItems, { toolsPropsToEdit })
  );
};
var css_248z$3 = ".tools-panel {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  background-color: #eeeeee;\n}\n.tools-panel .empty-props-message {\n  color: red;\n}";
styleInject(css_248z$3);
var ToolsPanel = ({ toolsPropsToEdit }) => {
  const { props = null, propsEditInfo = null } = Object.assign({}, toolsPropsToEdit);
  const renederToolsPanelContent = (0, import_react.useCallback)(() => {
    let hasPropetiesToEdit;
    hasPropetiesToEdit = props ? Object.keys(props).length > 0 : false;
    hasPropetiesToEdit = hasPropetiesToEdit || (propsEditInfo ? Object.keys(propsEditInfo).length > 0 : false);
    return hasPropetiesToEdit ? import_react.default.createElement(PropsEditTable, { toolsPropsToEdit }) : import_react.default.createElement("div", { className: "empty-props-message" }, "This component has no properties to edit");
  }, [props, propsEditInfo]);
  return import_react.default.createElement("div", { className: "tools-panel" }, renederToolsPanelContent());
};
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var PALETTE_PATH = "/REACT_BUDDY_PALETTE";
var URL_CHANGE_EVENT = "urlchange";
var useRoute = (path, exact) => {
  const [, setUpdate] = (0, import_react.useState)(false);
  const update = (0, import_react.useCallback)(() => {
    setUpdate((reRender) => {
      return !reRender;
    });
  }, []);
  (0, import_react.useEffect)(() => {
    window.addEventListener(URL_CHANGE_EVENT, update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener(URL_CHANGE_EVENT, update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return isMatchPath(path, exact);
};
function isMatchPath(path, exact = false) {
  const currentPath = getCurrentPath();
  const match = new RegExp(transformPath(path)).exec(currentPath);
  if (match) {
    const [url] = match;
    return exact ? currentPath === url : true;
  }
  return false;
}
function transformPath(path) {
  return escapeRegExp(encodeURI(path));
}
function getCurrentPath() {
  const { hash, pathname } = window.location;
  return hash ? hash.replace("#", "") : pathname;
}
function historyPush(url) {
  window.history.replaceState({}, "", url);
  dispatchUrlChangeEvent(url);
}
function dispatchUrlChangeEvent(url) {
  const urlChangeEvent = new CustomEvent(URL_CHANGE_EVENT, {
    bubbles: true,
    detail: url
  });
  window.dispatchEvent(urlChangeEvent);
}
var css_248z$2 = ".previews-module_previewsMain__31L3F {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\n.previews-module_previewsContent__1aMUf {\n  flex-basis: 100%;\n  flex-grow: 1;\n  overflow-y: auto;\n}\n\n.previews-module_previewsToolsPanel__30jjI {\n  flex-basis: 295px;\n  min-height: 100px;\n}";
var styles$2 = { "previewsMain": "previews-module_previewsMain__31L3F", "previewsContent": "previews-module_previewsContent__1aMUf", "previewsToolsPanel": "previews-module_previewsToolsPanel__30jjI" };
styleInject(css_248z$2);
var Previews = ({ children, palette = null }) => {
  const [toolsPropsToEdit, setToolsPropsToEdit] = (0, import_react.useState)(null);
  const [toolsPanelEnabled, enableToolsPanel] = (0, import_react.useState)(() => {
    var _a2;
    return (_a2 = window.__PROPERTIES_EDIT_PANEL_ENABLED__) !== null && _a2 !== void 0 ? _a2 : false;
  });
  const isPalettePath = useRoute(PALETTE_PATH);
  const childrenWithSetProps = (0, import_react.useMemo)(() => {
    return children ? import_react.default.Children.map(children, (child) => {
      return import_react.default.cloneElement(child, { setToolsPropsToEdit });
    }) : null;
  }, [children]);
  (0, import_react.useEffect)(() => {
    var _a2;
    window.enableComponentsPropsPanelEditor = (toolsPanelStatus) => {
      var _a3;
      (_a3 = window.setPropertiesEditPanelStatus) === null || _a3 === void 0 ? void 0 : _a3.call(window, toolsPanelStatus);
      enableToolsPanel(toolsPanelStatus);
    };
    window.reactBuddyHistoryPush = historyPush;
    (_a2 = window.cefQuery) === null || _a2 === void 0 ? void 0 : _a2.call(window, { request: "event:react-toolbox-initialized" });
  }, []);
  if (isPalettePath) {
    return palette;
  }
  return import_react.default.createElement(
    "div",
    { className: styles$2.previewsMain },
    import_react.default.createElement("div", { className: styles$2.previewsContent }, childrenWithSetProps),
    toolsPanelEnabled && import_react.default.createElement(
      "div",
      { className: styles$2.previewsToolsPanel },
      import_react.default.createElement(ToolsPanel, { toolsPropsToEdit })
    )
  );
};
var RoutePreview = ({ children, path, exact, setPropsToEdit }) => {
  const [modfiedProps, setModifiedProps] = (0, import_react.useState)(null);
  const isMatchPath2 = useRoute(path, exact);
  (0, import_react.useEffect)(() => {
    if (isMatchPath2) {
      const currentProps = modfiedProps !== null && modfiedProps !== void 0 ? modfiedProps : children.props;
      const propsToEdit = {
        props: currentProps,
        updateProps: setModifiedProps
      };
      setPropsToEdit(propsToEdit);
    }
    return () => {
      isMatchPath2 ? null : setModifiedProps(null);
    };
  }, [isMatchPath2]);
  const childrenWithUpdatedProps = modfiedProps ? import_react.default.cloneElement(children, Object.assign({}, modfiedProps)) : children;
  return isMatchPath2 ? import_react.default.createElement(import_react.default.Fragment, null, childrenWithUpdatedProps) : null;
};
var css_248z$1 = ".react-buddy-error-boundary-module_errorMessageContainer__1L848 {\n  width: 100%;\n  height: 100%;\n  padding-left: 20px;\n  padding-right: 20px;\n  background-color: #fff;\n}\n\n.react-buddy-error-boundary-module_errorMessageTitle__r4YnX {\n  color: #d32f2f;\n}\n\n.react-buddy-error-boundary-module_errorMessageStack__2XNRm {\n  color: #a9a9a9;\n  font-size: 0.8rem;\n  width: 100%;\n  overflow-x: scroll;\n}";
var styles$1 = { "errorMessageContainer": "react-buddy-error-boundary-module_errorMessageContainer__1L848", "errorMessageTitle": "react-buddy-error-boundary-module_errorMessageTitle__r4YnX", "errorMessageStack": "react-buddy-error-boundary-module_errorMessageStack__2XNRm" };
styleInject(css_248z$1);
var ReactBuddyErrorBoundary = class extends import_react.default.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  componentDidCatch(error) {
    console.error(error);
    this.setState({ error });
  }
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.error != null) {
      this.setState({ error: null });
    }
  }
  render() {
    const { error } = this.state;
    const { componentName, children } = this.props;
    if (error != null) {
      return import_react.default.createElement(
        "div",
        { className: styles$1.errorMessageContainer },
        import_react.default.createElement("h2", { className: styles$1.errorMessageTitle }, componentName ? `Something went wrong while rendering ${componentName} component` : "Something went wrong"),
        import_react.default.createElement("p", null, error.message),
        import_react.default.createElement("pre", { className: styles$1.errorMessageStack }, error.stack)
      );
    }
    return children;
  }
};
var ComponentPreview = ({ path, children, setToolsPropsToEdit, exact = true, propsEditInfo }) => {
  const setPropsToEdit = (0, import_react.useCallback)((propsToEdit) => {
    setToolsPropsToEdit(Object.assign(Object.assign({}, propsToEdit), { initialProps: children.props, propsEditInfo }));
  }, []);
  return import_react.default.createElement(
    RoutePreview,
    { path, exact, setPropsToEdit },
    import_react.default.createElement(ReactBuddyErrorBoundary, null, children)
  );
};
var Palette = ({ style, className, embeddable, children }) => {
  return embeddable ? import_react.default.createElement(import_react.default.Fragment, null, children) : import_react.default.createElement("div", { style, className }, children);
};
var CategoryContext = import_react.default.createContext({});
var useCategoryContext = () => (0, import_react.useContext)(CategoryContext);
var Category = ({ children, name, className, style }) => {
  return import_react.default.createElement(CategoryContext.Provider, { value: { categoryClassName: className, categoryStyle: style } }, getTransformedCategoryChildren({
    children,
    categoryName: name
  }));
};
function getTransformedCategoryChildren({ children, categoryName }) {
  return import_react.default.Children.map(children, (child) => {
    return import_react.default.cloneElement(child, { categoryName });
  });
}
var ComponentContext = import_react.default.createContext({});
var useComponentContext = () => (0, import_react.useContext)(ComponentContext);
var Component = ({ children, categoryName, name, className, style }) => {
  return import_react.default.createElement(ComponentContext.Provider, { value: { componentClassName: className, componentStyle: style } }, getTransformedComponentChildren({
    children,
    componentName: name,
    categoryName
  }));
};
function getTransformedComponentChildren({ children, componentName, categoryName }) {
  return import_react.default.Children.map(children, (child) => {
    return import_react.default.cloneElement(child, {
      categoryName,
      componentName
    });
  });
}
function classNames(...classNames2) {
  const splittedClassNamesWithoutNullable = classNames2.flatMap((className) => className ? className.split(" ") : []);
  const uniqClassNames = [...new Set(splittedClassNamesWithoutNullable)];
  return uniqClassNames.join(" ");
}
var css_248z = ".variant-module_fullWindow__1DkCI {\n  padding: 0;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.variant-module_variantRouteCenter__ce423 {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  min-height: 100%;\n}";
var styles = { "fullWindow": "variant-module_fullWindow__1DkCI", "variantRouteCenter": "variant-module_variantRouteCenter__ce423" };
styleInject(css_248z);
var DEFAULT_VARIANT_NAME = "DEFAULT_VARIANT";
var VariantRoute = ({ categoryName, componentName, variantName = DEFAULT_VARIANT_NAME, previewLayout = "center", children }) => {
  const { categoryClassName, categoryStyle } = useCategoryContext();
  const { componentClassName, componentStyle } = useComponentContext();
  const { variantClassName, variantStyle } = useVariantContext();
  const paletteItemPath = (0, import_react.useMemo)(() => {
    return getPaletteItemPath([categoryName, componentName, variantName]);
  }, [categoryName, componentName, variantName]);
  const isPathMatch = useRoute(paletteItemPath, true);
  const [paletteNode, setPaletteNode] = (0, import_react.useState)(null);
  (0, import_react.useLayoutEffect)(() => {
    if (paletteNode !== null)
      addFullWindowClassToParents(paletteNode);
    return () => {
      if (paletteNode !== null)
        removeFullWindowClassFromParents(paletteNode);
    };
  }, [paletteNode]);
  if (!isPathMatch) {
    return null;
  }
  return import_react.default.createElement(
    "div",
    { className: categoryClassName, style: categoryStyle },
    import_react.default.createElement(
      "div",
      { className: componentClassName, style: componentStyle, ref: setPaletteNode },
      import_react.default.createElement("div", { className: previewLayout === "center" ? classNames(styles.variantRouteCenter, variantClassName) : variantClassName, style: variantStyle }, children)
    )
  );
};
function getPaletteItemPath(names) {
  return PALETTE_PATH + "/" + names.filter((name) => name != null).join("/");
}
var VariantContext = import_react.default.createContext({});
var useVariantContext = () => (0, import_react.useContext)(VariantContext);
var Variant = ({ children, categoryName, componentName, name, previewLayout, className, style }) => {
  return import_react.default.createElement(
    VariantContext.Provider,
    { value: { variantClassName: className, variantStyle: style } },
    import_react.default.createElement(
      VariantRoute,
      { previewLayout, variantName: name, categoryName, componentName },
      import_react.default.createElement(ReactBuddyErrorBoundary, { componentName }, children)
    )
  );
};
function addFullWindowClassToParents(curNode) {
  if (curNode === null || curNode === document)
    return;
  curNode.className = classNames(styles.fullWindow, curNode.className);
  addFullWindowClassToParents(curNode.parentElement);
}
function removeFullWindowClassFromParents(curNode) {
  if (curNode === null || curNode === document)
    return;
  curNode.classList.remove(styles.fullWindow);
  removeFullWindowClassFromParents(curNode.parentElement);
}
export {
  Category,
  Component,
  ComponentPreview,
  DevSupport,
  Palette,
  Previews,
  PropsControlTypes,
  Variant,
  useCategoryContext,
  useComponentContext
};
/*! Bundled license information:

@react-buddy/ide-toolbox/dist/index.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=@react-buddy_ide-toolbox.js.map
